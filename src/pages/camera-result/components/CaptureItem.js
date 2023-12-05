import React, {Suspense, useMemo} from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  Button,
  CardPhotos,
} from 'components';
import CaptureItemContent from './CaptureItemContent';
import CaptureItemPlaceholder from './CaptureItemPlaceholder';

import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {getCount} from 'utils';

const failedMessages = {
  [Constants.cardSearchState.failedVisualSearch]: 'This scan failed to upload.',
  [Constants.cardSearchState.failedMedia]: 'This photo failed to upload.',
  [Constants.cardSearchState.failedCreate]: 'This scan failed to create.',
};

const failedActionLabels = {
  [Constants.cardSearchState.failedVisualSearch]: 'Reupload',
  [Constants.cardSearchState.failedMedia]: 'Reupload',
  [Constants.cardSearchState.failedCreate]: 'Retry',
};

const searchIcon = require('assets/icons/search.png');
const squareStackFillIcon = require('assets/icons/square_stack_fill.png');
const closeIcon = require('assets/icons/close.png');
const checkIcon = require('assets/icons/checkmark_circle_fill.png');
const chevronIcon = require('assets/icons/chevron_forward.png');
const reuploadIcon = require('assets/icons/arrow_circle.png');

const CaptureItem = ({
  style,
  userCard,
  updatedCardIds,
  searchedCards,
  possibleMatchCards,
  queryOptions,
  onPress,
  onPressMoreActions,
  onUpdate,
  onPressPossibleMatches,
  onRetryUploadMedia,
  onRetryCreateUserCard,
  onRetryVisualSearch,
  onEditAskingPrice,
  onSearchCard,
  onRemoveCard,
}) => {
  const {
    tradingCardId,
    sourceId,
    frontImageUrl,
    backImageUrl,
    front,
    back,
    cardState,
  } = userCard;

  const styles = useStyle();

  const isEditable = useMemo(() => (
    cardState !== Constants.cardSearchState.searching &&
    cardState !== Constants.cardSearchState.detected &&
    cardState !== Constants.cardSearchState.retryingCreate &&
    cardState !== Constants.cardSearchState.retryingUploadMedia
  ), [cardState]);

  const isSearchable = useMemo(() => (
    isEditable || cardState === Constants.cardSearchState.notDetected
  ), [isEditable, cardState]);

  const isPossibleMatches = useMemo(() => (
    !!possibleMatchCards[userCard.uuid] && possibleMatchCards[userCard.uuid]?.length > 1 &&
    searchedCards.findIndex(item => item.uuid === userCard.uuid) === -1
  ), [userCard, searchedCards, possibleMatchCards]);

  const possibleMatchesCount = useMemo(() => (
    Math.max(possibleMatchCards[userCard.uuid]?.filter(item => item.id !== userCard.id).length, 0)
  ), [userCard, possibleMatchCards]);

  const isUpdated = useMemo(() => (
    updatedCardIds.findIndex(uuid => uuid === userCard.uuid) > -1
  ), [userCard, updatedCardIds]);

  const handleSelect = () => {
    if (onPress) {
      onPress(userCard);
    }
  };

  const handleSearchCard = () => {
    if (onSearchCard) {
      onSearchCard();
    }
  };

  const handleRemoveCard = () => {
    if (onRemoveCard) {
      onRemoveCard();
    }
  };

  const handleChangedCondition = values => {
    if (onUpdate) {
      onUpdate(tradingCardId, values);
    }
  };

  const handleMoreAction = () => {
    if (onPressMoreActions) {
      onPressMoreActions();
    }
  };

  const handlePossibleMatches = () => {
    if (onPressPossibleMatches) {
      onPressPossibleMatches(userCard);
    }
  };

  const handleRetryCreateUserCard = () => {
    if (onRetryCreateUserCard) {
      onRetryCreateUserCard(userCard);
    }
  };

  const handleRetryUploadMedia = () => {
    if (onRetryUploadMedia) {
      onRetryUploadMedia(userCard);
    }
  };

  const handleRetryVisualSearch = () => {
    if (onRetryVisualSearch) {
      onRetryVisualSearch(userCard);
    }
  };

  const handleRetry = () => {
    if (cardState === Constants.cardSearchState.failedVisualSearch) {
      handleRetryVisualSearch();
    } else if (cardState === Constants.cardSearchState.failedMedia) {
      handleRetryUploadMedia();
    } else if (cardState === Constants.cardSearchState.failedCreate) {
      handleRetryCreateUserCard();
    }
  };

  const handleAskingPrice = (tradingCard) => {
    if (onEditAskingPrice) {
      onEditAskingPrice(tradingCard);
    }
  };

  const renderPlaceholder = () => (
    <CaptureItemPlaceholder onPressMoreActions={handleMoreAction} />
  );

  const renderCardInfo = () => {
    if (
      cardState === Constants.cardSearchState.searching ||
      cardState === Constants.cardSearchState.retryingCreate ||
      cardState === Constants.cardSearchState.retryingUploadMedia
    ) {
      return renderPlaceholder();
    } else if (
      cardState === Constants.cardSearchState.failedVisualSearch ||
      cardState === Constants.cardSearchState.failedCreate ||
      cardState === Constants.cardSearchState.failedMedia
    ) {
      return (
        <View style={styles.infoContainer}>
          <Text style={styles.textDescription}>
            {failedMessages[cardState]}
          </Text>
          <Button
            style={styles.notDetectButton}
            icon={reuploadIcon}
            iconStyle={styles.iconSearch}
            label={failedActionLabels[cardState]}
            labelStyle={[styles.textButton, styles.textSearch]}
            scale={Button.scaleSize.Two}
            onPress={handleRetry}
          />
          <Button
            style={styles.notDetectButton}
            icon={closeIcon}
            iconStyle={styles.iconRemove}
            label="Remove Scan"
            labelStyle={[styles.textButton, styles.textRemove]}
            scale={Button.scaleSize.Two}
            onPress={handleRemoveCard}
          />
        </View>
      );
    } else if (cardState === Constants.cardSearchState.notDetected) {
      return (
        <View style={styles.infoContainer}>
          <Text style={styles.textDescription}>
            We weren’t able to recognize this card. You can search for this card
            manually, or discard this scan.
          </Text>
          <Button
            style={styles.notDetectButton}
            icon={searchIcon}
            iconStyle={styles.iconSearch}
            label="Search for Card"
            labelStyle={[styles.textButton, styles.textSearch]}
            scale={Button.scaleSize.Two}
            disabled={!isSearchable}
            onPress={handleSearchCard}
          />
          <Button
            style={styles.notDetectButton}
            icon={closeIcon}
            iconStyle={styles.iconRemove}
            label="Remove Scan"
            labelStyle={[styles.textButton, styles.textRemove]}
            scale={Button.scaleSize.Two}
            onPress={handleRemoveCard}
          />
        </View>
      );
    } else if (!tradingCardId) {
      return renderPlaceholder();
    }

    return (
      <Suspense fallback={renderPlaceholder()}>
        <CaptureItemContent
          tradingCardId={tradingCardId}
          isEditable={isEditable}
          queryOptions={queryOptions}
          onPressMoreActions={handleMoreAction}
          onEditAskingPrice={handleAskingPrice}
          onUpdate={handleChangedCondition}
        />
      </Suspense>
    );
  };

  const renderCardInfoUpdated = () => {
    if (!isUpdated) {
      return null;
    }

    return (
      <View style={styles.cardInfoUpdatedContainer}>
        <Image style={styles.iconCheck} source={checkIcon} />
        <Text style={styles.textCardInfoUpdated}>Card info updated.</Text>
      </View>
    );
  };

  const renderPossibleMatches = () => {
    if (!isPossibleMatches || !sourceId) {
      return null;
    }

    if (!isEditable) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.possibleMatchesContainer}
        activeOpacity={0.8}
        onPress={handlePossibleMatches}>
        <Image
          style={styles.iconSquareStackFill}
          source={squareStackFillIcon}
        />
        <Text style={styles.textPossibleMatches}>
          {`${getCount(possibleMatchesCount)} variant${possibleMatchesCount > 1 ? 's' : ''}, tap to change selection`}
        </Text>
        <Image style={styles.iconMatchChevron} source={chevronIcon} />
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.8}
      onPress={handleSelect}
    >
      <View style={styles.mainContainer}>
        <CardPhotos
          style={styles.cardPhotoContainer}
          imageContainerStyle={styles.cardPhotoItemContainer}
          isCameraCapture={true}
          frontUri={front || frontImageUrl}
          backUri={back || backImageUrl}
          // cardState={!id ? cardState : Constants.cardSearchState.none}
          cardState={cardState}
        />
        {renderCardInfo()}
      </View>
      {renderCardInfoUpdated()}
      {renderPossibleMatches()}
      {/* {renderPhotoUploadFailed()} */}
    </TouchableOpacity>
  );
};

CaptureItem.defaultProps = {
  isUpdated: false,
  isPossibleMatches: false,
  possibleMatchesCount: 0,
  onPress: () => {},
  onPressMoreActions: () => {},
  onUpdate: () => {},
  onSearchCard: () => {},
  onRemoveCard: () => {},
  onPressPossibleMatches: () => {},
  onRetryUploadMedia: () => {},
  onRetryCreateUserCard: () => {},
  onRetryVisualSearch: () => {},
  onEditAskingPrice: () => {},
};

CaptureItem.propTypes = {
  userCard: PropTypes.object,
  isUpdated: PropTypes.bool,
  isPossibleMatches: PropTypes.bool,
  possibleMatchesCount: PropTypes.number,
  onPress: PropTypes.func,
  onPressMoreActions: PropTypes.func,
  onUpdate: PropTypes.func,
  onSearchCard: PropTypes.func,
  onRemoveCard: PropTypes.func,
  onPressPossibleMatches: PropTypes.func,
  onRetryUploadMedia: PropTypes.func,
  onRetryCreateUserCard: PropTypes.func,
  onRetryVisualSearch: PropTypes.func,
  onEditAskingPrice: PropTypes.func,
};

export default CaptureItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    // height: 80,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryBorder,
    backgroundColor: colors.primaryCardBackground,
  },
  cardPhotoContainer: {
    width: 94,
    height: 135,
    marginHorizontal: 0,
  },
  cardPhotoItemContainer: {
    width: 84,
    height: 115,
    borderRadius: 3,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  infoContainer: {
    flex: 1,
    height: '100%',
    marginLeft: 12,
    justifyContent: 'space-between',
    elevation: 1,
  },
  cardInfoUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  textCardInfoUpdated: {
    fontSize: 13,
    lineHeight: 15,
    letterSpacing: -0.004,
    color: colors.updated,
  },
  iconCheck: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 3,
    tintColor: Colors.lightGreen,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.lightGrayText,
  },
  possibleMatchesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    borderRadius: 100,
    paddingVertical: 4,
    backgroundColor: Colors.yellowAlphaHalf1,
  },
  iconSquareStackFill: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: Colors.yellow,
    marginRight: 5,
    transform: [{rotate: '90deg'}],
  },
  iconMatchChevron: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: Colors.yellow,
  },
  textPossibleMatches: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: Colors.yellow,
  },
  textButton: {
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: -0.24,
    fontWeight: Fonts.semiBold,
  },
  notDetectButton: {
    height: 30,
    borderRadius: 4,
    backgroundColor: colors.secondaryCardBackground,
  },
  iconSearch: {
    width: 22,
    height: 22,
    marginRight: 3,
    tintColor: colors.primary,
  },
  textSearch: {
    color: colors.primary,
  },
  iconRemove: {
    width: 22,
    height: 22,
    marginRight: 3,
    tintColor: Colors.red,
  },
  textRemove: {
    color: Colors.red,
  },
}));
