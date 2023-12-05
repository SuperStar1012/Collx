import React from 'react';
import {TouchableOpacity} from 'react-native';

import {
  Button,
  ShipToItem,
} from 'components';

import {createUseStyle} from 'theme';

const ellipsisIcon = require('assets/icons/ellipsis.png');

const SelectShippingAddressItem = (props) => {
  const {
    address,
    onSelect,
    onEdit,
  } = props;

  const {
    careOf,
    address1,
    address2,
    city,
    state,
    postalCode,
  } = address;

  const styles = useStyle();

  const handleSelect = () => {
    if (onSelect) {
      onSelect(address);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(address);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={handleSelect}
    >
      <ShipToItem
        name={careOf}
        address1={address1}
        address2={address2}
        city={city}
        state={state}
        postalCode={postalCode}
      />
      <Button
        style={styles.actionButton}
        icon={ellipsisIcon}
        iconStyle={styles.iconEllipsis}
        scale={Button.scaleSize.Four}
        onPress={handleEdit}
      />
    </TouchableOpacity>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 90,
    paddingHorizontal: 16,
    marginBottom: 4,
    backgroundColor: colors.primaryCardBackground,
  },
  actionButton: {
  },
  iconEllipsis: {
    width: 28,
    height: 28,
    tintColor: colors.grayText,
  },
}));

export default SelectShippingAddressItem;
