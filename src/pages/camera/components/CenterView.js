import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {BlurView, SegmentedControl} from 'components';
import CameraScanArea from './ScanArea';

import {Constants} from 'globals';
import {Colors} from 'theme';

const captureModes = [
  {
    label: 'Front Only',
    value: Constants.cardCaptureMode.frontOnly,
  },
  {
    label: 'Front & Back',
    value: Constants.cardCaptureMode.bothFrontBack,
  },
];

const CameraCenterView = props => {
  const {
    style,
    rootViewRef,
    cardCaptureMode,
    cardCaptureView,
    onChangeCaptureMode,
    onLayoutScanArea,
  } = props;

  const handleLayoutScanArea = ({target}) => {
    target.measureLayout(rootViewRef.current, (x, y, width, height) => {
      onLayoutScanArea({x, y, width, height});
    });
  };

  const handleChangeCaptureMode = (index) => {
    onChangeCaptureMode(captureModes[index].value);
  };

  return (
    <View
      style={[styles.container, style]}
      pointerEvents="box-none"
    >
      <CameraScanArea
        cardCaptureView={cardCaptureView}
        onLayout={handleLayoutScanArea}
      />
      <View style={styles.controlsContainer}>
        <View style={styles.captureModeContainer}>
          <BlurView />
          <SegmentedControl
            segmentLabels={captureModes.map(item => item.label)}
            movingSegmentMargin={4}
            selectedIndex={captureModes.findIndex(item => item.value === cardCaptureMode)}
            onChange={handleChangeCaptureMode}
          />
        </View>
      </View>
    </View>
  );
};

CameraCenterView.defaultProps = {
  onChangeCaptureMode: () => {},
  onLayoutScanArea: () => {},
};

CameraCenterView.propTypes = {
  rootViewRef: PropTypes.object.isRequired,
  cardCaptureMode: PropTypes.string,
  cardCaptureView: PropTypes.string,
  onChangeCaptureMode: PropTypes.func,
  onLayoutScanArea: PropTypes.func,
};

export default CameraCenterView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
    backgroundColor: Colors.blackAlpha5,
  },
  captureModeContainer: {
    width: 240,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
