import React from 'react';
import {BottomTabBar} from '@react-navigation/bottom-tabs';

import {createUseStyle} from 'theme';

const TabBar = props => {
  const {state, descriptors} = props;

  const styles = useStyle();

  state.routes.map((route) => {
    const {options} = descriptors[route.key];
    options.tabBarStyle = {
      ...options.tabBarStyle,
      ...styles.tabBarContainer,
    };
  });

  return <BottomTabBar {...props} />;
};

TabBar.defaultProps = {};

TabBar.propTypes = {};

export default TabBar;

const useStyle = createUseStyle(({colors}) => ({
  tabBarContainer: {
    backgroundColor: colors.bottomBarBackground,
    borderTopColor: colors.bottomBarBorder,
  },
}));
