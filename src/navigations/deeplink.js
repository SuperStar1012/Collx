import {Linking} from 'react-native';
import Config from 'react-native-config';

import {Constants} from 'globals';
import {encodeId} from 'utils';
import {
  emailVerification as emailVerificationRedux,
} from 'store/stores';

const deepLinkConfig = store => ({
  prefixes: [`${Config.URL_SCHEME}://`],

  config: {
    initialRouteName: 'MainScreensStack',
    screens: {
      MainScreensStack: {
        screens: {
          MainHomeStackScreens: {
            screens: {
              BottomTabStackScreens: {
                initialRouteName: 'HomeBottomTab',
                screens: {
                  HomeBottomTab: {
                    initialRouteName: 'Home',
                    screens: {
                      Profile: {
                        path: 'profiles/:profileId',
                        parse: {
                          profileId: id => encodeId(Constants.base64Prefix.profile, id),
                        },
                      },
                      CollectionStackScreens: {
                        screens: {
                          CollectionFilterDrawer: {
                            screens: {
                              Collection: {
                                path: 'collections/:profileId',
                                parse: {
                                  profileId: id => encodeId(Constants.base64Prefix.profile, id),
                                },
                              },
                            },
                          },
                        },
                      },
                      CardDetailStackScreens: {
                        screens: {
                          CardDetail: {
                            path: 'user_cards/:cardUser/:tradingCardId/:scrollToComment?',
                            parse: {
                              tradingCardId: id => encodeId(Constants.base64Prefix.tradingCard, id),
                            },
                          },
                          CanonicalCardDetail: {
                            path: 'cards/:canonicalCardId',
                            parse: {
                              canonicalCardId: id => encodeId(Constants.base64Prefix.sportCard, id),
                            },
                          },
                          SportCanonicalCardDetail: {
                            path: 'sports-cards/:canonicalCardId',
                            parse: {
                              canonicalCardId: id => encodeId(Constants.base64Prefix.sportCard, id),
                            },
                          },
                          GameCanonicalCardDetail: {
                            path: 'game-cards/:canonicalCardId',
                            parse: {
                              canonicalCardId: id => encodeId(Constants.base64Prefix.gameCard, id),
                            },
                          },
                        },
                      },
                      Notifications: 'notifications',
                      SearchStackScreens: {
                        screens: {
                          Search: 'search/:query?',
                          UniversalSearch: 'search.universal',
                          DatabaseSearchAllResult: 'search/db/:query?',
                          SaleSearchAllResult: 'search/for-sale/:query?',
                          ArticleSearchAllResult: 'search/articles/:query?',
                          UsersSearch: 'search/users/:query?',
                        },
                      },
                      DealsScreens: {
                        screens: {
                          Deal: {
                            path: 'deals/:dealId',
                            parse: {
                              dealId: id => encodeId(Constants.base64Prefix.deal, id),
                            },
                          },
                        },
                      },
                      OrderScreens: {
                        screens: {
                          OrderDetail: {
                            path: 'orders/:orderId',
                            parse: {
                              orderId: id => encodeId(Constants.base64Prefix.order, id),
                            },
                          },
                        },
                      },
                    },
                  },
                  CollectionBottomTab: 'collection', // more
                  MessagesBottomTab: {
                    screens: {
                      Messages: 'messages/:userId?',
                    },
                  },
                  ProfileBottomTab: {
                    initialRouteName: 'Profile',
                    screens: {
                      Profile: 'profile',
                      Settings: 'settings',
                      MyMoneyScreens: 'mymoney',
                      NotificationSettings: 'settings/notifications',
                      SellerToolsScreens: 'settings/seller-tools',
                    }
                  }
                },
              },
            },
          },
          FriendsStackScreens: {
            screens: {
              FindFriends: 'find-friends',
            },
          },
        },
      },
      CameraStackModal: 'camera',
      NotificationSplash: 'push-notifications',
      CollXProStackModal: 'pro',
    },
  },
  // Custom function to subscribe to incoming links
  subscribe(listener) {
    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      listener(url);

      if (url?.includes('email-verified')) {
        // TODO: Email is verified. remove it when profile subscription works
        store.dispatch(emailVerificationRedux.actions.setEmailVerified(true));
      }
    });

    return () => {
      // Clean up the event listeners
      linkingSubscription.remove();
    };
  },
});

export {
  deepLinkConfig,
};