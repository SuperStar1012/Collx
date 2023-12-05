import React from 'react';

import {
  CategoryMenuButton,
} from 'components';

import {createUseStyle} from 'theme';

const NavBarLeft = ({
  categoryLabel,
  onPress,
}) => {
  const styles = useStyle();

  return (
    <CategoryMenuButton
      style={styles.navBarAction}
      label={categoryLabel}
      onPress={onPress}
    />
  );
};

export default NavBarLeft;

const useStyle = createUseStyle(() => ({
  navBarAction: {
    marginHorizontal: 11,
  },
}));
