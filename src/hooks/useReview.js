import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export const useProductReviews = (slug, page = 1, limit = 10, rating = '') => {
  return useQuery({
    queryKey: ['productReviews', slug, page, limit, rating],
    queryFn: async () => {
      const response = await api.get(`/reviews/${slug}`, {
        params: {
          page,
          limit,
          ...(rating && { rating }),
        },
      });
      return response.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
