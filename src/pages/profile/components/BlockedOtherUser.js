import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Fonts, createUseStyle} from 'theme';

const blockIcon = require('assets/icons/more/block.png');

const BlockedOtherUser = ({style, profile}) => {
  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment BlockedOtherUser_profile on Profile {
      name
    }`,
    profile
  );

  return (
    <View style={[styles.container, style]}>
      <Image style={styles.iconBlock} source={blockIcon} />
      <Text style={styles.textTitle}>{`${profileData.name} is blocked.`}</Text>
    </View>
  );
};

BlockedOtherUser.defaultProps = {};

BlockedOtherUser.propTypes = {};

export default BlockedOtherUser;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBlock: {
    width: 62,
    height: 62,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.primaryText,
    letterSpacing: 0.35,
    textAlign: 'center',
    marginTop: 36,
  },
}));
