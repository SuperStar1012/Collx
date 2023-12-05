import React from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {Button} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {wp, hp} from 'utils';

const closeIcon = require('assets/icons/close.png');
const checkIcon = require('assets/icons/check.png');
const phoneImage = require('assets/imgs/camera/capture.png');

const data = [
  {
    label: 'Use a well-lit environment',
    icon: checkIcon,
  },
  {
    label: 'Use a dark background if possible',
    icon: checkIcon,
  },
  {
    label: 'Center card in frame with edges visible',
    icon: checkIcon,
  },
  {
    label: 'Avoid glare or reflections',
    icon: closeIcon,
  },
];

const ScanningTips = ({
  style,
  onClose,
}) => {
  const styles = useStyle();

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderTopBar = () => {
    return (
      <View style={styles.topBarContainer}>
        <Text style={styles.textTitle}>Scanning Tips</Text>
        <Button
          style={styles.closeButton}
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      </View>
    );
  };

  const renderList = () => {
    return (
      <View style={styles.listContainer}>
        {data.map((item, index) => (
          <View
            key={index}
            style={[
              styles.itemContainer,
              index === data.length - 1 && styles.lastItemContainer,
            ]}>
            <Image style={styles.iconItem} source={item.icon} />
            <Text style={styles.textItem}>{item.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.mainContainer}>
        {renderTopBar()}
        <Image style={styles.imagePhone} source={phoneImage} />
        {renderList()}
        <Button
          style={styles.gotItButton}
          icon={checkIcon}
          iconStyle={styles.iconItem}
          label="Got It"
          labelStyle={styles.textGotIt}
          scale={Button.scaleSize.Two}
          onPress={handleClose}
        />
      </View>
    </View>
  );
};

ScanningTips.defaultProps = {
  onClose: () => {},
};

ScanningTips.propTypes = {
  onClose: PropTypes.func,
};

export default ScanningTips;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    marginHorizontal: wp(6.4),
    backgroundColor: colors.primary,
    borderRadius: wp(6.4),
  },
  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(5.8),
    marginVertical: hp(2.2),
  },
  closeButton: {
    position: 'absolute',
    left: 0,
  },
  iconClose: {
    width: 28,
    height: 28,
    tintColor: Colors.white,
  },
  textTitle: {
    width: '100%',
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
    color: Colors.white,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  imagePhone: {
    alignSelf: 'center',
    height: hp(62),
    resizeMode: 'contain',
  },
  listContainer: {
    marginHorizontal: wp(5.8),
    marginTop: -wp(13),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  lastItemContainer: {
    marginTop: hp(1.1),
    marginBottom: 2,
  },
  iconItem: {
    width: 22,
    height: 22,
    tintColor: Colors.white,
  },
  textItem: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.white,
    marginLeft: 6,
  },
  gotItButton: {
    alignSelf: 'center',
    width: 130,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.white,
    marginVertical: hp(2.5),
  },
  textGotIt: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    letterSpacing: -0.41,
    marginLeft: 5,
    color: Colors.white,
  },
}));
