import React from 'react';
import {View, Text} from 'react-native';

import {
  TextInputUnit,
} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {SchemaTypes} from 'globals';

const unitValues = {
  [SchemaTypes.unitOfMeasureForWeight.GRAM]: 'g',
  [SchemaTypes.unitOfMeasureForWeight.OUNCE]: 'oz',
};

const ShippingWeights = ({
  rawWeight,
  rawWeightUnit,
  isRawWeightError,
  isGradedWeightError,
  gradedWeight,
  gradedWeightUnit,
  onChangeRawWeight,
  onChangeGradedWeight,
}) => {

  const styles = useStyle();

  const handleChangeRawWeight = (text) => {
    if (onChangeRawWeight) {
      onChangeRawWeight(text);
    }
  };

  const handleChangeGradedWeight = (text) => {
    if (onChangeGradedWeight) {
      onChangeGradedWeight(text);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textSectionTitle}>Weights</Text>
      <View style={styles.itemContainer}>
        <Text style={styles.textTitle}>
          RAW (in top loader) weight
        </Text>
        <TextInputUnit
          style={[styles.textInputContainer, isRawWeightError && styles.textInputContainerError]}
          textInputStyle={isRawWeightError ? styles.textInputError : styles.textInput}
          unitStyle={styles.textInput}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="numeric"
          unitPostfix={unitValues[rawWeightUnit]}
          value={rawWeight}
          onChangeText={handleChangeRawWeight}
        />
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.textTitle}>
          Graded (slabbed) weight
        </Text>
        <TextInputUnit
          style={[styles.textInputContainer, isGradedWeightError && styles.textInputContainerError]}
          textInputStyle={isGradedWeightError ? styles.textInputError : styles.textInput}
          unitStyle={styles.textInput}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="numeric"
          unitPostfix={unitValues[gradedWeightUnit]}
          value={gradedWeight}
          onChangeText={handleChangeGradedWeight}
        />
      </View>
      {isRawWeightError || isGradedWeightError ? (
        <Text style={styles.textError}>
          Cards should be shipped with in protective materials and would rarely weigh this little. Please input a higher weight value.
        </Text>
      ) : null}
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 20,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryCardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textTitle: {
    flex: 1,
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primaryText,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    marginRight: 10,
  },
  textInputContainer: {
    width: 90,
    height: 32,
    borderRadius: 2,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: colors.secondaryCardBackground,
    backgroundColor: colors.secondaryCardBackground,
  },
  textInputContainerError: {
    borderWidth: 1,
    borderColor: Colors.red,
  },
  textInput: {
    color: colors.primaryText,
  },
  textInputError: {
    color: Colors.red,
  },
  textError: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: Colors.red,
    marginHorizontal: 16,
    marginVertical: 8,
  },
}));

export default ShippingWeights;
