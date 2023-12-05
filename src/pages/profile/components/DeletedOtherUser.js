import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';

import {Fonts, createUseStyle} from 'theme';

const deleteIcon = require('assets/icons/more/delete.png');

const DeletedOtherUser = ({style}) => {
  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <Image style={styles.iconBlock} source={deleteIcon} />
      <Text style={styles.textTitle}>This account is deleted</Text>
    </View>
  );
};

DeletedOtherUser.defaultProps = {};

DeletedOtherUser.propTypes = {};

export default DeletedOtherUser;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBlock: {
    width: 68,
    height: 68,
    resizeMode: 'contain',
    tintColor: colors.lightGrayText,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.primaryText,
    letterSpacing: 0.35,
    textAlign: 'center',
    marginTop: 24,
  },
}));
