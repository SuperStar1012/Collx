import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {Button} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';

const FollowButtonOriginal = props => {
  const {
    style,
    labelStyle,
    isAnonymousUser,
    followed,
    immediateUpdate,
    onFollow,
  } = props;

  const styles = useStyle();

  const [currentFollowed, setCurrentFollowed] = useState(followed);

  useEffect(() => {
    setCurrentFollowed(followed);
  }, [followed]);

  const handleFollow = () => {
    const value = !currentFollowed;

    if (immediateUpdate && !isAnonymousUser) {
      setCurrentFollowed(value);
    }

    if (onFollow) {
      onFollow(value);
    }
  };

  let buttonStyle = {};
  let buttonLabelStyle = {};
  let label = '';

  if (currentFollowed) {
    buttonStyle = styles.followingButton;
    buttonLabelStyle = styles.textFollowing;
    label = 'Following';
  } else {
    buttonStyle = styles.followButton;
    buttonLabelStyle = styles.textFollow;
    label = 'Follow';
  }

  return (
    <Button
      style={[styles.normalButton, buttonStyle, style]}
      label={label}
      labelStyle={[styles.textNormalButton, buttonLabelStyle, labelStyle]}
      scale={Button.scaleSize.Two}
      onPress={handleFollow}
    />
  );
};

FollowButtonOriginal.defaultProps = {
  immediateUpdate: false,
  onFollow: () => {},
};

FollowButtonOriginal.propTypes = {
  isAnonymousUser: PropTypes.bool,
  followed: PropTypes.bool,
  immediateUpdate: PropTypes.bool, // TODO: remove later
  onFollow: PropTypes.func,
};

export default FollowButtonOriginal;

const useStyle = createUseStyle(({colors}) => ({
  normalButton: {
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButton: {
    width: 80,
    backgroundColor: colors.secondaryCardBackground,
  },
  followingButton: {
    width: 100,
    backgroundColor: colors.primary,
  },
  textNormalButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  textFollow: {
    color: colors.primary,
  },
  textFollowing: {
    color: Colors.white,
  },
}));
