import axios from 'axios';
import {Constants} from 'globals';

export const getInstallations = async userId => {
  const response = await axios.get(`/installations/${userId}`, {
    params: {limit: Constants.installationFetchLimit, offset: 0},
  });

  return response.data;
};

export const createInstallation = async query => {
  const {userId, ...data} = query;

  const response = await axios.post(`/installations/${userId}`, data);

  return response.data;
};

export const updateInstallation = async query => {
  const {userId, deviceId, ...data} = query;

  const response = await axios.put(
    `/installations/${userId}/${deviceId}`,
    data,
  );

  return response.data;
};
