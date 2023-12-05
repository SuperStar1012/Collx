import React from 'react';
import {View, Image} from 'react-native';
import PropTypes from 'prop-types';

import {withMessage} from 'store/containers';
import {Colors, createUseStyle} from 'theme';

const tabBarIcons = {
  home: {
    icon: require('assets/icons/home_fill.png'),
  },
  collection: {
    icon: require('assets/icons/square_stack_fill.png'),
  },
  search: {
    icon: require('assets/icons/search.png'),
  },
  message: {
    icon: require('assets/icons/message.png'),
  },
  profile: {
    icon: require('assets/icons/person_circle.png'),
  },
};

const TabBarIcon = props => {
  const {name, color, unreadMessageCount} = props;

  const styles = useStyle();

  const isDot = name === 'message' && unreadMessageCount > 0;

  const renderDot = () => {
    if (isDot) {
      return (
        <View style={styles.dotContainer}>
          <View style={styles.dot} />
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <Image
        source={tabBarIcons[name].icon}
        style={[styles.iconTab, {tintColor: color}]}
      />
      {renderDot()}
    </View>
  );
};

TabBarIcon.defaultProps = {};

TabBarIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default withMessage(TabBarIcon);

const useStyle = createUseStyle(({colors}) => ({
  container: {},
  iconTab: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  dotContainer: {
    padding: 2,
    borderRadius: 12,
    backgroundColor: colors.bottomBarBackground,
    position: 'absolute',
    right: 3,
    top: 3,
  },
  dot: {
    backgroundColor: Colors.red,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
}));
