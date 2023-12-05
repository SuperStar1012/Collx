import React, { useMemo } from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import {Button} from 'components';

import {Fonts, createUseStyle, useTheme} from 'theme';

const helpIcon = require('assets/icons/question_square.png');

const OnboardingCheckItem = ({
  style,
  isCurrentStep,
  isChecked,
  label,
  value,
  onPress,
  onHelp,
}) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const checkColors = useMemo(() => {
    if (isChecked) {
      return ({
        color: colors.grayText,
        borderColor: colors.primary,
        fontWeight: Fonts.semiBold,
      });
    } else if (isCurrentStep) {
      return ({
        color: colors.primary,
        borderColor: colors.primary,
        fontWeight: Fonts.bold,
      });
    }

    return ({
      color: colors.grayText,
      borderColor: colors.grayText,
      fontWeight: Fonts.semiBold,
    });
  }, [colors]);

  const handlePress = () => {
    if (onPress) {
      onPress(value);
    }
  };

  const handleHelp = () => {
    if (onHelp) {
      onHelp(value);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <BouncyCheckbox
        disabled
        disableText
        disableBuiltInState
        isChecked={isChecked}
        iconStyle={[styles.iconCheck, {borderColor: checkColors.borderColor}]}
        innerIconStyle={[styles.iconCheck, {borderColor: checkColors.borderColor}]}
        fillColor={colors.primary}
      />
      <Button
        style={styles.labelButton}
        disabled={isChecked}
        labelStyle={[
          styles.textLabel,
          {
            color: checkColors.color,
            fontWeight: checkColors.fontWeight,
          },
        ]}
        label={label}
        scale={Button.scaleSize.Two}
        numberOfLines={1}
        onPress={handlePress}
      />
      {isCurrentStep ? (
        <Button
          style={styles.helpButton}
          iconStyle={styles.iconHelp}
          icon={helpIcon}
          onPress={handleHelp}
        />
      ) : null}
    </View>
  );
};

OnboardingCheckItem.defaultProps = {
  onPress: () => {},
  onHelp: () => {},
};

OnboardingCheckItem.propTypes = {
  isChecked: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.string,
  onPress: PropTypes.func,
  onHelp: PropTypes.func,
};

export default OnboardingCheckItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelButton: {
    flexShrink: 1,
    marginLeft: 9,
    justifyContent: 'flex-start',
  },
  textLabel: {
    fontSize: 13,
    lineHeight: 25,
    letterSpacing: -0.052,
    textDecorationLine: 'none',
  },
  iconCheck: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  helpButton: {
    paddingHorizontal: 4,
  },
  iconHelp: {
    width: 24,
    height: 24,
    tintColor: colors.primary,
  },
}));
