import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, ScrollView } from 'react-native';
import { Text, Avatar, Divider, List, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import RecipeCard from '../../components/recipe/RecipeCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Header from '../../components/layout/Header';
import { globalStyles } from '../../styles/globalStyles';
import { formatDate, getInitials } from '../../utils/helpers';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalLikes: 0,
    totalViews: 0,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/recipes/my-recipes');
      const recipes = response.data.recipes;
      
      setUserRecipes(recipes);
      
      // Calculate stats
      const totalLikes = recipes.reduce((acc, recipe) => acc + (recipe.likes?.length || 0), 0);
      setStats({
        totalRecipes: recipes.length,
        totalLikes: totalLikes,
        totalViews: recipes.reduce((acc, recipe) => acc + (recipe.views || 0), 0),
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        },
      ]
    );
  };

  const navigateToRecipe = (recipeId) => {
    navigation.navigate('RecipeDetail', { recipeId });
  };

  const handleLike = async (recipeId) => {
    try {
      await api.post(`/recipes/${recipeId}/like`);
      // Refresh user recipes to update like status
      fetchUserData();
    } catch (error) {
      console.error('Error liking recipe:', error);
      Alert.alert('Error', 'Failed to update like status');
    }
  };

  const navigateToEditProfile = () => {
    // TODO: Implement edit profile screen
    Alert.alert('Coming Soon', 'Edit profile feature will be available soon!');
  };

  const navigateToSettings = () => {
    // TODO: Implement settings screen
    Alert.alert('Coming Soon', 'Settings will be available soon!');
  };

  const navigateToHelp = () => {
    // TODO: Implement help screen
    Alert.alert('Help & Support', 'For support, please contact us at support@cookmate.com');
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header 
          title="Profile"
          showBack={false}
          showProfile={false}
          navigation={navigation}
        />
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Profile"
        showBack={false}
        showProfile={false}
        navigation={navigation}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={[globalStyles.shadow, { margin: 16, marginBottom: 8 }]}>
          <Card.Content style={{ alignItems: 'center', paddingVertical: 24 }}>
            <Avatar.Text 
              size={80} 
              label={getInitials(user?.username)}
              style={{ backgroundColor: '#FF6B35', marginBottom: 16 }}
              labelStyle={{ fontSize: 32, fontWeight: 'bold' }}
            />
            
            <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: 4 }}>
              {user?.username}
            </Text>
            
            <Text variant="bodyMedium" style={{ color: 'gray', marginBottom: 16 }}>
              {user?.email}
            </Text>

            <Button
              title="Edit Profile"
              mode="outlined"
              onPress={navigateToEditProfile}
              style={{ marginBottom: 16 }}
            />
            
            {/* Stats Row */}
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text variant="titleLarge" style={{ fontWeight: 'bold', color: '#FF6B35' }}>
                  {stats.totalRecipes}
                </Text>
                <Text variant="bodySmall" style={{ color: 'gray' }}>
                  Recipes
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text variant="titleLarge" style={{ fontWeight: 'bold', color: '#FF6B35' }}>
                  {stats.totalLikes}
                </Text>
                <Text variant="bodySmall" style={{ color: 'gray' }}>
                  Total Likes
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text variant="titleLarge" style={{ fontWeight: 'bold', color: '#FF6B35' }}>
                  {user ? formatDate(user.createdAt) : 'N/A'}
                </Text>
                <Text variant="bodySmall" style={{ color: 'gray' }}>
                  Member Since
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Menu Options */}
        <Card style={[globalStyles.shadow, { margin: 16, marginTop: 8, marginBottom: 8 }]}>
          <Card.Content style={{ padding: 0 }}>
            <List.Item
              title="My Recipes"
              description={`${stats.totalRecipes} recipes created`}
              left={() => <List.Icon icon={() => <Ionicons name="restaurant" size={24} color="#FF6B35" />} />}
              right={() => <List.Icon icon={() => <Ionicons name="chevron-forward" size={24} color="gray" />} />}
              onPress={() => {
                // Scroll to recipes section
                if (userRecipes.length > 0) {
                  // Could implement smooth scroll to recipes section
                } else {
                  Alert.alert('No Recipes', 'You haven\'t created any recipes yet.');
                }
              }}
            />
            
            <Divider />
            
            <List.Item
              title="Favorite Recipes"
              description="Recipes you've liked"
              left={() => <List.Icon icon={() => <Ionicons name="heart" size={24} color="#FF6B35" />} />}
              right={() => <List.Icon icon={() => <Ionicons name="chevron-forward" size={24} color="gray" />} />}
              onPress={() => Alert.alert('Coming Soon', 'Favorite recipes feature will be available soon!')}
            />
            
            <Divider />
            
            <List.Item
              title="Settings"
              description="App preferences and account settings"
              left={() => <List.Icon icon={() => <Ionicons name="settings" size={24} color="#FF6B35" />} />}
              right={() => <List.Icon icon={() => <Ionicons name="chevron-forward" size={24} color="gray" />} />}
              onPress={navigateToSettings}
            />
            
            <Divider />
            
            <List.Item
              title="Help & Support"
              description="Get help and contact support"
              left={() => <List.Icon icon={() => <Ionicons name="help-circle" size={24} color="#FF6B35" />} />}
              right={() => <List.Icon icon={() => <Ionicons name="chevron-forward" size={24} color="gray" />} />}
              onPress={navigateToHelp}
            />
          </Card.Content>
        </Card>

        {/* My Recent Recipes */}
        <Card style={[globalStyles.shadow, { margin: 16, marginTop: 8 }]}>
          <Card.Content>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                My Recent Recipes
              </Text>
              {userRecipes.length > 3 && (
                <Button
                  title="View All"
                  mode="text"
                  onPress={() => Alert.alert('Coming Soon', 'View all recipes feature will be available soon!')}
                />
              )}
            </View>

            {userRecipes.length > 0 ? (
              <View>
                {userRecipes.slice(0, 3).map((recipe, index) => (
                  <View key={recipe._id}>
                    <RecipeCard
                      recipe={recipe}
                      onPress={navigateToRecipe}
                      onLike={handleLike}
                    />
                    {index < Math.min(userRecipes.length, 3) - 1 && (
                      <View style={{ height: 8 }} />
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                <Ionicons name="restaurant-outline" size={64} color="#ccc" />
                <Text variant="bodyLarge" style={{ color: 'gray', textAlign: 'center', marginTop: 16, marginBottom: 16 }}>
                  You haven't created any recipes yet.{'\n'}
                  Start sharing your delicious recipes!
                </Text>
                <Button
                  title="Create Your First Recipe"
                  onPress={() => navigation.navigate('Add Recipe')}
                  style={{ marginTop: 8 }}
                />
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <View style={{ margin: 16 }}>
          <Button
            title="Logout"
            mode="outlined"
            onPress={handleLogout}
            style={{ 
              borderColor: '#FF5252',
              marginBottom: 32 
            }}
            textColor="#FF5252"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;