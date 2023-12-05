export default ({navigation}) => ({
  pushProfile: (profileId) => {
    navigation.navigate('Profile', {
      profileId,
    });
  },

  navigateMessageCardSend(params) {
    navigation.navigate('CardMessageStackModal', {
      screen: 'MessageCardSend',
      params,
    });
  },

  navigateChatThread(params) {
    navigation.navigate('ChatThread', params);
  },

});
