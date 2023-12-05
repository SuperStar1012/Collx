import React from 'react';
import {Header} from '@react-navigation/stack';

import NavBarHeaderHandler from './NavBarHeaderHandler';

import {createUseStyle} from 'theme';

const NavBarModalHeader = ({
  handlerStyle,
  ...otherProps
}) => {
  const styles = useStyle();

  return (
    <>
      <NavBarHeaderHandler style={handlerStyle} />
      <Header
        {...otherProps}
        options={{
          ...otherProps.options,
          headerStyle: {
            ...otherProps.options.headerStyle,
            ...styles.headerContainer,
          }
        }}
      />
    </>
  );
};

NavBarModalHeader.defaultProps = {};

NavBarModalHeader.propTypes = {};

export default NavBarModalHeader;

const useStyle = createUseStyle(({colors}) => ({
  headerContainer: {
    backgroundColor: colors.primaryHeaderBackground,
  },
}));
