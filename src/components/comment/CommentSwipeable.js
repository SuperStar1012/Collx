import React, {useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import {Colors} from 'theme';
import {Button} from 'components';

const exclamationIcon = require('assets/icons/exclamation.png');

const CommentSwipeable = ({
  style,
  children,
  onReport,
}) => {
  const swipeableRef = useRef(null);

  const handleClose = () => {
    swipeableRef.current?.close();
  };

  const handleReport = () => {
    handleClose();

    if (onReport) {
      onReport();
    }
  };

  const renderRightActions = (progress) => {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [60, 0],
    });

    return (
      <View style={styles.swipeableContainer}>
        <Animated.View style={[styles.swipeableContentContainer, {transform: [{translateX}]}]}>
          <Button
            style={styles.swipeableButton}
            icon={exclamationIcon}
            iconStyle={styles.iconExclamation}
            scale={Button.scaleSize.Four}
            onPress={handleReport}
          />
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      containerStyle={style}
      friction={2}
      renderRightActions={renderRightActions}
    >
      {children}
    </Swipeable>
  );
};

export default CommentSwipeable;

const styles = StyleSheet.create({
  swipeableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swipeableContentContainer: {
    width: 60,
  },
  swipeableButton: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.gray,
  },
  iconExclamation: {
    width: 28,
    height: 28,
    tintColor: Colors.white,
  },
});
