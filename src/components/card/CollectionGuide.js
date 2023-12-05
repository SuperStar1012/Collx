import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {Button} from 'components';

import {Colors, Fonts, createUseStyle, useTheme} from 'theme';

const cameraIcon = require('assets/icons/camera.png');
const searchIcon = require('assets/icons/search.png');

const CollectionGuide = props => {
  const {
    style,
    title,
    description,
    disabledActions,
    isSmall,
    onStartScan,
    onAddManualCard,
  } = props;

  const {t: {images}} = useTheme();
  const styles = useStyle();

  const renderActions = () => {
    if (disabledActions) {
      return null;
    }

    return (
      <>
        <Button
          style={[styles.button, styles.startScanButton]}
          icon={cameraIcon}
          iconStyle={styles.iconCamera}
          label="Start Scanning"
          labelStyle={[styles.textButton, styles.textStartScan]}
          scale={Button.scaleSize.One}
          onPress={onStartScan}
        />
        <Button
          style={[styles.button, styles.addCardsButton]}
          icon={searchIcon}
          iconStyle={styles.iconSearch}
          label="Add cards Manually"
          labelStyle={[styles.textButton, styles.textAddCards]}
          scale={Button.scaleSize.One}
          onPress={onAddManualCard}
        />
      </>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.backgroundContainer}>
        <Image
          style={[
            styles.imageBackground,
            isSmall ? styles.smallBackgroundContainer : {},
          ]}
          source={
            isSmall
              ? images.emptyCardSmallBackground
              : images.emptyCardLargeBackground
          }
        />
      </View>
      <View
        style={[
          styles.contentContainer,
          isSmall ? styles.smallContentContainer : {},
        ]}>
        <Text style={styles.textTitle}>{title}</Text>
        <Text style={styles.textSubTitle}>{description}</Text>
        {renderActions()}
      </View>
    </View>
  );
};

CollectionGuide.defaultProps = {
  disabledActions: false,
  isSmall: false,
  onStartScan: () => {},
  onAddManualCard: () => {},
};

CollectionGuide.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  disabledActions: PropTypes.bool,
  isSmall: PropTypes.bool,
  onStartScan: PropTypes.func,
  onAddManualCard: PropTypes.func,
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBackgroundContainer: {
    marginHorizontal: 20,
  },
  imageBackground: {
    width: '100%',
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  smallContentContainer: {
    paddingVertical: 20,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.primaryText,
    letterSpacing: 0.35,
    textAlign: 'center',
  },
  textSubTitle: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    width: 216,
    height: 40,
    borderRadius: 10,
  },
  startScanButton: {
    backgroundColor: colors.primary,
    marginTop: 24,
  },
  addCardsButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: 16,
  },
  iconCamera: {
    width: 28,
    height: 28,
    tintColor: Colors.white,
  },
  iconSearch: {
    width: 28,
    height: 28,
    tintColor: colors.primary,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    textAlign: 'center',
    marginLeft: 8,
  },
  textStartScan: {
    color: Colors.white,
  },
  textAddCards: {
    color: colors.primary,
  },
}));

export default CollectionGuide;
