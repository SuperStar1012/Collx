import React, {useState, useRef, useEffect} from 'react';
import {View, Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {
  Button,
  TextInputUnit,
  BottomSheetModal,
} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {isPrice} from 'utils';

const TradingCardListingSheet = ({
  isVisible,
  tradingCard,
  onUpdateListingPrice,
  onClose,
}) => {
  const styles = useStyle();

  const tradingCardData = useFragment(graphql`
    fragment TradingCardListingSheet_tradingCard on TradingCard {
      id
      listing {
        askingPrice {
          amount
        }
      }
    }`,
    tradingCard
  );

  const [price, setPrice] = useState(tradingCardData?.listing?.askingPrice?.amount || '');

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

  const handleChangePrice = value => {
    setPrice(value);
  };

  const handleListCard = () => {
    if (onUpdateListingPrice) {
      onUpdateListingPrice(tradingCardData.id, price)
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      height={300}
      title="Sell Card"
      onClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.priceContainer}>
          <Text style={styles.textFieldName}>Asking Price</Text>
          <TextInputUnit
            style={styles.textInputPriceContainer}
            textInputStyle={styles.textInputPrice}
            unitStyle={styles.textInputPrice}
            autoCorrect={false}
            autoCapitalize="none"
            placeholderTextColor={styles.placeholderText.color}
            unitPrefix="$"
            value={price}
            onChangeText={handleChangePrice}
          />
        </View>
        <Text style={styles.textDescription}>
          Buyers on CollX will be able to find your card in search results and
          make offers to you. All purchase details must be arranged with the
          buyer. You can edit the asking price at any time from card details.
        </Text>
        <Button
          style={styles.sheetButton}
          scaleDisabled={true}
          disabled={!isPrice(price)}
          label="List Card"
          labelStyle={styles.textButton}
          onPress={handleListCard}
        />
      </View>
    </BottomSheetModal>
  );
};

export default TradingCardListingSheet;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: '100%',
    backgroundColor: colors.primaryCardBackground,
    paddingHorizontal: 16,
  },
  sheetButton: {
    height: 48,
    borderRadius: 10,
    marginVertical: 4,
    backgroundColor: colors.primary,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  textFieldName: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    fontWeight: Fonts.semiBold,
    color: colors.primaryText,
    marginVertical: 4,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginVertical: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInputPriceContainer: {
    width: 120,
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: colors.secondaryCardBackground,
  },
  textInputPrice: {
    fontSize: 15,
    letterSpacing: -0.24,
    color: colors.primaryText,
    textAlign: 'right',
  },
  placeholderText: {
    color: colors.placeholderText
  }
}));
