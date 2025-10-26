import axiosInstance from '../api/axiosInstance';
import type { SignUpData, SignInData, AuthResponse } from '../types/auth.types';

export const authService = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/signUp', data);
    return response.data;
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/signIn', data);
    return response.data;
  },

  logout: async (): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/logout');
    return response.data;
  },
};
