import React, {useState, useRef, useEffect} from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  View,
  Text,
  FlatList,
  Animated,
} from 'react-native';

import {
  Button,
  CircleCheck,
  TextInputUnit,
  BottomSheetModal,
} from 'components';

import {Constants, Styles} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';

const SoldTradingCardSheet = ({
  isVisible,
  tradingCard,
  markAsSoldStep,
  onChangedStep,
  onMarkAsSold,
  onClose,
}) => {
  const styles = useStyle();

  const tradingCardData = useFragment(graphql`
    fragment SoldTradingCardSheet_tradingCard on TradingCard {
      id
      listing {
        askingPrice {
          amount
        }
      }
    }`,
    tradingCard
  );

  const [price, setPrice] = useState(tradingCardData?.listing?.askingPrice.amount || '');
  const [type, setType] = useState(null);

  const flatListRef = useRef(null);
  const handleViewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});
  const scrollX = useRef(new Animated.Value(0)).current;

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

  const nextPage = () => {
    onChangedStep(1);

    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: 1,
        animated: true,
      });
    }
  };

  const handleMarkTradingCardAsSold = () => {
    if (onMarkAsSold) {
      onMarkAsSold(
        tradingCardData.id,
        price,
        type,
      );
    }
  };

  const renderMarkAsSold = () => {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.rowItemContainer}>
          <Text style={styles.textFieldName}>Amount Sold For</Text>
          <TextInputUnit
            style={styles.textInputPriceContainer}
            textInputStyle={styles.textInputPrice}
            unitStyle={styles.textInputPrice}
            autoCorrect={false}
            autoCapitalize="none"
            placeholderTextColor={styles.placeholderText.color}
            unitPrefix="$"
            value={price}
            onChangeText={setPrice}
          />
        </View>
        <Text style={styles.textDescription}>
          This card will be moved to the “Sold” category of your collection.
        </Text>
        <Button
          style={styles.sheetButton}
          scaleDisabled={true}
          label="Next"
          labelStyle={styles.textButton}
          onPress={nextPage}
        />
      </View>
    );
  };

  const renderSelectSold = () => {
    return (
      <View style={styles.contentContainer}>
        <CircleCheck
          label="On CollX"
          value={type == Constants.cardSaleTypes.collx}
          onChangedValue={() => setType(Constants.cardSaleTypes.collx)}
        />
        <CircleCheck
          label="Somewhere else"
          value={type == Constants.cardSaleTypes.other}
          onChangedValue={() => setType(Constants.cardSaleTypes.other)}
        />
        <Text style={styles.textDescription}>
          This card will be moved to the “Sold” category of your collection.
        </Text>
        <Button
          style={styles.sheetButton}
          scaleDisabled={true}
          disabled={type == null}
          label="Mark as Sold"
          labelStyle={styles.textButton}
          onPress={handleMarkTradingCardAsSold}
        />
      </View>
    );
  };

  const renderItem = ({item}) =>
    item === 0 ? renderMarkAsSold() : renderSelectSold();

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      height={270}
      title={markAsSoldStep === 0 ? 'Mark As Sold' : 'Where was it sold?'}
      onClose={handleClose}
    >
      <FlatList
        ref={flatListRef}
        style={styles.container}
        data={[0, 1]}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        pagingEnabled
        horizontal
        decelerationRate="normal"
        scrollEventThrottle={10}
        renderItem={renderItem}
        viewabilityConfig={handleViewConfigRef.current}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: false,
          },
        )}
      />
    </BottomSheetModal>
  );
};

export default SoldTradingCardSheet;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: '100%',
    backgroundColor: colors.primaryCardBackground,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    width: Styles.windowWidth,
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
  rowItemContainer: {
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
    color: colors.placeholderTextColor
  }
}));
