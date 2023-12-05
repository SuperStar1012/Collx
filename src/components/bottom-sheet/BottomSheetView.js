import React, {useEffect, useRef} from 'react';
import {Platform, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import BottomSheet, {BottomSheetView as DefaultBottomSheetView} from '@gorhom/bottom-sheet';

import BottomModalHeader from './BottomModalHeader';

import {createUseStyle} from 'theme';

const BottomSheetView = ({
  titleStyle,
  snapPoints,
  title,
  titleNumberOfLines,
  isHideHeader,
  isHideClose,
  headerLeft,
  headerRight,
  onClose,
  children,
}) => {
  const styles = useStyle();

  const bottomSheetRef = useRef(null);

  useEffect(() => {
    let showSubscription = null;
    let hideSubscription = null;

    if (Platform.OS === 'android') {
      // on only Android
      showSubscription = Keyboard.addListener(
        'keyboardDidShow',
        handleKeyboardDidShow,
      );
      hideSubscription = Keyboard.addListener(
        'keyboardDidHide',
        handleKeyboardDidHide,
      );
    } else {
      // on only ios
      showSubscription = Keyboard.addListener(
        'keyboardWillShow',
        handleKeyboardWillShow,
      );
      hideSubscription = Keyboard.addListener(
        'keyboardWillHide',
        handleKeyboardWillHide,
      );
    }

    return () => {
      if (showSubscription) {
        showSubscription.remove();
      }

      if (hideSubscription) {
        hideSubscription.remove();
      }
    };
  }, []);

  const handleKeyboardWillShow = () => {
    bottomSheetRef.current?.snapToIndex(snapPoints.length - 1);
  };

  const handleKeyboardWillHide = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleKeyboardDidShow = () => {
    bottomSheetRef.current?.snapToIndex(snapPoints.length - 1);
  };

  const handleKeyboardDidHide = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleSheetChange = (index) => {
    if (index === 0) {
      Keyboard.dismiss();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      backgroundStyle={styles.backgroundContainer}
      handleIndicatorStyle={styles.handleIndicator}
      snapPoints={snapPoints}
      onChange={handleSheetChange}>
      <DefaultBottomSheetView
        style={styles.container}
      >
        {!isHideHeader ? (
          <BottomModalHeader
            style={styles.headerContainer}
            title={title}
            titleNumberOfLines={titleNumberOfLines}
            isHideClose={isHideClose}
            textStyle={titleStyle}
            headerLeft={headerLeft}
            headerRight={headerRight}
            onClose={handleClose}
          />
        ) : null}
        {children}
      </DefaultBottomSheetView>
    </BottomSheet>
  );
};

BottomSheetView.defaultProps = {
  title: '',
  isHideClose: false,
  onClose: () => {},
};

BottomSheetView.propTypes = {
  title: PropTypes.string,
  isHideClose: PropTypes.bool,
  onClose: PropTypes.func,
};

BottomSheetView.displayName = 'BottomSheetView';

export default BottomSheetView;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.primaryBackground,
  },
  handleIndicator: {
    width: 30,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.headerHandlerColor,
  },
  headerContainer: {
    backgroundColor: colors.primaryBackground,
  },
}));
