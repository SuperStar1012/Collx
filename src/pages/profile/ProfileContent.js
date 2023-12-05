import React, {useEffect, useMemo, useRef, useState} from 'react';
import {graphql, useFragment} from 'react-relay';
import {View, Text} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';

import {
  KeyboardAvoidingCommentView,
  LoadingIndicator,
  ActionButton,
  UserInfo,
} from 'components';
import UserCollectionStats from './components/UserCollectionStats';
import UserMoreStats from './components/UserMoreStats';
import UserSocials from './components/UserSocials';
import RecentActivity from './components/RecentActivity';
import ProfileActionsForOtherUsers from './components/ProfileActionsForOtherUsers';
import ProfileCreateAccount from './components/ProfileCreateAccount';
import UnblockOtherUser from './components/UnblockOtherUser';
import IntroduceUsernameSheet from './components/IntroduceUsernameSheet';
import AccountSuspended from './components/AccountSuspended';
import BlockedOtherUser from './components/BlockedOtherUser';
import BannedOtherUser from './components/BannedOtherUser';
import DeletedOtherUser from './components/DeletedOtherUser';
import SellerDiscount from './components/SellerDiscount';
import SellerMinimum from './components/SellerMinimum';
import SellerShipping from './components/SellerShipping';

import {useActions} from 'actions';
import {Constants} from 'globals';
import {createUseStyle} from 'theme';
import {
  getStorageItem,
  setStorageItem,
  decodeId,
  showErrorAlert,
} from 'utils';
import {withProfile} from 'store/containers';
import {getMessageChannel, analyticsNavigationRoute} from 'services';

const proIcon = require('assets/icons/more/collx_pro_white.png');
const dollarIcon = require('assets/icons/dollar_circle.png');
const squareStackDollarIcon = require('assets/icons/square_stack_dollar.png');
const bagIcon = require('assets/icons/bag.png');
const tagIcon = require('assets/icons/tag_outline.png');
const cartIcon = require('assets/icons/cart.png');
const personSequenceIcon = require('assets/icons/person_sequence.png');
const clockIcon = require('assets/icons/clock.png');
const squareStackIcon = require('assets/icons/square_stack.png');
const heartOutlineIcon = require('assets/icons/heart.png');
// const giftIcon = require('assets/icons/gift.png');

const ProfileContent = ({
  viewer,
  profile,
  setEmailVerifiedAction,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const scrollCommentViewRef = useRef(null);

  const [isVisibleComment, setIsVisibleComment] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isVisibleIntroduceUsername, setIsVisibleIntroduceUsername] = useState(false);

  const commentDataRef = useRef(null);

  useScrollToTop(scrollCommentViewRef);

  const profileData = useFragment(graphql`
    fragment ProfileContent_profile on Profile {
      id
      name
      username
      bio
      isAnonymous
      status
      type
      flags
      viewer {
        isMe
        areTheyBlockingMe
        activeDealWithSeller {
          id
        }
      }
      ...ProfileCreateAccount_profile
      ...ProfileActionsForOtherUsers_profile
      ...RecentActivity_profile
      ...UserInfo_profile
      ...UserCollectionStats_profile
      ...UserMoreStats_profile
      ...UserSocials_profile
      ...UnblockOtherUser_profile
      ...IntroduceUsernameSheet_profile,
      ...AccountSuspended_profile,
      ...BlockedOtherUser_profile,
      ...SellerDiscount_profile
      ...SellerMinimum_profile
      ...SellerShipping_profile
    }`,
    profile
  );

  const viewerData = useFragment(graphql`
    fragment ProfileContent_viewer on Viewer {
      # marketing {
      #   referralProgramRefer5 {
      #     claimed
      #     remainingRedemptions
      #   }
      # }
      ...ProfileActionsForOtherUsers_viewer
      ...RecentActivity_viewer
      ...FollowButton_viewer
    }`,
    viewer
  );

  if (!profileData) {
    return null;
  }

  const navigationItems = useMemo(() => {
    const {marketplace} = profileData.flags || {};

    if (profileData.viewer.isMe) {
      const myItems = [];

      if (marketplace) {
        myItems.push({
          label: 'My Money',
          icon: dollarIcon,
          value: null,
          onPress: () => actions.navigateMyMoney(),
        });
      }

      myItems.push({
        label: 'My Listings',
        icon: squareStackDollarIcon,
        value: null,
        onPress: () => actions.navigateCollection(profileData.id, profileData.viewer.isMe, true),
      });

      if (marketplace) {
        myItems.push(...[
          {
            label: 'My Purchases',
            icon: bagIcon,
            value: null,
            onPress: () => actions.navigateMyPurchases(),
          },
          {
            label: 'My Sales',
            icon: tagIcon,
            value: null,
            onPress: () => actions.navigateMySales(),
          },
        ]);
      }

      myItems.push(...[
        {
          label: 'My Deals',
          icon: cartIcon,
          value: null,
          onPress: () => actions.navigateMyDeals(),
        },
        {
          label: 'My Buyers',
          icon: personSequenceIcon,
          value: null,
          onPress: () => actions.navigateMyBuyers(),
        },
        {
          label: 'Saved for Later',
          icon: clockIcon,
          value: null,
          onPress: () => actions.navigateSavedForLater(),
        },
        {
          label: 'My Likes',
          icon: heartOutlineIcon,
          value: null,
          onPress: () => actions.navigateMyLikes(),
        },
      ]);

      return myItems;
    }

    const otherItems = [
      {
        label: 'Listings',
        icon: squareStackDollarIcon,
        value: null,
        onPress: () => actions.navigateCollection(profileData.id, profileData.viewer.isMe, true),
      },
      {
        label: 'Collection',
        icon: squareStackIcon,
        value: null,
        onPress: () => actions.navigateCollection(profileData.id, profileData.viewer.isMe, false),
      },
    ];

    if (profileData.viewer.activeDealWithSeller) {
      otherItems.push({
        label: `My Deal with ${profileData.name}`,
        icon: cartIcon,
        value: null,
        onPress: () => actions.navigateDeal(profileData.viewer.activeDealWithSeller?.id),
      });
    }

    return otherItems;
  }, [profileData]);

  useEffect(() => {
    if (!profileData.viewer.isMe || !profileData.id) {
      return;
    }

    const [, userId] = decodeId(profileData.id);

    if (profileData.username === `user${userId}`) {
      getStorageItem(Constants.showedIntroduceUsername)
        .then(value => {
          setIsVisibleIntroduceUsername(value !== 'true');
        });
    }
  }, []);

  const handleRefresh = () => {
    actions.refresh();
  };

  const handleCloseIntroduceUsername = () => {
    setIsVisibleIntroduceUsername(false);
    setStorageItem(Constants.showedIntroduceUsername, 'true');
  };

  const handleChangeUsername = () => {
    actions.navigateChangeUsername();
  };

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

  const handleActivityComment = (commentData) => {
    if (profileData.isAnonymous) {
      actions.navigateCreateAccount();
      return;
    }

    commentDataRef.current = commentData;
    setIsVisibleComment(!isVisibleComment);
  };

  const handleOpenCollXPro = () => {
    actions.navigateCollXProModal({
      source: analyticsNavigationRoute.Profile,
    });
  };

  const handleMessage = (currentProfileId, peerProfileId) => {
    setEmailVerifiedAction(() => {
      getMessageChannel(currentProfileId, peerProfileId)
        .then(messageInfo => actions.navigateMessageChannel(messageInfo))
        .catch(error => showErrorAlert(error));
    });
  };

  const renderPro = () => {
    if (!profileData.viewer.isMe || profileData.type === Constants.userType.pro) {
      return null;
    }

    return (
      <ActionButton
        icon={proIcon}
        iconStyle={styles.iconPro}
        label="Get CollX Pro Now"
        active
        disabledTintColor
        onPress={handleOpenCollXPro}
      />
    );
  };

  // const renderReferral = () => {
  //   if (!profileData.viewer.isMe || viewerData.marketing?.referralProgramRefer5?.claimed) {
  //     return null;
  //   }

  //   const isRedeemedReward = viewerData.marketing?.referralProgramRefer5?.length > 0;
  //   const isRewardReady = viewerData.marketing?.referralProgramRefer5?.length >= Constants.rewardReferralCount;

  //   let label = 'Refer 5 Friends, Get a Free Pack';
  //   if (isRedeemedReward) {
  //     label = 'Reward redeemed';
  //   } else if (isRewardReady) {
  //     label = 'Reward ready, redeem now';
  //   }

  //   return (
  //     <ActionButton
  //       icon={giftIcon}
  //       label={label}
  //       disabled={isRedeemedReward}
  //       active={isRewardReady}
  //       onPress={actions.navigateOpenReferralProgram}
  //     />
  //   );
  // };

  const renderActions = () => {
    if (profileData.viewer.isMe) {
      return <ProfileCreateAccount profile={profileData} />;
    } else if (profileData.status === Constants.accountStatus.suspended) {
      return <AccountSuspended profile={profileData} />;
    } else if (profileData.viewer.areTheyBlockingMe) {
      return <UnblockOtherUser profile={profileData} />;
    }

    return (
      <ProfileActionsForOtherUsers
        profile={profileData}
        viewer={viewerData}
        onMessage={handleMessage}
      />
    );
  };

  const renderMainContent = () => {
    if (profileData.viewer.areTheyBlockingMe) {
      return <BlockedOtherUser profile={profileData} />;
    }

    return (
      <>
        <View style={styles.navigationContainer}>
          {renderPro()}
          {/* {renderReferral()} */}
          {navigationItems?.map((item, index) => (
            <ActionButton
              key={index}
              icon={item.icon}
              iconStyle={styles.iconAction}
              label={item.label}
              onPress={item.onPress}
            />
          ))}
        </View>
        {profileData.bio ? (
          <Text style={styles.textBio}>{profileData.bio}</Text>
        ) : null}
        <UserMoreStats profile={profileData} />
        <UserSocials profile={profileData} />
        <SellerDiscount profile={profileData} />
        <SellerMinimum profile={profileData} />
        <SellerShipping profile={profileData} />
        <RecentActivity
          title="Recent Activity"
          viewer={viewerData}
          profile={profileData}
          onLeaveComment={handleActivityComment}
        />
      </>
    );
  };

  const renderContent = () => {
    if (!profileData.viewer.isMe) {
      if (profileData.status === Constants.accountStatus.banned) {
        return <BannedOtherUser />;
      } else if (profileData.status === Constants.accountStatus.deleted) {
        return <DeletedOtherUser />;
      }
    }

    return (
      <>
        {renderActions()}
        <UserCollectionStats profile={profileData} />
        {renderMainContent()}
      </>
    );
  };

  return (
    <KeyboardAvoidingCommentView
      ref={scrollCommentViewRef}
      contentContainerStyle={styles.scrollViewContentContainer}
      visibleComment={isVisibleComment}
      onHideComment={setIsVisibleComment}
      onSendComment={handleSendComment}
      onRefresh={handleRefresh}>
      <LoadingIndicator isLoading={isAddingComment} />
      <UserInfo profile={profileData} />
      {renderContent()}
      <IntroduceUsernameSheet
        isVisible={isVisibleIntroduceUsername}
        profile={profileData}
        onChangeUsername={handleChangeUsername}
        onClose={handleCloseIntroduceUsername}
      />
    </KeyboardAvoidingCommentView>
  );
};

export default withProfile(ProfileContent);

const useStyle = createUseStyle(({colors}) => ({
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  textBio: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginHorizontal: 16,
    marginTop: 7,
  },
  navigationContainer: {
    marginVertical: 11,
  },
  iconAction: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  collectionGuideContainer: {
    marginVertical: 50,
  },
  iconPro: {
    width: 40,
    height: 18,
    resizeMode: 'contain',
  },
}));