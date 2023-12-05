import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {Image} from 'components';

import {Styles, Constants} from 'globals';
import {Colors} from 'theme';

const cardBorderFrontImage = require('assets/icons/camera/card_border_front.png');
const cardBorderBackImage = require('assets/icons/camera/card_border_back.png');
const cardBorderBothImage = require('assets/icons/camera/card_border_both.png');
const cardBorderFrontOnlyImage = require('assets/icons/camera/card_border_front_only.png');

const CardPhotos = props => {
  const {
    style,
    imageContainerStyle,
    frontUri,
    backUri,
    cardState,
    isCameraCapture,
    // isCurrentCard,
    // isNotDetected,
    isPreviewFrontCard,
    isPreviewBackCard,
    isFrontOnly,
    onLayout,
  } = props;
  const containerViewRef = useRef(null);

  useEffect(() => {
    if (containerViewRef && cardState === Constants.cardSearchState.current && onLayout) {
      setTimeout(() => {
        onLayout(containerViewRef.current);
      }, 100);
    }
  }, [cardState, containerViewRef]);

  const renderBorder = () => {
    if (!isCameraCapture) {
      return null;
    }

    if ((isFrontOnly && frontUri) || (frontUri && backUri)) {
      return null;
    }

    let borderImage = cardBorderFrontImage;

    if (isFrontOnly) {
      borderImage = cardBorderFrontOnlyImage;
    } else if (isPreviewFrontCard && isPreviewBackCard) {
      borderImage = cardBorderBothImage;
    } else if (isPreviewFrontCard) {
      borderImage = cardBorderBackImage;
    }

    return (
      <Image
        style={[styles.imageBorder, isFrontOnly ? imageContainerStyle : {}]}
        source={borderImage}
      />
    );
  };

  const renderStateCover = () => {
    if (cardState === Constants.cardSearchState.searching) {
      return (
        <View style={[styles.stateCoverContainer, styles.searchingContainer]} />
      );
    }

    return null;
  };

  const renderFrontCard = () => {
    if (!frontUri) {
      return null;
    }

    return (
      <View
        style={[
          styles.itemContainer,
          isFrontOnly ? {} : styles.frontContainer,
          imageContainerStyle,
        ]}>
        <Image style={styles.imageCard} source={frontUri} />
        {renderStateCover()}
      </View>
    );
  };

  const renderBackCard = () => {
    if (isFrontOnly || !backUri) {
      return null;
    }

    return (
      <View
        style={[
          styles.itemContainer,
          styles.backContainer,
          imageContainerStyle,
        ]}>
        <Image style={styles.imageCard} source={backUri} />
        {renderStateCover()}
      </View>
    );
  };

  const renderCards = () => {
    if (!isCameraCapture) {
      return (
        <View style={[styles.oneItemContainer, imageContainerStyle]}>
          <Image
            style={styles.imageCard}
            source={frontUri || Constants.defaultCardImage}
          />
          {renderStateCover()}
        </View>
      );
    }

    return (
      <>
        {renderFrontCard()}
        {renderBackCard()}
      </>
    );
  };

  return (
    <View ref={containerViewRef} style={[styles.container, style]}>
      {renderBorder()}
      {renderCards()}
      {/* {renderStateIcon()} */}
    </View>
  );
};

CardPhotos.defaultProps = {
  cardState: Constants.cardSearchState.none,
  isCameraCapture: false,
  isPreviewFrontCard: false,
  isPreviewBackCard: false,
  isFrontOnly: false,
  frontUri: null,
  backUri: null,
  onLayout: () => {},
};

CardPhotos.propTypes = {
  cardState: PropTypes.number,
  isCameraCapture: PropTypes.bool,
  isPreviewFrontCard: PropTypes.bool,
  isPreviewBackCard: PropTypes.bool,
  isFrontOnly: PropTypes.bool,
  frontUri: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  backUri: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onLayout: PropTypes.func,
};

export default CardPhotos;

const styles = StyleSheet.create({
  container: {
    width: Styles.cameraBottomBarCard.width,
    height: Styles.cameraBottomBarCard.height,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    width: Styles.cameraBottomBarCardImage.width,
    height: Styles.cameraBottomBarCardImage.height,
    borderRadius: 2,
    overflow: 'hidden',
  },
  oneItemContainer: {
    width: Styles.cameraBottomBarCardImage.width + 3,
    height: Styles.cameraBottomBarCardImage.height + 5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  frontContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    elevation: 1,
  },
  backContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  imageBorder: {
    position: 'absolute',
    width: '100%',
    height: '90%',
    borderRadius: 2,
    resizeMode: 'contain',
  },
  imageCard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  stateCoverContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  searchingContainer: {
    backgroundColor: Colors.blackAlpha4,
  },
  failedContainer: {
    backgroundColor: Colors.whiteAlpha6,
  },
});
