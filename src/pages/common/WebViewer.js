import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';

import {NavBarButton, LoadingIndicator} from 'components';

import {createUseStyle, useTheme} from 'theme';

const closeIcon = require('assets/icons/close.png');

const WebViewer = ({
  navigation,
  route,
}) => {
  const {
    title,
    url,
    isCloseBack = true,
  } = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    if (isCloseBack) {
      navigation.setOptions({
        title: title || '',
        headerLeft: () => (
          <NavBarButton
            icon={closeIcon}
            iconStyle={styles.iconClose}
            onPress={handleClose}
          />
        ),
      });
    } else {
      navigation.setOptions({
        title: title || '',
      });
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isLoading} />
      <WebView
        style={{backgroundColor: colors.primaryBackground}}
        source={{uri: url}}
        javaScriptEnabled
        scrollEnabled
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));

export default WebViewer;
