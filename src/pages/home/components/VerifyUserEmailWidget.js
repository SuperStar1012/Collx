import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {Button} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {useActions} from 'actions';

const VerifyUserEmailWidget = ({
  style,
  profile,
  onVerifyEmail,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const profileData = useFragment(graphql`
    fragment VerifyUserEmailWidget_profile on Profile {
      email,
      viewer {
        isMyEmailVerified
      }
    }`,
    profile
  );

  const {isMyEmailVerified} = profileData?.viewer || {};

  if (!profileData || isMyEmailVerified) {
    return null;
  }

  const handleVerifyEmail = () => {
    if (onVerifyEmail) {
      onVerifyEmail();
    }
  };

  const handleChangeEmail = () => {
    actions.navigateEditProfile();
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textTitle}>
        Verify Your Email Address
      </Text>
      <Text style={styles.textDescription}>
        To ensure you are notified from CollX about updates, card offers, and transactions, please verify your email with us.
      </Text>
      <Button
        style={styles.verifyEmail}
        scale={Button.scaleSize.One}
        onPress={handleVerifyEmail}
      >
        <Text style={styles.textVerifyEmail}>Verify Email</Text>
        <Text style={styles.textEmail}>{profileData.email}</Text>
      </Button>
      <Button
        style={styles.changeEmailButton}
        label="Change account email"
        labelStyle={styles.textChangeEmail}
        scale={Button.scaleSize.One}
        onPress={handleChangeEmail}
      />
    </View>
  );
};

VerifyUserEmailWidget.defaultProps = {
  onVerifyEmail: () => {},
};

VerifyUserEmailWidget.propTypes = {
  onVerifyEmail: PropTypes.func,
};

export default VerifyUserEmailWidget;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.primaryCardBackground,
  },
  textTitle: {
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    textAlign: 'center',
    marginVertical: 8,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginVertical: 8,
  },
  verifyEmail: {
    width: '100%',
    height: 49,
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginVertical: 8,
  },
  textVerifyEmail: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    textTransform: 'capitalize',
    color: Colors.white,
  },
  textEmail: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: Colors.softGray,
  },
  changeEmailButton: {
    marginTop: 8,
  },
  textChangeEmail: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
}));
