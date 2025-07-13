import React, { useState } from 'react';
import { View, ScrollView, Image, Alert, StyleSheet } from 'react-native';
import { Text, TextInput, Button as PaperButton, Menu, Divider } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import Input from '../common/Input';
import Button from '../common/Button';
import IngredientInput from './IngredientInput';
import { RECIPE_CATEGORIES, DIFFICULTY_LEVELS } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';

const schema = yup.object().shape({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  cookingTime: yup.number().positive('Cooking time must be positive').required('Cooking time is required'),
  category: yup.string().required('Category is required'),
  difficulty: yup.string().required('Difficulty is required'),
});

const RecipeForm = ({ onSubmit, loading = false, initialData = null }) => {
  const [image, setImage] = useState(initialData?.image || null);
  const [ingredients, setIngredients] = useState(initialData?.ingredients || []);
  const [steps, setSteps] = useState(initialData?.steps || ['']);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [difficultyMenuVisible, setDifficultyMenuVisible] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      cookingTime: initialData?.cookingTime?.toString() || '',
      category: initialData?.category || '',
      difficulty: initialData?.difficulty || '',
    },
  });

  const selectedCategory = watch('category');
  const selectedDifficulty = watch('difficulty');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
    }
  };

  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleFormSubmit = (data) => {
    // Validation
    if (ingredients.length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient');
      return;
    }

    if (steps.filter(step => step.trim()).length === 0) {
      Alert.alert('Error', 'Please add at least one cooking step');
      return;
    }

    // Format steps
    const formattedSteps = steps
      .filter(step => step.trim())
      .map((step, index) => ({
        stepNumber: index + 1,
        instruction: step.trim(),
      }));

    // Prepare form data
    const recipeData = {
      ...data,
      cookingTime: parseInt(data.cookingTime),
      ingredients,
      steps: formattedSteps,
      image,
    };

    onSubmit(recipeData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Picker */}
      <View style={styles.imageSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Recipe Photo
        </Text>
        
        <View style={styles.imageContainer}>
          {image ? (
            <Image 
              source={{ uri: image.uri || image }} 
              style={styles.image} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={40} color="#ccc" />
              <Text style={styles.placeholderText}>Add Photo</Text>
            </View>
          )}
        </View>
        
        <Button
          title={image ? "Change Photo" : "Add Photo"}
          mode="outlined"
          onPress={pickImage}
          style={styles.imageButton}
        />
      </View>

      <Divider style={styles.divider} />

      {/* Basic Information */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Basic Information
        </Text>

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Recipe Title"
              value={value}
              onChangeText={onChange}
              error={errors.title?.message}
              placeholder="e.g., Delicious Chocolate Cake"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Description"
              value={value}
              onChangeText={onChange}
              error={errors.description?.message}
              multiline
              numberOfLines={3}
              placeholder="Brief description of your recipe..."
            />
          )}
        />

        <Controller
          control={control}
          name="cookingTime"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Cooking Time (minutes)"
              value={value}
              onChangeText={onChange}
              error={errors.cookingTime?.message}
              keyboardType="numeric"
              placeholder="e.g., 30"
            />
          )}
        />

        {/* Category Dropdown */}
        <View style={styles.dropdownContainer}>
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <PaperButton
                mode="outlined"
                onPress={() => setCategoryMenuVisible(true)}
                style={styles.dropdown}
                contentStyle={styles.dropdownContent}
              >
                {selectedCategory || 'Select Category'}
              </PaperButton>
            }
          >
            {RECIPE_CATEGORIES.map((category) => (
              <Menu.Item
                key={category}
                onPress={() => {
                  setValue('category', category);
                  setCategoryMenuVisible(false);
                }}
                title={category}
              />
            ))}
          </Menu>
          {errors.category && (
            <Text style={styles.errorText}>{errors.category.message}</Text>
          )}
        </View>

        {/* Difficulty Dropdown */}
        <View style={styles.dropdownContainer}>
          <Menu
            visible={difficultyMenuVisible}
            onDismiss={() => setDifficultyMenuVisible(false)}
            anchor={
              <PaperButton
                mode="outlined"
                onPress={() => setDifficultyMenuVisible(true)}
                style={styles.dropdown}
                contentStyle={styles.dropdownContent}
              >
                {selectedDifficulty || 'Select Difficulty'}
              </PaperButton>
            }
          >
            {DIFFICULTY_LEVELS.map((difficulty) => (
              <Menu.Item
                key={difficulty}
                onPress={() => {
                  setValue('difficulty', difficulty);
                  setDifficultyMenuVisible(false);
                }}
                title={difficulty}
              />
            ))}
          </Menu>
          {errors.difficulty && (
            <Text style={styles.errorText}>{errors.difficulty.message}</Text>
          )}
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Ingredients Section */}
      <View style={styles.section}>
        <IngredientInput
          ingredients={ingredients}
          onIngredientsChange={setIngredients}
          error={ingredients.length === 0 ? 'At least one ingredient is required' : null}
        />
      </View>

      <Divider style={styles.divider} />

      {/* Cooking Steps */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Cooking Steps
        </Text>
        
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              {steps.length > 1 && (
                <PaperButton
                  mode="outlined"
                  compact
                  onPress={() => removeStep(index)}
                  style={styles.removeStepButton}
                >
                  <Ionicons name="trash" size={16} />
                </PaperButton>
              )}
            </View>
            
            <TextInput
              mode="outlined"
              label={`Step ${index + 1}`}
              value={step}
              onChangeText={(value) => updateStep(index, value)}
              multiline
              numberOfLines={2}
              placeholder="Describe this cooking step..."
              style={styles.stepInput}
            />
          </View>
        ))}
        
        <Button
          title="Add Step"
          mode="outlined"
          onPress={addStep}
          icon={() => <Ionicons name="add" size={20} />}
          style={styles.addStepButton}
        />
      </View>

      {/* Submit Button */}
      <View style={styles.submitSection}>
        <Button
          title={initialData ? "Update Recipe" : "Create Recipe"}
          onPress={handleSubmit(handleFormSubmit)}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  imageSection: {
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
  },
  imageContainer: {
    marginVertical: 16,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#ccc',
    marginTop: 8,
    fontSize: 14,
  },
  imageButton: {
    marginTop: 8,
  },
  divider: {
    height: 8,
    backgroundColor: '#f0f0f0',
  },
  dropdownContainer: {
    marginVertical: 8,
  },
  dropdown: {
    justifyContent: 'flex-start',
  },
  dropdownContent: {
    justifyContent: 'flex-start',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 4,
  },
  stepContainer: {
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  removeStepButton: {
    marginLeft: 'auto',
    minWidth: 40,
  },
  stepInput: {
    marginLeft: 44,
  },
  addStepButton: {
    marginTop: 8,
  },
  submitSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 32,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default RecipeForm;