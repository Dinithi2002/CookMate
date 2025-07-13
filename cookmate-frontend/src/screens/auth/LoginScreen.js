import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { globalStyles } from '../../styles/globalStyles';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    
    if (!result.success) {
      Alert.alert('Login Failed', result.message);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.centeredContainer}>
        <Text variant="headlineLarge" style={{ textAlign: 'center', marginBottom: 32, color: '#FF6B35', fontWeight: 'bold' }}>
          CookMate
        </Text>
        
        <Card style={[globalStyles.shadow, { width: '100%', maxWidth: 400 }]}>
          <Card.Content style={{ padding: 24 }}>
            <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 24 }}>
              Welcome Back!
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  secureTextEntry
                />
              )}
            />

            <Button
              title="Login"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={{ marginTop: 16 }}
            />

            <Button
              title="Don't have an account? Register"
              mode="text"
              onPress={() => navigation.navigate('Register')}
              style={{ marginTop: 8 }}
            />
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;