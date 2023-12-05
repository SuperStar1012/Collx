/* eslint-disable no-undef */
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import Share from 'react-native-share';
import ActionSheet from 'react-native-actionsheet';
import {RESULTS} from 'react-native-permissions';

import {
  Button,
  ContactInvite,
  ReferralFriendsOriginal,
  AllowContactsAccess,
} from 'components';
import ClipboardCopy from './components/ClipboardCopy';

import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {
  getContacts,
  getReferralMessage,
  sendSms,
  sendEmail,
  getInviteOptions,
  filterInviteContacts,
  checkContactsPermission,
  encodeId,
} from 'utils';
import {withReferral} from 'store/containers';

const shareIcon = require('assets/icons/share.png');

const ReferralProgram = props => {
  const {
    navigation,
    user,
    approvedReferrals,
    hashFriends,
    getHashFriends,
    getReferrals,
  } = props;

  const [allContacts, setAllContacts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [actionSheetOptions, setActionSheetOptions] = useState([]);
  const [contactsPermission, setChecksPermission] = useState(
    RESULTS.UNAVAILABLE,
  );

  const actionSheetRef = useRef(null);
  const actionSheetContact = useRef([]);

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  useEffect(() => {
    checkContactsPermission().then(result => {
      setChecksPermission(result);
    });

    if (user?.referralCode) {
      getReferrals({
        referralCode: user.referralCode,
        status: Constants.referralStatus.approved,
        claimed: false,
      });

      getReferrals({
        referralCode: user.referralCode,
        status: Constants.referralStatus.approved,
        claimed: true,
      });
    }
  }, []);

  useEffect(() => {
    if (contactsPermission !== RESULTS.GRANTED) {
      return;
    }

    getContacts(user.email).then(result => {
      setAllContacts(result.contacts);

      if (result.emailHashes.length) {
        getHashFriends(result.emailHashes);
      }
    });
  }, [contactsPermission]);

  useEffect(() => {
    filterContacts();
  }, [hashFriends, allContacts]);

  useEffect(() => {
    if (actionSheetOptions.length > 0) {
      setTimeout(() => {
        actionSheetRef.current?.show();
      });
    }
  }, [actionSheetOptions]);

  const filterContacts = async () => {
    if (contactsPermission !== RESULTS.GRANTED) {
      return;
    }

    const filteredContacts = filterInviteContacts(allContacts, hashFriends);
    setContacts(filteredContacts);
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
    const message = getReferralMessage(user?.referralCode);

    if (contactValue.email) {
      sendEmail(contactValue.email, message);
    } else if (contactValue.number) {
      sendSms(contactValue.number, message);
    }
  };

  const handleShare = () => {
    const options = {
      message: getReferralMessage(user?.referralCode),
    };

    Share.open(options)
      .then(result => {
        if (__DEV__) {
          console.log(result);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSearchFriends = () => {
    if (contactsPermission === RESULTS.GRANTED) {
      navigation.navigate('FriendsStackScreens', {
        screen: 'FindFriends',
      });
    } else {
      navigation.navigate('FriendsStackScreens');
    }
  };

  const handleRedeemReward = () => {
    navigation.navigate('RedeemReward');
  };

  const handleReferral = referral => {
    navigation.push('Profile', {
      profileId: encodeId(Constants.base64Prefix.profile, referral.id),
    });
  };

  const renderRedeemReward = () => {
    if (approvedReferrals.length < Constants.rewardReferralCount) {
      return null;
    }

    return (
      <Button
        style={[styles.button, styles.redeemRewardButton]}
        label="Redeem Reward"
        labelStyle={styles.textButton}
        scale={Button.scaleSize.One}
        onPress={handleRedeemReward}
      />
    );
  };

  const renderReferralCode = () => (
    <>
      <Text style={styles.textSubTitle}>Your Referral Code</Text>
      <View style={styles.referralCodeContainer}>
        <ClipboardCopy
          style={styles.clipboardContainer}
          referralCode={user?.referralCode}
        />
        <Button
          style={styles.shareContainer}
          labelStyle={styles.textShare}
          label="Share"
          icon={shareIcon}
          iconStyle={styles.iconShare}
          scale={Button.scaleSize.One}
          onPress={handleShare}
        />
      </View>
    </>
  );

  const renderSuggestedReferrals = () => {
    return (
      <>
        <Text style={[styles.textSubTitle, styles.textSuggestedReferrals]}>
          Suggested Referrals
        </Text>
        <AllowContactsAccess
          style={styles.allowContactsContainer}
          permission={contactsPermission}
          isAllowAccess
          onChangePermission={permission => setChecksPermission(permission)}
        />
        {contacts.map((contact, index) => (
          <ContactInvite
            key={index}
            {...contact}
            onInvite={() => handleInvite(contact)}
          />
        ))}
      </>
    );
  };

  const renderSearchFriends = () => {
    if (contactsPermission !== RESULTS.GRANTED) {
      return;
    }

    return (
      <Button
        style={[styles.button, styles.searchFriendsButton]}
        label="Search Friends"
        labelStyle={styles.textButton}
        scale={Button.scaleSize.One}
        onPress={handleSearchFriends}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ReferralFriendsOriginal
          referrals={approvedReferrals}
          onPressReferral={handleReferral}
        />
        <View style={styles.mainContainer}>
          <Text style={styles.textTitle}>Refer 5 friends, get a free pack</Text>
          <Text style={styles.textDescription}>
            For the first 5 friends you refer that scan a card, we'll send you a
            free pack of cards.
          </Text>
          {renderRedeemReward()}
          {renderReferralCode()}
        </View>
        {renderSuggestedReferrals()}
      </ScrollView>
      {renderSearchFriends()}
      <ActionSheet
        ref={actionSheetRef}
        tintColor={colors.primaryText}
        options={actionSheetOptions}
        cancelButtonIndex={actionSheetContact.current.length}
        onPress={handleSelectAction}
      />
    </SafeAreaView>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  mainContainer: {
    paddingHorizontal: 16,
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
    color: colors.primaryText,
    textTransform: 'capitalize',
    marginTop: 14,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    marginTop: 8,
  },
  textSubTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginTop: 30,
    marginBottom: 8,
  },
  referralCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clipboardContainer: {
    flex: 2.6,
    height: 68,
  },
  shareContainer: {
    flex: 1,
    height: 68,
    flexDirection: 'column',
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginLeft: 5,
  },
  textShare: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: Colors.white,
  },
  iconShare: {
    tintColor: Colors.white,
  },
  allowContactsContainer: {
    marginVertical: 8,
  },
  textSuggestedReferrals: {
    marginHorizontal: 16,
  },
  button: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  redeemRewardButton: {
    marginTop: 12,
  },
  searchFriendsButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    color: Colors.white,
  },
}));

export default withReferral(ReferralProgram);
