import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {Button, BottomSheetModal} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {useActions} from 'actions';

const emailsIcon = require('assets/icons/more/emails.png');

const VerifyUserEmailSheet = ({
  style,
  email,
  isVisible,
  onResend,
  onClose,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const bottomSheetRef = useRef(null);

  useEffect(() => {
    if (!bottomSheetRef.current) {
      return;
    }

    if (isVisible) {
      setTimeout(() => {
        bottomSheetRef.current?.present();
      });
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleResendVerification = () => {
    handleClose();

    if (onResend) {
      onResend();
    }
  };

  const handleChangeEmail = () => {
    handleClose();

    actions.navigateEditProfile();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      height={478}
      title="Verify Your Email Address"
      onClose={handleClose}
    >
      <View style={[styles.container, style]}>
        <Image style={styles.iconEmails} source={emailsIcon} />
        <Text style={styles.textSubtitle}>
          To buy and sell cards, and message other users, you must first verify your email address.
        </Text>
        <Text style={styles.textDescription}>
          {`A verification email was sent to ${email} when you created your account.`}
        </Text>
        <Button
          style={styles.resendButton}
          scale={Button.scaleSize.One}
          onPress={handleResendVerification}
        >
          <Text style={styles.textResend}>Resend Verification Email</Text>
          <Text style={styles.textEmail}>{email}</Text>
        </Button>
        <Button
          style={styles.changeEmailButton}
          label="Change my account email"
          labelStyle={styles.textChangeEmail}
          scale={Button.scaleSize.One}
          onPress={handleChangeEmail}
        />
      </View>
    </BottomSheetModal>
  );
};

VerifyUserEmailSheet.defaultProps = {
  isVisible: false,
  onClose: () => {},
};

VerifyUserEmailSheet.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default VerifyUserEmailSheet;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  iconEmails: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  textSubtitle: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    textAlign: 'center',
    marginVertical: 20,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginVertical: 20,
  },
  resendButton: {
    width: '100%',
    height: 49,
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginVertical: 18,
  },
  textResend: {
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
    marginTop: 2,
  },
  textChangeEmail: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
}));
