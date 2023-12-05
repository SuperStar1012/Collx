import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import isNumeric from 'validator/lib/isNumeric';

export const wp = value => {
  return Math.floor(widthPercentageToDP(value));
};

export const hp = value => {
  return Math.floor(heightPercentageToDP(value));
};

export const isPrice = value => value && isNumeric(value.toString()) && value.toString().length < 8 && Number(value) > 0;

export const isValidateUserName = (name) => (
  name.match(/^[A-Za-z ’]+$/)
);

export const getFilename = url => {
  return url.split('/').pop();
};

export const getObject = initialData => {
  const isId = typeof initialData !== 'object';

  if (isId && initialData) {
    return {id: Number(initialData)};
  }

  return initialData;
};

export const getGooglePlaceDetails = details => {
  const {address_components} = details;

  if (!address_components || !address_components.length) {
    return {};
  }

  const getComponent = (findType, isShortName = false) => {
    const foundComponent = address_components.find(
      component => component.types.findIndex(type => type === findType) > -1,
    );

    if (isShortName) {
      return foundComponent?.short_name;
    }

    return foundComponent?.long_name;
  };

  const subpremise = getComponent('subpremise');
  const streetNumber = getComponent('street_number');
  const nearestRoad = getComponent('route');
  const city = getComponent('locality');
  const country = getComponent('country', true);
  const state = getComponent('administrative_area_level_1', country === 'US');
  const zipCode = getComponent('postal_code');

  let address1 = null;
  if (streetNumber && nearestRoad) {
    address1 = `${streetNumber} ${nearestRoad}`;
  } else if (streetNumber || nearestRoad) {
    address1 = `${streetNumber || nearestRoad}`;
  }

  let address2 = null;
  if (subpremise) {
    address2 = subpremise;
  }

  return {
    address1,
    address2,
    city,
    state,
    zipCode,
    country,
  };
};

export const removeZeroDecimal = (value) => {
  if (value === undefined || value === null) {
    return '';
  }
  let price = '$';
  if (value?.toString().indexOf('$') > -1) {
    return price + parseFloat(value.toString().replace(/[$]/g, '')).toFixed(2).replace(/\.00$/, '');
  }
  return parseFloat(value).toFixed(2).replace(/\.00$/, '');
};
