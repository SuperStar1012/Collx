import axios from 'axios';

export const getFriends = async query => {
  const response = await axios.get('/users', {params: query});

  return response.data;
};

export const getTopFriends = async query => {
  const response = await axios.get('/users/featured', {params: query});

  return response.data;
};

export const getHashFriends = async data => {
  const response = await axios.post('/users/hash-search', data);

  return response.data;
};
