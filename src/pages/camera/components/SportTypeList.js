import React,{useMemo} from 'react';
import {
  Animated,
  StyleSheet,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';

import {BlurView} from 'components';
import CameraSportTypeListItem from './SportTypeListItem';

import {Colors} from 'theme';

export const sportTypeListVerticalPadding = 8;
export const sportTypeListWidth = 230;

const CameraSportTypeList = props => {
  const {style, types, value, animatedValue, onChangedValue} = props;

  const currentType = useMemo(() => (
    types.find(type => type.value === value) || {}
  ), [value, types]);

  const handleSelectItem = item => {
    if (onChangedValue) {
      onChangedValue(item.value);
    }
  };

  const renderItem = ({item}) => (
    <CameraSportTypeListItem
      {...item}
      isActive={item.value === currentType?.value}
      onPress={() => handleSelectItem(item)}
    />
  );

  return (
    <Animated.View style={[styles.container, {height: animatedValue}, style]}>
      <BlurView style={styles.blurViewContainer} />
      <FlatList
        contentContainerStyle={styles.typeListContentContainer}
        showsVerticalScrollIndicator={false}
        data={types}
        scrollEnabled={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </Animated.View>
  );
};

CameraSportTypeList.defaultProps = {
  onChangedValue: () => {},
};

CameraSportTypeList.propTypes = {
  types: PropTypes.array.isRequired,
  value: PropTypes.number.isRequired,
  animatedValue: PropTypes.any,
  onChangedValue: PropTypes.func,
};

export default CameraSportTypeList;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: sportTypeListWidth,
    overflow: 'hidden',
    zIndex: 1,
    elevation: 1,
    borderRadius: 15,
  },
  blurViewContainer: {
    backgroundColor: Colors.blackAlpha8,
  },
  typeListContentContainer: {
    paddingVertical: sportTypeListVerticalPadding,
  },
});
