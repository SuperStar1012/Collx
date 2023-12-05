import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';

import {createUseStyle, useTheme} from 'theme';

const ProgressStep = props => {
  const {
    style,
    textStyle,
    title,
    borderWidth,
    color,
    unfilledColor,
    currentStep,
    totalSteps,
  } = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const renderTitle = () => {
    if (!title) {
      return null;
    }

    return (
      <Text style={[styles.textTitle, styles.textDescription, textStyle]}>
        {title}
      </Text>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderTitle()}
      <View style={styles.progressContainer}>
        <Progress.Bar
          style={styles.progressBar}
          width={null}
          progress={currentStep / totalSteps}
          borderWidth={borderWidth}
          unfilledColor={unfilledColor || colors.secondaryCardBackground}
          color={color || colors.primary}
        />
        <Text style={[styles.textDescription, textStyle]}>
          {`${currentStep} of ${totalSteps}`}
        </Text>
      </View>
    </View>
  );
};

ProgressStep.defaultProps = {
  title: null,
  currentStep: 0,
  totalSteps: 0,
  borderWidth: 0,
  // color: Colors.lightBlue,
  // unfilledColor: Colors.softGray,
};

ProgressStep.propTypes = {
  title: PropTypes.string,
  currentStep: PropTypes.number,
  totalSteps: PropTypes.number,
  borderWidth: PropTypes.number,
  color: PropTypes.string,
  unfilledColor: PropTypes.string,
};

export default ProgressStep;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    margin: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    marginRight: 10,
  },
  textTitle: {
    marginBottom: 6,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
  },
}));
