import React, {useMemo} from 'react';
import {
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import MaskedView from '@react-native-masked-view/masked-view';

import {Constants} from 'globals';
import {Colors} from 'theme';
import {hp, wp} from 'utils';

const CameraScanArea = props => {
  const {style, cardCaptureView, onLayout} = props;

  const width = useMemo(() => {
    if (cardCaptureView === Constants.cardCaptureViewFinder.normal) {
      return Platform.select({
        ios: Math.min(hp(36.2), wp(77.6)),
        android: hp(38.6),
      });
    }

    return Platform.select({
      ios: Math.min(hp(30.8), wp(66.05)),
      android: hp(32.85),
    });
  }, [cardCaptureView]);

  const height = useMemo(() => {
    return Platform.select({
      ios: Math.min(hp(51.5), wp(110.4)),
      android: hp(51.5),
    });
  }, [cardCaptureView]);

  return (
    <View
      style={styles.container}
      pointerEvents="none"
    >
      <MaskedView
        style={styles.maskContainer}
        maskElement={<View style={styles.maskElementContainer} />}
      >
        <View style={styles.horizontalCell} />
        <View style={[styles.centerContainer, {width}]}>
          <View style={styles.verticalCell} />
          <View
            style={[styles.scanAreaContainer, {width, height}, style]}
            onLayout={onLayout}
          >
            {cardCaptureView !== Constants.cardCaptureViewFinder.normal ? <View style={styles.horizontalLine} /> : null}
          </View>
          <View style={styles.verticalCell} />
        </View>
        <View style={styles.horizontalCell} />
      </MaskedView>
    </View>
  );
};

CameraScanArea.defaultProps = {
  onLayout: () => {},
};

CameraScanArea.propTypes = {
  cardCaptureView: PropTypes.string,
  onLayout: PropTypes.func,
};

export default CameraScanArea;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  maskElementContainer: {
    flex: 1,
    backgroundColor: Colors.whiteAlpha10,
  },
  centerContainer: {
    height: '100%',
  },
  scanAreaContainer: {
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: 'transparent',
  },
  horizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: hp(11),
    height: 2,
    backgroundColor: Colors.white,
  },
  horizontalCell: {
    flex: 1,
    height: '100%',
    backgroundColor: Colors.blackAlpha5,
  },
  verticalCell: {
    flex: 1,
    height: '100%',
    backgroundColor: Colors.blackAlpha5,
  },
});
