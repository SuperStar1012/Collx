import React, {Suspense, useEffect, useMemo, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  NavBarButton,
  LoadingIndicator,
  Button,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import OnboardingItem from './components/OnboardingItem';
import PayButton from './components/PayButton';
import FreeTrialButton from './components/FreeTrialButton';

import {Constants, Styles} from 'globals';
import {Fonts, createUseStyle, useTheme} from 'theme';
import {usePrevious} from 'hooks';
import {showErrorAlert, decodeId, wp} from 'utils';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {withProMember} from 'store/containers';
import {
  singularSubscribeEvent,
  // firebaseAnalyticsLogPurchase,
  analyticsEvents,
  analyticsSendEvent,
  revenuecatConfigure,
} from 'services';

const closeIcon = require('assets/icons/close.png');
const arrowDownIcon = require('assets/icons/arrow_down.png');
const proIcon = require('assets/icons/more/collx_pro.png');

const benefits = [
  {
    icon: require('assets/icons/square_stack.png'),
    label: 'Unlimited cards in collection',
  },
  {
    icon: require('assets/icons/doc.png'),
    label: 'Print set checklists',
  },
  {
    icon: require('assets/icons/share.png'),
    label: 'Export your collection',
  },
  {
    icon: require('assets/icons/ai.png'),
    label: 'Chat with CollX AI',
  },
  {
    icon: require('assets/icons/star_outline.png'),
    label: 'Pin cards to the top of your collection',
  },
  {
    icon: require('assets/icons/mega_phone.png'),
    label: 'Your listings get featured in the explore screen',
  },
  {
    icon: require('assets/icons/bubble.png'),
    label: 'Priority live chat support',
  },
  {
    icon: require('assets/icons/pro_badge.png'),
    label: 'Get instant status with “Pro” badge',
  }
];

const learMoreDetails = [
  {
    subtitle: 'Unlimited cards in collection',
    description: 'CollX is free for collections up to 500 cards. To add more, go Pro. (If you have an older account with 500+, nothing is disabled on your existing collection, but you need to upgrade to keep adding.)',
    imageStyle: {
      width: wp(73),
      height: wp(80),
    },
  },
  {
    subtitle: 'Print set checklist',
    description: 'Our set view enables you to see what cards you own and don’t own from a set. You can also export and print checklists of the sets to help better visualize how you can complete the set.',
    imageStyle: {
      width: wp(79),
      height: wp(75),
    },
  },
  {
    subtitle: 'Export your collection',
    description: 'Get all of your collection and card details, including pricing and card-image URLs, in a CSV spreadsheet.',
    imageStyle: {
      width: wp(77),
      height: wp(67),
    },
  },
  {
    subtitle: 'Chat with CollX AI',
    description: 'Get a card coach in your pocket. CollX AI can answer virtually any questions about cards or the hobby in general.',
    imageStyle: {
      width: wp(68),
      height: wp(80),
    },
  },
  {
    subtitle: 'Pin cards to the top of your collection',
    description: 'Select cards to feature at the top of the your collection page. Make it easier for potential buyers to discover your best cards.',
    imageStyle: {
      width: wp(69),
      height: wp(80),
    },
  },
  {
    subtitle: 'Your listings get featured',
    description: 'Pro users automatically get their cards featured on the CollX activity feed and throughout the app. Get more eyeballs on your lists and sell more cards, faster.',
    imageStyle: {
      width: wp(67),
      height: wp(74),
    },
  },
  {
    subtitle: 'Priority live chat support',
    description: 'Want to chat instantly with a member of our team? Pro users get a faster response with Priority Support via chat.',
    imageStyle: {
      width: wp(77),
      height: wp(67),
    },
  },
  {
    subtitle: 'Get instant status with “Pro” badge',
    description: 'Show off your Pro status and support CollX by sporting a spiffy Pro badge throughout the app.',
    imageStyle: {
      width: wp(82),
      height: wp(61),
    },
  },
];

const GetCollXProPage = (props) => {
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
  route,
  isFetchingOfferings,
  isPurchasingPackage,
  isRestoringPurchases,
  isSettingSubscription,
  activeSubscription,
  offerings,
  errorText,
  getRevenueCatCustomer,
  getOfferings,
  purchasePackage,
  restorePurchases,
  setSubscription,
}) => {
  const {source} = route.params || {};

  const {t: {icons, images}} = useTheme();
  const styles = useStyle();
  const actions = useActions();

  const prevProps = usePrevious({activeSubscription, errorText});

  const {onboardingProImages} = images;

  const profileData = useLazyLoadQuery(graphql`
    query GetCollXProPageQuery {
      viewer {
        profile {
          id
          email
          name
        }
      }
    }`,
    {},
    {}
  );

  const [packages, setPackages] = useState([]);
  const [currentPurchaseType, setCurrentPurchaseType] = useState();
  const currentPurchasePackage = useRef(null);

  const disabledButtons = useMemo(() => {
    const disabled = {
      [Constants.revenueCatPackageType.monthly]: false,
      [Constants.revenueCatPackageType.annual]: false,
    };

    if (packages.findIndex(item => item.packageType === Constants.revenueCatPackageType.monthly) === -1) {
      disabled[Constants.revenueCatPackageType.monthly] = true;
    }

    if (packages.findIndex(item => item.packageType === Constants.revenueCatPackageType.annual) === -1) {
      disabled[Constants.revenueCatPackageType.annual] = true;
    }

    return disabled;
  }, [packages]);

  const learMoreItems = useMemo(() => (
    learMoreDetails.map((item, index) => ({
      ...item,
      image: onboardingProImages[index],
    }))
  ), [onboardingProImages]);

  useEffect(() => {
    setNavigationBar();
  }, [icons]);

  useEffect(() => {
    if (!profileData?.viewer?.profile) {
      return;
    }

    initRevenueCat(profileData.viewer.profile);

    // Custom Analytics
    analyticsSendEvent(
      analyticsEvents.viewedSubscriptions,
      {
        from: source,
      },
    );
  }, [profileData?.viewer?.profile]);

  useEffect(() => {
    if (offerings?.current?.availablePackages?.length) {
      setPackages(offerings.current.availablePackages);
    }
  }, [offerings]);

  useEffect(() => {
    if (!packages?.length) {
      return;
    }

    pickAvailablePackage(Constants.revenueCatPackageType.monthly);
  }, [packages]);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (!prevProps.activeSubscription && activeSubscription) {
      const [, userId] = decodeId(profileData.viewer.profile.id);
      setSubscription({
        userId: parseInt(userId),
        source,
        productId: activeSubscription,
      });

      singularSubscribeEvent();

      const {product} = currentPurchasePackage.current;

      // Custom Analytics
      analyticsSendEvent(
        analyticsEvents.purchasedSubscription,
        {
          product_id: activeSubscription,
          cost: product.price,
        },
      );

      // if (currentPurchasePackage.current) {
      //   firebaseAnalyticsLogPurchase({
      //     value: product.price || 0,
      //     currency: product.currencyCode || 'USD',
      //     items: [{
      //       item_id: product.identifier,
      //       item_name: product.title,
      //       item_category: product.productCategory,
      //     }],
      //   });
      // }

      currentPurchasePackage.current = null;

      handleClose();
      actions.updateUserType(Constants.userType.pro);
    } else if (!prevProps.errorText && errorText) {
      showErrorAlert(errorText);
    }
  }, [activeSubscription, errorText]);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerLeft: () => (
        <NavBarButton
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      ),
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Image style={styles.iconLogo} source={icons.logo} />
          <Image style={styles.iconPro} source={proIcon} />
        </View>
      ),
    });
  };

  const initRevenueCat = async (profile) => {
    const [, userId] = decodeId(profile.id);

    const userInfo = {
      id: userId,
      email: profile.email,
      name: profile.name
    };

    await revenuecatConfigure(userInfo);

    getRevenueCatCustomer();

    getOfferings();
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const pickAvailablePackage = (packageType) => {
    const purchaseInfo = packages.find(item => item.packageType === packageType);
    if (!purchaseInfo) {
      return;
    }

    currentPurchasePackage.current = purchaseInfo;
    setCurrentPurchaseType(purchaseInfo.packageType);
  };

  const handlePayMonthly = async () => {
    pickAvailablePackage(Constants.revenueCatPackageType.monthly);
  };

  const handlePayYearly = async () => {
    pickAvailablePackage(Constants.revenueCatPackageType.annual);
  };

  const handleFreeTrial = async () => {
    if (currentPurchasePackage.current) {
      purchasePackage(currentPurchasePackage.current);
    }
  };

  const handleRestorePurchase = () => {
    restorePurchases();
  };

  const renderBenefits = () => (
    <View style={styles.benefitsContainer}>
      <Text style={styles.textTitle}>Try CollX Pro for free and enjoy the benefits of:</Text>
      <View style={styles.benefitsContentContainer}>
        {benefits.map((item, index) => (
          <View key={index} style={styles.benefitItem}>
            <Image style={styles.iconBenefit} source={item.icon} />
            <Text style={styles.textLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={[styles.actionsContainer, {marginBottom: Styles.screenSafeBottomHeight || 16}]}>
      <View style={styles.payButtonsContainer}>
        <PayButton
          title="Monthly"
          subTitle="$9.99/mo"
          isActive={currentPurchaseType === Constants.revenueCatPackageType.monthly}
          disabled={disabledButtons[Constants.revenueCatPackageType.monthly]}
          onPress={handlePayMonthly}
        />
        <PayButton
          title="Yearly"
          subTitle="$99.99/yr"
          isActive={currentPurchaseType === Constants.revenueCatPackageType.annual}
          discountPercent={16}
          disabled={disabledButtons[Constants.revenueCatPackageType.annual]}
          onPress={handlePayYearly}
        />
      </View>
      <FreeTrialButton
        onPress={handleFreeTrial}
      />
      <Button
        style={styles.restoreButton}
        label="Restore Purchase"
        labelStyle={styles.textRestore}
        scale={Button.scaleSize.Two}
        onPress={handleRestorePurchase}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <LoadingIndicator
        isLoading={isFetchingOfferings || isPurchasingPackage || isRestoringPurchases || isSettingSubscription}
        isModalMode
      />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {renderBenefits()}
        <View style={styles.learnMoreContainer}>
          <Text style={styles.textLearnMore}>Learn More</Text>
          <Image style={styles.iconArrowDown} source={arrowDownIcon} />
        </View>
        {learMoreItems.map((item, index) => <OnboardingItem key={index} {...item} />)}
      </ScrollView>
      {renderActions()}
    </View>
  );
};

export default withProMember(GetCollXProPage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  iconClose: {
    width: 28,
    height: 28,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLogo: {
    width: 95,
    height: 26,
    resizeMode: 'contain',
  },
  iconPro: {
    width: 55,
    height: 26,
    resizeMode: 'contain',
    marginLeft: 12,
  },
  scrollViewContentContainer: {
    paddingBottom: 20,
  },
  benefitsContainer: {
    marginHorizontal: 16,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
    color: colors.primaryText,
    textAlign: 'center',
    marginVertical: 16,
  },
  benefitsContentContainer: {
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 9,
    backgroundColor: colors.secondaryCardBackground,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  textLabel: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
  },
  iconBenefit: {
    width: 28,
    height: 28,
    tintColor: colors.primary,
    resizeMode: 'contain',
    marginRight: 6,
  },
  learnMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  textLearnMore: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.06,
    color: colors.primary,
    marginRight: 8,
  },
  iconArrowDown: {
    width: 24,
    height: 24,
    tintColor: colors.primary,
  },
  actionsContainer: {
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.quaternaryBorder,
  },
  payButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restoreButton: {
    marginTop: 12,
  },
  textRestore: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.24,
    color: colors.lightGrayText,
  }
}));
