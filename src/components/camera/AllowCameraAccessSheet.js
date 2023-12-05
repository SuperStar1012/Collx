import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Platform,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {openSettings} from 'react-native-permissions';

import {Button, BottomSheetModal} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';

const allowSteps = Platform.select({
  ios: [
    {
      label: 'Open iPhone Settings',
      icon: require('assets/icons/access/ios_settings.png')
    },
    {
      label: 'Tap Privacy',
      icon: require('assets/icons/access/ios_privacy.png')
    },
    {
      label: 'Tap Camera',
      icon: require('assets/icons/access/ios_camera.png')
    },
    {
      label: 'Toggle on CollX',
      icon: require('assets/icons/access/ios_toggle.png')
    },
  ],
  android: [
    {
      label: 'Open Phone Settings',
      icon: require('assets/icons/access/android_settings.png')
    },
    {
      label: 'Tap Apps',
      icon: require('assets/icons/access/android_apps.png')
    },
    {
      label: 'Select CollX',
      icon: require('assets/icons/access/collx.png')
    },
    {
      label: 'Select Camera Permission',
      icon: require('assets/icons/access/android_camera.png')
    },
    {
      label: 'Enable Camera Access',
      icon: require('assets/icons/access/android_toggle.png')
    },
  ],
});

const AllowCameraAccessSheet = ({
  style,
  isVisible,
  onClose,
}) => {
  const styles = useStyle();

  const bottomSheetRef = useRef(null);

  useEffect(() => {
    if (!bottomSheetRef.current) {
      return;
    }

    if (isVisible) {
      setTimeout(() => {
        bottomSheetRef.current?.present();
      });
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleOpenSettings = () => {
    openSettings().catch(() => console.log('cannot open settings'));

    bottomSheetRef.current?.dismiss();
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image style={styles.icon} source={item.icon} />
      <Text style={styles.textLabel}>{item.label}</Text>
    </View>
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      height={Platform.select({
        ios: 476,
        android: 574
      })}
      title="Allow CollX to access your camera"
      onClose={handleClose}
    >
      <View style={[styles.container, style]}>
        <Text style={styles.textDescription}>CollX needs to have access to your phone’s camera to scan your cards and get the value.</Text>
        <FlatList
          style={styles.listContainer}
          data={allowSteps}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
          />
        <Button
          style={styles.button}
          label="Go To Settings"
          labelStyle={styles.textButton}
          scale={Button.scaleSize.One}
          onPress={handleOpenSettings}
        />
      </View>
    </BottomSheetModal>
  );
};

AllowCameraAccessSheet.defaultProps = {
  isVisible: false,
  onClose: () => {},
};

AllowCameraAccessSheet.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AllowCameraAccessSheet;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    paddingHorizontal: 16,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  listContainer: {
    marginTop: 18,
    marginHorizontal: 28,
  },
  button: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginTop: 18,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    textTransform: 'capitalize',
    color: Colors.white,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  icon: {
    width: 50,
    height: 50,
  },
  textLabel: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    marginLeft: 12,
  },
}));
