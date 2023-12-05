import {StackActions} from '@react-navigation/native';

export default ({navigation}) => ({
  navigateExportCollectionProgress: (params) => {
    navigation.dispatch(StackActions.replace('ExportCollectionProgress', params));
  },

});
