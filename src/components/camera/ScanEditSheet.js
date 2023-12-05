import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';

import {Button, BottomSheetModal} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';

const ScanEditSheet = ({
  isVisible,
  onSearch,
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

  const handleSearchForCard = () => {
    if (onSearch) {
      onSearch();
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
      height={184}
      onClose={handleClose}
    >
      <View style={styles.container}>
        <Button
          style={[styles.button, styles.searchButton]}
          scaleDisabled={true}
          label="Search For A Card"
          labelStyle={[styles.textNormal, styles.textSearchButton]}
          onPress={handleSearchForCard}
        />
        <Button
          style={[styles.button, styles.removeButton]}
          scaleDisabled={true}
          label="Remove Scan"
          labelStyle={[styles.textNormal, styles.textRemoveButton]}
          onPress={handleRemoveScan}
        />
      </View>
    </BottomSheetModal>
  );
};

export default ScanEditSheet;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: '100%',
    backgroundColor: colors.primaryCardBackground,
  },
  button: {
    height: 48,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  searchButton: {
    backgroundColor: colors.primary,
  },
  removeButton: {
    borderWidth: 1,
    borderColor: Colors.red,
  },
  textNormal: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    textTransform: 'capitalize',
  },
  textSearchButton: {
    color: Colors.white,
  },
  textRemoveButton: {
    color: Colors.red,
  },
}));
