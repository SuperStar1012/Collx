import React, {useEffect} from 'react';
import {FlatList, View} from 'react-native';

import SettingsItem from '../components/SettingsItem';

import {createUseStyle} from 'theme';

const notificationData = [
  {
    label: 'News',
    route: 'NewsSettings',
  },
  {
    label: 'Followers',
    route: 'FollowersSettings',
  },
  {
    label: 'Comments and Likes',
    route: 'CommentsAndLikesSettings',
  },
  {
    label: 'Messages',
    route: 'MessagesSettings',
  },
  // {
  //   label: 'Offers',
  //   route: '',
  // },
  // {
  //   label: 'Portfolio Change',
  //   route: 'PortfolioChangeSettings',
  // },
  // {
  //   label: 'Winners',
  //   route: 'WinnersSettings',
  // },
];

const NotificationSettings = ({
  navigation
}) => {
  const styles = useStyle();

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: 'Notification Settings',
    });
  };

  const handleSelect = index => {
    if (notificationData[index]?.route) {
      navigation.navigate(notificationData[index].route);
    }
  };

  const renderItem = ({item, index}) => (
    <SettingsItem {...item} onPress={() => handleSelect(index)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        data={notificationData}
        bounces={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
    marginTop: 18,
  },
}));

export default NotificationSettings;
