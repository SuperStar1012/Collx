import React from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {Grayscale} from 'react-native-color-matrix-image-filters';

import {Image, Button} from 'components';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {wp} from 'utils';

const cameraIcon = require('assets/icons/camera.png');
const resetIcon = require('assets/icons/arrow_circle.png');

const CardCapture = props => {
  const {
    style,
    isCapture,
    isEdit,
    initFrontImageUrl,
    frontImageUrl,
    initBackImageUrl,
    backImageUrl,
    onCapture,
    onResetPhotos,
  } = props;

  const styles = useStyle();

  const handleCapturePhotos = () => {
    if (onCapture) {
      onCapture();
    }
  };

  const handleRetakePhotos = () => {
    if (onCapture) {
      onCapture();
    }
  };

  const handleResetPhotos = () => {
    if (onResetPhotos) {
      onResetPhotos();
    }
  };

  const renderActions = () => {
    if (!isCapture) {
      return null;
    }

    if (
      frontImageUrl === initFrontImageUrl ||
      backImageUrl === initBackImageUrl
    ) {
      return (
        <Button
          icon={cameraIcon}
          iconStyle={styles.iconButton}
          label="Capture Photos"
          labelStyle={styles.textButton}
          scale={Button.scaleSize.Two}
          onPress={handleCapturePhotos}
        />
      );
    }

    return (
      <>
        <Button
          icon={cameraIcon}
          iconStyle={styles.iconButton}
          label="Retake Photos"
          labelStyle={styles.textButton}
          scale={Button.scaleSize.Two}
          onPress={handleRetakePhotos}
        />
        <Button
          icon={resetIcon}
          iconStyle={styles.iconButton}
          label="Reset Photos"
          labelStyle={styles.textButton}
          scale={Button.scaleSize.Two}
          onPress={handleResetPhotos}
        />
      </>
    );
  };

  const renderFrontImage = () => {
    if (!isEdit && frontImageUrl === initFrontImageUrl) {
      return (
        <Grayscale>
          <Image
            style={styles.imageCard}
            source={frontImageUrl || Constants.defaultCardImage}
          />
        </Grayscale>
      );
    }

    return (
      <Image
        style={styles.imageCard}
        source={frontImageUrl || Constants.defaultCardImage}
      />
    );
  };

  const renderBackImage = () => {
    if (!isEdit && backImageUrl === initBackImageUrl) {
      return (
        <Grayscale>
          <Image
            style={styles.imageCard}
            source={backImageUrl || Constants.defaultCardImage}
          />
        </Grayscale>
      );
    }

    return (
      <Image
        style={styles.imageCard}
        source={backImageUrl || Constants.defaultCardImage}
      />
    );
  };

  return (
    <View
      style={[styles.container, {height: isCapture ? wp(76) : wp(68)}, style]}>
      <View style={styles.cardFrontBackContainer}>
        {renderFrontImage()}
        {renderBackImage()}
      </View>
      <View style={styles.actionsContainer}>{renderActions()}</View>
    </View>
  );
};

CardCapture.defaultProps = {
  isCapture: true,
  isEdit: false,
  onCapture: () => {},
  onResetPhotos: () => {},
};

CardCapture.propTypes = {
  isCapture: PropTypes.bool,
  isEdit: PropTypes.bool,
  initFrontImageUrl: PropTypes.string,
  frontImageUrl: PropTypes.string,
  initBackImageUrl: PropTypes.string,
  backImageUrl: PropTypes.string,
  onCapture: PropTypes.func,
  onResetPhotos: PropTypes.func,
};

export default CardCapture;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: wp(100),
    height: wp(76),
    backgroundColor: colors.secondaryCardBackground,
    marginBottom: 16,
  },
  cardFrontBackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp(4),
    marginTop: wp(4),
  },
  imageCard: {
    width: wp(44),
    height: wp(60),
  },
  actionsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 16,
  },
  iconButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  textButton: {
    fontWeight: Fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    textAlign: 'center',
    color: colors.primary,
    marginLeft: 6,
  },
}));
