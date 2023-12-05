import React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
} from 'react-native';

// import Button from '../common/Button';

import {createUseStyle, useTheme} from 'theme';
import {withMaintenance} from 'store/containers';

const maintenanceIcon = require('assets/icons/more/maintenance.png');

export const Maintenance = () => {
  const {t: {icons}} = useTheme();
  const styles = useStyle();

  // const handleNotifyMe = () => {};

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.contentContainer}>
        <Image style={styles.iconLogo} source={icons.logo} />
        <View style={styles.centerContainer}>
          <Image style={styles.iconMaintenance} source={maintenanceIcon} />
          <Text style={styles.textDescription}>
            Our servers are currently undergoing some updates. Please come back later.
          </Text>
        </View>
        {/* <Button
          style={styles.notifyButton}
          labelStyle={styles.textNotify}
          label="Notify Me When It’s Done"
          scale={Button.scaleSize.One}
          onPress={handleNotifyMe}
        /> */}
      </SafeAreaView>
    </View>
  );
};

export default withMaintenance(Maintenance);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 16,
  },
  iconLogo: {
    width: 120,
    height: 33,
    resizeMode: 'contain',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  iconMaintenance: {
    width: 120,
    height: 120,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    textAlign: 'center',
    marginTop: 24,
  },
  // notifyButton: {
  //   height: 48,
  //   width: '100%',
  //   borderRadius: 10,
  //   backgroundColor: colors.primary,
  // },
  // textNotify: {
  //   fontWeight: Fonts.semiBold,
  //   fontSize: 17,
  //   lineHeight: 22,
  //   letterSpacing: -0.41,
  //   color: Colors.white,
  // },
}));
