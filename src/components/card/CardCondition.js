import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {SchemaTypes} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';

const CardCondition = props => {
  const {style, textStyle, condition, serialNumber} = props;

  const styles = useStyle();

  const isError = condition === SchemaTypes.sportCardFlag.ERR;
  if(condition === SchemaTypes.sportCardFlag.SN && !serialNumber) return null;

  return (
    <View style={[
      styles.container,
      styles.normalContainer,
      style,
    ]}>
      <Text
        style={[
          styles.textCondition,
          isError ? styles.textError : styles.textNormal,
          textStyle,
        ]}
      >
        {condition === SchemaTypes.sportCardFlag.SN ? '#/' + serialNumber : condition}
      </Text>
    </View>
  );
};

CardCondition.defaultProps = {
  isRecentGrade: false,
};

CardCondition.propTypes = {
  condition: PropTypes.string,
};

export default CardCondition;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    // width: 61,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
    borderRadius: 10,
  },
  normalContainer: {
    backgroundColor: colors.conditionBackground,
  },
  textCondition: {
    fontWeight: Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.004,
  },
  textNormal: {
    color: colors.primary,
  },
  textError: {
    color: Colors.red,
  },
}));
