import React, {useEffect, useRef } from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {Button, BottomSheetModal} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';

const IntroduceUsernameSheet = ({
  style,
  isVisible,
  profile,
  onChangeUsername,
  onClose,
}) => {
  const styles = useStyle();

  const bottomSheetRef = useRef(null);

  const profileData = useFragment(graphql`
    fragment IntroduceUsernameSheet_profile on Profile {
      username
    }`,
    profile
  );

  if (!profileData.username) {
    return null;
  }

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

  const handleChangeUsername = () => {
    handleClose();

    if (onChangeUsername) {
      onChangeUsername();
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      height={495}
      title="Introducing Username"
      onClose={handleClose}
    >
      <View style={[styles.container, style]}>
        <Text style={styles.textDescription}>
          {'We are introducing usernames to make it easier for members of the community to find and connect with each other. \n\nKeep in mind that usernames are unique to each user, so once a username has been chosen, it can’t be selected by anyone else. \n\nWe’ve reserved the username below for you based on your full name. If you want a different one, you can change it.'}
        </Text>
        <View style={styles.usernameContainer}>
          <Text style={styles.textUsername}>{profileData.username}</Text>
        </View>
        <Button
          style={styles.gotItButton}
          label="Got It"
          labelStyle={styles.textGotIt}
          scale={Button.scaleSize.One}
          onPress={handleClose}
        />
        <Button
          style={styles.changeUsernameButton}
          label="Change my username"
          labelStyle={styles.textChangeUsername}
          scale={Button.scaleSize.One}
          onPress={handleChangeUsername}
        />
      </View>
    </BottomSheetModal>
  );
};

IntroduceUsernameSheet.defaultProps = {
  isVisible: false,
  onClose: () => {},
};

IntroduceUsernameSheet.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default IntroduceUsernameSheet;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    paddingHorizontal: 16,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginHorizontal: 16,
  },
  usernameContainer: {
    height: 54,
    borderRadius: 6,
    marginTop: 16,
    backgroundColor: colors.secondaryCardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textUsername: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.41,
    color: colors.primaryText,
  },
  gotItButton: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginTop: 22,
  },
  textGotIt: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    textTransform: 'capitalize',
    color: Colors.white,
  },
  changeUsernameButton: {
    marginTop: 16,
  },
  textChangeUsername: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
}));
