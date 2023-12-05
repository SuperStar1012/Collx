import React, {useRef, useEffect, useMemo} from 'react';
import {
  Text,
  Image,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import SelectDropdown from 'react-native-select-dropdown';

import {createUseStyle} from 'theme';

const triangleIcon = require('assets/icons/arrow_triangle_down.png');
const checkIcon = require('assets/icons/check.png');

const Dropdown = props => {
  const {
    style,
    dropDownContainerStyle,
    dropDownItemStyle,
    dropDownItemTextStyle,
    textStyle,
    placeholder,
    placeholderTextColor,
    data,
    value,
    disabled,
    onChangedValue,
  } = props;

  const styles = useStyle();

  const selectDropdownRef = useRef(null);

  const defaultText = data?.find(item => item.value === value)?.label;

  const placeholderColor = useMemo(
    () => (placeholderTextColor || styles.textPlaceholder.color),
    [placeholderTextColor]
  );

  useEffect(() => {
    if (selectDropdownRef.current) {
      selectDropdownRef.current.reset();
    }
  }, [data]);

  useEffect(() => {
    if (selectDropdownRef.current) {
      selectDropdownRef.current.reset();
    }
  }, [value]);

  const handleSelect = item => {
    if (onChangedValue) {
      onChangedValue(item.value);
    }
  };

  const renderDropdownIcon = isOpened => (
    <Image
      style={[styles.iconArrow, isOpened && styles.iconArrowUp]}
      source={triangleIcon}
    />
  );

  const renderIcon = item => {
    if (!item.icon) {
      return;
    }

    let tintColor = styles.icon.tintColor;
    if (dropDownItemTextStyle?.color) {
      tintColor = dropDownItemTextStyle.color;
    } else if (textStyle?.color) {
      tintColor = textStyle.color;
    }

    return <Image style={[styles.icon, {tintColor}]} source={item.icon} />;
  };

  const renderCheckIcon = item => {
    if (item.value === value) {
      return <Image style={styles.iconCheck} source={checkIcon} />;
    }

    return null;
  };

  const renderRowItem = item => {
    return (
      <View style={styles.rowItemContainer}>
        {renderIcon(item)}
        <Text
          style={[styles.textRowItem, textStyle, dropDownItemTextStyle]}
          numberOfLines={1}>
          {item.label}
        </Text>
        {renderCheckIcon(item)}
      </View>
    );
  };

  if (!data || !data.length) {
    return null;
  }

  let buttonStyle = {};
  if (disabled) {
    buttonStyle = styles.disabledButton;
  }

  return (
    <SelectDropdown
      ref={selectDropdownRef}
      buttonStyle={{...styles.button, ...buttonStyle, ...style, }}
      buttonTextStyle={{
        ...styles.textButton,
        ...textStyle,
        ...(!value ? {color: placeholderColor} : {}),
      }}
      dropdownStyle={{...styles.dropDownContainer, ...dropDownContainerStyle}}
      rowStyle={{...styles.dropDownRowContainer, ...dropDownItemStyle}}
      defaultButtonText={defaultText || placeholder}
      data={data}
      defaultValue={value}
      disabled={disabled}
      onSelect={handleSelect}
      buttonTextAfterSelection={item => item.label}
      rowTextForSelection={item => item}
      renderDropdownIcon={renderDropdownIcon}
      renderCustomizedRowChild={renderRowItem}
    />
  );
};

Dropdown.defaultProps = {
  disabled: false,
  onChangedValue: () => {},
};

Dropdown.propTypes = {
  placeholder: PropTypes.string,
  data: PropTypes.array,
  value: PropTypes.any,
  disabled: PropTypes.bool,
  onChangedValue: PropTypes.func,
};

export default Dropdown;

const useStyle = createUseStyle(({colors}) => ({
  button: {
    width: 140,
    height: 30,
    borderWidth: 0,
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
  },
  textButton: {
    fontSize: 15,
    letterSpacing: -0.24,
    color: colors.primaryText,
    textAlign: 'left',
    marginHorizontal: 0,
  },
  iconArrow: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  iconArrowUp: {
    transform: [{rotate: '180deg'}],
  },
  dropDownContainer: {
    backgroundColor: colors.secondaryCardBackground,
    borderWidth: 1,
    borderColor: colors.tertiaryBorder,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  dropDownRowContainer: {
    height: 36,
    borderBottomWidth: 0,
    paddingHorizontal: 8,
  },
  rowItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textRowItem: {
    flex: 1,
    fontSize: 15,
    letterSpacing: -0.24,
    color: colors.primaryText,
    textAlign: 'left',
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 15,
    tintColor: colors.primaryText,
  },
  iconCheck: {
    width: 17,
    height: 17,
    tintColor: colors.primary,
  },
  textPlaceholder: {
    color: colors.darkGrayText,
  },
  disabledButton: {
    opacity: 0.6,
  },
}));
