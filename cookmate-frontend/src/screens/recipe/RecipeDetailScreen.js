import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Alert, Share } from 'react-native';
import { Text, IconButton, Chip, Divider, Card, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import Header from '../../components/layout/Header';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { globalStyles } from '../../styles/globalStyles';
import { 
  getImageUri, 
  formatCookingTime, 
  shareRecipe, 
  getDifficultyColor,
  formatDate,
  showAlert,
  showConfirmation
} from '../../utils/helpers';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [recipeId]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/recipes/${recipeId}`);
      const recipeData = response.data.recipe;
      
      setRecipe(recipeData);
      setIsLiked(recipeData.isLiked || false);
      setLikesCount(recipeData.likes?.length || 0);
      
    } catch (error) {
      console.error('Error fetching recipe:', error);
      showAlert(
        'Error', 
        'Failed to load recipe details. Please try again.',
        [
          { text: 'Retry', onPress: fetchRecipe },
          { text: 'Go Back', onPress: () => navigation.goBack() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (actionLoading) return;
    
    try {
      setActionLoading(true);
      const response = await api.post(`/recipes/${recipeId}/like`);
      
      setIsLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
      
    } catch (error) {
      console.error('Error liking recipe:', error);
      showAlert('Error', 'Failed to update like status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = async () => {
    if (recipe) {
      try {
        await Share.share({
          message: `Check out this amazing recipe: ${recipe.title}\n\n${recipe.description}\n\nShared via CookMate app!`,
          title: recipe.title,
          url: recipe.image ? getImageUri(recipe.image) : undefined,
        });
      } catch (error) {
        console.error('Error sharing recipe:', error);
        showAlert('Error', 'Failed to share recipe. Please try again.');
      }
    }
  };

  const handleSaveRecipe = async () => {
    // TODO: Implement save recipe functionality
    showAlert('Coming Soon', 'Save recipe feature will be available soon!');
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header 
          title="Recipe Details"
          showBack={true}
          onBackPress={() => navigation.goBack()}
          showProfile={false}
          navigation={navigation}
        />
        <LoadingSpinner />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={globalStyles.container}>
        <Header 
          title="Recipe Details"
          showBack={true}
          onBackPress={() => navigation.goBack()}
          showProfile={false}
          navigation={navigation}
        />
        <View style={globalStyles.centeredContainer}>
          <Ionicons name="restaurant-outline" size={64} color="#ccc" />
          <Text variant="headlineSmall" style={{ marginTop: 16, color: 'gray' }}>
            Recipe not found
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    );
  }

  const imageUri = getImageUri(recipe.image);

  return (
    <View style={globalStyles.container}>
      <Header 
        title=""
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showProfile={false}
        rightAction={
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon={() => <Ionicons name="bookmark-outline" size={24} color="white" />}
              onPress={handleSaveRecipe}
            />
            <IconButton
              icon={() => <Ionicons name="share-outline" size={24} color="white" />}
              onPress={handleShare}
            />
          </View>
        }
        navigation={navigation}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={{ position: 'relative' }}>
          <Image 
            source={{ uri: imageUri }}
            style={{ width: '100%', height: 300 }}
            resizeMode="cover"
          />
          
          {/* Floating Like Button */}
          <FAB
            icon={() => (
              <Ionicons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={24} 
                color={isLiked ? "white" : "white"} 
              />
            )}
            style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: isLiked ? '#FF6B35' : 'rgba(0,0,0,0.5)',
            }}
            onPress={handleLike}
            disabled={actionLoading}
          />
        </View>

        <View style={globalStyles.screenPadding}>
          {/* Recipe Header */}
          <View style={{ marginTop: 20 }}>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', lineHeight: 32 }}>
              {recipe.title}
            </Text>
            
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: 8 
            }}>
              <View>
                <Text variant="bodyMedium" style={{ color: 'gray' }}>
                  By {recipe.author?.username}
                </Text>
                <Text variant="bodySmall" style={{ color: 'gray' }}>
                  {formatDate(recipe.createdAt)}
                </Text>
              </View>
              
              <View style={{ alignItems: 'flex-end' }}>
                <Text variant="bodySmall" style={{ color: 'gray' }}>
                  {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                </Text>
              </View>
            </View>

            <Text variant="bodyLarge" style={{ 
              marginTop: 16, 
              lineHeight: 24, 
              color: '#333' 
            }}>
              {recipe.description}
            </Text>
          </View>

          {/* Recipe Info Chips */}
          <View style={{ 
            flexDirection: 'row', 
            marginTop: 20, 
            flexWrap: 'wrap',
            gap: 8 
          }}>
            <Chip 
              mode="outlined" 
              icon={() => <Ionicons name="time-outline" size={16} />}
              style={{ backgroundColor: '#FF6B35', borderColor: '#FF6B35' }}
              textStyle={{ color: 'white' }}
            >
              {formatCookingTime(recipe.cookingTime)}
            </Chip>
            
            <Chip 
              mode="outlined" 
              style={{ 
                backgroundColor: getDifficultyColor(recipe.difficulty) + '20',
                borderColor: getDifficultyColor(recipe.difficulty)
              }}
              textStyle={{ color: getDifficultyColor(recipe.difficulty) }}
            >
              {recipe.difficulty}
            </Chip>
            
            <Chip 
              mode="outlined"
              style={{ backgroundColor: '#f0f0f0' }}
            >
              {recipe.category}
            </Chip>
          </View>

          <Divider style={{ marginVertical: 32 }} />

          {/* Ingredients Section */}
          <View style={{ marginBottom: 32 }}>
            <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: 16 }}>
              Ingredients ({recipe.ingredients.length})
            </Text>
            
            <Card style={globalStyles.shadow}>
              <Card.Content style={{ padding: 0 }}>
                {recipe.ingredients.map((ingredient, index) => (
                  <View key={index}>
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      paddingVertical: 16,
                      paddingHorizontal: 16
                    }}>
                      <Text variant="bodyLarge" style={{ flex: 1, color: '#333' }}>
                        {ingredient.name}
                      </Text>
                      <Text variant="bodyLarge" style={{ 
                        fontWeight: 'bold', 
                        color: '#FF6B35',
                        marginLeft: 16
                      }}>
                        {ingredient.quantity}
                      </Text>
                    </View>
                    {index < recipe.ingredients.length - 1 && (
                      <Divider style={{ marginHorizontal: 16 }} />
                    )}
                  </View>
                ))}
              </Card.Content>
            </Card>
          </View>

          {/* Instructions Section */}
          <View style={{ marginBottom: 32 }}>
            <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: 16 }}>
              Instructions ({recipe.steps.length} steps)
            </Text>
            
            {recipe.steps.map((step, index) => (
              <Card key={index} style={[globalStyles.shadow, { marginBottom: 16 }]}>
                <Card.Content>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 20, 
                      backgroundColor: '#FF6B35', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginRight: 16,
                      marginTop: 4
                    }}>
                      <Text variant="bodyLarge" style={{ color: 'white', fontWeight: 'bold' }}>
                        {step.stepNumber}
                      </Text>
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text variant="bodyLarge" style={{ 
                        lineHeight: 24, 
                        color: '#333' 
                      }}>
                        {step.instruction}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={{ marginBottom: 32 }}>
            <Button
              title={isLiked ? "❤️ Liked" : "🤍 Like this recipe"}
              mode={isLiked ? "contained" : "outlined"}
              onPress={handleLike}
              loading={actionLoading}
              style={{ marginBottom: 12 }}
            />
            
            <Button
              title="📤 Share Recipe"
              mode="outlined"
              onPress={handleShare}
              style={{ marginBottom: 12 }}
            />
            
            <Button
              title="🔖 Save Recipe"
              mode="outlined"
              onPress={handleSaveRecipe}
            />
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;