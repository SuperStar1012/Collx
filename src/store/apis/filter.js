import axios from 'axios';

export const getCardFilters = async userId => {
  const response = await axios.get(`/users/${userId}/cards/filters`);

  return response.data;
};
