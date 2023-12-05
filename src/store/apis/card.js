import axios from 'axios';

export const getCards = async query => {
  const response = await axios.get('/cards', {params: query});

  return response.data;
};
