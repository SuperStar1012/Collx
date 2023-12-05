export default ({navigation}) => ({
  navigateSelectShippingAddress: (params) => {
    navigation.navigate('ShippingAddressScreens', {
      screen: 'SelectShippingAddress',
      params,
    });
  },

  navigateSelectPaymentMethod: (params) => {
    navigation.navigate('PaymentMethodScreens', {
      screen: 'SelectPaymentMethod',
      params,
    });
  },

  navigateAddPaymentCard: () => {
    navigation.navigate('PaymentMethodScreens', {
      screen: 'AddPaymentCard',
    });
  },

  navigateApplyPrice: (params) => {
    navigation.navigate('ApplyPrice', params);
  },

});
