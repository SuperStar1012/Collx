import React, {useEffect, forwardRef, useImperativeHandle} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

import {Constants} from 'globals';

const animationSteps = [
  Constants.cardAnimationSteps.step0,
  Constants.cardAnimationSteps.step1,
  Constants.cardAnimationSteps.step2,
];

const CameraAnimatedView = forwardRef((props, ref) => {
  const {
    previewCards,
    cardCaptureMode,
    scanAreaLayout,
    listCardLayout,
    onChangedStep,
  } = props;

  const animatedFrontImageValue = useSharedValue(Constants.cardAnimationSteps.step0);
  const animatedBackImageValue = useSharedValue(Constants.cardAnimationSteps.step0);

  useEffect(() => {
    if (!previewCards[Constants.cardFrontPhoto]) {
      runOnJS(handleChangedStep)(
        Constants.cardAnimationSteps.step0,
        Constants.cardFrontPhoto,
      );

      animatedFrontImageValue.value = Constants.cardAnimationSteps.step0;
    }
  }, [previewCards[Constants.cardFrontPhoto]]);

  useEffect(() => {
    if (!previewCards[Constants.cardBackPhoto]) {
      runOnJS(handleChangedStep)(
        Constants.cardAnimationSteps.step0,
        Constants.cardBackPhoto,
      );

      animatedBackImageValue.value = Constants.cardAnimationSteps.step0;
    }
  }, [previewCards[Constants.cardBackPhoto]]);

  useImperativeHandle(ref, () => ({
    playAnimationToList,
  }));

  const playAnimationToList = (cardType) => {
    const animatedValue = cardType === Constants.cardFrontPhoto ? animatedFrontImageValue : animatedBackImageValue;

    runOnJS(handleChangedStep)(Constants.cardAnimationSteps.step0, cardType);

    animatedValue.value = Constants.cardAnimationSteps.step0;

    // Easing.easeInOutCirc
    animatedValue.value = withSequence(
      withTiming(Constants.cardAnimationSteps.step1, {duration: 300}),
      withTiming(Constants.cardAnimationSteps.step2, {duration: 300}, () => {
        runOnJS(handleChangedStep)(
          Constants.cardAnimationSteps.step2,
          cardType,
        );
      }),
    );
  };

  const handleChangedStep = (step, cardType) => {
    onChangedStep(step, cardType);
  };

  const getCardAnimatedX = cardType => {
    'worklet';
    return [
      scanAreaLayout.x,
      scanAreaLayout.x,
      Math.floor(listCardLayout[cardType].x - scanAreaLayout.width / 2 + listCardLayout[cardType].width / 2),
    ];
  };

  const getCardAnimatedY = cardType => {
    'worklet';
    return [
      scanAreaLayout.y,
      scanAreaLayout.y,
      Math.floor(listCardLayout[cardType].y - scanAreaLayout.height / 2 + listCardLayout[cardType].height / 2),
    ];
  };

  const getCardAnimatedWidth = cardType => {
    'worklet';
    return [
      1,
      (listCardLayout[cardType].width + 2) / scanAreaLayout.width || 0,
      (listCardLayout[cardType].width + 2) / scanAreaLayout.width || 0,
    ];
  };

  const getCardAnimatedHeight = cardType => {
    'worklet';
    return [
      1,
      (listCardLayout[cardType].height + 2) / scanAreaLayout.height || 0,
      (listCardLayout[cardType].height + 2) / scanAreaLayout.height || 0,
    ];
  };

  const frontCardStyle = useAnimatedStyle(() => {
    /*
      0: both front and back images move to the scan area border,
      1: a front or back image moves to center of the scan area border,
      2: a front or back image moves to bottom of the scan area border,
      3: both front or back image move to center of the scan area border,
      4: both front or back image move to bottom bar,
    */

    if (!scanAreaLayout.width || !scanAreaLayout.height) {
      return {
        left: 0,
        top: 0,
        transform: [{scaleX: 0}, {scaleY: 0}],
        opacity: 0,
      };
    }

    const cardType = Constants.cardFrontPhoto;

    // x
    const animatedX = interpolate(
      animatedFrontImageValue.value,
      animationSteps,
      getCardAnimatedX(cardType),
    );

    // y
    const animatedY = interpolate(
      animatedFrontImageValue.value,
      animationSteps,
      getCardAnimatedY(cardType),
    );

    // width
    const animatedWidth = interpolate(
      animatedFrontImageValue.value,
      animationSteps,
      getCardAnimatedWidth(cardType),
    );

    // height
    const animatedHeight = interpolate(
      animatedFrontImageValue.value,
      animationSteps,
      getCardAnimatedHeight(cardType),
    );

    return {
      left: animatedX,
      top: animatedY,
      transform: [{scaleX: animatedWidth}, {scaleY: animatedHeight}],
      opacity: previewCards[cardType] ? 1 : 0,
    };
  });

  const backCardStyle = useAnimatedStyle(() => {
    /*
      0: both front and back images move to the scan area border,
      1: a front or back image moves to center of the scan area border,
      2: a front or back image moves to bottom of the scan area border,
      3: both front or back image move to center of the scan area border,
      4: both front or back image move to bottom bar,
    */

    if (!scanAreaLayout.width || !scanAreaLayout.height) {
      return {
        left: 0,
        top: 0,
        transform: [{scaleX: 0}, {scaleY: 0}],
        opacity: 0,
      };
    }

    const cardType = Constants.cardBackPhoto;

    // x
    const animatedX = interpolate(
      animatedBackImageValue.value,
      animationSteps,
      getCardAnimatedX(cardType),
    );

    // y
    const animatedY = interpolate(
      animatedBackImageValue.value,
      animationSteps,
      getCardAnimatedY(cardType),
    );

    // width
    const animatedWidth = interpolate(
      animatedBackImageValue.value,
      animationSteps,
      getCardAnimatedWidth(cardType),
    );

    // height
    const animatedHeight = interpolate(
      animatedBackImageValue.value,
      animationSteps,
      getCardAnimatedHeight(cardType),
    );

    return {
      left: animatedX,
      top: animatedY,
      transform: [{scaleX: animatedWidth}, {scaleY: animatedHeight}],
      opacity: previewCards[cardType] ? 1 : 0,
    };
  });

  const sizeStyle = {
    width: scanAreaLayout.width, // animatedWidth,
    height: scanAreaLayout.height, // animatedHeight,
  };

  const renderFrontCard = () => {
    let frontUriSource = previewCards[Constants.cardFrontPhoto];
    if (typeof frontUriSource === 'string') {
      frontUriSource = {uri: frontUriSource};
    }

    if (!frontUriSource) {
      return null;
    }

    return (
      <Animated.Image
        style={[styles.imageAnimatedCard, sizeStyle, frontCardStyle]}
        source={frontUriSource}
      />
    );
  };

  const renderBackCard = () => {
    if (cardCaptureMode !== Constants.cardCaptureMode.bothFrontBack) {
      return null;
    }

    let backUriSource = previewCards[Constants.cardBackPhoto];
    if (typeof backUriSource === 'string') {
      backUriSource = {uri: backUriSource};
    }

    if (!backUriSource) {
      return null;
    }

    return (
      <Animated.Image
        style={[styles.imageAnimatedCard, sizeStyle, backCardStyle]}
        source={backUriSource}
      />
    );
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {renderFrontCard()}
      {renderBackCard()}
    </View>
  );
});

CameraAnimatedView.defaultProps = {
  previewCards: {},
  scanAreaLayout: {},
  listCardLayout: {},
  onChangedStep: () => {},
};

CameraAnimatedView.propTypes = {
  previewCards: PropTypes.object,
  cardCaptureMode: PropTypes.string,
  scanAreaLayout: PropTypes.object,
  listCardLayout: PropTypes.object,
  onChangedStep: PropTypes.func,
};

CameraAnimatedView.displayName = 'CameraAnimatedView';

export default CameraAnimatedView;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    elevation: 2,
  },
  imageAnimatedCard: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
});
