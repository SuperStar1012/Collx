import axios from 'axios';
import Config from 'react-native-config';

export const getUserCard = async query => {
  const {userId, userCardId} = query;

  const response = await axios.get(`/users/${userId}/cards/${userCardId}`);

  return response.data;
};

export const getSaleUserCards = async query => {
  const response = await axios.get('/user_cards', {
    params: query,
  });

  return response.data;
};

export const getExportCollection = async () => {
  const response = await axios({
    method: 'GET',
    baseURL: Config.SERVICES_BASE_URL,
    url: '/exports',
  });

  return response.data;
};

export const setExportCollection = async data => {
  const response = await axios({
    method: 'POST',
    baseURL: Config.SERVICES_BASE_URL,
    url: '/exports',
    data,
  });

  return response.data;
};
