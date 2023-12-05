export default ({navigation}) => ({
  navigateExportCollection: () => {
    navigation.navigate('CollXProScreens', {
      screen: 'ExportCollection',
    });
  },

  navigateExportCollectionProgress: () => {
    navigation.navigate('CollXProScreens', {
      screen: 'ExportCollectionProgress',
    });
  },

});
