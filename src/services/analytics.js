/* eslint-disable no-undef */
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';

import {Constants} from 'globals';
import {getUserInfo, getStorageItem, setStorageItem} from 'utils';

import {
  sendEvent,
} from 'store/apis';

export const analyticsEvents = {
  completedRegistration: 'completed_registration',
  contactedSupport: 'contacted_support',
  firstOrderSucceeded: 'first_order_succeeded',
  openedProduct: 'opened_product',
  orderSucceeded: 'order_succeeded',
  promptedAI: 'prompted_ai',
  purchasedSubscription: 'purchased_subscription',
  receivedMessage: 'received_message',
  sentMessage: 'sent_message',
  sessionEnded: 'session_ended',
  sessionStarted: 'session_started',
  sharedCard: 'shared_card',
  sharedProduct: 'shared_product',
  startedRegistration: 'started_registration',
  viewedCard: 'viewed_card',
  viewedCollection: 'viewed_collection',
  viewedProduct: 'viewed_product',
  viewedProfile: 'viewed_profile',
  viewedSubscriptions: 'viewed_subscriptions'
};

export const analyticsValues = {
  apple: 'apple',
  cameraDrawer: 'camera-drawer',
  canonicalCard: 'canonical-card',
  card: 'card',
  cardAdd: 'card-add',
  cardDetails: 'card-details',
  chat: 'chat',
  collection: 'collection',
  collectionExport: 'collection-export',
  deal: 'deal',
  deeplink: 'deeplink',
  email: 'email',
  facebook: 'facebook',
  featuredUsers: 'featured-users',
  feed: 'feed',
  findFriends: 'find-friends',
  followers: 'followers',
  following: 'following',
  google: 'google',
  message: 'message',
  notification: 'notification',
  priorityChatSupport: 'priority-chat-support',
  production: 'production',
  profile: 'profile',
  proPerks: 'pro-perks',
  recommended: 'recommended',
  referral: 'referral',
  savedForLaterCards: 'saved-for-later-cards',
  scanResults: 'scan-results',
  search: 'search',
  setChecklist: 'set-checklist',
  staging: 'staging',
  tradingCard: 'trading-card',
  userCard: 'user-card',
  usersWithCard: 'users-with-card'
};

export const analyticsNavigationRoute = {
  Activity: analyticsValues.feed,
  AddCard: analyticsValues.cardAdd,
  AllFeaturedUsers: analyticsValues.featuredUsers,
  CameraDrawer: analyticsValues.cameraDrawer,
  CanonicalCard: analyticsValues.canonicalCard,
  Card: analyticsValues.card,
  CardDetail: analyticsValues.cardDetails,
  CardUsers: analyticsValues.usersWithCard,
  CategoryCards: analyticsValues.search,
  Collection: analyticsValues.collection,
  CollectionExport: analyticsValues.collectionExport,
  Deal: analyticsValues.deal,
  FindFriends: analyticsValues.findFriends,
  FollowingThem: analyticsValues.followers,
  Message: analyticsValues.chat,
  Messages: analyticsValues.message,
  Notifications: analyticsValues.notification,
  PriorityChatSupport: analyticsValues.priorityChatSupport,
  Profile: analyticsValues.profile,
  ProPerks: analyticsValues.proPerks,
  ReferralProgram: analyticsValues.referral,
  SavedForLaterCards: analyticsValues.savedForLaterCards,
  ScanResults: analyticsEvents.scanResults,
  Search: analyticsEvents.search,
  SetChecklist: analyticsValues.setChecklist,
  TheyFollowing: analyticsValues.following,
  TradingCard: analyticsValues.tradingCard,
  UserCard: analyticsValues.userCard,
};

export const analyticsSendEvent = async (eventName, params = null) => {
  if (__DEV__) {
    return;
  }

  if (!eventName) {
    return;
  }

  const values = {
    env: Config.PLATFORM_STAGE,
    event: eventName,
    // timestamp: null,
    platform: Platform.OS.toLowerCase(),
    appVersion: DeviceInfo.getVersion(),
    deviceId: await DeviceInfo.getUniqueId(),
  };

  if (params) {
    values.props = params;
  }

  // user info
  const userInfo = await getUserInfo();
  if (userInfo?.id) {
    values.userId = userInfo.id;
  }

  try {
    await sendEvent(values);
  } catch (error) {
    console.log(error);
  }
};

export const analyticsSendSession = async () => {
  try {
    const oldSession = await getStorageItem(Constants.analyticsSessionData);
    const {start = {}, end = {}} = oldSession || {};
    const newSession = {};

    if (start.id && end.id && start.id === end.id) {
      // session start, session end
      if (end.time && start.time) {
        const milliSeconds = new Date(end.time) - new Date(start.time);
        if (milliSeconds > 0) {
          await analyticsSendEvent(analyticsEvents.sessionEnded, {
            id: end.id,
            duration: Math.round(milliSeconds / 1000),
          });
        }
      }

      newSession.start = {
        id: start.id + 1,
        time: new Date(),
      };
    } else if (start.id && start.time && !end.id) {
      // session start, not session end
      newSession.start = oldSession.start;
      newSession.end = {
        id: start.id,
        time: new Date(),
      };
    } else {
      const newSessionId = (start.id || 0) + 1;
      newSession.start = {
        id: newSessionId,
        time: new Date(),
      };
    }

    if (newSession.start && !newSession.end)
      await analyticsSendEvent(analyticsEvents.sessionStarted, {
        id: newSession.start.id,
      });

    await setStorageItem(Constants.analyticsSessionData, newSession);
  } catch (error) {
    console.log(error);
  }
};
