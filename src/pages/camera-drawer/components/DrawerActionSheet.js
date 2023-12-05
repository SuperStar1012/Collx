import React, {useRef, useEffect} from 'react';
import {View} from 'react-native';

import {
  Button,
  BottomSheetModal,
} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';

const DrawerActionSheet = ({
  isVisible,
  onSearch,
  onReport,
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

  const handleWrongCard = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const handleReportCard = () => {
    if (onReport) {
      onReport();
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      height={180}
      onClose={handleClose}
    >
      <View style={styles.container}>
        <Button
          style={styles.actionButton}
          scaleDisabled={true}
          label="This Is The Wrong Card"
          labelStyle={styles.textAction}
          onPress={handleWrongCard}
        />
        <Button
          style={styles.actionButton}
          scaleDisabled={true}
          label="Report A Problem"
          labelStyle={styles.textAction}
          onPress={handleReportCard}
        />
      </View>
    </BottomSheetModal>
  );
};

export default DrawerActionSheet;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: '100%',
    backgroundColor: colors.primaryCardBackground,
  },
  actionButton: {
    height: 48,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: colors.primary,
  },
  textAction: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
    textTransform: 'capitalize',
  },
}));
