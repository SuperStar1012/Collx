export default ({navigation}) => ({
  navigateEditMinimumAmount: (params) => {
    navigation.navigate('SellerToolsScreens', {
      screen: 'SellerMinimumAmountEdit',
      params,
    });
  },
  navigateSellerMinimum: (params) => {
    navigation.navigate('SellerToolsScreens', {
      screen: 'SellerMinimum',
      params,
    });
  },
});
