import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TextInput,
  View,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';
import states from 'states-us';

import {Button, Dropdown} from 'components';

import {Fonts, createUseStyle, useTheme} from 'theme';
import {getGooglePlaceDetails} from 'utils';

const usStates = states.map((item) => ({
  label: item.name,
  value: item.abbreviation,
}));

const ShippingAddress = props => {
  const {style, address, onChangeAddress} = props;
  const {address1, address2, city, state, postalCode} = address;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [isManualAddress, setIsManualAddress] = useState(false);
  const [minLength, setMinLength] = useState(2);
  const initializedGoogleInput = useRef(false);

  const handleChangeAddress = items => {
    const newAddress = {
      ...address,
      ...items,
    };

    onChangeAddress(newAddress);
  };

  const handleChangeAddress1 = value => {
    if (!initializedGoogleInput.current) {
      initializedGoogleInput.current = true;
      return;
    }

    handleChangeAddress({address1: value})
  };

  const handleManualAddress = () => {
    setIsManualAddress(true);
    setMinLength(1000);
  };

  const handleSelectSuggestion = (data, details = null) => {
    const parsedDetails = getGooglePlaceDetails(details);

    const newAddress = {...address};

    if (parsedDetails.address1) {
      newAddress.address1 = parsedDetails.address1;
    }

    if (parsedDetails.address2) {
      newAddress.address2 = parsedDetails.address2;
    }

    if (parsedDetails.city) {
      newAddress.city = parsedDetails.city;
    }

    if (parsedDetails.state) {
      newAddress.state = parsedDetails.state;
    }

    if (parsedDetails.zipCode) {
      newAddress.postalCode = parsedDetails.zipCode;
    }

    if (parsedDetails.country) {
      newAddress.country = parsedDetails.country;
    }

    handleChangeAddress(newAddress);
  };

  const renderManualAddress = () => {
    if (isManualAddress || !address1 || address1.length < minLength) {
      return null;
    }

    return (
      <Button
        style={styles.manualAddressButton}
        label="Enter address manually"
        labelStyle={styles.textManualAddress}
        scale={Button.scaleSize.One}
        onPress={handleManualAddress}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.itemContainer}>
        <Text style={styles.textFieldName}>ADDRESS</Text>
        <GooglePlacesAutocomplete
          styles={{
            ...googlePlacesStyles(colors),
            listView:
              !address1 || address1.length < minLength ? {height: 0} : {},
          }}
          fetchDetails
          placeholder="Address Line 1"
          enablePoweredByContainer={false}
          debounce={250}
          minLength={minLength}
          query={{
            key: Config.GOOGLE_API_KEY,
            language: 'en',
            types: 'address',
            components: 'country:us',
          }}
          textInputProps={{
            value: address1 || '',
            placeholderTextColor: colors.placeholderText,
            clearButtonMode:
              !address1 || address1.length < minLength
                ? 'never'
                : 'while-editing',
            onChangeText: handleChangeAddress1,
            onFocus: () => setIsManualAddress(false),
            onBlur: () => setIsManualAddress(true),
          }}
          listViewDisplayed={true}
          GooglePlacesDetailsQuery={{
            fields: "address_components,formatted_address",
          }}
          onPress={handleSelectSuggestion}
        />
        {renderManualAddress()}
        <TextInput
          style={styles.textFieldValue}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Address Line2 (Optional)"
          placeholderTextColor={colors.placeholderText}
          value={address2 || ''}
          underlineColorAndroid="transparent"
          onChangeText={value => handleChangeAddress({address2: value})}
        />
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.textFieldName}>CITY</Text>
        <TextInput
          style={styles.textFieldValue}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="City"
          placeholderTextColor={colors.placeholderText}
          value={city || ''}
          underlineColorAndroid="transparent"
          onChangeText={value => handleChangeAddress({city: value})}
        />
      </View>
      <View style={styles.rowContainer}>
        <View style={[styles.itemContainer, styles.rowLeftItemContainer]}>
          <Text style={styles.textFieldName}>STATE</Text>
          <Dropdown
            style={styles.dropdownContainer}
            textStyle={styles.textDropdown}
            dropDownItemTextStyle={[styles.textDropdown, styles.textDropdownItem]}
            placeholderTextColor={colors.placeholderText}
            placeholder="State"
            data={usStates}
            value={state}
            onChangedValue={value => handleChangeAddress({state: value})}
          />
        </View>
        <View style={[styles.itemContainer, styles.rowRightItemContainer]}>
          <Text style={styles.textFieldName}>ZIP</Text>
          <TextInput
            style={styles.textFieldValue}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="number-pad"
            placeholder="ZIP Code"
            placeholderTextColor={colors.placeholderText}
            value={postalCode || ''}
            underlineColorAndroid="transparent"
            onChangeText={value => handleChangeAddress({postalCode: value})}
          />
        </View>
      </View>
    </View>
  );
};

ShippingAddress.defaultProps = {
  address: {},
  onChangeAddress: () => {},
};

ShippingAddress.propTypes = {
  address: PropTypes.object,
  onChangeAddress: PropTypes.func,
};

export default ShippingAddress;

const textFieldValueStyle = {
  height: 40,
  fontWeight: Fonts.semiBold,
  fontSize: 17,
  lineHeight: 22,
  letterSpacing: -0.41,
  paddingHorizontal: 12,
  paddingVertical: 0,
  marginTop: 10,
  borderRadius: 2,
};

const useStyle = createUseStyle(({colors}) => ({
  container: {},
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLeftItemContainer: {
    flex: 1,
  },
  rowRightItemContainer: {
    flex: 1,
    marginLeft: 10,
  },
  itemContainer: {
    marginVertical: 12,
  },
  textFieldName: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
  },
  textFieldValue: {
    ...textFieldValueStyle,
    color: colors.primaryText,
    backgroundColor: colors.secondaryCardBackground,
  },
  manualAddressButton: {
    alignSelf: 'flex-start',
    marginVertical: 6,
    marginHorizontal: 13,
  },
  textManualAddress: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
  dropdownContainer: {
    width: '100%',
    height: 40,
    marginTop: 10,
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
  },
  textDropdown: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
  },
  textDropdownItem: {
    fontWeight: Fonts.normal,
  },
}));

const googlePlacesStyles = colors => ({
  container: {flex: 0},
  textInput: {
    ...textFieldValueStyle,
    color: colors.primaryText,
    backgroundColor: colors.secondaryCardBackground,
  },
  row: {
    minHeight: 0,
  },
  description: {
    justifyContent: 'center',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
  },
  separator: {
    backgroundColor: 'transparent',
  },
});
