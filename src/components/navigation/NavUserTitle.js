import React from 'react';
import {
  View,
  Text,
  TextInput,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import {Image} from '../common';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const NavUserTitle = ({
  style,
  userId,
  avatarUri,
  name,
  onChangeName
}) => {
  const styles = useStyle();

  const renderName = () => {
    if (!userId) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.textTitle}>To:</Text>
          <TextInput
            style={styles.textInput}
            autoCorrect={false}
            autoCapitalize="words"
            value={name}
            underlineColorAndroid="transparent"
            onChangeText={onChangeName}
          />
        </View>
      );
    }

    if (name) {
      return <Text style={styles.textTitle}>{name}</Text>;
    }

    return null;
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        style={styles.imageAvatar}
        source={avatarUri || Constants.defaultAvatar}
      />
      {renderName()}
    </View>
  );
};

NavUserTitle.defaultProps = {
  style: {},
  avatarUri: null,
  name: null,
};

NavUserTitle.propTypes = {
  avatarUri: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
};

export default NavUserTitle;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    left: Platform.select({
      ios: -28,
      android: -20,
    }),
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 17,
    color: colors.primaryText,
    // textTransform: 'capitalize',
    marginLeft: 9,
  },
  textInput: {
    flex: 1,
    marginLeft: 6,
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 17,
    color: colors.primaryText,
    textTransform: 'capitalize',
  },
}));
