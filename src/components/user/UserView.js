import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {useFragment, graphql} from 'react-relay';

import {Image, Button} from 'components';
import ProBadge from './ProBadge';

import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';

const messageFillIcon = require('assets/icons/message_fill.png');

const UserView = ({
  style,
  profile,
  isVisibleMessage,
  onPress,
  onLayout,
  onMessage,
}) => {
  const styles = useStyle();

  const profileData = useFragment(
    graphql`
      fragment UserView_profile on Profile {
        id
        avatarImageUrl
        name
        location
        isAnonymous
        ...ProBadge_profile
      }
    `,
    profile,
  );

  const handleLayout = event => {
    const layout = event.nativeEvent.layout;
    if (onLayout) {
      onLayout(layout);
    }
  };

  const renderMessage = () => {
    if (!isVisibleMessage) {
      return null;
    }

    return (
      <Button
        style={styles.messageButton}
        icon={messageFillIcon}
        iconStyle={styles.iconMessage}
        scale={Button.scaleSize.One}
        onPress={onMessage}
      />
    );
  };

  const renderName = () => {
    if (profileData.isAnonymous || !profileData.name) {
      return null;
    }

    return (
      <Text style={styles.textName} numberOfLines={1}>
        {profileData.name}
      </Text>
    );
  };

  const renderDescription = () => {
    if (!profileData.location) {
      return null;
    }

    return (
      <Text style={styles.textDescription} numberOfLines={1}>
        {profileData.location}
      </Text>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.userContainer}
        activeOpacity={0.9}
        onLayout={handleLayout}
        onPress={onPress}>
        <Image
          style={styles.imageAvatar}
          source={profileData.avatarImageUrl || Constants.defaultAvatar}
        />
        <View style={styles.textsContentContainer}>
          <View style={styles.nameContainer}>
            {renderName()}
            <ProBadge profile={profileData} />
          </View>
          {renderDescription()}
        </View>
        {renderMessage()}
      </TouchableOpacity>
    </View>
  );
};

UserView.defaultProps = {
  isVisibleMessage: false,
  onPress: () => {},
  onLayout: () => {},
  onMessage: () => {},
};

UserView.propTypes = {
  isVisibleMessage: PropTypes.bool,
  onMessage: PropTypes.func,
  onLayout: PropTypes.func,
  onPress: PropTypes.func,
};

export default UserView;

const useStyle = createUseStyle(({colors}) => ({
  container: {},
  userContainer: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.secondaryCardBackground,
  },
  imageAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textsContentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textName: {
    flexShrink: 1,
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    marginBottom: 4,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
  },
  messageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  iconMessage: {
    width: 24,
    height: 24,
    marginLeft: 1,
    marginTop: 2,
    tintColor: Colors.white,
  },
}));
