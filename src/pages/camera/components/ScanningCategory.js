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

const checkIcon = require('assets/icons/check.png');
const phoneImage = require('assets/imgs/camera/category.png');

const ScanningCategory = ({
  onClose,
}) => {
  const styles = useStyle();

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.textTitle}>Got an unmatched card?</Text>
        <Image style={styles.imagePhone} source={phoneImage} />
        <View style={styles.descriptionContainer}>
          <Text style={styles.textDescription}>
            Did you select the right sport or category? Be sure to update the drop-down menu.
          </Text>
        </View>
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

ScanningCategory.defaultProps = {
  onClose: () => {},
};

ScanningCategory.propTypes = {
  onClose: PropTypes.func,
};

export default ScanningCategory;

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
  textTitle: {
    width: '100%',
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
    color: Colors.white,
    textTransform: 'capitalize',
    alignSelf: 'center',
    marginHorizontal: wp(5.8),
    marginVertical: hp(2.2),
  },
  imagePhone: {
    alignSelf: 'center',
    height: hp(62),
    resizeMode: 'contain',
  },
  descriptionContainer: {
    marginHorizontal: wp(5.8),
    marginTop: -wp(13),
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.white,
    marginLeft: 6,
  },
  iconItem: {
    width: 22,
    height: 22,
    tintColor: Colors.white,
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
