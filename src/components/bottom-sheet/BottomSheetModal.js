import React, {useEffect, useState, forwardRef} from 'react';
import {Platform, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import {BottomSheetModal as DefaultBottomSheetModal, BottomSheetBackdrop} from '@gorhom/bottom-sheet';

import BottomModalHeader from './BottomModalHeader';

import {createUseStyle} from 'theme';
import {Styles} from 'globals';

const BottomSheetModal = forwardRef(({
  titleStyle,
  height,
  title,
  titleNumberOfLines,
  isHideHeader,
  isHideClose,
  headerLeft,
  headerRight,
  onClose,
  children,
}, ref) => {
  const styles = useStyle();

  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  const handleKeyboardWillShow = e => {
    setKeyboardHeight(e.endCoordinates.height - Styles.screenSafeBottomHeight);
  };

  const handleKeyboardWillHide = () => {
    setKeyboardHeight(0);
  };

  const handleKeyboardDidShow = e => {
    setKeyboardHeight(e.endCoordinates.height - Styles.screenSafeBottomHeight);
  };

  const handleKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  const handleClose = () => {
    ref.current?.dismiss();
    handleDismiss();
  };

  const handleDismiss = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <DefaultBottomSheetModal
      ref={ref}
      backgroundStyle={styles.bottomSheetBackgroundContainer}
      handleIndicatorStyle={styles.bottomSheetHandleIndicator}
      backdropComponent={backDropProps => (
        <BottomSheetBackdrop
          {...backDropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      snapPoints={[height + Styles.screenSafeBottomHeight + keyboardHeight]}
      onDismiss={handleDismiss}>
      {!isHideHeader ? (
        <BottomModalHeader
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
    </DefaultBottomSheetModal>
  );
});

BottomSheetModal.defaultProps = {
  title: '',
  isHideClose: false,
  onClose: () => {},
};

BottomSheetModal.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number.isRequired,
  isHideClose: PropTypes.bool,
  onClose: PropTypes.func,
};

BottomSheetModal.displayName = 'BottomSheetModal';

export default BottomSheetModal;

const useStyle = createUseStyle(({colors}) => ({
  bottomSheetBackgroundContainer: {
    backgroundColor: colors.primaryCardBackground,
  },
  bottomSheetHandleIndicator: {
    width: 30,
    height: 5,
    borderRadius: 3,
  },
}));
