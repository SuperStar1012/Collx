import React, {useEffect, useState} from 'react';
import {View, Text, SectionList} from 'react-native';

import {Switch, LoadingIndicator} from 'components';

import {Fonts, createUseStyle} from 'theme';
import {withNotificationSettings} from 'store/containers';

const data = [
  {
    key: 'news',
    title: 'CollX News',
    data: [
      {
        label: 'Email newsletter',
        value: 'email',
      },
      {
        label: 'Push notifications',
        value: 'push',
      },
    ],
  },
];

const NewsSettings = ({
  isUpdatingUser,
  user,
  updateUser,
}) => {
  const styles = useStyle();

  const {notificationSettings} = user;

  const [notifications, setNotifications] = useState(
    notificationSettings || {},
  );

  useEffect(() => {
    setNotifications(notificationSettings || {});
  }, [notificationSettings]);

  const handleChangeItem = (sectionKey, itemKey, value) => {
    const newValues = {
      ...notifications,
      [sectionKey]: {
        ...notifications[sectionKey],
        [itemKey]: value,
      },
    };

    setNotifications(newValues);

    updateUser({
      notificationSettings: newValues,
    });
  };

  const renderSectionHeader = ({section}) => (
    <Text style={styles.textSectionTitle}>{section.title}</Text>
  );

  const renderItem = ({section, item}) => (
    <Switch
      style={styles.itemContainer}
      label={item.label}
      value={
        notifications[section.key] && notifications[section.key][item.value]
      }
      onChangedValue={value => handleChangeItem(section.key, item.value, value)}
    />
  );

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isUpdatingUser} />
      <SectionList
        sections={data}
        bounces={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    </View>
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
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    textTransform: 'uppercase',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
}));

export default withNotificationSettings(NewsSettings);
