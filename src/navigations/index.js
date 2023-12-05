import React, {useState, useRef, useEffect, useMemo} from 'react';
import {StyleSheet, useColorScheme, StatusBar, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {NavigationContainer, CommonActions, StackActions} from '@react-navigation/native';
import {CardStyleInterpolators} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {OverlayProvider as ChatOverlayProvider, Chat} from 'stream-chat-react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import _ from 'lodash';
import {chatClient} from 'services';

import {
  ProvidersContainer,
} from 'providers';

import {
  Constants,
  Styles,
} from 'globals';
import {
  Colors,
  Fonts,
  DarkTheme,
  LightTheme,
  ChatDarkTheme,
  ChatLightTheme,
  useThemeDispatch,
} from 'theme';

import {
  user as userRedux,
  maintenance as maintenanceRedux,
  navigationOptions as navigationOptionsRedux,
} from 'store/stores';
import {initAxios} from 'store/apis';
import {getUserInfo, getStorageItem} from 'utils';
import {deepLinkConfig} from './deeplink';
import {
  analyticsEvents,
  analyticsSendEvent,
  analyticsNavigationRoute,
} from 'services';
import {decodeId} from 'utils';

import {RootNavigation} from './root';

const AppNavigator = props => {
  const {store} = props;

  const colorScheme = useColorScheme();
  const {setTheme} = useThemeDispatch();
  const appearanceMode = useSelector(state => state.user.appearanceMode);

  const [isInitialized, setIsInitialized] = useState(false);

  const [lastColorScheme, setLastColorScheme] = useState(colorScheme);
  const debouncedFunction = useRef(null);

  const navigationContainerRef = useRef(null);
  const navigationRouteNameRef = useRef(null);

  const insets = useSafeAreaInsets();

  Styles.screenSafeTopHeight = insets.top;
  Styles.screenSafeBottomHeight = insets.bottom;
  Styles.headerStatusBarHeight = Math.max(Math.floor(Styles.screenSafeTopHeight / 2), 20);

  const currentTheme = useMemo(() => {
    let newColorScheme = lastColorScheme;
    if (appearanceMode === Constants.appearanceSettings.on) {
      newColorScheme = Constants.colorSchemeName.dark;
    } else if (appearanceMode === Constants.appearanceSettings.off) {
      newColorScheme = Constants.colorSchemeName.light;
    }

    return newColorScheme;
  }, [appearanceMode, lastColorScheme]);

  const Theme = currentTheme === Constants.colorSchemeName.dark ? DarkTheme : LightTheme;
  const ChatTheme = currentTheme === Constants.colorSchemeName.dark ? ChatDarkTheme : ChatLightTheme;

  useEffect(() => {
    getUserFromLocalStorage();
  }, []);

  useEffect(() => {
    setTheme(currentTheme);

    const statusBarStyle = currentTheme === Constants.colorSchemeName.dark ? 'light-content' : 'dark-content';
    StatusBar.setBarStyle(statusBarStyle);

    if (Platform.OS === 'android') {
      const statusBarBackgroundColor = currentTheme === Constants.colorSchemeName.dark ? Colors.black : Colors.white;
      StatusBar.setBackgroundColor(statusBarBackgroundColor);
      changeNavigationBarColor(statusBarBackgroundColor);
    }
  }, [currentTheme]);

  useEffect(() => {
    const navStyles = navigationStyles(Theme.colors);
    const screenOptions = {
      // header: NavBarHeader,
      headerTitleStyle: navStyles.textNavBarTitle,
      headerStyle: navStyles.headerContainer,
      headerLeftContainerStyle: navStyles.headerLeftContainer,
      headerTintColor: Colors.lightBlue,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    };

    store.dispatch(navigationOptionsRedux.actions.setNavigationOptions({
      styles: navStyles,
      screenOptions,
    }));
  }, [Theme.colors]);

  useEffect(() => {
    if (appearanceMode !== Constants.appearanceSettings.system) {
      return;
    }

    if (debouncedFunction.current) {
      debouncedFunction.current.cancel();
    }

    debouncedFunction.current = _.debounce(() => {
      debouncedFunction.current = null;
      setLastColorScheme(colorScheme);
    },
    1000,
    {
      leading: false,
      trailing: true,
    });

    debouncedFunction.current();
  }, [colorScheme]);

  const getUserFromLocalStorage = async () => {
    // dark mode appearance
    const appearanceMode = await getStorageItem(Constants.darkAppearanceMode);
    store.dispatch(userRedux.actions.setAppearanceMode(appearanceMode));

    // camera sound effect
    const cameraSoundEffect = await getStorageItem(Constants.cameraSoundEffect);
    store.dispatch(userRedux.actions.setCameraSoundEffect(cameraSoundEffect));

    // user info
    const currentUserInfo = await getUserInfo();

    initAxios(currentUserInfo?.token, handleChangeUserStatus);

    if (currentUserInfo?.token) {
      store.dispatch(userRedux.actions.signInSuccess(currentUserInfo));
    }

    setIsInitialized(true);
  };

  const handleChangeUserStatus = (status) => {
    switch (status) {
      case Constants.axiosResponseError.auth: {
        if (!navigationContainerRef.current) {
          return;
        }

        const currentRoute = navigationContainerRef.current.getCurrentRoute();
        if (currentRoute.name === 'Welcome') {
          return;
        }

        store.dispatch(userRedux.actions.signOut());

        if (navigationContainerRef.current) {
          navigationContainerRef.current.dispatch(StackActions.popToTop());
          navigationContainerRef.current.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{
                name: 'AuthStackScreens',
                state: {
                  routes: [
                    {
                      name: "Welcome",
                    },
                  ],
                },
              }],
            }),
          );
        }

        store.dispatch(maintenanceRedux.actions.setServerMaintenance(false));
        break;
      }
      case Constants.axiosResponseError.maintenance: {
        store.dispatch(maintenanceRedux.actions.setServerMaintenance(true));
        break;
      }
      default:
        store.dispatch(maintenanceRedux.actions.setServerMaintenance(false));
        break;
    }
  };

  const handleNavigationReady = () => {
    navigationRouteNameRef.current = navigationContainerRef.current?.getCurrentRoute();
  };

  const handleNavigationStateChange = () => {
    const previousRoute = navigationRouteNameRef.current;
    const previousRouteName = previousRoute?.name;
    const currentRoute = navigationContainerRef.current?.getCurrentRoute();
    const currentRouteName = currentRoute?.name;

    let eventName = null;
    let moreValues = {};

    switch (currentRouteName) {
      case 'Profile': {
        eventName = analyticsEvents.viewedProfile;
        break;
      }
      case 'CardDetail': {
        eventName = analyticsEvents.viewedCard;
        const {
          canonicalCardId,
          tradingCardId,
          analyticsQueryTerms,
        } = currentRoute.params || {};

        if (canonicalCardId) {
          const [, cardId] = decodeId(canonicalCardId);
          moreValues.card_id = cardId;
        } else if (tradingCardId) {
          const [, userCardId] = decodeId(tradingCardId);
          moreValues.user_card_id = userCardId;
        }

        if (analyticsQueryTerms) {
          moreValues.query = analyticsQueryTerms;
        }

        break;
      }
      case 'Collection': {
        eventName = analyticsEvents.viewedCollection;
        break;
      }
    }

    if (previousRouteName === currentRouteName) {
      const currentParams = currentRoute.params;
      const previousParams = previousRoute.params;

      if (_.isEqual(currentParams, previousParams)) {
        return;
      }
    }

    if (eventName && previousRouteName) {
      moreValues.from = analyticsNavigationRoute[previousRouteName] || previousRouteName;
    }

    if (eventName && Object.keys(moreValues).length) {
      analyticsSendEvent(
        eventName,
        moreValues,
      );
    }

    navigationRouteNameRef.current = currentRoute;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ChatOverlayProvider
        value={{style: ChatTheme}}
        bottomInset={Styles.screenSafeBottomHeight}>
        <Chat client={chatClient}>
          <NavigationContainer
            ref={navigationContainerRef}
            linking={deepLinkConfig(store)}
            onReady={handleNavigationReady}
            onStateChange={handleNavigationStateChange}
          >
            {isInitialized ? (
              <>
                <RootNavigation />
                <ProvidersContainer />
                {props.children}
              </>
            ) : null}
          </NavigationContainer>
        </Chat>
      </ChatOverlayProvider>
    </GestureHandlerRootView>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

const navigationStyles = colors => StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.primaryHeaderBackground,
    // borderBottomWidth: 1,
    // borderBottomColor: colors.quaternaryBorder,
    shadowColor: colors.quaternaryBorder,
  },
  headerLeftContainer: {
    paddingLeft: 5,
  },
  headerNoneBorderContainer: {
    backgroundColor: colors.primaryHeaderBackground,
    shadowColor: 'transparent',
    elevation: 0,
  },
  homeHeaderContainer: {
    backgroundColor: colors.secondaryBackground,
  },
  textNavBarTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    letterSpacing: -0.004,
    color: colors.headerTitleColor,
  },
  tabBarContainer: {
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    // width: Styles.screenWidth + 4,
    // marginLeft: -2,
    borderTopWidth: 2,
    // borderLeftWidth: 2,
    // borderRightWidth: 2,
    backgroundColor: colors.bottomBarBackground,
    borderTopColor: colors.bottomBarBorder,
    // borderLeftColor: colors.bottomBarBorder,
    // borderRightColor: colors.bottomBarBorder,
    elevation: 0,
  },
});
