import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  Button,
  BlurView,
  ScanEditSheet,
  ScanRemoveSheet,
} from 'components';
import BottomCardItem from './BottomCardItem';

import {Constants, Styles} from 'globals';
import {Colors, createUseStyle} from 'theme';

const photosIcon = require('assets/icons/photo_rectangle.png');
const arrowRightIcon = require('assets/icons/arrow_forward_square_fill.png');

const CameraBottomBar = ({
  style,
  rootViewRef,
  cards,
  isDisabledTake,
  isDisabledLibrary,
  isDisabledResult,
  isShowCardList,
  isPreviewFrontCard,
  isPreviewBackCard,
  cardCaptureMode,
  queryOptions,
  onLayoutListCard,
  onOpenPhotos,
  onTakePhoto,
  onShowSearchResult,
  onSearchCard,
  onRetryVisualSearch,
  onRetryCreateUserCard,
  onRetryUploadMedia,
  onShowCardVariants,
  onRemoveScan,
}) => {
  const styles = useStyle();

  const cardListRef = useRef(null);
  const editingScanRef = useRef({});

  const [isVisibleRemoveScan, setIsVisibleRemoveScan] = useState(false);
  const [isVisibleEditScan, setIsVisibleEditScan] = useState(false);

  const [maxCount, setMaxCount] = useState(cards.length);
  const [currentItemPosition, setCurrentItemPosition] = useState({x: 0, y: 0});
  const [contentOffsetX, setContentOffsetX] = useState(0);

  const allCards = useMemo(() => {
    const allCards = [...cards];
    for (let i = allCards.length; i < maxCount; i++) {
      allCards.push(null);
    }

    return allCards;
  }, [cards, maxCount]);

  useEffect(() => {
    let index = cards.length - 1;
    if (index < 0) {
      index = 0;
    }

    setMaxCount(cards.length + 1);

    setTimeout(() => {
      if (cardListRef.current) {
        try {
          cardListRef.current.scrollToIndex({index});
        } catch (error) {
          console.log(error);
        }
      }
    }, 100);
  }, [cards.length]);

  const handleScroll = ({nativeEvent}) => {
    const offsetX = nativeEvent.contentOffset.x;
    setContentOffsetX(offsetX);
    setLayoutListCard(currentItemPosition.x, currentItemPosition.y, offsetX);
  };

  const handleScrollToIndexFailed = info => {
    const wait = new Promise(resolve => setTimeout(resolve, 100));
    wait.then(() => {
      if (cardListRef.current && info.index < maxCount) {
        try {
          cardListRef.current.scrollToIndex({index: info.index});
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const handleLayoutCard = (target, offset) => {
    if (target && rootViewRef.current) {
      target.measureLayout(rootViewRef.current, (x, y) => {
        setCurrentItemPosition({x: x + offset.x, y: y + offset.y});
        setLayoutListCard(x + offset.x, y + offset.y, contentOffsetX);
      });
    }
  };

  const handleSearchCard = (card) => {
    if (onSearchCard) {
      onSearchCard(card);
    }
  };

  const handleRetryVisualSearch = (card) => {
    if (onRetryVisualSearch) {
      onRetryVisualSearch(card);
    }
  };

  const handleRetryCreateUserCard = (card) => {
    if (onRetryCreateUserCard) {
      onRetryCreateUserCard(card);
    }
  };

  const handleRetryUploadMedia = (card) => {
    if (onRetryUploadMedia) {
      onRetryUploadMedia(card);
    }
  };

  const handleShowCardVariants = (card) => {
    if (onShowCardVariants) {
      onShowCardVariants(card);
    }
  };

  const handleShowEditScanSheet = (card) => {
    editingScanRef.current = card;
    setIsVisibleEditScan(true);
  };

  const handleSearchForCard = () => {
    setIsVisibleEditScan(false);

    handleSearchCard(editingScanRef.current);
  };

  const handleRemoveScan = () => {
    handleCloseScanSheet();

    if (onRemoveScan) {
      onRemoveScan(editingScanRef.current);
    }
  };

  const handleShowRemoveScanSheet = (card) => {
    editingScanRef.current = card;

    setIsVisibleRemoveScan(true);
  };

  const handleCloseScanSheet = () => {
    setIsVisibleEditScan(false);
    setIsVisibleRemoveScan(false);
  };

  const setLayoutListCard = (x, y, offsetX) => {
    const widthOffsetX = Styles.cameraBottomBarSmallCard.width - Styles.cameraBottomBarSmallCardImage.width;
    const heightOffsetY = Styles.cameraBottomBarSmallCard.height - Styles.cameraBottomBarSmallCardImage.height;

    let frontOffsetX = 0, frontOffsetY = 0, backOffsetX = 0, backOffsetY = 0;

    if (cardCaptureMode === Constants.cardCaptureMode.frontOnly) {
      frontOffsetX = widthOffsetX / 2;
      frontOffsetY = heightOffsetY / 2;
    } else {
      backOffsetX = widthOffsetX;
      backOffsetY = heightOffsetY;
    }

    onLayoutListCard(Constants.cardFrontPhoto, {
      x: x - offsetX + frontOffsetX,
      y: y + frontOffsetY,
      width: Styles.cameraBottomBarSmallCardImage.width,
      height: Styles.cameraBottomBarSmallCardImage.height,
    });
    onLayoutListCard(Constants.cardBackPhoto, {
      x: x - offsetX + backOffsetX,
      y: y + backOffsetY,
      width: Styles.cameraBottomBarSmallCardImage.width,
      height: Styles.cameraBottomBarSmallCardImage.height,
    });
  };

  const renderItem = ({item, index}) => {
    const isFrontOnly =
      (index === cards.length && cardCaptureMode === Constants.cardCaptureMode.frontOnly) ||
      item?.captureMode === Constants.cardCaptureMode.frontOnly

    return (
      <BottomCardItem
        isFirstCard={cards.length === 0}
        isFullWidth={index === cards.length}
        isFrontOnly={isFrontOnly}
        isPreviewFrontCard={index === cards.length && isPreviewFrontCard}
        isPreviewBackCard={index === cards.length && isPreviewBackCard}
        cardState={
          index === cards.length
            ? Constants.cardSearchState.current
            : (item?.cardState || Constants.cardSearchState.none)
        }
        card={item || {}}
        queryOptions={queryOptions}
        onLayout={handleLayoutCard}
        onSearchCard={handleSearchCard}
        onRetryVisualSearch={handleRetryVisualSearch}
        onRetryCreateUserCard={handleRetryCreateUserCard}
        onRetryUploadMedia={handleRetryUploadMedia}
        onShowCardVariants={handleShowCardVariants}
        onEditScan={handleShowEditScanSheet}
        onRemoveScan={handleShowRemoveScanSheet}
      />
    );
  };

  const renderCardList = () => {
    if (!isShowCardList) {
      return null;
    }

    const validCardIndex = cards.findIndex(item => item.cardState === Constants.cardSearchState.created || item.cardState === Constants.cardSearchState.updated);

    return (
      <>
        {validCardIndex > -1 ? (
          <View style={styles.handlerContainer} />
        ) : null}
        <FlatList
          ref={cardListRef}
          style={[styles.cardsContainer, validCardIndex < 0 && styles.cardsEmptyContainer]}
          contentContainerStyle={styles.cardsContentContainer}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={allCards}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onScroll={handleScroll}
          onScrollToIndexFailed={handleScrollToIndexFailed}
        />
      </>
    );
  };

  const renderPhotoButton = () => {
    return (
      <Button
        style={styles.photosButton}
        iconStyle={styles.iconPhotos}
        icon={photosIcon}
        disabled={isDisabledLibrary}
        activeColor={Colors.white}
        inactiveColor={Colors.darkGray}
        onPress={onOpenPhotos}
      />
    );
  };

  const renderTakeButton = () => {
    const containerStyle = isShowCardList ? styles.takeSmallButton : styles.takeLargeButton;
    const innerStyle = isShowCardList ? styles.takeSmallInner : styles.takeLargeInner;

    const color = isDisabledTake ? Colors.darkGray : Colors.white;

    return (
      <Button
        style={[containerStyle, {borderColor: color}]}
        disabled={isDisabledTake}
        inactiveColor={Colors.darkGray}
        onPress={onTakePhoto}>
        <View style={[innerStyle, {backgroundColor: color}]} />
      </Button>
    );
  };

  const renderResultButton = () => {
    if (!isShowCardList) {
      return <View style={styles.arrowButton} />;
    }

    return (
      <Button
        style={styles.arrowButton}
        iconStyle={styles.iconArrow}
        icon={arrowRightIcon}
        disabled={!cards.length || isDisabledResult}
        activeColor={Colors.white}
        inactiveColor={Colors.darkGray}
        onPress={onShowSearchResult}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.topRadiusBackgroundContainer} />
      <View style={styles.contentContainer}>
        <BlurView style={styles.blurViewContainer} />
        {renderCardList()}
        <View
          style={[
            styles.buttonsContainer,
            {marginBottom: Styles.screenSafeBottomHeight || 10},
          ]}>
          {renderPhotoButton()}
          {renderTakeButton()}
          {renderResultButton()}
        </View>
      </View>
      <ScanEditSheet
        isVisible={isVisibleEditScan}
        onSearch={handleSearchForCard}
        onRemove={handleRemoveScan}
        onClose={handleCloseScanSheet}
      />
      <ScanRemoveSheet
        isVisible={isVisibleRemoveScan}
        onRemove={handleRemoveScan}
        onClose={handleCloseScanSheet}
      />
    </View>
  );
};

CameraBottomBar.defaultProps = {
  cards: [],
  isDisabledTake: false,
  isDisabledLibrary: false,
  isDisabledResult: false,
  isShowCardList: true,
  isPreviewFrontCard: false,
  isPreviewBackCard: false,
  onLayoutListCard: () => {},
  onOpenPhotos: () => {},
  onTakePhoto: () => {},
  onShowSearchResult: () => {},
  onSearchCard: () => {},
  onRetryVisualSearch: () => {},
  onRetryCreateUserCard: () => {},
  onRetryUploadMedia: () => {},
  onShowCardVariants: () => {},
  onRemoveScan: () => {},
};

CameraBottomBar.propTypes = {
  rootViewRef: PropTypes.object.isRequired,
  cards: PropTypes.array,
  isDisabledTake: PropTypes.bool,
  isDisabledLibrary: PropTypes.bool,
  isDisabledResult: PropTypes.bool,
  isShowCardList: PropTypes.bool,
  isPreviewFrontCard: PropTypes.bool,
  isPreviewBackCard: PropTypes.bool,
  cardCaptureMode: PropTypes.string,
  onLayoutListCard: PropTypes.func,
  onOpenPhotos: PropTypes.func,
  onTakePhoto: PropTypes.func,
  onShowSearchResult: PropTypes.func,
  onSearchCard: PropTypes.func,
  onRetryVisualSearch: PropTypes.func,
  onRetryCreateUserCard: PropTypes.func,
  onRetryUploadMedia: PropTypes.func,
  onShowCardVariants: PropTypes.func,
  onRemoveScan: PropTypes.func,
};

export default CameraBottomBar;

const useStyle = createUseStyle(() => ({
  container: {},
  contentContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  blurViewContainer: {},
  topRadiusBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: Colors.blackAlpha5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.whiteAlpha1,
  },
  photosButton: {
    width: 46,
    height: 46,
  },
  iconPhotos: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  arrowButton: {
    width: 46,
    height: 46,
  },
  iconArrow: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  takeSmallButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  takeSmallInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
  },
  takeLargeButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  takeLargeInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.white,
  },
  handlerContainer: {
    height: 5,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.whiteAlpha2,
    marginVertical: 6,
    alignSelf: 'center',
  },
  cardsContainer: {
    marginBottom: 16,
  },
  cardsEmptyContainer: {
    marginTop: 16
  },
  cardsContentContainer: {
    paddingRight: 16,
  },
}));
