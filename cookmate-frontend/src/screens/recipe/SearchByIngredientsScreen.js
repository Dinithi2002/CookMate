import React, { useState } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { Text, Chip, TextInput, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import RecipeCard from '../../components/recipe/RecipeCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { globalStyles } from '../../styles/globalStyles';

const SearchByIngredientsScreen = ({ navigation }) => {
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(item => item !== ingredient));
  };

  const searchRecipes = async () => {
    if (ingredients.length === 0) return;

    setLoading(true);
    try {
      const response = await api.get(`/recipes/search-by-ingredients?ingredients=${ingredients.join(',')}`);
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (recipeId) => {
    try {
      await api.post(`/recipes/${recipeId}/like`);
      setRecipes(prev => prev.map(recipe => 
        recipe._id === recipeId 
          ? { ...recipe, isLiked: !recipe.isLiked }
          : recipe
      ));
    } catch (error) {
      console.error('Error liking recipe:', error);
    }
  };

  const navigateToRecipe = (recipeId) => {
    navigation.navigate('RecipeDetail', { recipeId });
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView style={globalStyles.screenPadding}>
        <Text variant="headlineMedium" style={{ marginBottom: 16, fontWeight: 'bold' }}>
          Search by Ingredients
        </Text>
        
        <Text variant="bodyMedium" style={{ marginBottom: 16, color: 'gray' }}>
          Enter the ingredients you have, and we'll find recipes you can make!
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <TextInput
            mode="outlined"
            placeholder="Add an ingredient..."
            value={currentIngredient}
            onChangeText={setCurrentIngredient}
            style={{ flex: 1, marginRight: 8 }}
            onSubmitEditing={addIngredient}
          />
          <IconButton
            icon={() => <Ionicons name="add" size={24} color="#FF6B35" />}
            onPress={addIngredient}
          />
        </View>

        {ingredients.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text variant="titleSmall" style={{ marginBottom: 8 }}>
              Your Ingredients:
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {ingredients.map((ingredient, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  onClose={() => removeIngredient(ingredient)}
                  style={{ margin: 4 }}
                >
                  {ingredient}
                </Chip>
              ))}
            </View>
          </View>
        )}

        <Button
          title="Find Recipes"
          onPress={searchRecipes}
          disabled={ingredients.length === 0}
          loading={loading}
          style={{ marginBottom: 24 }}
        />

        {loading && <LoadingSpinner />}

        {recipes.length > 0 && (
          <>
            <Text variant="titleMedium" style={{ marginBottom: 16 }}>
              Found {recipes.length} recipe(s):
            </Text>
            <FlatList
              data={recipes}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <RecipeCard
                  recipe={item}
                  onPress={navigateToRecipe}
                  onLike={handleLike}
                />
              )}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchByIngredientsScreen;