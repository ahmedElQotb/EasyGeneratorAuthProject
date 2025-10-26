import axiosInstance from '../api/axiosInstance';

export const usersService = {
  getUsername: async (): Promise<{ name: string }> => {
    const response = await axiosInstance.get<{ name: string }>('/users/username');
    return response.data;
  },
};

