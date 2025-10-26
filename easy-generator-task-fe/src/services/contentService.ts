import axiosInstance from '../api/axiosInstance';

export interface QuoteResponse {
  quote: string;
}

export const contentService = {
  getQuote: async (): Promise<QuoteResponse> => {
    const response = await axiosInstance.get<QuoteResponse>('/content/quote');
    return response.data;
  },
};
