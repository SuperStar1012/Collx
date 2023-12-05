import React, {useEffect, useState} from 'react';
import {Text, Animated} from 'react-native';

import {Button} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';

const closeIcon = require('assets/icons/close.png');
const viewHeight = 44;

const OrderIn = ({
  isVisible,
  onClose,
}) => {

  const styles = useStyle();

  const [isOrderIn, setIsOrderIn] = useState(isVisible);
  const [animatedHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible && !isOrderIn) {
      // hide banner
      Animated.timing(animatedHeight, {
        toValue: -viewHeight,
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        if (onClose) {
          onClose();
        }
      });
    }
  }, [isVisible, isOrderIn]);

  const handleClose = () => {
    setIsOrderIn(false);
  };

  if (!isVisible) {
    return null;
  }

  const animatedOpacity = animatedHeight.interpolate({
    inputRange: [-viewHeight, 0],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {marginTop: animatedHeight, opacity: animatedOpacity}
      ]}
    >
      <Text style={styles.textDescription}>Your order's in!</Text>
      <Button
        icon={closeIcon}
        iconStyle={styles.iconClose}
        onPress={handleClose}
      />
    </Animated.View>
  );
};

export default OrderIn;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    height: viewHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.green,
  },
  textDescription: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.white,
  },
  iconClose: {
    width: 28,
    height: 28,
    tintColor: colors.white,
  },
}));
