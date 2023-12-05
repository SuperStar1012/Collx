import React, { useMemo } from 'react';
import {useFragment, graphql} from 'react-relay'
import {View} from 'react-native';

import {Button} from 'components';

import {createUseStyle} from 'theme';
import {SchemaTypes, Urls} from 'globals';
import {openUrl} from 'utils';

const socialExtraInfos = {
  [SchemaTypes.socialSite.INSTAGRAM]: {
    icon: require('assets/icons/social/instagram.png'),
    link: Urls.instagramUrl,
  },
  [SchemaTypes.socialSite.TIKTOK]: {
    icon: require('assets/icons/social/tiktok.png'),
    link: Urls.tiktokUrl,
  },
  [SchemaTypes.socialSite.TWITTER_BLACK]: {
    icon: require('assets/icons/social/twitter_black.png'),
    link: Urls.twitterUrl,
  },
  [SchemaTypes.socialSite.TWITTER_WHITE]: {
    icon: require('assets/icons/social/twitter_white.png'),
    link: Urls.twitterUrl,
  },
  [SchemaTypes.socialSite.FACEBOOK]: {
    icon: require('assets/icons/social/facebook_circle.png'),
    link: Urls.facebookUrl,
  },
};

const UserSocials = ({
  style,
  profile,
}) => {
  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment UserSocials_profile on Profile {
      id
      socialMedia {
        userId
        site
      }
    }`,
    profile
  );

  const socialActions = useMemo(() => {
    const actions = [];

    profileData.socialMedia?.map(item => {
      actions.push({
        ...item,
        ...socialExtraInfos[item.site],
      })
    });

    return actions;
  }, [profileData]);

  const handleAction = (item) => {
    if (!item?.link ||  !item?.userId) {
      return;
    }

    switch (item.site) {
      case SchemaTypes.socialSite.INSTAGRAM:
      case SchemaTypes.socialSite.TWITTER_BLACK:
      case SchemaTypes.socialSite.TWITTER_WHITE:
      case SchemaTypes.socialSite.FACEBOOK:
        openUrl(`${item.link}/${item.userId}`);
        break;
      case SchemaTypes.socialSite.TIKTOK:
        openUrl(`${item.link}/${item.link.charAt(0) !== '@' ? '@' : ''}${item.userId}`);
        break;
    }
  };

  if (!socialActions.length) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {socialActions.map((item, index) => (
        <Button
          key={index}
          style={styles.button}
          icon={item.icon}
          label={item.userId}
          iconStyle={styles.iconSocial}
          labelStyle={styles.textButton}
          scale={Button.scaleSize.Two}
          onPress={() => handleAction(item)}
        />
      ))}
    </View>
  );
};

export default UserSocials;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginTop: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  iconSocial: {
    width: 20,
    height: 20,
  },
  textButton: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginLeft: 12,
  },
}));
