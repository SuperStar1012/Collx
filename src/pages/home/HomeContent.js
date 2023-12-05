/* eslint-disable no-undef */
import React, {useEffect, useRef, useState, Suspense} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import {useScrollToTop} from '@react-navigation/native';
import {openInbox} from 'react-native-email-link';

import {
  LoadingIndicator,
  FooterIndicator,
  KeyboardAvoidingCommentView,
  MarketplaceIntroduceSheet,
  // ReferralProgramWidget,
} from 'components';
import OnboardingCreditView from './components/OnboardingCreditView';
import CreateAccount from './components/CreateAccount';
import RecentlyAddedCards from './components/RecentlyAddedCards';
import VerifyUserEmailWidget from './components/VerifyUserEmailWidget';
import FeaturedUsers from './components/FeaturedUsers';
import FeaturedListings from './components/FeaturedListings';
import ActivityList from './components/ActivityList';
import ReleaseNoteView from './components/ReleaseNoteView';
import NavBarRight from './components/NavBarRight';

import {
  firebaseAnalyticsSetUser,
  sentrySetUser,
  customerIoInitialize,
  customerIdentify,
  customerTrack,
  singularSetCustomUserId,
  singularCompleteRegistrationEvent,
  revenuecatConfigure,
} from 'services';
import {useActions} from 'actions';
import {createUseStyle} from 'theme';
import {
  decodeId,
  getStorageItem,
  setStorageItem,
  showErrorAlert,
} from 'utils';
import {Constants} from 'globals';

const HomeContent = ({
  navigation,
  queryOptions,
  isNewUser,
  isFetchingProducts,
  products,
  releaseNote,
  isFetchingPosts,
  posts,
  selectedCategory,
  userCardsActionCount,
  getRevenueCatCustomer,
  getOfferings,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const [isVisibleComment, setIsVisibleComment] = useState(false);
  const [mainContentHeight, setMainContentHeight] = useState(0);
  const [mainContentOffsetY, setMainContentOffsetY] = useState(0);

  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isClaimingCredit, setIsClaimingCredit] = useState(false);

  const [isVisibleMarketplaceIntroduce, setIsVisibleMarketplaceIntroduce] = useState(false);

  const activityListRef = useRef(null);
  const commentDataRef = useRef(null);

  const isRequiredSellerSettings = useRef(false);

  const scrollCommentViewRef = useRef(null);
  useScrollToTop(scrollCommentViewRef);

  const viewerData = useLazyLoadQuery(graphql`
    query HomeContentQuery {
      viewer {
        profile {
          id
          email
          name
          isAnonymous
          flags
          ...RecentlyAddedCards_profile
          ...VerifyUserEmailWidget_profile
        }
        notificationUnreadCount
        ...OnboardingCreditView_viewer
        # ...ReferralProgramWidget_viewer,
        recommendations {
          ...FeaturedUsers_recommendations
          ...FeaturedListings_recommendations
        }
        ...ActivityList_viewer
        ...FollowButton_viewer
      }
    }`,
    {},
    queryOptions
  );

  if (!viewerData) {
    return null;
  }

  const {profile: profileData, notificationUnreadCount = 0} = viewerData.viewer || {};

  useEffect(() => {
    checkMarketplaceIntroduce();
  }, []);

  useEffect(() => {
    if (!profileData) {
      return;
    }
    initRevenueCat(profileData);
  }, [profileData]);

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

  useEffect(() => {
    const [, userId] = decodeId(profileData.id);

    const userInfo = {
      id: userId,
      email: profileData.email,
      name: profileData.name
    };

    // CustomerIO
    customerIoInitialize();

    customerIdentify(userInfo);

    customerTrack('launched_app');

    // Sentry
    sentrySetUser(userInfo);

    // Firebase Analytics
    firebaseAnalyticsSetUser(userInfo);

    // Singular
    setSingular();
  }, [profileData]);

  useEffect(() => {
    setNavigationBar();
  }, [notificationUnreadCount]);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerRight: () => (
        <NavBarRight
          unreadCount={notificationUnreadCount}
          onSearchUsers={handleSearchUsers}
          onNotifications={handleNotifications}
        />
      ),
    });
  };

  const setSingular = () => {
    singularSetCustomUserId({
      email: profileData.email,
    });

    if (isNewUser) {
      singularCompleteRegistrationEvent();
    }
  };

  const checkMarketplaceIntroduce = () => {
    const {marketplace} = profileData.flags || {};
    if (!marketplace) {
      return;
    }

    getStorageItem(Constants.showedMarketplaceIntroduce).then(result => {
      if (result !== 'yes') {
        setStorageItem(Constants.showedMarketplaceIntroduce, 'yes');

        setTimeout(() => {
          setIsVisibleMarketplaceIntroduce(true);
        }, 1000);
      }
    });
  };

  const handleSearchUsers = () => {
    actions.navigateSearchUsers();
  };

  const handleNotifications = () => {
    actions.navigateNotifications();
  }

  const handleSendComment = text => {
    if (!commentDataRef.current) {
      return;
    }

    setIsAddingComment(true);

    actions.createComment(
      text,
      commentDataRef.current,
      {
        onComplete: () => {
          setIsAddingComment(false);
        },
        onError: (error) => {
          setIsAddingComment(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );

    commentDataRef.current = null;
  };

  const handleRefresh = () => {
    actions.refresh();
  };

  const handleLayout = ({nativeEvent: {layout}}) => {
    setMainContentHeight(layout.height);
  };

  const handleScroll = ({nativeEvent: {contentOffset}}) => {
    setMainContentOffsetY(contentOffset.y);
  };

  const handleCreateAccount = () => {
    actions.navigateCreateAccount();
  };

  const handleEndReached = () => {
    if (!activityListRef.current) {
      return;
    }

    activityListRef.current.loadNextActivities();
  };

  const handleActivityComment = (commentData) => {
    if (profileData?.isAnonymous) {
      handleCreateAccount();
      return;
    }

    commentDataRef.current = commentData;
    setIsVisibleComment(!isVisibleComment);
  };

  const handleSetSellerSettings = () => {
    isRequiredSellerSettings.current = true;
    handleSkipMarketplaceSettings();
  };

  const handleCloseMarketplaceIntroduce = () => {
    if (isRequiredSellerSettings.current) {
      isRequiredSellerSettings.current = false;
      actions.navigateSetSellerSettings();
    }
  };

  const handleSkipMarketplaceSettings = () => {
    setIsVisibleMarketplaceIntroduce(false);
  };

  const handleVerifyEmail = () => {
    setIsVerifyingEmail(true);

    actions.initiateEmailVerification({
      onComplete: () => {
        setIsVerifyingEmail(false);

        try {
          openInbox({
            removeText: true,
          });
        } catch (error) {
          console.log(error);
        }
      },
      onError: (error) => {
        setIsVerifyingEmail(false);

        if (error?.message) {
          showErrorAlert(error?.message);
        }
      },
    });
  };

  const handleClaimCredit = () => {
    setIsClaimingCredit(true);

    actions.marketingClaimOnboardingCredit({
      onComplete: () => {
        setIsClaimingCredit(false);

        actions.navigateCreditHistory();
      },
      onError: (error) => {
        setIsClaimingCredit(false);

        if (error?.message) {
          showErrorAlert(error?.message);
        }
      },
    });
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isAddingComment || isVerifyingEmail || isClaimingCredit} />
      <KeyboardAvoidingCommentView
        ref={scrollCommentViewRef}
        contentContainerStyle={styles.contentContainer}
        visibleComment={isVisibleComment}
        onHideComment={setIsVisibleComment}
        onSendComment={handleSendComment}
        onEndReached={handleEndReached}
        onRefresh={handleRefresh}
        onLayout={handleLayout}
        onScroll={handleScroll}>
        <CreateAccount
          isAnonymous={profileData?.isAnonymous}
          onCreate={handleCreateAccount}
        />
        {!profileData?.isAnonymous ? (
          <OnboardingCreditView
            viewer={viewerData.viewer}
            onClaimCredit={handleClaimCredit}
          />
        ) : null}
        <ReleaseNoteView releaseNote={releaseNote}/>
        {/* <ReferralProgramWidget
          style={styles.referralContainer}
          viewer={viewerData.viewer}
        /> */}
        <VerifyUserEmailWidget
          profile={profileData}
          onVerifyEmail={handleVerifyEmail}
        />
        <RecentlyAddedCards
          profile={profileData}
          userCardsActionCount={userCardsActionCount}
        />
        <FeaturedUsers
          recommendations={viewerData.viewer.recommendations}
          viewer={viewerData.viewer}
        />
        <Suspense fallback={<FooterIndicator isLoading />}>
          <FeaturedListings
            recommendations={viewerData.viewer.recommendations}
            category={selectedCategory}
          />
        </Suspense>
        <Suspense fallback={<FooterIndicator isLoading />}>
          <ActivityList
            ref={activityListRef}
            parentViewRef={scrollCommentViewRef}
            parentContentHeight={mainContentHeight}
            parentContentOffsetY={mainContentOffsetY}
            viewer={viewerData.viewer}
            isFetchingPosts={isFetchingPosts}
            posts={posts}
            isFetchingProducts={isFetchingProducts}
            products={products}
            category={selectedCategory}
            onLeaveComment={handleActivityComment}
          />
        </Suspense>
        <MarketplaceIntroduceSheet
          isVisible={isVisibleMarketplaceIntroduce}
          onSetSellerSettings={handleSetSellerSettings}
          onSkip={handleSkipMarketplaceSettings}
          onClose={handleCloseMarketplaceIntroduce}
        />
      </KeyboardAvoidingCommentView>
    </View>
  );
};

export default HomeContent;

const useStyle = createUseStyle(() => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 8,
  },
  // referralContainer: {
  //   marginTop: 8,
  //   marginBottom: 16,
  // },
}));
