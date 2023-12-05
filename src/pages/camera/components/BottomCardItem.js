import React, {Suspense, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  CardPhotos,
  CardFailIcon,
} from 'components';
import BottomCardItemContent from './BottomCardItemContent';
import BottomCardItemPlaceholder from './BottomCardItemPlaceholder';

import {Constants, Styles} from 'globals';
import {Colors, Fonts} from 'theme';
import {wp, getCardPriceForApi, encodeId} from 'utils';
import {usePrevious} from 'hooks';
import {soundTypes, playSound} from 'services';
import {withSettings} from 'store/containers';

const BottomCardItem = props => {
  const {
    style,
    isFirstCard,
    isFullWidth,
    isPreviewFrontCard,
    isPreviewBackCard,
    isFrontOnly,
    cardState,
    card,
    cameraSoundEffect,
    queryOptions,
    onLayout,
    onSearchCard,
    onRetryVisualSearch,
    onShowCardVariants,
    onEditScan,
    onRemoveScan,
  } = props;

  const tradingCardId = card.tradingCardId || (card.cardId && encodeId(Constants.base64Prefix.tradingCard, card.id));

  const frontUri = card && (card[Constants.cardFrontPhoto] || card.frontImageUrl);
  const backUri = card && (card[Constants.cardBackPhoto] || card.backImageUrl);

  const containerViewRef = useRef(null);

  const prevProps = usePrevious({cardState});

  const isFailedVisualSearch = cardState === Constants.cardSearchState.failedVisualSearch;
  const isNotDetectedCard = cardState === Constants.cardSearchState.notDetected;
  const isSucceedCard = cardState === Constants.cardSearchState.created || cardState === Constants.cardSearchState.updated;
  const isFailedCreateCard = cardState === Constants.cardSearchState.failedCreate;
  const isFailedUploadPhoto = cardState === Constants.cardSearchState.failedMedia;

  useEffect(() => {
    if (cameraSoundEffect !== Constants.soundEffectSettings.on) {
      return;
    }

    if (prevProps?.cardState !== Constants.cardSearchState.searching) {
      return;
    }

    if (cardState === Constants.cardSearchState.detected) {
      // Success
      const cardPrice = getCardPriceForApi(card);

      if (cardPrice.price > 10) {
        playSound(soundTypes.greater);
      } else {
        playSound(soundTypes.success);
      }
    } else if (
      cardState === Constants.cardSearchState.notDetected ||
      cardState === Constants.cardSearchState.failedVisualSearch ||
      cardState === Constants.cardSearchState.failedCreate ||
      cardState === Constants.cardSearchState.failedMedia
    ) {
      // Fail
      playSound(soundTypes.fail);
    }
  }, [cardState, cameraSoundEffect]);

  const handleLayoutPhoto = target => {
    if (target && containerViewRef.current) {
      target.measureLayout(containerViewRef.current, (x, y) => {
        onLayout(containerViewRef.current, {x, y});
      });
    }
  };

  const handlePress = () => {
    if (isFailedVisualSearch) {
      if (onRetryVisualSearch) {
        onRetryVisualSearch(card);
      }
    } else if (isFailedCreateCard) {
      if (onRetryVisualSearch) {
        onRetryVisualSearch(card);
      }
    } else if (isFailedUploadPhoto) {
      if (onRetryVisualSearch) {
        onRetryVisualSearch(card);
      }
    } else if (isNotDetectedCard) {
      if (onSearchCard) {
        onSearchCard(card);
      }
    } else if (isSucceedCard) {
      if (onShowCardVariants) {
        onShowCardVariants(card);
      }
    }
  };

  const handleLongPress = () => {
    if (isFailedVisualSearch || isFailedCreateCard || isFailedUploadPhoto) {
      if (onRemoveScan) {
        onRemoveScan(card);
      }
    } else if (isSucceedCard || isNotDetectedCard) {
      if (onEditScan) {
        onEditScan(card);
      }
    }
  };

  const renderCardInfo = () => {
    if (cardState === Constants.cardSearchState.searching || !tradingCardId) {
      return (
        <BottomCardItemPlaceholder />
      );
    }

    return (
      <Suspense fallback={<BottomCardItemPlaceholder />}>
        <BottomCardItemContent
          tradingCardId={tradingCardId}
          queryOptions={queryOptions}
        />
      </Suspense>
    );
  };

  const renderScanText = text => {
    return (
      <Text style={styles.textDescription}>
        Scan or upload the
        <Text style={styles.textDescriptionBold}> {text} </Text>of your card
      </Text>
    );
  };

  const renderMainContent = () => {
    let description = null;
    if (isNotDetectedCard) {
      description = 'Unrecognized. Verify category above. If correct, tap to search and manually fix.';
    } else if (isFailedVisualSearch) {
      description = 'This scan failed to upload. Tap to retry.';
    } else if (isFailedUploadPhoto) {
      description = 'This photo failed to upload. Tap to retry.';
    } else if (isFailedCreateCard) {
      description = 'This scan failed to create. Tap to retry.';
    }

    if (description) {
      return (
        <Text style={styles.textDescription}>
          {description}
        </Text>
      );
    }

    if ((isFrontOnly && frontUri) || (frontUri && backUri)) {
      return renderCardInfo();
    }

    if (isPreviewFrontCard && isPreviewBackCard) {
      return null;
    } else if (isPreviewFrontCard) {
      return renderScanText('back');
    }

    return renderScanText('front');
  };

  const width = isFullWidth ? Styles.windowWidth - 32 : wp(80);
  const marginLeft = isFirstCard || !isFullWidth ? 16 : 8;

  return (
    <TouchableOpacity
      ref={containerViewRef}
      style={[styles.container, {width, marginLeft}, style]}
      activeOpacity={0.9}
      disabled={cardState === Constants.cardSearchState.current}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <CardPhotos
        style={styles.cardPhotoContainer}
        imageContainerStyle={styles.cardPhotoItemContainer}
        frontUri={frontUri}
        backUri={backUri}
        isCameraCapture
        isPreviewFrontCard={isPreviewFrontCard}
        isPreviewBackCard={isPreviewBackCard}
        isFrontOnly={isFrontOnly}
        cardState={cardState}
        onLayout={handleLayoutPhoto}
      />
      {renderMainContent()}
      <CardFailIcon
        isNotDetected={isNotDetectedCard}
        isFailed={isFailedVisualSearch}
      />
    </TouchableOpacity>
  );
};

BottomCardItem.defaultProps = {
  cardState: Constants.cardSearchState.none,
  isFirstCard: false,
  isFullWidth: false,
  isPreviewFrontCard: false,
  isPreviewBackCard: false,
  isFrontOnly: false,
  onLayout: () => {},
  onRetryVisualSearch: () => {},
  onRetryCreateUserCard: () => {},
  onRetryUploadMedia: () => {},
  onSearchCard: () => {},
  onShowCardVariants: () => {},
  onEditScan: () => {},
  onRemoveScan: () => {},
};

BottomCardItem.propTypes = {
  isFirstCard: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  frontUri: PropTypes.string,
  backUri: PropTypes.string,
  isPreviewFrontCard: PropTypes.bool,
  isPreviewBackCard: PropTypes.bool,
  isFrontOnly: PropTypes.bool,
  cardState: PropTypes.number,
  card: PropTypes.object,
  onLayout: PropTypes.func,
  onRetryVisualSearch: PropTypes.func,
  onRetryCreateUserCard: PropTypes.func,
  onRetryUploadMedia: PropTypes.func,
  onSearchCard: PropTypes.func,
  onShowCardVariants: PropTypes.func,
  onEditScan: PropTypes.func,
  onRemoveScan: PropTypes.func,
};

export default withSettings(BottomCardItem);

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.lightGrayAlpha1,
    // marginHorizontal: 4,
  },
  textDescription: {
    flex: 1,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: -0.08,
    color: Colors.whiteAlpha5,
  },
  textDescriptionBold: {
    fontWeight: Fonts.bold,
    color: Colors.white,
  },
  cardPhotoContainer: {
    width: Styles.cameraBottomBarSmallCard.width,
    height: Styles.cameraBottomBarSmallCard.height,
  },
  cardPhotoItemContainer: {
    width: Styles.cameraBottomBarSmallCardImage.width,
    height: Styles.cameraBottomBarSmallCardImage.height,
  },
});
