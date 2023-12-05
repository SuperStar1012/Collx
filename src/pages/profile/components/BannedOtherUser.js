import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';

import {Fonts, createUseStyle} from 'theme';
import {Urls} from 'globals';
import {useActions} from 'actions';

const exclamationCircleIcon = require('assets/icons/exclamation_circle.png');

const BannedOtherUser = ({style}) => {
  const styles = useStyle();
  const actions = useActions();

  const handleCommunityGuidelines = () => {
    actions.navigateWebViewer({
      title: 'Community Guidelines',
      url: Urls.communityGuidelinesUrl
    })
  };

  return (
    <View style={[styles.container, style]}>
      <Image style={styles.iconBlock} source={exclamationCircleIcon} />
      <Text style={styles.textTitle}>This account is banned</Text>
      <Text style={styles.textDescription}>This account was banned due to violations of our <Text style={styles.textCommunityGuidelines} onPress={handleCommunityGuidelines}>Community Guidelines</Text>.</Text>
    </View>
  );
};

BannedOtherUser.defaultProps = {};

BannedOtherUser.propTypes = {};

export default BannedOtherUser;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBlock: {
    width: 80,
    height: 80,
    tintColor: colors.lightGrayText,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.primaryText,
    letterSpacing: 0.35,
    textAlign: 'center',
    marginTop: 10,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.darkGrayText,
    letterSpacing: -0.24,
    textAlign: 'center',
    marginTop: 10,
  },
  textCommunityGuidelines: {
    color: colors.primary,
  },
}));
