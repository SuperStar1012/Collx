import axios from 'axios';

export const getSets = async query => {
  const response = await axios.get('/sets/options', {params: query});

  return response.data;
};
