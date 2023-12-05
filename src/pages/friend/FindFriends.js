import React, {useEffect, useState, useRef} from 'react';
import {View, Text} from 'react-native';
import {RESULTS} from 'react-native-permissions';
import ActionSheet from 'react-native-actionsheet';
import {StackActions, CommonActions} from '@react-navigation/native';

import {
  LoadingIndicator,
  SearchBar,
  KeyboardAvoidingSectionList,
  Button,
  ProgressStep,
  AllowContactsAccess,
  ContactInvite,
  ReferralProgramWidgetOriginal,
  FooterIndicator,
} from 'components';
import FriendFollowItem from './components/FriendFollowItem';

import ActionContext, {useActions} from 'actions';
import {Constants, Styles, Urls} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {withFriend} from 'store/containers';
import {
  getContacts,
  sendSms,
  sendEmail,
  getInviteOptions,
  filterInviteContacts,
  checkContactsPermission,
  encodeId,
} from 'utils';
import {
  analyticsEvents,
  analyticsSendEvent,
  analyticsValues,
} from 'services';
import {usePrevious} from 'hooks';

const nextButtonHeight = 48;
const nextButtonMargin = 12;

const FindFriends = ({
  navigation,
  route,
  user,
  isFetching,
  friends,
  topFriends,
  hashFriends,
  approvedReferrals,
  claimedReferrals,
  isAuthenticated,
  isCompletedSignUp,
  isFetchingReferral,
  getFriends,
  getTopFriends,
  getHashFriends,
  setFollow,
  signUpComplete,
  resetSignUp,
  // getReferrals,
}) => {
  const {isSignUp = false, isAnonymousUser} = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [searchText, setSearchText] = useState(null);
  const [searchInMode, setSearchInMode] = useState(false);
  const [allFriends, setAllFriends] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactsPermission, setChecksPermission] = useState(
    RESULTS.UNAVAILABLE,
  );

  const [isInitReferral, setIsInitReferral] = useState(false);

  const [actionSheetOptions, setActionSheetOptions] = useState([]);

  const offsetRef = useRef(0);
  const actionSheetRef = useRef(null);
  const actionSheetContact = useRef([]);

  const actions = useActions();
  const prevProps = usePrevious({isFetchingReferral});

  const buttonMarginBottom = Styles.screenSafeBottomHeight || nextButtonMargin;

  useEffect(() => {
    setNavigationBar();

    getTopFriends({
      limit: Constants.topUsersFetchLimit,
    });

    checkContactsPermission().then(result => {
      setChecksPermission(result);
    });

    // Gets referrals
    // if (user?.referralCode) {
    //   getReferrals({
    //     referralCode: user.referralCode,
    //     status: Constants.referralStatus.approved,
    //     claimed: false,
    //   });

    //   getReferrals({
    //     referralCode: user.referralCode,
    //     status: Constants.referralStatus.approved,
    //     claimed: true,
    //   });
    // }
  }, []);

  useEffect(() => {
    if (isAuthenticated && isCompletedSignUp) {
      if (isAnonymousUser) {
        navigation.dispatch(StackActions.popToTop());
        navigation.goBack();
      }

      actions.updateProfileInLocal(user);

      analyticsSendEvent(
        analyticsEvents.completedRegistration,
        {
          auth_method: analyticsValues.email,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      );

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'MainHomeStackScreens'}],
        }),
      );

      setTimeout(() => {
        resetSignUp();
      }, 500);
    }
  }, [isAuthenticated, isCompletedSignUp]);

  useEffect(() => {
    if (searchInMode && (!searchText || searchText.startsWith(' '))) {
      return;
    }

    getInitialCurrentFriends();
  }, [searchText]);

  useEffect(() => {
    if (contactsPermission !== RESULTS.GRANTED) {
      return;
    }

    getContacts(user.email).then(result => {
      setContacts(result.contacts);

      if (result.emailHashes.length) {
        getHashFriends(result.emailHashes);
      }
    });
  }, [contactsPermission]);

  useEffect(() => {
    filterContacts();
  }, [topFriends, hashFriends, friends, contacts, searchInMode]);

  useEffect(() => {
    if (actionSheetOptions.length > 0) {
      setTimeout(() => {
        actionSheetRef.current?.show();
      });
    }
  }, [actionSheetOptions]);

  useEffect(() => {
    if (prevProps?.isFetchingReferral && !isFetchingReferral) {
      setIsInitReferral(true);
    }
  }, [isFetchingReferral]);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: isSignUp ? 'Sign Up' : 'Find Your Friends',
    });
  };

  const filterContacts = async () => {
    if (searchInMode) {
      const isEmpty = !searchText || searchText.startsWith(' ');

      setAllFriends([
        {
          title: '',
          data: isEmpty ? [] : friends,
        },
      ]);
      return;
    }

    const data = [];
    if (contactsPermission === RESULTS.GRANTED) {
      if (hashFriends?.length) {
        data.push({
          title: 'Friends on CollX',
          data: hashFriends,
        });
      }

      const filteredContacts = filterInviteContacts(contacts, hashFriends);

      if (filteredContacts?.length) {
        data.push({
          title: 'Invite to CollX',
          data: filteredContacts,
        });
      }
    } else if (topFriends?.length) {
      data.push({
        title: 'Top Users',
        data: topFriends,
      });
    }

    setAllFriends(data);
  };

  const getInitialCurrentFriends = () => {
    offsetRef.current = 0;
    getCurrentFriends();
  };

  const getCurrentFriends = () => {
    if (isFetching) {
      return;
    }

    const searchQuery = searchText ? {q: searchText} : {};
    const fetchLimit = searchInMode
      ? Constants.defaultFetchLimit
      : Constants.friendsFetchLimit;

    getFriends({
      offset: offsetRef.current * fetchLimit,
      limit: fetchLimit,
      ...searchQuery,
    });

    offsetRef.current += 1;
  };

  const handleChangeSearch = value => {
    setSearchText(value);
  };

  const handleDelete = () => {
    setSearchText('');
  };

  const handleCancel = () => {
    setSearchInMode(false);
    setSearchText('');
  };

  const handleFocus = () => {
    setSearchInMode(true);
  };

  const handleBlur = () => {
    // setSearchInMode(false);
  };

  const handleFollow = (item, isWillFollow) => {
    if (!user || user.anonymous) {
      navigation.navigate('AuthStackModal', {
        screen: 'CreateAccount',
        params: {
          variant: Constants.createAccountVariant.continue,
        },
      });
      return;
    }

    setFollow({userId: item.id, enabled: isWillFollow});

    if (isWillFollow) {
      actions.addEngagement(Constants.userEngagement.followed);
    }
  };

  const handlePressFriend = item => {
    navigation.push('Profile', {
      profileId: encodeId(Constants.base64Prefix.profile, item.id),
    });
  };

  const handleInvite = async item => {
    actionSheetContact.current = getInviteOptions(item);
    if (!actionSheetContact.current.length) {
      return;
    }

    const options = actionSheetContact.current.map(
      option => `${option.email || option.number} (${option.label})`,
    );
    options.push('Cancel');

    setActionSheetOptions(options);
  };

  const handleSelectAction = index => {
    if (index > actionSheetContact.current.length - 1) {
      return;
    }

    const contactValue = actionSheetContact.current[index];
    if (contactValue.email) {
      sendEmail(contactValue.email);
    } else if (contactValue.number) {
      sendSms(contactValue.number);
    }
  };

  const handleClaimReferralReward = () => {
    navigation.navigate('ReferralProgramStackScreens', {
      screen: 'RedeemReward',
    });
  };

  const handleOpenReferralProgram = () => {
    navigation.navigate('ReferralProgramStackScreens');
  };

  const handlePressReferral = referral => {
    navigation.push('Profile', {
      profileId: encodeId(Constants.base64Prefix.profile, referral.id),
    });
  };

  const handleEndReached = ({distanceFromEnd}) => {
    if (distanceFromEnd <= 0) {
      return;
    }

    if (searchInMode) {
      getCurrentFriends();
    }
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('CommonStackModal', {
      screen: 'WebViewer',
      params: {
        title: 'Privacy Policy',
        url: Urls.privacyUrl,
      },
    });
  };

  const handleNext = () => {
    signUpComplete();
  };

  const renderProgressBar = () => {
    if (!isSignUp) {
      return null;
    }

    return (
      <ProgressStep
        style={styles.progressStepContainer}
        currentStep={Constants.authProgressSteps}
        totalSteps={Constants.authProgressSteps}
      />
    );
  };

  const renderNext = () => {
    if (!isSignUp) {
      return null;
    }

    return (
      <Button
        style={[
          styles.nextButton,
          {
            marginBottom: buttonMarginBottom,
          },
        ]}
        label="Next"
        labelStyle={styles.textNext}
        scale={Button.scaleSize.One}
        onPress={handleNext}
      />
    );
  };

  const renderSectionHeader = ({section}) => {
    if (!section.title) {
      return null;
    }

    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.textSectionHeaderTitle}>{section.title}</Text>
      </View>
    );
  };

  const renderItem = ({item, section}) => {
    if (section.title.includes('Invite')) {
      return <ContactInvite {...item} onInvite={() => handleInvite(item)} />;
    }

    return (
      <FriendFollowItem
        {...item}
        isAnonymousUser={user?.anonymous}
        onFollow={isWillFollow => handleFollow(item, isWillFollow)}
        onPress={() => handlePressFriend(item)}
      />
    );
  };

  const renderFooter = () => (
    <FooterIndicator isLoading={!!allFriends.length && isFetching} />
  );

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <LoadingIndicator isLoading={isFetchingReferral} />
        {renderProgressBar()}
        {!isSignUp && isInitReferral ? (
          <ReferralProgramWidgetOriginal
            style={styles.referralContainer}
            isVisible={!claimedReferrals?.length}
            referrals={approvedReferrals}
            onClaimReward={handleClaimReferralReward}
            onOpenProgram={handleOpenReferralProgram}
            onPressReferral={handlePressReferral}
          />
        ) : null}
        {contactsPermission === RESULTS.GRANTED ? (
          <SearchBar
            style={styles.searchBar}
            placeholder="Find Friends"
            onChangeText={handleChangeSearch}
            onDelete={handleDelete}
            onCancel={handleCancel}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : null}
        <KeyboardAvoidingSectionList
          contentContainerStyle={{paddingBottom: Styles.screenSafeBottomHeight || 0}}
          scrollIndicatorInsets={{right: 1}}
          keyboardShouldPersistTaps="handled"
          bottomOffset={isSignUp ? buttonMarginBottom + nextButtonHeight + nextButtonHeight : Styles.screenSafeBottomHeight || 0}
          sections={allFriends}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          renderSectionHeader={renderSectionHeader}
          onEndReachedThreshold={0.2}
          onEndReached={handleEndReached}
        />
        <AllowContactsAccess
          permission={contactsPermission}
          onChangePermission={permission => setChecksPermission(permission)}
          onPrivacyPolicy={handlePrivacyPolicy}
        />
        {renderNext()}
        <ActionSheet
          ref={actionSheetRef}
          tintColor={colors.primaryText}
          options={actionSheetOptions}
          cancelButtonIndex={actionSheetContact.current.length}
          onPress={handleSelectAction}
        />
      </View>
    </ActionContext.Provider>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  progressStepContainer: {
    marginBottom: 0,
  },
  referralContainer: {
    marginTop: 16,
  },
  searchBar: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  sectionHeaderContainer: {
    paddingHorizontal: 19,
    paddingVertical: 12,
    borderBottomWidth: 1,
    backgroundColor: colors.primaryBackground,
    borderBottomColor: colors.secondaryBorder,
  },
  textSectionHeaderTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    textTransform: 'capitalize',
    color: colors.primaryText,
  },
  nextButton: {
    height: nextButtonHeight,
    borderRadius: 10,
    marginTop: nextButtonMargin,
    marginBottom: nextButtonMargin,
    marginHorizontal: 16,
    backgroundColor: colors.primary,
  },
  textNext: {
    fontWeight: Fonts.semiBold,
    color: Colors.white,
  },
}));

export default withFriend(FindFriends);
