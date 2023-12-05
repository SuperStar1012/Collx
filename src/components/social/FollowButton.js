import React from 'react';
import {graphql, useFragment} from 'react-relay';

import {Button} from '../common';

import {useActions} from 'actions';
import {Colors, Fonts, createUseStyle} from 'theme';
import {Constants} from 'globals';

const FollowButton = React.memo(({
  style,
  labelStyle,
  viewer,
  profile,
}) => {
  const actions = useActions();
  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment FollowButton_profile on Profile {
      id
      viewer {
        amIFollowingThem
      }
    }`,
    profile
  );

  const viewerData = useFragment(graphql`
    fragment FollowButton_viewer on Viewer {
      engagement
      profile {
        isAnonymous
      }
    }`,
    viewer
  );

  let buttonStyle = styles.followButton;
  let buttonLabelStyle = styles.textFollow;
  let label = 'Follow';

  if (profileData?.viewer?.amIFollowingThem) {
    buttonStyle = styles.followingButton;
    buttonLabelStyle = styles.textFollowing;
    label = 'Following';
  }

  const handleFollow = () => {
    if (viewerData?.profile?.isAnonymous) {
      actions.navigateCreateAccount();
      return;
    }

    if (profileData.viewer.amIFollowingThem) {
      actions.stopFollowing(profileData.id);
      return;
    }

    actions.startFollowing(profileData.id);

    if (!viewerData?.engagement?.includes(Constants.userEngagement.followed)) {
      actions.addEngagement(Constants.userEngagement.followed);
    }
  };

  return (
    <Button
      style={[styles.normalButton, buttonStyle, style]}
      label={label}
      labelStyle={[styles.textNormalButton, buttonLabelStyle, labelStyle]}
      scale={Button.scaleSize.Two}
      onPress={handleFollow}
    />
  );
});

FollowButton.displayName = 'FollowButton';

export default FollowButton;

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
