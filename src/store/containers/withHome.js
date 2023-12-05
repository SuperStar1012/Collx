import {connect} from 'react-redux';

import {
  config,
  filter,
  strapi,
  subscription,
} from '../stores';

const mapStateToProps = state => ({
  pushNotificationRequestType: state.notification.pushNotificationRequestType,
  userCardsActionCount: state.collection.userCardsActionCount,
  isNewUser: state.user.isNewUser,
  isFetchingProducts: state.strapi.isFetchingProducts,
  products: state.strapi.products,
  releaseNote: state.strapi.releaseNote,
  isFetchingPosts: state.strapi.isFetchingPosts,
  posts: state.strapi.posts,
  selectedCategory: state.search.selectedCategory,
});

const mapDispatchToProps = {
  getConfig: config.actions.getConfig,
  setFilter: filter.actions.setFilter,
  getProducts: strapi.actions.getProducts,
  getReleaseNote: strapi.actions.getReleaseNote,
  getPosts: strapi.actions.getPosts,
  getRevenueCatCustomer: subscription.actions.getCustomer,
  getOfferings: subscription.actions.getOfferings,
};

export default connect(mapStateToProps, mapDispatchToProps);
