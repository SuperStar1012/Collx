import React, {useRef, forwardRef, useEffect, useState} from 'react';
import {StyleSheet, Platform, PixelRatio, View} from 'react-native';
import {
  Camera,
  useCameraDevice,
} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import {TapGestureHandler} from 'react-native-gesture-handler';

import {
  AllowCameraAccessSheet,
} from 'components';

import {
  useIsForeground,
  // useAvailableCameraDevice
} from 'hooks';
import {Styles} from 'globals';
import {
  checkCameraPermission,
} from 'utils';

const CameraView = forwardRef(({
  cameraWidth,
  cameraHeight,
  isPossibleCameraAllow,
  onInitialized,
  onCheckedPermission,
}, ref) => {
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActiveCamera = isFocussed && isForeground;

  // const availableCameraDevice = useAvailableCameraDevice();

  const cameraFocusPointRef = useRef({x: 0, y: 0});
  const [isVisibleCameraAccess, setIsVisibleCameraAccess] = useState(false);
  const [isHasCameraPermission, setIsHasCameraPermission] = useState(false);

  const cameraDevice = useCameraDevice('back', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera'
    ]
  });

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    // Checks Camera permission
    try {
      const isGranted = await checkCameraPermission();

      if (!isGranted) {
        setTimeout(() => {
          setIsVisibleCameraAccess(true);
        }, 500);
      } else {
        setIsHasCameraPermission(true);
        handleCloseCameraAccess();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseCameraAccess = () => {
    setIsVisibleCameraAccess(false);

    if (onCheckedPermission) {
      onCheckedPermission();
    }
  };

  const handleInitialized = () => {
    if (onInitialized) {
      onInitialized();
    }
  };

  const handleErrorCamera = error => {
    console.log('Camera Error: ', error);
  };

  const handleEndedTapGesture = async ({nativeEvent: {x, y,}}) => {
    const {x: prevX, y: prevY} = cameraFocusPointRef.current;

    if (prevX !== x || prevY !== y) {
      try {
        await ref?.current?.focus({
          x: PixelRatio.getPixelSizeForLayoutSize(x),
          y: PixelRatio.getPixelSizeForLayoutSize(y),
        });
      } catch (error) {
        console.log(error);
      }
    }

    cameraFocusPointRef.current = {x, y};
  };

  const renderCamera = () => {
    if (Platform.OS === 'android' && !isActiveCamera) {
      // TODO: Remove later. Now Android camera library has crash issue for "isActive"
      return null;
    }

    if (!isForeground || !cameraDevice) {
      return null;
    }

    if (!isHasCameraPermission) {
      return null;
    }

    return (
      <View
        style={[
          styles.container,
          Platform.select({
            ios: {
              left: 0,
              right: 0,
              bottom: 0,
            },
            android: {
              left: cameraWidth > Styles.windowWidth ? - Math.round((cameraWidth - Styles.windowWidth) / 2) : 0,
              width: cameraWidth,
              height: cameraHeight,
            },
          }),
        ]}>
        <TapGestureHandler
          enabled={isActiveCamera && cameraDevice.supportsFocus}
          shouldCancelWhenOutside={false}
          maxDurationMs={99999999}
          onEnded={handleEndedTapGesture}>
          <Camera
            ref={ref}
            style={styles.cameraContainer}
            device={cameraDevice}
            isActive={isActiveCamera}
            enableZoomGesture={true}
            zoom={cameraDevice.neutralZoom}
            photo={true}
            video={false}
            audio={false}
            orientation="portrait"
            resizeMode={
              Platform.select({
                ios: 'cover',
                android: 'contain',
              })
            }
            onInitialized={handleInitialized}
            onError={handleErrorCamera}
          />
        </TapGestureHandler>
      </View>
    );
  };

  return (
    <>
      {renderCamera()}
      <AllowCameraAccessSheet
        isVisible={isPossibleCameraAllow && isVisibleCameraAccess}
        onClose={handleCloseCameraAccess}
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
  },
  cameraContainer: {
    width: '100%',
    height: '100%',
  },
});

CameraView.displayName = 'CameraView';

export default CameraView;
