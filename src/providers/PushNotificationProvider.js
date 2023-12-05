/* eslint-disable no-undef */
import {useEffect, useRef} from 'react';
import {Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import {
  checkNotifications,
  requestNotifications,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
import {graphql, useFragment} from 'react-relay';
import * as RNLocalize from 'react-native-localize';
import _ from 'lodash';
import moment from 'moment';
import Config from 'react-native-config';

import {withPushNotification} from 'store/containers';
import {
  addGetStreamDevice,
} from 'services';
import {Constants} from 'globals';
import {
  openUrl,
  getStorageItem,
  setStorageItem,
} from 'utils';

const PushNotificationProvider = ({
  user,
  viewer,
  installations,
  unreadMessageCount,
  permissionCheckAllow,
  getInstallations,
  createInstallation,
  updateInstallation,
  setPushToken,
  setPushNotificationAsk,
}) => {

  const viewerData = useFragment(
    graphql`
      fragment PushNotificationProvider_viewer on Viewer {
        myIpAddress
        notificationUnreadCount
      }
    `,
    viewer,
  );

  const {myIpAddress, notificationUnreadCount = 0} = viewerData || {};

  const initializedPushNotification = useRef(false);
  const pushNotificationStatus = useRef(null);

  useEffect(() => {
    if (!permissionCheckAllow) {
      return;
    }

    enablePushNotification();
  }, [permissionCheckAllow]);

  useEffect(() => {
    const count = unreadMessageCount + notificationUnreadCount;
    PushNotification.setApplicationIconBadgeNumber(count || 0);
  }, [unreadMessageCount]);

  useEffect(() => {
    if (!user?.id) {
      initializedPushNotification.current = false;
      return;
    }

    if (!installations) {
      getInstallations(user.id);
    } else if (!initializedPushNotification.current) {
      initializedPushNotification.current = true;

      setInstallation();

      checkNotificationsPermission();
    }
  }, [user?.id, installations]);

  const checkNotificationsPermission = async () => {
    const {status} = await checkNotifications();
    pushNotificationStatus.current = status;

    if (status === RESULTS.GRANTED) {
      initPushNotification();
      return;
    }

    if (status === RESULTS.DENIED) {
      // the first request - displays NotificationSplash
      setPushNotificationAsk(Constants.notificationRequestType.askToEnable);
      return;
    }

    const result = await getStorageItem(Constants.showedPushNotificationSplash);

    if (!result || result === 'true') {
      setStorageItem(Constants.showedPushNotificationSplash, new Date().toString());
      setPushNotificationAsk(Constants.notificationRequestType.askToReenable);
      return;
    }

    const fromNow = moment().diff(new Date(result), 'days');
    if (fromNow > 6) {
      // the second quest - displays AllowPushNotificationSheet
      setPushNotificationAsk(Constants.notificationRequestType.askToReenable)
    }
  };

  const enablePushNotification = async () => {
    if (pushNotificationStatus.current === RESULTS.DENIED) {
      if (Platform.OS === 'android' && Number(Platform.constants?.Release || 0) >= 13) {
        // Android 13+
        try {
          const {status} = await requestNotifications();
          if (status !== RESULTS.GRANTED) {
            return;
          }
        } catch (error) {
          console.log(error);
          return;
        }
      }

      initPushNotification();
    } else if (pushNotificationStatus.current === RESULTS.BLOCKED) {
      openSettings();
    }
  };

  const initPushNotification = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: info => {
        if (__DEV__) {
          console.log('onRegister:', info);
        }

        const token = info?.token;

        setInstallation(token);

        if (user.id && token && !user.anonymous) {
          setPushToken(token);
          addGetStreamDevice(user.id, token);
        }
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: notification => {
        if (__DEV__) {
          console.log('onNotification:', JSON.stringify(notification));
        }

        // CustomerIO notification
        if (!notification.foreground && _.has(notification.data || {}, 'CIO-Delivery-Token')) {
          openCustomerIoDeepLink(notification.data);
        }

        // Stream notification
        if (notification.data?.stream) {
          openStreamDeepLink(notification.data);
        }

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: notification => {
        if (__DEV__) {
          console.log('onAction:', JSON.stringify(notification));
        }

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: error => {
        console.log(error.message, error);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });

    // eslint-disable-next-line no-unused-vars
    PushNotification.popInitialNotification(notification => {
      // when app is entirely closed and click on push notification

      if (__DEV__) {
        console.log('popInitialNotification:', JSON.stringify(notification));
      }

      if (_.has(notification?.data || {}, 'CIO-Delivery-Token')) {
        openCustomerIoDeepLink(notification?.data);
      }
    });
  };

  const openCustomerIoDeepLink = data => {
    if (Platform.OS === 'ios' && data?.CIO?.push?.link) {
      openUrl(data.CIO.push.link);
    } else if (Platform.OS === 'android' && data?.link) {
      openUrl(data.link);
    }
  };

  const openStreamDeepLink = data => {
    const {stream} = data || {};
    if (!stream) {
      return;
    }

    let senderId = null;
    if (Platform.OS === 'ios') {
      senderId = stream.senderId;
    } else if (Platform.OS === 'android') {
      const streamObject = JSON.parse(stream);
      senderId = streamObject?.senderId;
    }

    if (senderId) {
      openUrl(`${Config.URL_SCHEME}://messages/${senderId}`);
    }
  };

  const setInstallation = async token => {
    const installation = {};
    const locales = RNLocalize.getLocales();

    if (token) {
      if (Platform.OS === 'ios') {
        // iOS
        installation.apnsToken = token;
      } else {
        // android
        installation.registrationId = token;
      }
    }

    installation.userId = user.id;
    installation.deviceModel = DeviceInfo.getModel();
    installation.systemName = DeviceInfo.getSystemName();
    installation.appVersion = DeviceInfo.getVersion();
    installation.bundleId = DeviceInfo.getBundleId();
    installation.locale = locales.length > 0 ? locales[0].languageTag : 'en-US';
    installation.timezone = RNLocalize.getTimeZone();

    if (myIpAddress) {
      installation.ip_address = myIpAddress;
    }

    try {
      installation.deviceId = await DeviceInfo.getUniqueId();
      installation.deviceName = await DeviceInfo.getDeviceName();
      installation.deviceVersion = await DeviceInfo.getDevice();
    } catch (error) {
      console.log(error);
    }

    const index = installations?.findIndex(item => item.deviceId === installation.deviceId);

    if (!installations || index === -1) {
      createInstallation(installation);
    } else {
      updateInstallation(installation);
    }
  };

  return null;
};

export default withPushNotification(PushNotificationProvider);
