import React from 'react';
import {FlatList} from 'react-native';

import {Switch} from 'components';

import {createUseStyle} from 'theme';
import {withSettings} from 'store/containers';
import {Constants} from 'globals';

const data = [
  {
    label: 'Camera Sound Effects',
    value: 'email',
  },
];

const CameraSoundEffectSettings = ({
  cameraSoundEffect,
  setCameraSoundEffect,
}) => {
  const styles = useStyle();

  const handleChangeValue = () => {
    setCameraSoundEffect(cameraSoundEffect === Constants.soundEffectSettings.on ? Constants.soundEffectSettings.off : Constants.soundEffectSettings.on)
  };

  const renderItem = ({item}) => (
    <Switch
      style={styles.itemContainer}
      label={item.label}
      value={cameraSoundEffect === Constants.soundEffectSettings.on}
      onChangedValue={handleChangeValue}
    />
  );

  return (
    <FlatList
      style={styles.container}
      data={data}
      bounces={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  itemContainer: {
    height: 44,
    backgroundColor: colors.primaryCardBackground,
    paddingHorizontal: 16,
    borderBottomColor: colors.secondaryBorder,
    borderBottomWidth: 1,
  },
}));

export default withSettings(CameraSoundEffectSettings);
