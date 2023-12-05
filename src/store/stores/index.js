import {combineReducers} from 'redux';

import address from './address';
import analytics from './analytics';
import capture from './capture';
import card from './card';
import collection from './collection';
import config from './config';
import filter from './filter';
import friend from './friend';
import emailVerification from './email-verification';
import installation from './installation';
import maintenance from './maintenance';
import message from './message';
import navigationOptions from './navigation-options';
import notification from './notification';
import player from './player';
import referral from './referral';
import search from './search';
import set from './set';
import strapi from './strapi';
import stripe from './stripe';
import subscription from './subscription';
import team from './team';
import type from './type';
import user from './user';

const rootReducer = combineReducers({
  address: address.reducer,
  analytics: analytics.reducer,
  capture: capture.reducer,
  card: card.reducer,
  collection: collection.reducer,
  config: config.reducer,
  filter: filter.reducer,
  friend: friend.reducer,
  emailVerification: emailVerification.reducer,
  installation: installation.reducer,
  maintenance: maintenance.reducer,
  message: message.reducer,
  navigationOptions: navigationOptions.reducer,
  notification: notification.reducer,
  player: player.reducer,
  referral: referral.reducer,
  search: search.reducer,
  set: set.reducer,
  strapi: strapi.reducer,
  stripe: stripe.reducer,
  subscription: subscription.reducer,
  team: team.reducer,
  type: type.reducer,
  user: user.reducer,
});

export {
  rootReducer,
  address,
  analytics,
  capture,
  card,
  collection,
  config,
  filter,
  friend,
  emailVerification,
  installation,
  maintenance,
  message,
  navigationOptions,
  notification,
  player,
  referral,
  search,
  set,
  strapi,
  stripe,
  subscription,
  team,
  type,
  user,
};
