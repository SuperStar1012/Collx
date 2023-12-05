/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
import axios from 'axios';
import * as mime from 'react-native-mime-types';

import {uploadFileToCloud} from './file';
import {getUploadUrlsForUserCard} from '../relay';
import {Constants} from 'globals';
import {isValidUrl, sleep} from 'utils';

export const confirmUserCard = async data => {
  const {userId, cardIds} = data;

  const response = await axios.post(`/users/${userId}/cards/confirm`, cardIds);

  return response.data;
};

export const updateUserCardMedia = async data => {
  const {
    userId,
    userCardId,
    frontImage,
    backImage,
  } = data;

  const formData = new FormData();

  if (frontImage) {
    formData.append('front_image_file', {
      uri: frontImage,
      name: frontImage.replace(/^.*[\\\/]/, ''),
      type: mime.lookup(frontImage) || 'image/jpeg',
    });
  }

  if (backImage) {
    formData.append('back_image_file', {
      uri: backImage,
      name: backImage.replace(/^.*[\\\/]/, ''),
      type: mime.lookup(backImage) || 'image/jpeg',
    });
  }
  const response = await axios.put(`/users/${userId}/cards/${userCardId}/media`, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });

  return response.data;
};

export const uploadUserCardPhotoToCloud = async (tradingCardId, imageUploadUrl, localImagePath, cardFace) => {
  let response = await uploadFileToCloud(imageUploadUrl, localImagePath);

  if (!response) {
    // No error
    return null;
  }

  if (response.Error?.Code?.includes(Constants.cloudErrorCode.expiredToken)) {
    // response.Error?.Code?.includes('AccessDenied')
    const urlsResponse = await getUploadUrlsForUserCard(tradingCardId);

    if (urlsResponse && urlsResponse.frontImageUploadUrl && urlsResponse.backImageUploadUrl) {
      response = await uploadFileToCloud(
        cardFace === Constants.cardFrontPhoto ? urlsResponse.frontImageUploadUrl : urlsResponse.backImageUploadUrl,
        localImagePath,
      );

      if (!response) {
        // No error
        return cardFace === Constants.cardFrontPhoto ? urlsResponse : null
      }
    }
  }

  return response;
};

export const uploadUserCardPhotosToCloud = async (userCard) => {
  const {
    tradingCardId,
    frontImageUrl,
    backImageUrl,
  } = userCard;

  let {
    frontImageUploadUrl,
    backImageUploadUrl,
  } = userCard;

  if (!tradingCardId) {
    return null;
  }

  if (!frontImageUploadUrl && !backImageUploadUrl) {
    const urlsResponse = await getUploadUrlsForUserCard(tradingCardId);

    if (urlsResponse && urlsResponse.frontImageUploadUrl && urlsResponse.backImageUploadUrl) {
      frontImageUploadUrl = urlsResponse.frontImageUploadUrl;
      backImageUploadUrl = urlsResponse.backImageUploadUrl;
    }
  }

  const imageValues = {};

  if (
    frontImageUrl && !isValidUrl(frontImageUrl) &&
    frontImageUploadUrl && isValidUrl(frontImageUploadUrl)
  ) {
    await sleep(Constants.nextSleepForCardUpload);

    const response = await uploadUserCardPhotoToCloud(
      tradingCardId,
      frontImageUploadUrl,
      frontImageUrl,
      Constants.cardFrontPhoto,
    );

    if (!response) {
      imageValues.frontImageUploadUrl = frontImageUploadUrl;
    } else if (response.frontImageUploadUrl && response.backImageUploadUrl) {
      frontImageUploadUrl = response.frontImageUploadUrl;
      backImageUploadUrl = response.backImageUploadUrl;
      imageValues.frontImageUploadUrl = frontImageUploadUrl;
    } else {
      // error
      const messages = response.Error?.Message;
      throw new Error(messages?.length && messages[0]);
    }
  }

  if (
    backImageUrl && !isValidUrl(backImageUrl) &&
    backImageUploadUrl && isValidUrl(backImageUploadUrl)
  ) {
    await sleep(Constants.nextSleepForCardUpload);

    const response = await uploadUserCardPhotoToCloud(
      tradingCardId,
      backImageUploadUrl,
      backImageUrl,
      Constants.cardBackPhoto,
    );

    if (!response) {
      imageValues.backImageUploadUrl = backImageUploadUrl;
    } else {
      // error
      const messages = response.Error?.Message;
      throw new Error(messages?.length && messages[0]);
    }
  }

  if (Object.keys(imageValues).length) {
    return imageValues;
  }

  return null;
};
