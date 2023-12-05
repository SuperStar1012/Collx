import {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';

import {withMaintenance} from 'store/containers';

const MaintenanceProvider = ({
  isServerMaintenance,
}) => {
  const navigation = useNavigation();

  const isPrevServerMaintenance = useRef(isServerMaintenance);

  useEffect(() => {
    if (!isPrevServerMaintenance.current && isServerMaintenance) {
      // Show
      isPrevServerMaintenance.current = isServerMaintenance;

      navigation.navigate('MaintenanceModal');
    } else if (isPrevServerMaintenance.current && !isServerMaintenance) {
      // Hide
      isPrevServerMaintenance.current = isServerMaintenance;

      const currentRoute = navigation.getCurrentRoute();
      if (currentRoute?.name === 'MaintenanceModal') {
        navigation.goBack();
      }
    }
  }, [navigation, isServerMaintenance]);

  return null;
};

export default withMaintenance(MaintenanceProvider);
