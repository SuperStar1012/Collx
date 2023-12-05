import React, { useEffect, useMemo, useRef } from 'react';
import {View, Text} from 'react-native';
import Carousel from 'react-native-snap-carousel';

import MatchVariantListItem, {matchVariantItemWidth} from './MatchVariantListItem';

import {Styles} from 'globals';
import {Colors, createUseStyle} from 'theme';

const MatchVariantList = ({
  currentMatch,
  variants,
  onSelectVariant,
}) => {
  const carouselRef = useRef(null);
  const currentVariant = useRef({});

  const styles = useStyle();

  const currentIndex = useMemo(() => {
    const index = variants.findIndex(item => item.id === currentMatch.id);

    if (carouselRef.current && index !== -1) {
      carouselRef.current?.snapToItem(index);
    }

    return index;
  }, [currentMatch, variants]);

  useEffect(() => {
    if (currentIndex !== -1) {
      setTimeout(() => {
        carouselRef.current?.snapToItem(currentIndex);
      }, 200);
    }
  }, []);

  const handleSelectVariant = (variant) => {
    if (currentVariant.current.id === variant.id) {
      return;
    }

    currentVariant.current = variant;

    if (onSelectVariant) {
      onSelectVariant(variant)
    }
  };

  const handleSnapToItem = (index) => {
    if (currentVariant.current.id === variants[index].id) {
      return;
    }

    currentVariant.current = variants[index];

    if (onSelectVariant) {
      onSelectVariant(currentVariant.current);
    }
  };

  const renderTip = () => {
    const isHints = currentMatch.hints;

    return (
      <View style={styles.tipContainer}>
        <View
          style={[
            styles.tipContentContainer,
            isHints ? styles.tipContentSetContainer : styles.tipContentSwipeContainer,
          ]}>
          <Text
            style={[
              styles.textTip,
              isHints ? styles.textTipSet : styles.textTipSwipe,
            ]}
            numberOfLines={2}
          >
            {isHints ? `Look for: ${currentMatch.hints}` : 'Swipe to change variant'}
          </Text>
        </View>
        <View style={[styles.arrowDown, isHints ? styles.arrowDownLookFor : styles.arrowDownSwipe]} />
      </View>
    );
  };

  const renderItem = ({item}) => (
    <MatchVariantListItem
      {...item}
      isActive={item.id === currentMatch.id}
      onSelect={() => handleSelectVariant(item)}
    />
  );

  return (
    <View style={styles.container}>
      {renderTip()}
      <Carousel
        ref={carouselRef}
        containerCustomStyle={styles.listContainer}
        contentContainerCustomStyle={styles.listContentContainer}
        data={variants}
        renderItem={renderItem}
        sliderWidth={Styles.screenWidth - 16 * 2}
        itemWidth={matchVariantItemWidth}
        enableMomentum
        activeSlideOffset={Math.round(matchVariantItemWidth / 4)}
        swipeThreshold={Math.round(matchVariantItemWidth / 4)}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        onSnapToItem={handleSnapToItem}
      />
    </View>
  );
};

export default MatchVariantList;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  listContainer: {
    height: 62,
    borderRadius: 10,
    backgroundColor: Colors.lightGrayAlpha1,
  },
  listContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  tipContentContainer: {
    width: '100%',
    height: 46,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContentSwipeContainer: {
    backgroundColor: Colors.lightGrayAlpha1,
  },
  tipContentSetContainer: {
    backgroundColor: colors.primary,
  },
  textTip: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    textAlign: 'center',
  },
  textTipSwipe: {
    color: colors.darkGrayText,
  },
  textTipSet: {
    color: Colors.white,
  },
  arrowDown: {
    borderTopWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 0,
    borderLeftWidth: 7,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  arrowDownSwipe: {
    borderTopColor: Colors.lightGrayAlpha1,
  },
  arrowDownLookFor: {
    borderTopColor: colors.primary,
  },
}));
