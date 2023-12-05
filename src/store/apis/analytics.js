import axios from 'axios';
import Config from 'react-native-config';

export const sendEvent = async data => {

  const response = await axios({
    method: 'POST',
    baseURL: Config.ANALYTICS_BASE_URL,
    url: '/events',
    data,
  });

  return response.data;
};
