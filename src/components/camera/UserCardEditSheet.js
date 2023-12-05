import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';

import {Button, BottomSheetModal} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';

const UserCardEditSheet = ({
  isVisible,
  onEdit,
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

  const handleEditCard = () => {
    if (onEdit) {
      onEdit();
    }
  }

  const handleSearchScan = () => {
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
      height={244}
      onClose={handleClose}
    >
      <View style={styles.container}>
        <Button
          style={[styles.button, styles.normalButton]}
          scaleDisabled={true}
          label="Edit Card Details"
          labelStyle={[styles.textNormal, styles.textSearchButton]}
          onPress={handleEditCard}
        />
        <Button
          style={[styles.button, styles.normalButton]}
          scaleDisabled={true}
          label="This Is The Wrong Card"
          labelStyle={[styles.textNormal, styles.textSearchButton]}
          onPress={handleSearchScan}
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

export default UserCardEditSheet;

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
  normalButton: {
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
