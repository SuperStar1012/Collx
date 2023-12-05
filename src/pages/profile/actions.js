import {Constants} from 'globals';
import {decodeId} from 'utils';

export default ({navigation, setFilter, setBlock}) => ({
  navigateCollection: (profileId, isMe, isSale) => {
    setFilter({
      profileId,
      filter_by: isSale ? {
        [Constants.cardFilters.sale.value]: true,
      } : {},
    });

    if (isMe) {
      navigation.navigate('CollectionBottomTab');
    } else {
      navigation.navigate('CollectionStackScreens', {
        screen: 'CollectionFilterDrawer',
        params: {
          screen: 'Collection',
          params: {
            profileId,
          },
        },
      });
    }
  },

  setBlockOrUnblockUser: (profileId, enabled) => {
    const [, userId] = decodeId(profileId);

    setBlock({userId, enabled});
  },

  showCollectionForUser: () => {},

  navigateFollowers: (profileId) => {
    navigation.push('FollowingThem', {profileId: profileId});
  },

  navigateFollowings: (profileId) => {
    navigation.push('TheyFollowing', {profileId: profileId});
  },

  startConversation: () => {},

  acceptNotifications: () => {},

  navigateMyDeals: () => {
    navigation.navigate('DealsScreens', {
      screen: 'MyDeals',
    });
  },

  navigateMyBuyers: () => {
    navigation.navigate('DealsScreens', {
      screen: 'MyBuyers',
    });
  },

  navigateSavedForLater: () => {
    navigation.navigate('DealsScreens', {
      screen: 'SavedForLater',
    });
  },

  navigateMyPurchases: () => {
    navigation.navigate('OrderScreens', {
      screen: 'MyPurchases',
    });
  },

  navigateMySales: () => {
    navigation.navigate('OrderScreens', {
      screen: 'MySales',
    });
  },

  navigateChangeUsername: () => {
    navigation.navigate('ChangeUsername');
  },

  navigateMyMoney: () => {
    navigation.navigate('MyMoneyScreens', {
      screen: 'MyMoney',
    });
  },

  navigateMyLikes: () => {
    navigation.navigate('MyLikesScreen');
  },

});
