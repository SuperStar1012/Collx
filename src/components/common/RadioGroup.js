import React from 'react';
import PropTypes from 'prop-types';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import {createUseStyle, useTheme} from 'theme';

const RadioGroup = ({
  style,
  buttonStyle,
  radioButtonStyle,
  labelStyle,
  data,
  value,
  onChangeValue,
}) => {
  const styles = useStyle();
  const {t: {colors}} = useTheme();

  const handleChangeValue = (itemValue) => {
    if (onChangeValue) {
      onChangeValue(itemValue);
    }
  };

  return (
    <RadioForm
      style={[styles.container, style]}
      animation={true}
    >
      {
        data.map((obj, index) => (
          <RadioButton
            style={[styles.button, buttonStyle]}
            labelHorizontal={true}
            key={index}
          >
            <RadioButtonInput
              obj={obj}
              index={index}
              isSelected={value === obj.value}
              borderWidth={1}
              buttonInnerColor={colors.primary}
              buttonOuterColor={colors.primary}
              buttonSize={12}
              buttonOuterSize={20}
              buttonWrapStyle={[styles.radioButtonContainer, radioButtonStyle]}
              onPress={() => handleChangeValue(obj.value)}
            />
            <RadioButtonLabel
              obj={obj}
              index={index}
              labelHorizontal={true}
              labelWrapStyle={styles.labelWrapContainer}
              labelStyle={[styles.textRadioLabel, labelStyle]}
              onPress={() => handleChangeValue(obj.value)}
            />
          </RadioButton>
        ))
      }
    </RadioForm>
  );
};

RadioGroup.defaultProps = {
  data: [],
  value: null,
  onChangeValue: () => {},
};

RadioGroup.propTypes = {
  data: PropTypes.array.isRequired,
  value: PropTypes.any,
  onChangeValue: PropTypes.func,
};

export default RadioGroup;

const useStyle = createUseStyle(({colors}) => ({
  container: {},
  button: {
    paddingVertical: 10,
  },
  radioButtonContainer: {},
  labelWrapContainer: {
    flex: 1,
  },
  textRadioLabel: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
}));
