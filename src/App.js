import React, {useEffect, useRef} from 'react';
import {LogBox, Text, AppState} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import AppNavigator from './navigations';

import {customConfigureStore} from 'store';
import {ThemeProvider} from 'theme';
import {
  sentryInit,
  askTrackingForSingular,
  stripeInit,
  analyticsSendSession,
} from 'services';

import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import {RelayEnvironmentProvider} from 'react-relay/hooks';
import RelayEnvironment from 'relay/Environment';
import ActionContext, {
  createMutationActions,
  createSharingActions,
  createErrorActions,
} from 'actions';

const {Provider, store} = customConfigureStore();

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const App = () => {
  const currentAppState = useRef(AppState.currentState);

  useEffect(() => {

    ignoreWarnings();

    sentryInit();

    askTrackingForSingular();

    stripeInit();

    // Session Analytics
    analyticsSendSession();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        (currentAppState.current.match(/inactive|background/) && nextAppState === 'active') ||
        (currentAppState.current === 'active' && nextAppState.match(/inactive|background/))
      ) {
        analyticsSendSession();
      }

      currentAppState.current = nextAppState;
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const ignoreWarnings = () => {
    LogBox.ignoreLogs([
      'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
      'Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.',
      'ViewPropTypes will be removed from React Native',
      'Animated: `useNativeDriver` was not specified.',
    ]);
  };

  const actions = {
    ...createMutationActions(RelayEnvironment),
    ...createSharingActions(),
    ...createErrorActions()
  };

  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <ActionContext.Provider value={actions}>
        <Provider store={store}>
          <SafeAreaProvider>
            <ThemeProvider>
              <BottomSheetModalProvider>
                <AppNavigator store={store}>
                </AppNavigator>
              </BottomSheetModalProvider>
            </ThemeProvider>
          </SafeAreaProvider>
        </Provider>
      </ActionContext.Provider>
    </RelayEnvironmentProvider>
  );
};

export default App;
