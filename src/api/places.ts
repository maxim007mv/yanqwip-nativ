import { api } from './client';
import type { Place, PlacesResponse } from '../types/api';

interface PlacesQuery {
  query?: string;
  lat?: number;
  lon?: number;
  radius?: number;
  tags?: string[];
}

export const fetchPlaces = async (params: PlacesQuery): Promise<Place[]> => {
  const response = await api.get<PlacesResponse>('/places', {
    params: {
      ...params,
      tags: params.tags?.join(','),
    },
  });
  return response.data.places;
};
