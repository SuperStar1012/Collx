import React, {useRef, useState, useEffect} from 'react';
import {View, Animated, FlatList} from 'react-native';
import {ExpandingDot} from 'react-native-animated-pagination-dots';

import {
  Button,
  NavBarModalHeader,
  NavBarButton,
} from 'components';
import DealOnboardingStep from './components/DealOnboardingStep';

import {Styles} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';

const arrowRightIcon = require('assets/icons/arrow_forward.png');
const closeIcon = require('assets/icons/close.png');

const slides = [
  {
    title: 'Add cards to a deal',
    description: 'Now you can arrange a deal of multiple cards with a seller! Add cards to your deal by tap “select” on the seller’s collection page, or “add to deal” in the card detail page.',
  },
  {
    title: 'Make an offer',
    description: 'View, manage all the cards in your deal, and make an offer to the seller to purchase this pack of cards.',
  },
  {
    title: 'Settle on a price and buy',
    description: 'Make counteroffer, accept or reject the deal in messages. Lock your deals down with ease.',
  },
];

const DealOnboarding = ({
  navigation,
  route,
}) => {
  const styles = useStyle();
  const {t: {images}} = useTheme();

  const flatListRef = useRef(null);
  const handleViewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});
  const scrollX = useRef(new Animated.Value(0)).current;

  const [activeIndex, setActiveIndex] = useState(0);

  const handleViewRef = useRef(({viewableItems}) => {
    if (viewableItems?.length) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  useEffect(() => {
    setNavigationBar();
  }, [styles]);

  const setNavigationBar = () => {
    navigation.setOptions({
      header: NavBarModalHeader,
      headerLeft: () => (
        <NavBarButton
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      ),
    });
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (activeIndex === slides.length - 1) {
      const {onComplete} = route.params || {};
      if (onComplete) {
        onComplete();
      }
      handleClose();
    } else {
      if (flatListRef.current && activeIndex + 1 < slides.length) {
        flatListRef.current.scrollToIndex({
          index: activeIndex + 1,
          animated: true,
        });
      }
    }
  };

  const renderItem = ({item, index}) => (
    <DealOnboardingStep image={images.onboardingDealImages[index]} {...item} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{
          paddingTop: 10,
        }}
        data={slides}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        horizontal
        decelerationRate="normal"
        scrollEventThrottle={10}
        renderItem={renderItem}
        onViewableItemsChanged={handleViewRef.current}
        viewabilityConfig={handleViewConfigRef.current}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: false,
          },
        )}
      />
      <View style={[styles.bottomContainer, {marginBottom: Styles.screenSafeBottomHeight || 16}]}>
        <ExpandingDot
          containerStyle={styles.dotContainer}
          dotStyle={styles.dotItem}
          data={slides}
          expandingDotWidth={24}
          scrollX={scrollX}
          activeDotColor={Colors.lightBlue}
          inActiveDotColor={Colors.lightGray}
        />
        <Button
          style={styles.nextButton}
          label={activeIndex === slides.length - 1 ? 'Continue' : 'Next'}
          labelStyle={styles.textAction}
          icon={activeIndex === slides.length - 1 ? null : arrowRightIcon}
          iconStyle={styles.iconNext}
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

export default DealOnboarding;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotContainer: {
    bottom: 10,
  },
  dotItem: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3.5,
  },
  nextButton: {
    height: 28,
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  textAction: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    color: colors.primary,
  },
  iconNext: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.primary,
    marginLeft: 8,
  },
}));
