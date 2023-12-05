import React, {useEffect, useRef} from 'react';
import {View, Text, Image} from 'react-native';

import {Button, BottomSheetModal} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';

const marketplaceSettings = [
  {
    label: 'Accept payment directly in-app',
    icon: require('assets/icons/credit_card_123.png'),
  },
  {
    label: 'CollX generates shipping label for you',
    icon: require('assets/icons/shipping_box.png'),
  },
  {
    label: 'Set seller discount and accept offers',
    icon: require('assets/icons/tag_outline.png'),
  },
  {
    label: 'Manage credits and track your balance',
    icon: require('assets/icons/dollar_circle.png'),
  },
];

const MarketplaceIntroduceSheet = ({
  isVisible,
  onSetSellerSettings,
  onSkip,
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

  const handleSetSellerSettings = () => {
    if (onSetSellerSettings) {
      onSetSellerSettings();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  const renderItem = (index, item) => (
    <View key={index} style={styles.introduceItem}>
      <Image style={styles.iconIntroduce} source={item.icon} />
      <Text style={styles.textIntroduce}>{item.label}</Text>
    </View>
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      isHideClose
      height={538}
      titleStyle={styles.textMarketplace}
      title="Introducing CollX Marketplace"
      onClose={handleClose}
    >
      <View style={styles.container}>
        <Text style={styles.textDescription}>
          To sell your cards, please configure your settings about accepting offers, seller discount, and shipping method. Our default shipping method is seller pays shipping if you don't select one.
        </Text>
        {marketplaceSettings.map((item, index) => renderItem(index, item))}
        <Button
          style={styles.sellerSettingsButton}
          scale={Button.scaleSize.One}
          label="Set Seller Settings"
          labelStyle={styles.textSellerSettings}
          onPress={handleSetSellerSettings}
        />
        <Button
          scale={Button.scaleSize.One}
          label="I’ll do this later"
          labelStyle={styles.textSkip}
          onPress={handleSkip}
        />
      </View>
    </BottomSheetModal>
  );
};

export default MarketplaceIntroduceSheet;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: '100%',
    backgroundColor: colors.primaryCardBackground,
    paddingHorizontal: 16,
  },
  textMarketplace: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
  },
  sellerSettingsButton: {
    height: 48,
    borderRadius: 10,
    marginVertical: 16,
    backgroundColor: colors.primary,
  },
  textSellerSettings: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  textSkip: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.primary,
  },
  introduceItem: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 6,
    backgroundColor: colors.secondaryCardBackground,
  },
  iconIntroduce: {
    width: 24,
    height: 24,
    marginRight: 6,
    tintColor: colors.marketplaceText,
  },
  textIntroduce: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.marketplaceText,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.grayText,
    textAlign: 'center',
    marginBottom: 18,
  },
}));
