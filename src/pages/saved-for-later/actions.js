export default ({navigation}) => ({
  navigateSavedForLaterCards(savedForLater) {
    navigation.navigate('SavedForLaterCards', {
      savedForLater
    });
  },
});
