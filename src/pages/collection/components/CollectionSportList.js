import React, {useState, useRef, useEffect, useMemo} from 'react';
import {
  TouchableOpacity,
  View,
  Animated,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useRefetchableFragment} from 'react-relay';

import {BlurView} from 'components';
import CollectionSportListItem, {sportTypeListItemHeight} from './CollectionSportListItem';

import {
  Constants,
  Styles,
  UserCardCategories,
} from 'globals';
import {createUseStyle} from 'theme';
import {usePrevious} from 'hooks';

const CollectionSportList = props => {
  const {
    style,
    isOpen,
    userCardType,
    refetchKey,
    onChangeType,
    onChangeAllCardTypes,
  } = props;

  const styles = useStyle();
  const prevProps = usePrevious({refetchKey});

  const [animatedContentValue] = useState(new Animated.Value(0));
  const isExpandedList = useRef(isOpen);

  const [profile, refetch] = useRefetchableFragment(
    graphql`
      fragment CollectionSportList_profile on Profile
      @refetchable(queryName: "CollectionSportListRefetchQuery") {
        tradingCardTypes {
          sports
          games
        }
      }
    `,
    props.profile
  );

  const userCardTypes = useMemo(() => {
    const availableSportTypes = [Constants.allUserCardType];

    if (!profile.tradingCardTypes) {
      return availableSportTypes;
    }

    UserCardCategories.map(item => {
      const cardType = item.sport || item.game;

      if (
        profile.tradingCardTypes.sports?.indexOf(cardType) > -1 ||
        profile.tradingCardTypes.games?.indexOf(cardType) > -1
      ) {
        availableSportTypes.push(item);
      }
    });

    return availableSportTypes;
  }, [profile.tradingCardTypes]);

  const contentHeight = (userCardTypes.length || 0) * sportTypeListItemHeight + 16;

  useEffect(() => {
    if (onChangeAllCardTypes) {
      onChangeAllCardTypes(userCardTypes);
    }
  }, [userCardTypes]);

  useEffect(() => {
    const currentIndex = userCardTypes.findIndex(item => item.value === userCardType.value);

    if (currentIndex === -1) {
      const allItem = userCardTypes.find(item => item.value === 0);
      if (allItem) {
        onChangeType(allItem, false);
      }
    }
  }, [userCardType, userCardTypes]);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    handleRefetch();
  }, [refetchKey]);

  useEffect(() => {
    if (isOpen === isExpandedList.current) {
      return;
    }

    animateContent();
  }, [isOpen]);

  const handleRefetch = () => {
    refetch(
      {},
      {fetchPolicy: 'network-only'},
    );
  };

  const handleSelectItem = item => {
    animateContent();

    onChangeType(item, true);
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
    <CollectionSportListItem
      {...item}
      isActive={item.value === userCardType.value}
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
          data={userCardTypes}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.backdropContainer}
        onPress={() => handleSelectItem(userCardType)}
      />
    </Animated.View>
  );
};

CollectionSportList.defaultProps = {
  isOpen: false,
  onChangeType: () => {},
  onChangeAllCardTypes: () => {},
};

CollectionSportList.propTypes = {
  isOpen: PropTypes.bool,
  userCardType: PropTypes.object,
  onChangeType: PropTypes.func,
  onChangeAllCardTypes: PropTypes.func,
};

export default CollectionSportList;

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
