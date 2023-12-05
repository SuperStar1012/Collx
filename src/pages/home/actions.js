import {Constants} from 'globals';

export default ({navigation, setFilter}) => ({
  navigateOnboardingItem(value, profileId) {
    switch (value) {
      case Constants.userEngagement.scanned:
        navigation.navigate('CameraStackModal');
        break;
      case Constants.userEngagement.added:
        navigation.navigate('CollectionBottomTab');
        break;
      case Constants.userEngagement.followed:
        navigation.navigate('FriendsStackScreens', {
          screen: 'FindFriends',
        });
        break;
      case Constants.userEngagement.listed: {
        setFilter({
          profileId,
          filter_by: {
            [Constants.cardFilters.sale.value]: true,
          },
        });

        navigation.navigate('CollectionBottomTab');
        break;
      }
    }
  },

  helpForOnboardingItem(uri) {
    navigation.navigate('VideoPlayerModal', {uri});
  },

  navigateMyCollection() {
    navigation.navigate('CollectionBottomTab');
  },

  navigatePeopleToFollow() {
    navigation.navigate('AllFeaturedUsers');
  },

  navigateNotifications() {
    navigation.navigate('Notifications');
  },

});
