import React, {Suspense, useEffect, useState, useMemo, useCallback, useRef} from 'react';
import {View, Image, ScrollView, Alert, Text} from 'react-native';
import {CommonActions, StackActions, useFocusEffect} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  Button,
  NavBarButton,
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import SettingsItem from './components/SettingsItem';

import {Constants, Urls} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {withSettings} from 'store/containers';
import {usePrevious} from 'hooks';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions'
import {contactSupport, encodeId, openUrl} from 'utils';
import {analyticsNavigationRoute} from 'services';

const madeinPhillyImage = require('assets/imgs/madein_philly.png');
const moonIcon = require('assets/icons/moon.png');
const personIcon = require('assets/icons/person_circle.png');
const bellIcon = require('assets/icons/bell.png');
const shippingBoxIcon = require('assets/icons/shipping_box.png');
const creditCardIcon = require('assets/icons/credit_card_123.png');
const tagIcon = require('assets/icons/tag_outline.png');
const exclamationIcon = require('assets/icons/exclamation_circle.png');
const shareIcon = require('assets/icons/share.png');
const giftIcon = require('assets/icons/gift.png');
const bubbleIcon = require('assets/icons/bubble.png');
const emailIcon = require('assets/icons/email.png');

const actionNames = {
  emailSupport: 'EmailSupport',
  priorityChatSupport: 'PriorityChatSupport',
  exportCollection: 'ExportCollection',
};

const SettingsPage = (props) => {
  const styles = useStyle();
  const {navigation} = props;

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({
      navigation,
    }),
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <Content
              queryOptions={refreshedQueryOptions ?? {}}
              {...props}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const Content = ({
  navigation,
  isFetchingExportCollection,
  exportCollection,
  queryOptions,
  getExportCollection,
  signOut,
}) => {

  const styles = useStyle();
  const actions = useActions();

  const profileData = useLazyLoadQuery(graphql`
    query SettingsPageQuery {
      viewer {
        profile {
          id
          type
          flags
          isAnonymous
        }
      }
    }`,
    {},
    queryOptions
  );

  const {
    id: profileId,
    type: userType,
    flags,
    isAnonymous,
  } = profileData?.viewer?.profile || {};

  const prevProps = usePrevious({userType});

  const actionAfterSubscription = useRef(null);

  const settingsData = useMemo(() => {
    if (isAnonymous) {
      return [
        {
          label: 'Account Settings',
          route: 'AccountSettings',
          icon: personIcon,
        },
        {
          label: 'About CollX',
          route: 'AboutCollX',
          icon: exclamationIcon,
        },
      ];
    }

    const {marketplace} = flags || {};

    const myItems = [
      {
        label: 'Appearance & Sound',
        route: 'AppearanceAndSound',
        icon: moonIcon,
      },
      {
        label: 'Account Settings',
        route: 'AccountSettings',
        icon: personIcon,
      },
      {
        label: 'Notification Settings',
        route: 'NotificationSettings',
        icon: bellIcon,
      },
      {
        label: 'My Shipping Address',
        route: 'ShippingAddressScreens',
        icon: shippingBoxIcon,
      },
    ];

    if (marketplace) {
      myItems.push(...[
        {
          label: 'My Payment Methods',
          route: 'PaymentMethodScreens',
          icon: creditCardIcon,
        },
        {
          label: 'Seller Tools',
          route: 'SellerToolsScreens',
          icon: tagIcon,
        },
      ]);
    }

    myItems.push(...[
      {
        label: 'About CollX',
        route: 'AboutCollX',
        icon: exclamationIcon,
      },
      {
        label: 'Email Support',
        action: actionNames.emailSupport,
        icon: emailIcon,
      },
      {
        label: 'Priority Chat Support',
        action: actionNames.priorityChatSupport,
        icon: bubbleIcon,
        isProBadge: true,
        source: analyticsNavigationRoute.priorityChatSupport,
      },
      {
        label: 'Pro Perks',
        externalUrl: Urls.proPerksUrl,
        icon: giftIcon,
        isProBadge: true,
        source: analyticsNavigationRoute.proPerks,
      },
      {
        label: 'Export Collection',
        action: actionNames.exportCollection,
        icon: shareIcon,
        isProBadge: true,
        source: analyticsNavigationRoute.collectionExport,
      },
    ]);

    return myItems;
  }, [isAnonymous, flags]);

  useEffect(() => {
    setNavigationBar();
  }, []);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (
      prevProps.userType !== Constants.userType.pro &&
      userType === Constants.userType.pro &&
      actionAfterSubscription.current
    ) {
      setTimeout(() => {
        actionAfterSubscription.current();
        actionAfterSubscription.current = null;
      });
    }
  }, [userType]);

  useFocusEffect(
    useCallback(() => {
      if (userType === Constants.userType.pro) {
        // eslint-disable-next-line no-undef
        if (__DEV__) {
          return
        }

        getExportCollection();
      }
    }, [userType])
  );

  const setNavigationBar = () => {
    navigation.setOptions({
      headerRight: () => (
        <NavBarButton
          label="Log Out"
          labelStyle={styles.textLogOut}
          onPress={handleDisplayAlertLogoutAccount}
        />
      ),
    });
  };

  const handleDisplayAlertLogoutAccount = () => {
    if (!isAnonymous) {
      handleLogOut();
      return;
    }

    Alert.alert(
      'You are logged in anonymously',
      'If you log out before upgrading to a registered user account, you will not be able to log back in and you will lose your collection.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: () => handleLogOut(),
        },
      ],
    );
  };

  const handleLogOut = () => {
    navigation.dispatch(StackActions.popToTop());
    navigation.dispatch(
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

    signOut();
  };

  const handleSelect = item => {
    actionAfterSubscription.current = null;

    if (item.route) {
      navigation.navigate(item.route);
    } else if (item.action) {
      switch (item.action) {
        case actionNames.emailSupport:
          contactSupport();
          break;
        case actionNames.priorityChatSupport:
          if (userType === Constants.userType.pro) {
            handleNavigateSupportMessage();
          } else {
            actionAfterSubscription.current = handleNavigateSupportMessage;

            actions.navigateCollXProModal({
              source: item.source,
            });
          }
          break;
        case actionNames.exportCollection:
          if (userType === Constants.userType.pro) {

            if (exportCollection.length) {
              actions.navigateExportCollectionProgress();
            } else {
              actions.navigateExportCollection();
            }
          } else {
            actionAfterSubscription.current = actions.navigateExportCollection;

            actions.navigateCollXProModal({
              source: item.source,
            });
          }
          break;
      }
    } else if (item.internalUrl || item.externalUrl) {
      const linkAction = () => {
        if (item.internalUrl) {
          navigation.navigate('CommonStackModal', {
            screen: 'WebViewer',
            params: {
              title: item.label,
              url: item.internalUrl,
            },
          });
        } else if (item.externalUrl) {
          openUrl(item.externalUrl);
        }
      };

      if (!item.isProBadge || userType === Constants.userType.pro) {
        linkAction();
      } else {
        actionAfterSubscription.current = linkAction;

        actions.navigateCollXProModal({
          source: item.source,
        });
      }
    }
  };

  const handleNavigateSupportMessage = () => {
    const peerProfileId = encodeId(Constants.base64Prefix.profile, 1);

    actions.navigateMessage({
      currentProfileId: profileId,
      peerProfileId,
    });
  };

  const handleCreateAccount = () => {
    actions.navigateCreateAccount();
  };

  const renderCreateAccount = () => {
    if (!isAnonymous) {
      return null;
    }

    return (
      <Button
        style={styles.createAccountButton}
        label="Create My Account"
        labelStyle={styles.textCreateAccount}
        scale={Button.scaleSize.One}
        onPress={handleCreateAccount}
      />
    );
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isFetchingExportCollection} />
      <ScrollView>
        {renderCreateAccount()}
        {settingsData.map((item, index) => (
          <SettingsItem
            key={index}
            {...item}
            onPress={() => handleSelect(item)}
          />
        ))}
      </ScrollView>
      <Text style={styles.textVersion}>
        {`${DeviceInfo.getApplicationName()} v${DeviceInfo.getVersion()} build ${DeviceInfo.getBuildNumber()}`}
      </Text>
      <Image style={styles.imageMadein} source={madeinPhillyImage} />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  textLogOut: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.red,
  },
  createAccountButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  textCreateAccount: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
  },
  textVersion: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.grayText,
    textAlign: 'center',
    marginVertical: 16,
  },
  imageMadein: {
    width: 155,
    height: 47,
    alignSelf: 'center',
    marginBottom: 40,
  },
}));

export default withSettings(SettingsPage);
