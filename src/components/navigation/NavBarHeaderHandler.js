import React from 'react';
import {View} from 'react-native';

import {createUseStyle} from 'theme';

const NavBarHeaderHandler = ({
  style
}) => {
  const styles = useStyle();

  return (
    <View style={[styles.handler, style]} />
  );
};

NavBarHeaderHandler.defaultProps = {};

NavBarHeaderHandler.propTypes = {};

export default NavBarHeaderHandler;

const useStyle = createUseStyle(({colors}) => ({
  handler: {
    position: 'absolute',
    top: 10,
    height: 5,
    width: 30,
    borderRadius: 2.5,
    backgroundColor: colors.headerHandlerColor,
    alignSelf: 'center',
    zIndex: 1,
    elevation: 1,
  },
}));
