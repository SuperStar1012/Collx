import axios from 'axios';

export const getConfig = async () => {
  const response = await axios.get('/config');

  return response.data;
};
