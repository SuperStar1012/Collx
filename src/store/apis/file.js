/* eslint-disable no-useless-escape */
import {Platform} from 'react-native';
import * as mime from 'react-native-mime-types';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Config from 'react-native-config';
import {parseString} from 'react-native-xml2js';

import {Constants} from 'globals';
import {getUserInfo} from 'utils';

export const uploadFileToCloud = async (uploadUrl, filePath) => {
  return new Promise((resolve, reject) => {
    ReactNativeBlobUtil.fetch(
      'PUT',
      decodeURIComponent(uploadUrl),
      {
        'Content-Type': mime.lookup(filePath) || 'image/jpeg',
      },
      ReactNativeBlobUtil.wrap(filePath.replace('file://', '')),
    ).then((response) => {
      const responseData = response.text();
      if (responseData) {
        parseString(responseData, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
        return;
      }

      resolve(null);
    })
    .catch((error) => {
      reject(error);
    });
  });
};

export const uploadVisualSearch = async (visionUrl, data) => {
  const currentUserInfo = await getUserInfo();

  if (!currentUserInfo?.token) {
    return;
  }

  return new Promise((resolve, reject) => {
    const {type, barcodes, visual, front, source} = data;

    const formData = [];
    formData.push({name: 'type', data: String(type)});
    formData.push({name: 'source', data: source?.toLowerCase() || 'unknown'});
    formData.push({name: 'platform', data: Platform.OS});

    if (barcodes && barcodes[Constants.cardFrontPhoto]) {
      formData.push({
        name: 'barcodes',
        data: JSON.stringify([barcodes[Constants.cardFrontPhoto]]),
      });
    }

    let frontImageFile = visual;
    if (!frontImageFile) {
      frontImageFile = front;
    }

    if (frontImageFile) {
      formData.push({
        name: 'front_image_file',
        filename: frontImageFile.replace(/^.*[\\\/]/, ''),
        type: mime.lookup(frontImageFile) || 'image/jpeg',
        data: ReactNativeBlobUtil.wrap(frontImageFile.replace('file://', '')),
      });
    }

    ReactNativeBlobUtil.fetch(
      'POST',
      visionUrl || `${Config.API_BASE_URL}/cards/vsearch`,
      {
        Authorization: `Bearer ${currentUserInfo?.token}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      formData,
    ).then((response) => {
      // if (response?.info()?.respType === 'json') {
      //   resolve(response.json());
      // } else {
      //   reject(new Error (JSON.stringify(response?.info() || {})));
      // }
      resolve(response.json());
    }).catch((error) => {
      reject(error);
    });
  });
};
