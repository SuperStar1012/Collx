import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import {TextInputUnit} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';

const SegmentedControl = props => {
  const {
    style,
    data,
    value,
    disabled,
    customPrefix,
    customPostfix,
    onChangeValue,
  } = props;

  const styles = useStyle();

  const handleSelect = item => {
    if (onChangeValue) {
      onChangeValue(item?.value);
    }
  };

  const handleChangeCustomValue = value => {
    if (onChangeValue) {
      onChangeValue(value);
    }
  };

  const renderItem = (item, index) => {
    const isActive = value == item.value;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.itemContainer,
          index > 0 && styles.itemLeftBorder,
          index == 0 && styles.itemLeftContainer,
          index === data.length - 1 && styles.itemRightContainer,
          isActive && styles.itemActiveContainer,
        ]}
        disabled={disabled}
        activeOpacity={0.9}
        onPress={() => handleSelect(item)}>
        <Text
          style={[
            styles.textLabel,
            isActive ? styles.textActiveLabel : styles.textInactiveLabel,
          ]}
        >
          {item?.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.listContainer}>
        {data?.map((item, index) => renderItem(item, index))}
      </View>
      <View style={styles.customContainer}>
        <Text style={styles.textCustom}>
          Custom value
        </Text>
        <TextInputUnit
          style={styles.textInputContainer}
          autoCorrect={false}
          autoCapitalize="none"
          maxLength={7}
          value={String(value)}
          editable={!disabled}
          unitPrefix={customPrefix}
          unitPostfix={customPostfix}
          onChangeText={handleChangeCustomValue}
        />
      </View>
    </View>
  );
};

SegmentedControl.defaultProps = {
  disabled: false,
  onChangeValue: () => {},
};

SegmentedControl.propTypes = {
  data: PropTypes.array.isRequired,
  value: PropTypes.any,
  disabled: PropTypes.bool,
  customPrefix: PropTypes.string,
  customPostfix: PropTypes.string,
  onChangeValue: PropTypes.func,
};

export default SegmentedControl;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primaryCardBackground,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  itemContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemActiveContainer: {
    backgroundColor: colors.primary,
  },
  itemLeftContainer: {
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
  },
  itemRightContainer: {
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
  },
  itemLeftBorder: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.lightGray,
  },
  textLabel: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  textActiveLabel: {
    color: colors.white,
  },
  textInactiveLabel: {
    color: colors.darkGrayText,
  },
  customContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  textCustom: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textInputContainer: {
    minWidth: 70,
    height: 32,
    borderRadius: 2,
    paddingHorizontal: 7,
    backgroundColor: colors.secondaryCardBackground,
  },
}));
