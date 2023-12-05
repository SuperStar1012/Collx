import React, {useState, useRef, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Animated,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';

import {BlurView} from 'components';
import CardTypeListItem, {sportTypeListItemHeight} from './CardTypeListItem';

import {Styles} from 'globals';
import {createUseStyle} from 'theme';

// TODO: Remove later, doesn't use now.
const CardTypeList = props => {
  const {style, isOpen, types, currentType, onChangedValue} = props;

  const styles = useStyle();

  const contentHeight = (types.length || 0) * sportTypeListItemHeight + 16;

  const [animatedContentValue] = useState(new Animated.Value(0));
  const isExpandedList = useRef(isOpen);

  useEffect(() => {
    if (isOpen === isExpandedList.current) {
      return;
    }

    animateContent();
  }, [isOpen]);

  const handleSelectItem = item => {
    animateContent();

    onChangedValue(item);
  };

  const animateContent = () => {
    isExpandedList.current = !isExpandedList.current;

    Animated.timing(animatedContentValue, {
      toValue: isExpandedList.current ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const renderItem = ({item}) => (
    <CardTypeListItem
      {...item}
      isActive={item?.value === currentType?.value}
      onPress={() => handleSelectItem(item)}
    />
  );

  const animationHeightValue = animatedContentValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Styles.windowHeight],
  });

  return (
    <Animated.View
      style={[styles.container, style, {height: animationHeightValue}]}>
      <View style={[styles.typeListWrapper, {height: contentHeight}]}>
        <BlurView style={styles.blurViewContainer} />
        <FlatList
          contentContainerStyle={styles.typeListContentContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          data={types}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.backdropContainer}
        onPress={() => handleSelectItem(currentType)}
      />
    </Animated.View>
  );
};

CardTypeList.defaultProps = {
  isOpen: false,
  onChangedValue: () => {},
};

CardTypeList.propTypes = {
  types: PropTypes.array.isRequired,
  currentType: PropTypes.object.isRequired,
  isOpen: PropTypes.bool,
  onChangedValue: PropTypes.func,
};

export default CardTypeList;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    overflow: 'hidden',
    zIndex: 9,
    elevation: 9,
  },
  typeListWrapper: {},
  backdropContainer: {
    flex: 1,
  },
  blurViewContainer: {
    backgroundColor: colors.cardTypeListBackground,
  },
  typeListContentContainer: {
    paddingVertical: 8,
  },
}));
