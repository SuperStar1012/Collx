import {useEffect, useRef} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';

const NetworkProvider = () => {
  const navigation = useNavigation();

  const isNetworkConnectedRef = useRef(null);

  useEffect(() => {
    // Subscribe
    const netInfoUnsubscribe = NetInfo.addEventListener((state) => {
      if (isNetworkConnectedRef.current !== false && state.isConnected === false) {
        // Show
        isNetworkConnectedRef.current = state.isConnected;

        navigation.navigate('NetworkOfflineModal');
      } else if (isNetworkConnectedRef.current === false && state.isConnected !== false) {
        // Hide
        isNetworkConnectedRef.current = state.isConnected;

        const currentRoute = navigation.getCurrentRoute();
        if (currentRoute?.name === 'NetworkOfflineModal') {
          navigation.goBack();
        }
      }
    });

    return () => {
      // Unsubscribe
      if (netInfoUnsubscribe) {
        netInfoUnsubscribe();
      }
    };
  }, [navigation]);

  return null;
};

export default NetworkProvider;
