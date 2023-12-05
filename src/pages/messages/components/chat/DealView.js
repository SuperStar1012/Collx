import React from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import DealStateView from './DealStateView';
import CardUser from './CardUser';
import DealCardContent from './DealCardContent';

import {Styles} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const DealView = ({
  deal,
  user,
  cards,
  numOfCards,
  onPress,
}) => {
  const styles = useStyle();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  if (!deal) {
    return null;
  }

  return (
    <TouchableOpacity
    style={styles.container}
      activeOpacity={0.9}
      onPress={handlePress}>
      <DealStateView deal={deal} />
      <CardUser
        style={styles.userContainer}
        name={user.name}
        avatarUri={user.avatarUri}
      />
      <DealCardContent
        cards={cards}
        numOfCards={numOfCards}
      />
    </TouchableOpacity>
  );
};

DealView.defaultProps = {
  onPress: () => {},
};

DealView.propTypes = {
  name: PropTypes.string,
  onPress: PropTypes.func,
};

export default DealView;

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
  userContainer: {
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 0,
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
