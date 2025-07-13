import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ 
  title = "CookMate", 
  showBack = false, 
  onBackPress, 
  showProfile = true,
  rightAction,
  navigation 
}) => {
  const { user } = useAuth();

  const handleProfilePress = () => {
    if (navigation) {
      navigation.navigate('Profile');
    }
  };

  return (
    <Appbar.Header style={styles.header}>
      {showBack && (
        <Appbar.BackAction onPress={onBackPress} />
      )}
      
      <Appbar.Content 
        title={title} 
        titleStyle={styles.title}
      />
      
      {rightAction && rightAction}
      
      {showProfile && user && (
        <View style={styles.profileContainer}>
          <Avatar.Text 
            size={35}
            label={user.username?.charAt(0).toUpperCase() || 'U'}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
            onTouchEnd={handleProfilePress}
          />
        </View>
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FF6B35',
    elevation: 4,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  profileContainer: {
    marginRight: 8,
  },
  avatar: {
    backgroundColor: '#F7931E',
  },
  avatarLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Header;