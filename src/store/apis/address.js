import axios from 'axios';

export const getAddresses = async query => {
  const {userId, ...params} = query;

  const response = await axios.get(`/users/${userId}/addresses`, {params});

  return response.data;
};
