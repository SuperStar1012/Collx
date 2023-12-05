import axios from 'axios';
import Config from 'react-native-config';

import {
  revenuecatGetCustomerInfo,
  revenuecatGetOfferings,
  revenuecatPurchasePackage,
  revenuecatRestorePurchases,
} from 'services';

export const getCustomer = async () => {
  const response = await revenuecatGetCustomerInfo();

  return response;
};

export const getOfferings = async () => {
  const response = await revenuecatGetOfferings();

  return response;
};

export const purchasePackage = async (purchaseInfo) => {
  const response = await revenuecatPurchasePackage(purchaseInfo);
  return response;
};

export const restorePurchases = async () => {
  const response = await revenuecatRestorePurchases();

  return response;
};

export const setSubscription = async data => {
  const response = await axios({
    method: 'POST',
    baseURL: Config.SERVICES_BASE_URL,
    url: '/subscriptions',
    data,
  });

  return response.data;
};
