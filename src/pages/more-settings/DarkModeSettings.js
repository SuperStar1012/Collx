import React, {useEffect} from 'react';
import {View, FlatList} from 'react-native';

import {Check, LoadingIndicator} from 'components';

import {Constants} from 'globals';
import {withSettings} from 'store/containers';
import {createUseStyle} from 'theme';

const data = [
  {
    label: 'On',
    value: Constants.appearanceSettings.on,
  },
  {
    label: 'Off',
    value: Constants.appearanceSettings.off,
  },
  {
    label: 'System',
    value: Constants.appearanceSettings.system,
  },
];

const DarkModeSettings = ({
  navigation,
  appearanceMode,
  setAppearanceMode,
}) => {

  const styles = useStyle();

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: 'Dark Mode',
    });
  };

  const handleChangeMode = value => {
    setAppearanceMode(value);
  };

  const renderItem = ({item}) => (
    <Check
      style={styles.itemContainer}
      label={item.label}
      value={appearanceMode === item.value}
      onChangedValue={() => handleChangeMode(item.value)}
    />
  );

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={false} />
      <FlatList
        style={styles.listContainer}
        data={data}
        bounces={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  listContainer: {
    marginTop: 20,
  },
  itemContainer: {
    height: 44,
    backgroundColor: colors.primaryCardBackground,
    paddingHorizontal: 16,
    borderBottomColor: colors.secondaryBorder,
    borderBottomWidth: 1,
  },
}));

export default withSettings(DarkModeSettings);
