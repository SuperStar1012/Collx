/* eslint-disable no-undef */
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

let isCallNativeInit = false;

export const sentryInit = () => {
  if (__DEV__) {
    return;
  }

  try {
    Sentry.init({
      dsn: Config.SENTRY_DSN,
      enableAppHangTracking: false,
      tracesSampleRate: 0.0,
      enableTracing: false,
      onReady: ({didCallNativeInit}) => {
        isCallNativeInit = didCallNativeInit;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const sentryClose = async () => {
  if (__DEV__) {
    return;
  }

  if (!isCallNativeInit) {
    return;
  }

  try {
    await Sentry.close();
  } catch (error) {
    console.log(error);
  }
};

export const sentrySetUser = user => {
  if (__DEV__) {
    return;
  }

  if (!isCallNativeInit) {
    return;
  }

  if (!user) {
    return;
  }

  try {
    Sentry.setUser({id: user.id, email: user.email, username: user.name});
  } catch (error) {
    console.log(error);
  }
};

export const sentryCaptureMessage = message => {
  if (__DEV__) {
    console.log(message);
    return;
  }

  if (!isCallNativeInit) {
    return;
  }

  if (!message) {
    return;
  }

  try {
    Sentry.captureMessage(message);
  } catch (error) {
    console.log(error);
  }
};

export const sentryAddBreadcrumb = info => {
  if (__DEV__) {
    console.log(info);
    return;
  }

  if (!isCallNativeInit) {
    return;
  }

  if (!info) {
    return;
  }

  try {
    Sentry.addBreadcrumb(info);
  } catch (error) {
    console.log(error);
  }
};

export const sentryCaptureException = message => {
  if (__DEV__) {
    console.log(message);
    return;
  }

  if (!isCallNativeInit) {
    return;
  }

  if (!message) {
    return;
  }

  try {
    Sentry.captureException(new Error(message));
  } catch (error) {
    console.log(error);
  }
};
