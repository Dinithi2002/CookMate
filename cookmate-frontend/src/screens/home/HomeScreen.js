import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import api from '../../services/api';
import RecipeCard from '../../components/recipe/RecipeCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { globalStyles } from '../../styles/globalStyles';

const HomeScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery !== '') {
        searchRecipes();
      } else {
        fetchRecipes(true);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const fetchRecipes = async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page;
      const response = await api.get(`/recipes?page=${currentPage}&limit=10${searchQuery ? `&search=${searchQuery}` : ''}`);
      
      if (reset) {
        setRecipes(response.data.recipes);
        setPage(2);
      } else {
        setRecipes(prev => [...prev, ...response.data.recipes]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(response.data.recipes.length === 10);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const searchRecipes = async () => {
    setLoading(true);
    setPage(1);
    await fetchRecipes(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchRecipes(true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchRecipes();
    }
  };

  const handleLike = async (recipeId) => {
    try {
      await api.post(`/recipes/${recipeId}/like`);
      // Update local state
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

  if (loading && recipes.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.screenPadding}>
        <Text variant="headlineMedium" style={{ marginBottom: 16, fontWeight: 'bold' }}>
          Discover Recipes
        </Text>
        
        <Searchbar
          placeholder="Search recipes..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ marginBottom: 16 }}
        />
      </View>

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading && recipes.length > 0 ? <LoadingSpinner /> : null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;