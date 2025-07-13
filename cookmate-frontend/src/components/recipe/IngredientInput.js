import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, IconButton, Text, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const IngredientInput = ({ 
  ingredients = [], 
  onIngredientsChange, 
  error 
}) => {
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState('');

  const addIngredient = () => {
    if (ingredientName.trim() && quantity.trim()) {
      const newIngredient = {
        name: ingredientName.trim(),
        quantity: quantity.trim(),
      };
      
      const updatedIngredients = [...ingredients, newIngredient];
      onIngredientsChange(updatedIngredients);
      
      // Clear inputs
      setIngredientName('');
      setQuantity('');
    }
  };

  const removeIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    onIngredientsChange(updatedIngredients);
  };

  const handleIngredientSubmit = () => {
    addIngredient();
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.label}>
        Ingredients
      </Text>
      
      {/* Input Row */}
      <View style={styles.inputRow}>
        <TextInput
          mode="outlined"
          label="Ingredient"
          value={ingredientName}
          onChangeText={setIngredientName}
          style={styles.ingredientInput}
          placeholder="e.g., Tomatoes"
          onSubmitEditing={handleIngredientSubmit}
        />
        
        <TextInput
          mode="outlined"
          label="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          style={styles.quantityInput}
          placeholder="e.g., 2 cups"
          onSubmitEditing={handleIngredientSubmit}
        />
        
        <IconButton
          icon={() => <Ionicons name="add" size={24} color="#FF6B35" />}
          mode="contained"
          containerColor="#FF6B35"
          iconColor="white"
          onPress={addIngredient}
          disabled={!ingredientName.trim() || !quantity.trim()}
          style={styles.addButton}
        />
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Ingredients List */}
      {ingredients.length > 0 && (
        <View style={styles.ingredientsList}>
          <Text variant="bodyMedium" style={styles.listTitle}>
            Added Ingredients ({ingredients.length}):
          </Text>
          
          <View style={styles.chipsContainer}>
            {ingredients.map((ingredient, index) => (
              <Chip
                key={index}
                mode="outlined"
                onClose={() => removeIngredient(index)}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {ingredient.name} - {ingredient.quantity}
              </Chip>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  ingredientInput: {
    flex: 2,
    marginRight: 8,
  },
  quantityInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    margin: 0,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 4,
  },
  ingredientsList: {
    marginTop: 16,
  },
  listTitle: {
    marginBottom: 8,
    color: '#666',
    fontWeight: '500',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 4,
    backgroundColor: '#f8f9fa',
  },
  chipText: {
    fontSize: 12,
  },
});

export default IngredientInput;