import React from 'react';
import {Header, getHeaderTitle} from '@react-navigation/elements';

import {createUseStyle} from 'theme';

const NavBarDrawerHeader = props => {
  const {options, layout, route,} = props;

  const styles = useStyle();

  return (
    <Header
      {...options}
      headerStyle={{
        ...options.headerStyle,
        ...styles.headerContainer,
      }}
      headerTitleStyle={{
        ...options.headerTitleStyle,
        ...styles.textHeaderTitle,
      }}
      layout={layout}
      title={getHeaderTitle(options, route.name)}
      // headerLeft={
      //   options.headerLeft ??
      //   ((props) => <DrawerToggleButton {...props} />)
      // }
    />
);
};

NavBarDrawerHeader.defaultProps = {};

NavBarDrawerHeader.propTypes = {};

export default NavBarDrawerHeader;

const useStyle = createUseStyle(({colors}) => ({
  headerContainer: {
    backgroundColor: colors.primaryHeaderBackground,
  },
  textHeaderTitle: {
    color: colors.headerTitleColor,
  },
}));
