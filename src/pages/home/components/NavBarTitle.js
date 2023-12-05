import React from 'react';

import {
  SearchBarButton,
} from 'components';

import {createUseStyle} from 'theme';

const NavBarTitle = ({
  categoryLabel,
  onSearch,
}) => {
  const styles = useStyle();

  return (
    <SearchBarButton
      style={styles.searchBar}
      placeholder={categoryLabel}
      onPress={onSearch}
    />
  );
};

export default NavBarTitle;

const useStyle = createUseStyle(() => ({
  searchBar: {
    width: '100%',
  },
}));
