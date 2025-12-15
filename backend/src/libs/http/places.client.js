import { createHttpClient } from './client.js';

export const placesClient = createHttpClient({
  baseURL: 'https://search.reservamos.mx/api/v2/places',
});

const getCities = async() => {
    const response = await placesClient.get() || [];
    
    const filteredCities = response.filter((record) => record.result_type == 'city');

    return filteredCities;
};

export { getCities };