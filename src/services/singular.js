/* eslint-disable no-undef */
import {
  Singular,
  SingularConfig,
  Events,
} from 'singular-react-native';
import Config from 'react-native-config';
import {getTrackingStatus, requestTrackingPermission} from 'react-native-tracking-transparency';

export const askTrackingForSingular = async () => {
  let trackingStatus = await getTrackingStatus();
  if (trackingStatus === 'unavailable') {
    singularInit();
    return;
  }

  trackingStatus = await requestTrackingPermission();
  if (trackingStatus === 'authorized') {
    singularInit();
  }
};

export const singularInit = (user) => {
  const {id, email} = user || {};

  if (__DEV__) {
    return;
  }

  try {
    const config = new SingularConfig(
      Config.SINGULAR_SDK_KEY,
      Config.SINGULAR_SDK_SECRET,
    );

    config.withLoggingEnabled();

    // Enable SKAdNetwork
    config.withSkAdNetworkEnabled(true);

    // Wait 5m for tracking authorization before sending any events
    config.withWaitForTrackingAuthorizationWithTimeoutInterval(300);

    // config.withConversionValuesUpdatedHandler((values) => {
    //   console.log('withConversionValuesUpdatedHandler: ', JSON.stringify(values));
    // });

    // Enable manual conversion value updates
    // config.withManualSkanConversionManagement();

    // Optional settings
    if (id) {
      config.withCustomUserId(id);
    } else if (email) {
      config.withCustomUserId(email);
    }

    Singular.init(config);
  } catch (error) {
    console.log(error);
  }
};

export const singularSetCustomUserId = (user) => {
  const {id, email} = user;

  if (__DEV__) {
    return;
  }

  try {
    if (id) {
      Singular.setCustomUserId(id);
    } else if (email) {
      Singular.setCustomUserId(email);
    }
  } catch (error) {
    console.log(error);
  }
};

export const singularUnsetCustomUserId = () => {
  if (__DEV__) {
    return;
  }

  try {
    Singular.unsetCustomUserId();
  } catch (error) {
    console.log(error);
  }
};

export const singularEvent = (eventName, attributes) => {
  if (__DEV__) {
    return;
  }

  if (!eventName) {
    return;
  }

  try {
    if (attributes) {
      Singular.eventWithArgs(eventName, attributes);
    } else {
      Singular.event(eventName);
    }
    Singular.skanUpdateConversionValue(7);
  } catch (error) {
    console.log(error);
  }
};

export const singularSubscribeEvent = () => {
  singularEvent(Events.sngSubscribe);
};

export const singularCompleteRegistrationEvent = () => {
  singularEvent(Events.sngCompleteRegistration);
};
