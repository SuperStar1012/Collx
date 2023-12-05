import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {createUseStyle} from 'theme';

const creditCardIcon = require('assets/icons/credit_card_123.png');
const chevronForwardIcon = require('assets/icons/chevron_forward.png');

const AddPaymentCardItem = ({
  style,
  tabBarHeight,
  onPress,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyle();

  const handleSelect = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, !tabBarHeight && {marginBottom: insets.bottom || 20}, style]}
      activeOpacity={0.8}
      onPress={handleSelect}
    >
      <View style={styles.contentContainer}>
        <Image style={styles.iconPayment} source={creditCardIcon} />
        <Text style={styles.textValue}>Add CollX Credit/Debit Card</Text>
      </View>
      <Image style={styles.iconChevron} source={chevronForwardIcon} />
    </TouchableOpacity>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingHorizontal: 16,
    marginVertical: 20,
    backgroundColor: colors.primaryCardBackground,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPayment: {
    width: 24,
    height: 24,
    tintColor: colors.primary,
    resizeMode: 'contain',
  },
  iconChevron: {
    width: 24,
    height: 24,
    tintColor: colors.grayText,
    resizeMode: 'contain',
  },
  textValue: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginLeft: 8,
  },
}));

export default AddPaymentCardItem;
