import { createHttpClient } from './client.js';

export const placesClient = createHttpClient({
  baseURL: 'https://search.reservamos.mx/api/v2',
});

const filterCities = (allResponse) => {
  return allResponse.filter((record) => record.result_type == 'city');
};

const getCities = async() => {
    const response = await placesClient.get('/places') || [];
    
    const filteredCities = filterCities(response);

    return filteredCities;
};

export { getCities };