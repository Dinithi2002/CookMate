import { Alert, Linking, Platform, Share } from 'react-native';
import { IMAGE_PLACEHOLDER } from './constants';

/**
 * Format cooking time to human readable string
 */
export const formatCookingTime = (minutes) => {
  if (!minutes || minutes <= 0) return 'N/A';
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Get image URI with fallback to placeholder
 */
export const getImageUri = (image, baseUrl = 'http://localhost:5000') => {
  if (!image) return IMAGE_PLACEHOLDER;
  
  if (image.startsWith('http')) {
    return image;
  }
  
  return `${baseUrl}${image}`;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Show alert with custom styling
 */
export const showAlert = (title, message, buttons = []) => {
  const defaultButtons = [
    { text: 'OK', style: 'default' }
  ];
  
  Alert.alert(title, message, buttons.length > 0 ? buttons : defaultButtons);
};

/**
 * Show confirmation dialog
 */
export const showConfirmation = (title, message, onConfirm, onCancel) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'Confirm',
        style: 'destructive',
        onPress: onConfirm,
      },
    ]
  );
};

/**
 * Open URL in browser
 */
export const openURL = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      showAlert('Error', `Cannot open URL: ${url}`);
    }
  } catch (error) {
    console.error('Error opening URL:', error);
    showAlert('Error', 'Failed to open URL');
  }
};

/**
 * Share recipe
 */
export const shareRecipe = async (recipe) => {
  try {
    const message = `Check out this amazing recipe: ${recipe.title}\n\n${recipe.description}\n\nShared via CookMate app!`;
    
    await Share.share({
      message,
      title: recipe.title,
      url: recipe.image ? getImageUri(recipe.image) : undefined,
    });
  } catch (error) {
    console.error('Error sharing recipe:', error);
    showAlert('Error', 'Failed to share recipe');
  }
};

/**
 * Generate recipe difficulty color
 */
export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return '#4CAF50'; // Green
    case 'medium':
      return '#FF9800'; // Orange
    case 'hard':
      return '#F44336'; // Red
    default:
      return '#757575'; // Gray
  }
};

/**
 * Generate category color
 */
export const getCategoryColor = (category) => {
  const colors = {
    breakfast: '#FFB74D',
    lunch: '#81C784',
    dinner: '#64B5F6',
    snack: '#FFD54F',
    dessert: '#F06292',
    appetizer: '#A1887F',
    beverage: '#4DB6AC',
  };
  
  return colors[category?.toLowerCase()] || '#9E9E9E';
};

/**
 * Debounce function for search inputs
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Calculate recipe rating average
 */
export const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  
  const sum = ratings.reduce((acc, rating) => acc + rating.value, 0);
  return (sum / ratings.length).toFixed(1);
};

/**
 * Format ingredient list for display
 */
export const formatIngredientsList = (ingredients) => {
  if (!ingredients || ingredients.length === 0) return '';
  
  return ingredients
    .map(ingredient => `${ingredient.quantity} ${ingredient.name}`)
    .join(', ');
};

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Validate recipe form data
 */
export const validateRecipeData = (data) => {
  const errors = {};
  
  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }
  
  if (!data.cookingTime || data.cookingTime <= 0) {
    errors.cookingTime = 'Cooking time must be greater than 0';
  }
  
  if (!data.category) {
    errors.category = 'Category is required';
  }
  
  if (!data.difficulty) {
    errors.difficulty = 'Difficulty is required';
  }
  
  if (!data.ingredients || data.ingredients.length === 0) {
    errors.ingredients = 'At least one ingredient is required';
  }
  
  if (!data.steps || data.steps.filter(step => step.instruction && step.instruction.trim()).length === 0) {
    errors.steps = 'At least one cooking step is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if image file is valid
 */
export const isValidImageFile = (file) => {
  if (!file) return false;
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Remove HTML tags from string
 */
export const stripHtmlTags = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '');
};

/**
 * Convert string to URL slug
 */
export const slugify = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Check network connectivity (basic implementation)
 */
export const checkNetworkConnectivity = async () => {
  try {
    // Simple network check
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
      timeout: 5000,
    });
    return true;
  } catch (error) {
    console.warn('Network check failed:', error);
    return false;
  }
};

/**
 * Retry async operation
 */
export const retryAsync = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

/**
 * Format numbers with commas
 */
export const formatNumber = (num) => {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Get platform-specific styles
 */
export const getPlatformStyle = (iosStyle, androidStyle) => {
  return Platform.OS === 'ios' ? iosStyle : androidStyle;
};

/**
 * Safe JSON parse
 */
export const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON parse error:', error);
    return defaultValue;
  }
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  if (typeof obj === 'string') return obj.trim().length === 0;
  return false;
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

/**
 * Calculate reading time for recipe
 */
export const calculateReadingTime = (text) => {
  if (!text) return 0;
  
  const wordsPerMinute = 200;
  const words = text.split(' ').length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Get recipe difficulty emoji
 */
export const getDifficultyEmoji = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return '😊';
    case 'medium':
      return '🤔';
    case 'hard':
      return '🔥';
    default:
      return '❓';
  }
};

/**
 * Convert minutes to hours and minutes
 */
export const minutesToHoursAndMinutes = (totalMinutes) => {
  if (!totalMinutes || totalMinutes <= 0) return { hours: 0, minutes: 0 };
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return { hours, minutes };
};

/**
 * Format cooking time with emoji
 */
export const formatCookingTimeWithEmoji = (minutes) => {
  const timeStr = formatCookingTime(minutes);
  return `⏱️ ${timeStr}`;
};

/**
 * Check if user can edit recipe (is author)
 */
export const canEditRecipe = (recipe, currentUser) => {
  if (!recipe || !currentUser) return false;
  return recipe.author?._id === currentUser.id || recipe.author?.id === currentUser.id;
};

/**
 * Generate a random recipe tip
 */
export const getRandomCookingTip = () => {
  const tips = [
    "Taste as you go! Adjust seasoning throughout the cooking process.",
    "Let meat rest after cooking to redistribute juices.",
    "Use room temperature ingredients for better mixing.",
    "Preheat your oven properly - it makes a difference!",
    "Sharp knives are safer and more efficient than dull ones.",
    "Don't overcrowd the pan when searing or frying.",
    "Save pasta water - it's great for adjusting sauce consistency!",
    "Mise en place: prep all ingredients before you start cooking.",
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
};

/**
 * Validate ingredient input
 */
export const validateIngredient = (ingredient) => {
  if (!ingredient || typeof ingredient !== 'object') return false;
  
  return ingredient.name && 
         ingredient.name.trim().length > 0 && 
         ingredient.quantity && 
         ingredient.quantity.trim().length > 0;
};

/**
 * Validate cooking step
 */
export const validateCookingStep = (step) => {
  if (!step || typeof step !== 'object') return false;
  
  return step.instruction && 
         step.instruction.trim().length >= 10; // Minimum 10 characters
};

/**
 * Clean recipe data before submission
 */
export const cleanRecipeData = (recipeData) => {
  return {
    ...recipeData,
    title: sanitizeInput(recipeData.title),
    description: sanitizeInput(recipeData.description),
    ingredients: recipeData.ingredients
      .filter(validateIngredient)
      .map(ingredient => ({
        name: sanitizeInput(ingredient.name),
        quantity: sanitizeInput(ingredient.quantity),
      })),
    steps: recipeData.steps
      .filter(validateCookingStep)
      .map((step, index) => ({
        stepNumber: index + 1,
        instruction: sanitizeInput(step.instruction),
      })),
  };
};