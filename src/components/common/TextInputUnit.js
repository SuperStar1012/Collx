import React, {useMemo, useRef} from 'react';
import {
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import {Fonts, createUseStyle} from 'theme';

const TextInputUnit = props => {
  const {
    style,
    textInputStyle,
    editable,
    unitStyle,
    unitPrefix,
    unitPostfix,
    value,
    placeholderTextColor,
    keyboardType = 'numeric',
    ...otherProps
  } = props;

  const styles = useStyle();

  const textInputRef = useRef(null);

  const unitColor = useMemo(() => {
    return value ?
      (StyleSheet.flatten(unitStyle)?.color || StyleSheet.flatten(textInputStyle)?.color || styles.textInput?.color)
      :
      (placeholderTextColor || styles.textUnit?.color);
  }, [value, unitStyle, textInputStyle, placeholderTextColor]);

  const handlePressText = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const renderPrefix = () => {
    if (!unitPrefix) {
      return null;
    }

    return (
      <Text style={[styles.textUnit, unitStyle, {color: unitColor}]}>
        {unitPrefix}
      </Text>
    );
  };

  const renderPostfix = () => {
    if (!unitPostfix) {
      return null;
    }

    return (
      <Text style={[styles.textUnit, unitStyle, {color: unitColor}]}>
        {unitPostfix}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={1}
      disabled={!editable}
      onPress={handlePressText}
    >
      {renderPrefix()}
      <TextInput
        ref={textInputRef}
        style={[styles.textInput, textInputStyle]}
        value={value}
        placeholderTextColor={placeholderTextColor}
        {...otherProps}
        editable={editable}
        underlineColorAndroid="transparent"
        keyboardType={keyboardType}
      />
      {renderPostfix()}
    </TouchableOpacity>
  );
};

TextInputUnit.defaultProps = {
  editable: true,
};

TextInputUnit.propTypes = {
  editable: PropTypes.bool,
  unitPrefix: PropTypes.string,
  unitPostfix: PropTypes.string,
};

export default TextInputUnit;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textUnit: {
    fontSize: 14,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginHorizontal: 5,
  },
  textInput: {
    flex: 1,
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    textAlign: 'right',
    color: colors.primaryText,
    paddingVertical: 0,
  },
}));
