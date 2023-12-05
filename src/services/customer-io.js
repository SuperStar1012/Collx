/* eslint-disable no-undef */
import {
  CustomerIO,
  CustomerIOEnv,
  CustomerioConfig,
  Region,
  CioLogLevel,
} from 'customerio-reactnative';
import Config from 'react-native-config';

export const customerIoInitialize = () => {
  if (__DEV__) {
    return;
  }

  const env = new CustomerIOEnv();

  env.siteId = Config.CUSTOMERIO_SITE_ID;
  env.apiKey = Config.CUSTOMERIO_API_KEY;
  // env.organizationId = "CollX"; // OrganizationId is optional and lets you send in-app messages.

  env.region = Region.US; // Region is optional, defaults to Region.US. // Use Region.EU for EU-based workspaces.

  const config = new CustomerioConfig();
  config.logLevel = CioLogLevel.debug
  config.autoTrackDeviceAttributes = true
  config.enableInApp = true;

  CustomerIO.initialize(env, config);
};

export const customerRegisterDeviceToken = (token) => {
  if (__DEV__) {
    return;
  }

  CustomerIO.registerDeviceToken(token);
};

export const customerIdentify = (user) => {
  const {id, email, name} = user;

  if (__DEV__) {
    return;
  }

  CustomerIO.identify(id, {
    email,
    name,
  });
};

export const customerClearIdentify = () => {
  if (__DEV__) {
    return;
  }

  CustomerIO.clearIdentify();
};

export const customerTrack = (eventName, attributes = {}) => {
  if (__DEV__) {
    return;
  }

  CustomerIO.track(eventName, attributes);
};

export const customerScreen = (screenName, attributes = {}) => {
  if (__DEV__) {
    return;
  }

  CustomerIO.screen(screenName, attributes)
};
