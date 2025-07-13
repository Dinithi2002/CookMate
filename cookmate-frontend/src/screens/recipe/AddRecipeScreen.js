import React, { useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import api from '../../services/api';
import RecipeForm from '../../components/recipe/RecipeForm';
import Header from '../../components/layout/Header';
import { globalStyles } from '../../styles/globalStyles';
import { validateRecipeData, showAlert } from '../../utils/helpers';

const AddRecipeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleCreateRecipe = async (recipeData) => {
    setLoading(true);

    try {
      // Validate the recipe data
      const validation = validateRecipeData(recipeData);
      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors);
        showAlert('Validation Error', errorMessages[0]);
        setLoading(false);
        return;
      }

      // Prepare FormData for the API request
      const formData = new FormData();
      
      // Add basic recipe data
      formData.append('title', recipeData.title.trim());
      formData.append('description', recipeData.description.trim());
      formData.append('cookingTime', recipeData.cookingTime.toString());
      formData.append('category', recipeData.category);
      formData.append('difficulty', recipeData.difficulty);
      
      // Add ingredients and steps as JSON strings
      formData.append('ingredients', JSON.stringify(recipeData.ingredients));
      formData.append('steps', JSON.stringify(recipeData.steps));

      // Add image if present
      if (recipeData.image && recipeData.image.uri) {
        formData.append('image', {
          uri: recipeData.image.uri,
          type: 'image/jpeg',
          name: `recipe-${Date.now()}.jpg`,
        });
      }

      // Make API request
      const response = await api.post('/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout for image upload
      });

      // Success feedback
      Alert.alert(
        'Success! 🎉',
        'Your delicious recipe has been created successfully!',
        [
          {
            text: 'View Recipe',
            onPress: () => {
              navigation.navigate('RecipeDetail', { 
                recipeId: response.data.recipe._id 
              });
            },
          },
          {
            text: 'Back to Home',
            onPress: () => navigation.navigate('Home'),
            style: 'cancel',
          },
        ]
      );

    } catch (error) {
      console.error('Create recipe error:', error);
      
      let errorMessage = 'Failed to create recipe. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout. Please try with a smaller image.';
      }

      showAlert('Error', errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Add New Recipe"
        showBack={true}
        onBackPress={() => {
          Alert.alert(
            'Discard Recipe?',
            'Are you sure you want to go back? All changes will be lost.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
            ]
          );
        }}
        showProfile={false}
        navigation={navigation}
      />
      
      <RecipeForm
        onSubmit={handleCreateRecipe}
        loading={loading}
        initialData={null}
      />
    </View>
  );
};

export default AddRecipeScreen;