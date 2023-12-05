import React, {useMemo} from 'react';
import {FlatList} from 'react-native';

import SettingsItem from './components/SettingsItem';

import {createUseStyle} from 'theme';
import {withSettings} from 'store/containers';
import {Constants} from 'globals';

const settingsInitialData = [
  {
    label: 'Dark Mode',
    route: 'DarkModeSettings',
    icon: require('assets/icons/moon.png'),
    value: Constants.appearanceSettings.system,
  },
  {
    label: 'Camera Sound Effects',
    route: 'CameraSoundEffectSettings',
    icon: require('assets/icons/speaker_wave.png'),
    value: Constants.soundEffectSettings.on,
  },
];

const AppearanceAndSound = ({
  navigation,
  appearanceMode,
  cameraSoundEffect,
}) => {
  const styles = useStyle();

  const settingsData = useMemo(() => {
    const data = [...settingsInitialData];
    data[0].value = appearanceMode;
    data[1].value = cameraSoundEffect;
    return data;
  }, [appearanceMode, cameraSoundEffect]);

  const handleSelect = item => {
    if (item.route) {
      navigation.navigate(item.route);
    }
  };

  const renderItem = ({item}) => (
    <SettingsItem
      {...item}
      onPress={() => handleSelect(item)}
    />
  );

  return (
    <FlatList
      style={styles.container}
      data={settingsData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));

export default withSettings(AppearanceAndSound);
