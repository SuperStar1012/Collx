import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
} from 'react-native';

import {Button} from 'components';

import {withPushNotification} from 'store/containers';
import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {hp, setStorageItem} from 'utils';

const data = [
  'Messages from other users',
  'New users follow you',
  'Offers on your cards',
  'Comments and likes on your cards',
  'Significant changes in card values',
];

const NotificationSplash = props => {
  const {navigation, setPermissionCheckAllow} = props;

  const {t: {images}} = useTheme();
  const styles = useStyle();

  const handleNotNow = () => {
    setStorageItem(Constants.showedPushNotificationSplash, new Date().toString());
    navigation.goBack();
  };

  const handleEnableNotifications = () => {
    setStorageItem(Constants.showedPushNotificationSplash, new Date().toString());
    navigation.goBack();
    setPermissionCheckAllow(true);
  };

  const renderTitle = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.textTitle}>Get Notifications</Text>
      <View style={styles.notificationBadge} />
    </View>
  );

  const renderList = () => (
    <View style={styles.listContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <View style={styles.listItemDot} />
          <Text style={styles.textItem}>{item}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {renderTitle()}
        {renderList()}
        <Image
          style={styles.imageNotificationList}
          source={images.notificationList}
        />
      </View>
      <Button
        style={styles.notNowButton}
        label="Not Now"
        labelStyle={styles.textNotNow}
        scale={Button.scaleSize.Two}
        onPress={handleNotNow}
      />
      <Button
        style={styles.enableButton}
        label="Enable Notifications"
        labelStyle={styles.textEnable}
        scale={Button.scaleSize.One}
        onPress={handleEnableNotifications}
      />
    </SafeAreaView>
  );
};

export default withPushNotification(NotificationSplash);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  mainContainer: {
    flex: 1,
    paddingVertical: hp(2.5),
  },
  titleContainer: {
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  textTitle: {
    width: '100%',
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
    color: colors.primaryText,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
  },
  listContainer: {
    alignSelf: 'center',
    marginVertical: hp(4),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  listItemDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.darkGrayText,
    marginHorizontal: 10,
  },
  textItem: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.darkGrayText,
  },
  imageNotificationList: {
    alignSelf: 'center',
  },
  notNowButton: {
    alignSelf: 'center',
  },
  textNotNow: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    letterSpacing: -0.41,
    color: colors.primary,
  },
  enableButton: {
    alignSelf: 'stretch',
    height: 48,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: hp(2.8),
    backgroundColor: colors.primary,
  },
  textEnable: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    letterSpacing: -0.41,
    marginLeft: 5,
    color: Colors.white,
  },
}));
