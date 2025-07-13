import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Card, Text, IconButton, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../styles/globalStyles';

const RecipeCard = ({ recipe, onPress, onLike }) => {
  const imageUri = recipe.image 
    ? `http://localhost:5000${recipe.image}` 
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <TouchableOpacity onPress={() => onPress(recipe._id)}>
      <Card style={[globalStyles.shadow, { margin: 8 }]}>
        <Image 
          source={{ uri: imageUri }}
          style={{ height: 200, width: '100%' }}
          resizeMode="cover"
        />
        <Card.Content style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" numberOfLines={2}>
                {recipe.title}
              </Text>
              <Text variant="bodySmall" style={{ color: 'gray', marginTop: 4 }}>
                By {recipe.author?.username}
              </Text>
              <Text variant="bodySmall" numberOfLines={2} style={{ marginTop: 8 }}>
                {recipe.description}
              </Text>
            </View>
            <IconButton
              icon={({ color }) => (
                <Ionicons 
                  name="heart" 
                  size={24} 
                  color={recipe.isLiked ? '#FF6B35' : 'gray'} 
                />
              )}
              onPress={() => onLike(recipe._id)}
            />
          </View>
          
          <View style={{ flexDirection: 'row', marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip compact mode="outlined" style={{ marginRight: 8, marginBottom: 4 }}>
              {recipe.category}
            </Chip>
            <Chip compact mode="outlined" style={{ marginRight: 8, marginBottom: 4 }}>
              {recipe.difficulty}
            </Chip>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="time-outline" size={16} color="gray" />
              <Text variant="bodySmall" style={{ marginLeft: 4, color: 'gray' }}>
                {recipe.cookingTime} min
              </Text>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Ionicons name="heart" size={16} color="gray" />
            <Text variant="bodySmall" style={{ marginLeft: 4, color: 'gray' }}>
              {recipe.likes?.length || 0} likes
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export default RecipeCard;