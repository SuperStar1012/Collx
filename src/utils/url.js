import {Linking} from 'react-native';
import isURL from 'validator/lib/isURL';

import {showErrorAlert} from './alert';

export const openUrl = async url => {
  // Checking if the link is supported for links with custom URL scheme.
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(url);
  } else {
    showErrorAlert(`Don't know how to open this URL: ${url}`);
  }
};

export const openEbayUrl = async (card, condition, isRecent) => {
  let url = 'https://www.ebay.com/sch/i.html?';
  if (isRecent) {
    url += 'LH_Sold=1&';
  }

  let values = [];

  if (card.set?.name) {
    values.push(encodeURIComponent(card.set?.name));
  }

  if (card.number) {
    values.push(card.number);
  }

  if (card.player?.name) {
    values.push(encodeURIComponent(card.player?.name));
  }

  if (condition) {
    values.push(encodeURIComponent(condition));
  }

  if (values.length) {
    url += '_nkw=';
    url += values.join('+');
  }

  url += '&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5338995256&customid=PricingTable&toolid=10001&mkevt=1';

  openUrl(url);
};

export const isValidUrl = (link) => {
  return link && typeof link === 'string' && isURL(link);
};

export const getImageLink = (fullLink) => {
  if (!fullLink) {
    return null;
  }

  const parsedUrl = new URL(fullLink);
  return `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`;
};

