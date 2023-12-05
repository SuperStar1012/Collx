import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';
import axios from 'axios';
import qs from 'qs';

export const getProducts = async () => {
  const query = qs.stringify(
    {
      fields: [
        'category',
        'name',
        'description',
        'appLink',
        'callToAction',
        'priority',
      ],
      populate: {
        brand: {
          populate: [
            'icon',
          ],
          fields: [
            'name',
            'link',
          ],
        },
        image: {
          fields: [
            'url',
          ],
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const response = await axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${Config.STRAPI_TOKEN}`
    },
    baseURL: Config.STRAPI_BASE_URL,
    url: `/api/products?${query}`,
  });

  return response.data;
};

export const getReleaseNote = async () => {
  const query = qs.stringify(
    {
      populate: {
        bullets: '*',
      },
      filters: {
        version: {
          $eq: DeviceInfo.getVersion(),
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const response = await axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${Config.STRAPI_TOKEN}`
    },
    baseURL: Config.STRAPI_BASE_URL,
    url: `/api/releases?${query}`,
  });

  return response.data;
};

export const getPosts = async () => {
  const query = qs.stringify(
    {
      populate: {
        socialNetwork: {
          populate: [
            'icon',
          ],
          fields: [
            'username',
            'name',
            'link',
          ],
        },
        media: {
          fields: [
            'url',
            'ext',
            'mime',
            'width',
            'height',
          ],
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const response = await axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${Config.STRAPI_TOKEN}`
    },
    baseURL: Config.STRAPI_BASE_URL,
    url: `/api/posts?${query}`,
  });

  return response.data;
};
