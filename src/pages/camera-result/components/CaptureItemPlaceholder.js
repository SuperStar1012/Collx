import React from 'react';
import {
  View,
} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

import {Button} from 'components';

import {createUseStyle, useTheme} from 'theme';

const ellipsisIcon = require('assets/icons/ellipsis.png');

const CaptureItemPlaceholder = (props) => {
  const {style, onPressMoreActions} = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  let shimmerProps = {};

  if (colors.shimmerColors.length) {
    shimmerProps = {
      shimmerColors: colors.shimmerColors,
    };
  }

  const handleMoreAction = () => {
    if (onPressMoreActions) {
      onPressMoreActions();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View>
        <View style={styles.shimmerRowContainer}>
          <ShimmerPlaceHolder
            shimmerStyle={styles.shimmerSubTitle}
            LinearGradient={LinearGradient}
            {...shimmerProps}
          />
          <Button
            style={styles.actionButton}
            icon={ellipsisIcon}
            iconStyle={styles.iconEllipsis}
            scale={Button.scaleSize.Four}
            onPress={handleMoreAction}
          />
        </View>
        <ShimmerPlaceHolder
          shimmerStyle={styles.shimmerTitle}
          LinearGradient={LinearGradient}
          {...shimmerProps}
        />
      </View>
      <ShimmerPlaceHolder
        shimmerStyle={styles.shimmerPrice}
        LinearGradient={LinearGradient}
        {...shimmerProps}
      />
      <View style={styles.shimmerRowContainer}>
        <ShimmerPlaceHolder
          shimmerStyle={styles.shimmerGrade}
          LinearGradient={LinearGradient}
          {...shimmerProps}
        />
        <ShimmerPlaceHolder
          shimmerStyle={styles.shimmerGrade}
          LinearGradient={LinearGradient}
          {...shimmerProps}
        />
      </View>
    </View>
  );
};

CaptureItemPlaceholder.defaultProps = {};

CaptureItemPlaceholder.propTypes = {};

export default CaptureItemPlaceholder;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    height: '100%',
    marginLeft: 12,
    justifyContent: 'space-between',
    elevation: 1,
  },
  shimmerRowContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shimmerGrade: {
    width: '48%',
    height: 30,
    borderRadius: 4,
  },
  shimmerSubTitle: {
    width: '60%',
    height: 20,
    borderRadius: 2,
  },
  shimmerTitle: {
    width: '80%',
    height: 20,
    marginTop: 3,
    borderRadius: 2,
  },
  shimmerPrice: {
    width: '100%',
    height: 40,
    borderRadius: 4,
  },
  actionButton: {
    width: 40,
    height: 30,
    marginRight: -8,
    marginTop: -8,
  },
  iconEllipsis: {
    width: 28,
    height: 28,
    tintColor: colors.primary,
  },
}));
