import React, {forwardRef, useRef} from 'react';
import {View, Text, Alert} from 'react-native';
import PropTypes from 'prop-types';
import BottomSheet from '@gorhom/bottom-sheet';
import ActionSheet from 'react-native-actionsheet';

import {Button} from 'components';

import {Styles} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {getCount} from 'utils';

const actionLabels = [
  'Feature Cards',
  'Unfeature Cards',
  'Delete',
  'Cancel',
];

const BottomView = forwardRef(({
  cardsCount,
  isCurrentUser,
  isProUser,
  onAddToDeal,
  onRemove,
  onPinFeatureCards,
  onPinUnfeatureCards,
}, ref) => {
  const styles = useStyle();
  const {t: {colors}} = useTheme();

  const actionSheetRef = useRef(null);

  const getSelectedCards = () => {
    if (cardsCount === 0) {
      return '';
    }

    return `${getCount(cardsCount)} card${cardsCount > 1 ? 's' : ''} selected`;
  };

  const handleDelete = () => {
    Alert.alert(
      'CollX',
      `Are you sure you want to delete the ${getSelectedCards()}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onRemove();
          },
        },
      ],
    );
  };

  const handleAddCardsToDeal = () => {
    onAddToDeal();
  };

  const handleMoreActions = () => {
    setTimeout(() => {
      actionSheetRef.current?.show();
    });
  };

  const handleSelectAction = (actionIndex) => {
    switch (actionIndex) {
      case 0: // Feature Cards
        if (onPinFeatureCards) {
          onPinFeatureCards();
        }
        break;
      case 1:
        if (onPinUnfeatureCards) {
          onPinUnfeatureCards();
        }
        break;
      case 2: // Delete
        handleDelete();
        break;
    }
  };

  const renderActions = () => {
    if (!isCurrentUser) {
      return (
        <Button
          style={[styles.generalButton, styles.actionButton]}
          label="Add To Deal"
          labelStyle={[styles.textGeneral, styles.textAction]}
          scale={Button.scaleSize.One}
          onPress={handleAddCardsToDeal}
        />
      );
    }

    if (isProUser) {
      return (
        <Button
          style={[styles.generalButton, styles.actionButton]}
          label="Actions"
          labelStyle={[styles.textGeneral, styles.textAction]}
          scale={Button.scaleSize.One}
          onPress={handleMoreActions}
        />
      );
    }

    return (
      <Button
        style={[styles.generalButton, styles.deleteButton]}
        label="Delete"
        labelStyle={[styles.textGeneral, styles.textDelete]}
        scale={Button.scaleSize.One}
        onPress={handleDelete}
      />
    );
  };

  return (
    <>
      <BottomSheet
        ref={ref}
        style={styles.container}
        backgroundStyle={styles.backgroundContainer}
        index={-1}
        enableOverDrag={false}
        handleComponent={null}
        snapPoints={[Styles.collectionActionBarHeight + Styles.collectionActionBarMarginBottom]}>
        <View style={styles.contentContainer}>
          <Text style={[styles.textGeneral, styles.textSelectCards]}>
            {getSelectedCards()}
          </Text>
          {renderActions()}
        </View>
      </BottomSheet>
      <ActionSheet
        ref={actionSheetRef}
        tintColor={colors.primaryText}
        options={actionLabels}
        destructiveButtonIndex={actionLabels.length - 2}
        cancelButtonIndex={actionLabels.length - 1}
        onPress={handleSelectAction}
      />
    </>
  );
});

BottomView.defaultProps = {
  cardsCount: 0,
  onAddToDeal: () => {},
  onRemove: () => {},
};

BottomView.propTypes = {
  cardsCount: PropTypes.number,
  onAddToDeal: PropTypes.func,
  onRemove: PropTypes.func,
};

BottomView.displayName = 'BottomView';

export default BottomView;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
  },
  backgroundContainer: {
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: colors.secondaryCardBackground,
    marginBottom: Styles.collectionActionBarMarginBottom,
    shadowColor: Colors.gray,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 4,
    borderRadius: 16,
  },
  textGeneral: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    textTransform: 'capitalize',
  },
  textSelectCards: {
    color: colors.primaryText,
  },
  generalButton: {
    height: 32,
    // width: 110,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: Colors.redAlphaHalf1,
  },
  textDelete: {
    color: Colors.red,
  },
  actionButton: {
    backgroundColor: colors.primary,
  },
  textAction: {
    color: Colors.white,
  },
}));
