import React, {useMemo} from 'react';
import {
  View,
  FlatList,
  Text,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Button} from 'components';
import CategoryItem from './CategoryItem';

import {Fonts, createUseStyle} from 'theme';
import {withCategory} from 'store/containers';
import {Styles, UserCardCategories} from 'globals';

const collxLogoIcon = require('assets/icons/collx_logo_full.png');
const closeIcon = require('assets/icons/close.png');

const CategorySelectPage = ({
  navigation,
  selectedCategory,
  setSearchCategory,
}) => {
  const styles = useStyle();

  const insets = useSafeAreaInsets();

  const allCategories = useMemo(() => ([
    {
      label: 'All',
      value: 0,
      icon: collxLogoIcon,
    },
    ...UserCardCategories,
  ]), []);

  const currentCategory = useMemo(() => (
    selectedCategory || allCategories[0]
  ), [selectedCategory]);

  const handleClose = () => {
    navigation.closeDrawer();
  };

  const handleSelectCategory = (category) => {
    if (category.value) {
      setSearchCategory(category);
    } else {
      setSearchCategory(null);
    }

    handleClose();
  };

  const renderHeader = () => (
    <View style={[styles.headerContainer, {height: Styles.headerNavBarHeight - insets.top}]}>
      <Button
        style={styles.closeButton}
        iconStyle={styles.iconClose}
        icon={closeIcon}
        onPress={handleClose}
      />
      <Text style={styles.textTitle}>Categories</Text>
    </View>
  );

  const renderItem = ({item}) => (
    <CategoryItem
      category={item}
      isActive={currentCategory.value === item.value}
      onPress={handleSelectCategory}
    />
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {renderHeader()}
      <FlatList
        data={allCategories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

CategorySelectPage.defaultProps = {};

CategorySelectPage.propTypes = {
};

export default withCategory(CategorySelectPage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryCardBackground,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
    color: colors.primaryText,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 16,
  },
  iconClose: {
    width: 28,
    height: 28,
    tintColor: colors.primary,
  },
}));
