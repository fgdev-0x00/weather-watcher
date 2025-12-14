export const attachInterceptors = (client) => {
  client.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response) {
        throw {
          type: 'EXTERNAL_API_ERROR',
          status: error.response.status,
          message: error.response.data?.message || 'External API error',
        };
      }

      if (error.request) {
        throw {
          type: 'NETWORK_ERROR',
          message: 'No response from external service',
        };
      }

      throw {
        type: 'UNKNOWN_ERROR',
        message: error.message,
      };
    }
  );
};
