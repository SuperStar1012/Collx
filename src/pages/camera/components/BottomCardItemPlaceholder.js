import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import {Colors} from 'theme';

const BottomCardItemPlaceholder = props => {
  const {style} = props;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.shimmerLeftContainer}>
        <ShimmerPlaceHolder
          shimmerStyle={styles.shimmerSetContainer}
          LinearGradient={LinearGradient}
          shimmerColors={[
            Colors.whiteAlpha1,
            Colors.whiteAlpha1,
            Colors.whiteAlpha1,
          ]}
        />
        <ShimmerPlaceHolder
          shimmerStyle={styles.shimmerNameContainer}
          LinearGradient={LinearGradient}
          shimmerColors={[
            Colors.whiteAlpha1,
            Colors.whiteAlpha1,
            Colors.whiteAlpha1,
          ]}
        />
      </View>
      <ShimmerPlaceHolder
        shimmerStyle={styles.shimmerRightContainer}
        LinearGradient={LinearGradient}
        shimmerColors={[
          Colors.whiteAlpha1,
          Colors.whiteAlpha1,
          Colors.whiteAlpha1,
        ]}
      />
    </View>
  );
};

BottomCardItemPlaceholder.defaultProps = {};

BottomCardItemPlaceholder.propTypes = {};

export default BottomCardItemPlaceholder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shimmerLeftContainer: {
    flex: 1,
    marginHorizontal: 2,
    marginVertical: 10,
  },
  shimmerSetContainer: {
    width: 110,
    height: 15,
    borderRadius: 2,
    marginVertical: 5,
  },
  shimmerNameContainer: {
    width: 147,
    height: 15,
    borderRadius: 2,
    marginVertical: 5,
  },
  shimmerRightContainer: {
    width: 82,
    height: 60,
    borderRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.whiteAlphaHalf,
  },
});
