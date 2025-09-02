import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authenticateUser = async (credentials: LoginCredentials) => {
  try {
    // Get user from database
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', credentials.email)
      .limit(1);

    if (error) throw error;

    if (!users || users.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Contraseña incorrecta');
    }

    // Store user session in localStorage
    localStorage.setItem('adminUser', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }));

    return user;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('adminUser');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('adminUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};