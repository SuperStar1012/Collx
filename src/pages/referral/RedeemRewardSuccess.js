import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {RESULTS} from 'react-native-permissions';

import {Button} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {wp, checkContactsPermission} from 'utils';

const redeemRewardImage = require('assets/imgs/referral/redeem_reward.png');

const RedeemRewardSuccess = props => {
  const {navigation} = props;

  const styles = useStyle();

  const handleInviteMoreFriends = async () => {
    try {
      const contactsPermission = await checkContactsPermission();

      navigation.dispatch(StackActions.popToTop());

      if (contactsPermission === RESULTS.GRANTED) {
        navigation.navigate('FriendsStackScreens', {
          screen: 'FindFriends',
        });
      } else {
        navigation.navigate('FriendsStackScreens');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image style={styles.imageReferralCode} source={redeemRewardImage} />
        <Text style={styles.textTitle}>It's on the way!</Text>
        <Text style={styles.textDescription}>
          We've sent a receipt to your email and will let you know when your
          reward ships.
        </Text>
      </View>
      <Button
        style={styles.button}
        label="Invite More Friends"
        labelStyle={styles.textButton}
        scale={Button.scaleSize.One}
        onPress={handleInviteMoreFriends}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
    color: colors.primaryText,
    marginTop: 20,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginTop: 12,
    textAlign: 'center',
  },
  imageReferralCode: {
    width: wp(42),
    height: wp(42),
    resizeMode: 'contain',
  },
  button: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    color: Colors.white,
  },
}));

export default RedeemRewardSuccess;
