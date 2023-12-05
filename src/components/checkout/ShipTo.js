import React from 'react';
import {Text, View} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {
  Button,
} from 'components';
import ShipToItem from './ShipToItem';

import {Colors, Fonts, createUseStyle} from 'theme';

const ShipTo = (props) => {
  const {
    style,
    isEditable,
    onAddShippingAddress,
    onChangeShippingAddress,
  } = props;

  const styles = useStyle();

  const addressData = useFragment(graphql`
    fragment ShipTo_address on Address {
      id
      careOf
      address1
      address2
      city
      state
      postalCode
    }`,
    props.address
  );

  const handleAddAddress = () => {
    if (onAddShippingAddress) {
      onAddShippingAddress();
    }
  };

  const handleChangeAddress = () => {
    if (onChangeShippingAddress) {
      onChangeShippingAddress();
    }
  };

  const renderContent = () => {
    if (!addressData) {
      return (
        <Button
          style={styles.addButton}
          label="Add Shipping Address"
          labelStyle={styles.textAddButton}
          scale={Button.scaleSize.One}
          onPress={handleAddAddress}
        />
      );
    }

    return (
      <View style={styles.detailsContainer}>
        <ShipToItem
          name={addressData.careOf}
          address1={addressData.address1}
          address2={addressData.address2}
          city={addressData.city}
          state={addressData.state}
          postalCode={addressData.postalCode}
        />
        {isEditable ? (
          <Button
            style={styles.changeButton}
            label="Change"
            labelStyle={styles.textChangeButton}
            scale={Button.scaleSize.One}
            onPress={handleChangeAddress}
          />
        ) : null}
      </View>
    );
  };

  if (!addressData && !isEditable) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textTitle}>Ship To</Text>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </View>
  );
}

export default ShipTo;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 24,
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 15,
    lineHeight: 18,
    color: colors.primaryText,
    marginHorizontal: 16,
    marginBottom: 13,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopColor: colors.quaternaryBorder,
    borderTopWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
    borderBottomWidth: 1,
  },
  addButton: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.primary,
  },
  textAddButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    textTransform: 'capitalize',
    color: colors.primary,
  },
  changeButton: {
    width: 80,
    height: 30,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.gray,
  },
  textChangeButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    letterSpacing: -0.24,
    textTransform: 'capitalize',
    color: Colors.gray,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
