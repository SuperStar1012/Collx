import React, {useState, useRef} from 'react';
import {View, Animated, FlatList} from 'react-native';
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import {CommonActions} from '@react-navigation/native';

import {Button} from 'components';
import OnboardingItem from './components/OnboardingItem';

import {Styles} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {wp, saveOnboarding} from 'utils';

const arrowRightIcon = require('assets/icons/arrow_forward.png');

const slides = [
  {
    title: 'Snap a photo',
    description:
      'Scan any baseball card to instantly recognize it against our database of every known card.',
    image: require('assets/imgs/onboarding/onboarding1.png'),
    imageStyle: {
      width: Styles.windowWidth,
      height: wp(93.6),
      marginTop: wp(2.2),
    },
  },
  {
    title: 'Track market value',
    description:
      'Get the average value of your card, based on all recent transactions from marketplaces.',
    image: require('assets/imgs/onboarding/onboarding2.png'),
    imageStyle: {
      width: Styles.windowWidth,
      height: wp(98.4),
      marginTop: wp(0.5),
      transform: [{scaleY: 0.98}],
    },
  },
  {
    title: 'Build your collection',
    description:
      'Track your cards and total collection value over time. Filter, sort, and search your cards.',
    image: require('assets/imgs/onboarding/onboarding3.png'),
    imageStyle: {
      width: Styles.windowWidth,
      height: wp(96.1),
      marginTop: wp(4.4),
    },
  },
  {
    title: 'Stay connected',
    description:
      'Connect with collectors. Message other users about their cards, make offers to buy, sell, or trade.',
    image: require('assets/imgs/onboarding/onboarding4.png'),
    imageStyle: {
      width: Styles.windowWidth,
      height: wp(98.6),
      marginTop: wp(4.4),
    },
  },
  {
    title: 'Buy & Sell',
    description:
      'Unload and acquire cards, and get paid top dollar by getting your cards graded. More sports and cards coming soon!',
    image: require('assets/imgs/onboarding/onboarding5.png'),
    imageStyle: {
      width: Styles.windowWidth,
      height: wp(92),
      marginTop: wp(7.8),
    },
  },
];

const Onboarding = props => {
  const {navigation} = props;

  const styles = useStyle();

  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const handleViewRef = useRef(({viewableItems}) => {
    if (viewableItems?.length) {
      setActiveIndex(viewableItems[0].index);
    }
  });
  const handleViewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (flatListRef.current && activeIndex + 1 < slides.length) {
      flatListRef.current.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: slides.length - 1,
        animated: true,
      });
    }
  };

  const handleGetStarted = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Welcome'}],
      }),
    );

    saveOnboarding();
  };

  const renderItem = ({item}) => <OnboardingItem {...item} />;

  const renderActions = () => {
    if (activeIndex === slides.length - 1) {
      return (
        <Button
          style={[
            styles.getStartedButton,
            {bottom: Styles.screenSafeBottomHeight + 16},
          ]}
          scaleDisabled={true}
          label="Get Started"
          labelStyle={styles.textGetStarted}
          onPress={() => handleGetStarted()}
        />
      );
    }

    return (
      <View
        style={[
          styles.actionsContainer,
          {bottom: Styles.screenSafeBottomHeight + 12},
        ]}>
        <Button
          label="Skip"
          labelStyle={styles.textSkip}
          onPress={() => handleSkip()}
          scale={Button.scaleSize.Eight}
        />
        <Button
          style={styles.nextButton}
          label="Next"
          labelStyle={styles.textNext}
          icon={arrowRightIcon}
          iconStyle={styles.iconNext}
          onPress={() => handleNext()}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{paddingTop: Styles.screenSafeTopHeight + 14}}
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
      <ExpandingDot
        containerStyle={[
          styles.dotContainer,
          {bottom: Styles.screenSafeBottomHeight + 86},
        ]}
        dotStyle={styles.dotItem}
        data={slides}
        expandingDotWidth={24}
        scrollX={scrollX}
        activeDotColor={Colors.lightBlue}
        inActiveDotColor={Colors.lightGray}
      />
      {renderActions()}
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  dotContainer: {},
  dotItem: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3.5,
  },
  actionsContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  textSkip: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.darkGrayText,
  },
  nextButton: {
    flexDirection: 'row-reverse',
  },
  textNext: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    color: colors.primary,
    marginRight: 8,
  },
  iconNext: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  getStartedButton: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  textGetStarted: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    color: Colors.white,
  },
}));

export default Onboarding;
