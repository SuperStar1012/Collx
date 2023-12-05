/* eslint-disable no-undef */
import {Platform} from 'react-native';
import Purchases from 'react-native-purchases';
import Config from 'react-native-config';

export const revenuecatConfigure = async (user) => {
  try {
    Purchases.configure({
      apiKey: Platform.select({
        ios: Config.REVENUECAT_APPLE_API_KEY,
        android: Config.REVENUECAT_GOOGLE_API_KEY,
      }),
      appUserID: user.id,
      observerMode: false,
      useAmazon: false,
    });

    await Purchases.setDisplayName(user.name);
    await Purchases.setEmail(user.email);

    if (__DEV__) {
      await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }
  } catch (error) {
    console.log(error);
  }
};

export const revenuecatLogout = async () => {
  try {
    if (await Purchases.isConfigured()) {
      await Purchases.logOut();
    }
  } catch (error) {
    console.log(error);
  }
};

export const revenuecatGetCustomerInfo = async () => {
  return await Purchases.getCustomerInfo();
};

export const revenuecatGetOfferings = async () => {
  return await Purchases.getOfferings();
};

export const revenuecatPurchasePackage = async (purchasePackage) => {
  const {customerInfo} = await Purchases.purchasePackage(purchasePackage);
  return customerInfo;
};

export const revenuecatRestorePurchases = async () => {
  return await Purchases.restorePurchases();
};
