import {StackActions} from '@react-navigation/native';

export default ({navigation}) => ({
  navigateCollXCreditCodeSuccessSuccess(amount) {
    navigation.dispatch(StackActions.replace('CollXCreditCodeSuccess', {
      amount,
    }));
  },

});
