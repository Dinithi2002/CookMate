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
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const RegisterScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const { confirmPassword, ...registerData } = data;
    const result = await register(registerData);
    
    if (!result.success) {
      Alert.alert('Registration Failed', result.message);
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
              Join CookMate!
            </Text>

            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Username"
                  value={value}
                  onChangeText={onChange}
                  error={errors.username?.message}
                  autoCapitalize="none"
                />
              )}
            />

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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmPassword?.message}
                  secureTextEntry
                />
              )}
            />

            <Button
              title="Register"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={{ marginTop: 16 }}
            />

            <Button
              title="Already have an account? Login"
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={{ marginTop: 8 }}
            />
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;