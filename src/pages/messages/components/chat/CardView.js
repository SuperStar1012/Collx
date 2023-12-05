import React from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import CardUser from './CardUser';
import CardContent from './CardContent';

import {Styles} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const CardView = ({
  card,
  user,
  onPress,
}) => {
  const styles = useStyle();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  if (!card) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={handlePress}>
      <CardUser name={user.name} avatarUri={user.avatarUri} />
      <CardContent {...card} />
    </TouchableOpacity>
  );
};

CardView.defaultProps = {
  onPress: () => {},
};

CardView.propTypes = {
  name: PropTypes.string,
  onPress: PropTypes.func,
};

export default CardView;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: Styles.screenWidth - 65 * 2,
    backgroundColor: colors.secondaryHeaderBackground,
    margin: 5,
    borderWidth: 0,
    // borderColor: colors.primaryBorder,
    borderRadius: 15,
    shadowColor: colors.quaternaryBorder,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  imageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  textName: {
    flex: 1,
    fontSize: 17,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.41,
    color: colors.primaryText,
  },
}));
