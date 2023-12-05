import React, {useEffect, useRef} from 'react';
import {
  View,
} from 'react-native';

import {Button, BottomSheetModal} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';

const ScanRemoveSheet = ({
  isVisible,
  onRemove,
  onClose,
}) => {
  const styles = useStyle();

  const bottomSheetRef = useRef(null);

  useEffect(() => {
    if (!bottomSheetRef.current) {
      return;
    }

    if (isVisible) {
      setTimeout(() => {
        bottomSheetRef.current?.present();
      });
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleRemoveScan = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      height={132}
      onClose={handleClose}
    >
      <View style={styles.container}>
        <Button
          style={styles.removeButton}
          scaleDisabled={true}
          label="Remove Scan"
          labelStyle={[styles.textNormal, styles.textRemove]}
          onPress={handleRemoveScan}
        />
      </View>
    </BottomSheetModal>
  );
};

export default ScanRemoveSheet;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: '100%',
    backgroundColor: colors.primaryCardBackground,
  },
  removeButton: {
    height: 48,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: Colors.red,
  },
  textRemove: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    textTransform: 'capitalize',
    color: Colors.red,
  },
}));
