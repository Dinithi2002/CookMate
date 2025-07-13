import api from './api';
import { storage } from './storage';

class AuthService {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email: email.toLowerCase().trim(),
        password,
      });

      const { token, user } = response.data;

      if (token) {
        await storage.setItem('authToken', token);
        await storage.setItem('user', JSON.stringify(user));
      }

      return {
        success: true,
        user,
        token,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
        error: error.response?.data || error.message,
      };
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', {
        username: userData.username.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
      });

      const { token, user } = response.data;

      if (token) {
        await storage.setItem('authToken', token);
        await storage.setItem('user', JSON.stringify(user));
      }

      return {
        success: true,
        user,
        token,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
        error: error.response?.data || error.message,
      };
    }
  }

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/profile');
      
      const { user } = response.data;
      await storage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user profile.',
        error: error.response?.data || error.message,
      };
    }
  }

  // Logout user
  async logout() {
    try {
      await storage.removeItem('authToken');
      await storage.removeItem('user');
      
      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Error during logout',
        error: error.message,
      };
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const token = await storage.getItem('authToken');
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  // Get stored auth token
  async getAuthToken() {
    try {
      return await storage.getItem('authToken');
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  // Get stored user data
  async getStoredUser() {
    try {
      const userString = await storage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Get stored user error:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile', userData);
      
      const { user } = response.data;
      await storage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        user,
        message: response.data.message || 'Profile updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile.',
        error: error.response?.data || error.message,
      };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      return {
        success: true,
        message: response.data.message || 'Password changed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password.',
        error: error.response?.data || error.message,
      };
    }
  }

  // Refresh auth token
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh-token');
      
      const { token } = response.data;
      if (token) {
        await storage.setItem('authToken', token);
      }

      return {
        success: true,
        token,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to refresh token.',
        error: error.response?.data || error.message,
      };
    }
  }
}

// Export singleton instance
export default new AuthService();