import Config from 'react-native-config';
import axios from 'axios';
import relayEnvironment from 'relay/Environment';

import {Constants} from 'globals';

let lastResponseError = Constants.axiosResponseError.none;

export const initAxios = (token, onChangeResponseStatus) => {
  axios.defaults.baseURL = Config.API_BASE_URL;
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common.Accept = 'application/json';

  setAxiosToken(token);

  // axios.interceptors.request.use(request => {
  //   console.log('axios request: ', JSON.stringify(request, null, 2));
  //   return request;
  // });

  axios.interceptors.response.use(
    response => {
      // console.log('axios response: ', JSON.stringify(response, null, 2));

      if (lastResponseError !== Constants.axiosResponseError.none) {
        if (onChangeResponseStatus) {
          onChangeResponseStatus(Constants.axiosResponseError.none);
        }
      }

      lastResponseError = Constants.axiosResponseError.none;

      return response;
    },
    error => {
      // console.log('axios error: ', JSON.stringify(error, null, 2));

      if (error.response?.status === 401 || error.response?.status === 403) {
        // Authenticate Error
        if (error.config?.headers?.Authorization) {
          lastResponseError = Constants.axiosResponseError.auth;
          if (onChangeResponseStatus) {
            onChangeResponseStatus(lastResponseError);
          }
        }
      } else if (error.response?.status === 503) {
        // Maintenance
        lastResponseError = Constants.axiosResponseError.maintenance;
        if (onChangeResponseStatus) {
          onChangeResponseStatus(lastResponseError);
        }

        return sleepRequest(error.config);
      }

      return Promise.reject(error);
    },
  );
};

export const setAxiosToken = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    axios.defaults.headers.common.Authorization = null;
  }

  relayEnvironment.setBearerToken(token);
};

export const resetAxios = () => {
  axios.defaults.headers.common.Authorization = null;

  relayEnvironment.resetEnvironment();
};

const sleepRequest = (originalRequest) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(axios(originalRequest)), Constants.axiosRetryTimeout * 1000);
  });
};
