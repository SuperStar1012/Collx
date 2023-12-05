import React, {useState, useRef, useEffect, useCallback} from 'react';
import {StyleSheet, View, Animated, Platform, StatusBar} from 'react-native';
import {
  CameraCaptureError,
} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import ImageEditor from '@react-native-community/image-editor';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {launchImageLibrary} from 'react-native-image-picker';
import {v4 as uuidv4} from 'uuid';
import RNQRGenerator from 'rn-qr-generator';
import Modal from 'react-native-modal';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import {
  AllowPhotoLibraryAccessSheet,
  ErrorBoundaryWithRetry,
  ErrorView,
  LoadingIndicator,
} from 'components';
import CameraView from './components/CameraView';
import ScanningTips from './components/ScanningTips';
import ScanningCategory from './components/ScanningCategory';
import CameraTopBar, {extraTopBarHeight} from './components/TopBar';
import CameraCenterView from './components/CenterView';
import CameraBottomBar from './components/BottomBar';
import CameraAnimatedView from './components/AnimatedView';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import {
  Constants,
  SchemaTypes,
  Styles,
  UserCardCategories,
} from 'globals';
import {Colors, useTheme} from 'theme';
import {withCapture} from 'store/containers';
import {
  getStorageItem,
  setStorageItem,
  checkPhotoLibraryPermission,
  showErrorAlert,
} from 'utils';
import {
  useIsForeground,
} from 'hooks';

const CameraPage = props => {
  const {navigation} = props;

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState({
    fetchPolicy: 'store-and-network',
  });

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    refresh: handleRefresh,
  };

  return (
    <BottomSheetModalProvider>
      <ActionContext.Provider value={actions}>
        <View style={styles.container}>
          <ErrorBoundaryWithRetry
            onRetry={handleRefresh}
            fallback={({retry}) => <ErrorView onTryAgain={retry} />}
          >
            <Content
              {...props}
              queryOptions={refreshedQueryOptions}
            />
          </ErrorBoundaryWithRetry>
        </View>
      </ActionContext.Provider>
    </BottomSheetModalProvider>
  );
};

const Content = props => {
  const {
    route,
    navigation,
    user,
    capturedCards,
    searchingCards,
    searchedCards,
    uploadingCardMedias,
    possibleMatchCards,
    queryOptions,
    cameraSoundEffect,
    isShowScanningCategory,
    addCapturedCard,
    searchCardVisual,
    createUserCards,
    uploadUserCardMedias,
    resetCapturedCard,
    setCapturedCards,
    removeCapturedCard,
    updateCapturedCard,
    setHandleSearchBack,
    setSearchModalMode,
    reuploadVisualSearch,
    recreateUserCard,
    reuploadUserCardMedia,
    setShowScanningCategory,
    setMutationActions,
  } = props;

  const {selectedTheme} = useTheme();
  const actions = useActions();

  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActiveCamera = isFocussed && isForeground;

  const isCheckInitialCards = useRef(false);

  const cameraWidth = Platform.select({
    ios: Styles.windowWidth,
    android: Math.max(Styles.windowWidth, Math.round((Styles.windowHeight * 3) / 4)), // 4:3 ratio on Android
  });
  const cameraHeight = Platform.select({
    ios: Styles.windowHeight,
    android: Math.round(cameraWidth * 4 / 3), // 4:3 ratio on Android
  });

  const navBarHeight = Styles.screenSafeTopHeight + Styles.cameraNavigationBarContentHeight;

  const cameraFeature = (route.params && route.params.openFrom) || Constants.openCameraFrom.default;
  const onTakeCards = route.params && route.params.onTakeCards;

  const rootViewRef = useRef(null);
  const cameraRef = useRef(null);
  const animatedViewRef = useRef(null);
  const animationStepRef = useRef({});

  const previewCardPhotoRef = useRef({});
  const visualCardPhotoRef = useRef(null);
  const barCodeQrCodeRef = useRef({});
  const cardSourceRef = useRef(SchemaTypes.tradingCardSource.CAMERA);
  // const isShowedScanningCategoryRef = useRef(false);

  const [isInitializedCamera, setIsInitializedCamera] = useState(false);

  const [previewCardPhoto, setPreviewCardPhoto] = useState({});
  // const [animationStep, setAnimationStep] = useState({});
  const [animatedOpacityValue] = useState(new Animated.Value(0));
  const [currentSportType, setCurrentSportType] = useState(
    UserCardCategories[0].value,
  );
  const [isOpenCardType, setIsOpenCardType] = useState(false);
  const [isVisibleScanningTips, setIsVisibleScanningTips] = useState(false);
  const [isShowedScanningTips, setIsShowedScanningTips] = useState(false);
  const [isVisiblePhotoAccess, setIsVisiblePhotoAccess] = useState(false);
  const [isVisibleScanningCategory, setIsVisibleScanningCategory] = useState(false);
  const [isInTakingPhoto, setIsInTakingPhoto] = useState(false);
  const [cardCaptureMode, setCardCaptureMode] = useState(Constants.cardCaptureMode.frontOnly);
  const [cardCaptureView, setCardCaptureView] = useState(Constants.cardCaptureViewFinder.normal);

  // Layouts
  const initLayout = {x: 0, y: 0, width: 0, height: 0};
  const initialCardLayout = {};
  initialCardLayout[Constants.cardFrontPhoto] = {...initLayout};
  initialCardLayout[Constants.cardBackPhoto] = {...initLayout};

  const listCardLayoutRef = useRef({...initialCardLayout});

  const [listCardLayout, setListCardLayout] = useState({...initialCardLayout});
  const [scanAreaLayout, setScanAreaLayout] = useState({...initLayout});

  const [isUpdatingUserCard, setIsUpdatingUserCard] = useState(false);

  const isCameraReady = isInitializedCamera && isActiveCamera;

  useEffect(() => {
    checkStoredCaptures();

    setMutationActions(actions);
  }, []);

  useEffect(() => {
    if (selectedTheme === Constants.colorSchemeName.light) {
      const statusBarStyle = 'light-content';
      StatusBar.setBarStyle(statusBarStyle);

      if (Platform.OS === 'android') {
        const statusBarBackgroundColor = Colors.black;
        StatusBar.setBackgroundColor(statusBarBackgroundColor);
        changeNavigationBarColor(statusBarBackgroundColor);
      }
    }

    return () => {
      const statusBarStyle = selectedTheme === Constants.colorSchemeName.dark ? 'light-content' : 'dark-content';
      StatusBar.setBarStyle(statusBarStyle);

      if (Platform.OS === 'android') {
        const statusBarBackgroundColor = selectedTheme === Constants.colorSchemeName.dark ? Colors.black : Colors.white;
        StatusBar.setBackgroundColor(statusBarBackgroundColor);
        changeNavigationBarColor(statusBarBackgroundColor);
      }
    }
  }, [selectedTheme]);

  useEffect(() => {
    storeExistingCaptures();

    // if (capturedCards?.length) {
    //   const lastCapturedCard = capturedCards[capturedCards.length - 1];

    //   if (lastCapturedCard?.type !== currentSportType) {
    //     setCurrentSportType(lastCapturedCard?.type);
    //   }
    // }
  }, [
    searchingCards,
    searchedCards,
    uploadingCardMedias,
    capturedCards,
    possibleMatchCards,
  ]);

  useEffect(() => {
    if (!capturedCards || !capturedCards.length) {
      return;
    }

    const lastCapturedCard = capturedCards[capturedCards.length - 1];

    if (lastCapturedCard?.id) {
      // For new scanned card
      actions.addEngagement(Constants.userEngagement.scanned);
    }

    // if (lastCapturedCard?.type !== currentSportType) {
    //   setCurrentSportType(lastCapturedCard?.type);
    // }
  }, [capturedCards]);

  useEffect(() => {
    if (searchingCards.length > 0) {
      searchCardVisual();
    }
  }, [searchingCards]);

  useEffect(() => {
    if (searchedCards.length > 0) {
      createUserCards();
    }

    if (!isShowScanningCategory && searchedCards.length) {
      const index = searchedCards.findIndex(item => item.cardState === Constants.cardSearchState.notDetected);
      if (index > -1) {
        setShowScanningCategory(true);
        setIsVisibleScanningCategory(true);
      }
    }
  }, [isShowScanningCategory, searchedCards]);

  useEffect(() => {
    if (uploadingCardMedias.length > 0) {
      uploadUserCardMedias();
    }
  }, [uploadingCardMedias]);

  useEffect(() => {
    resetCardPhotos();
  }, [cardCaptureMode]);

  const checkStoredCaptures = async () => {
    try {
      // Checks the last capture mode
      const captureMode = await getStorageItem(Constants.userCardCaptureMode);
      if (captureMode) {
        setCardCaptureMode(captureMode);
      }

      // Checks the last capture view
      const captureView = await getStorageItem(Constants.userCardCaptureView);
      if (captureView) {
        setCardCaptureView(captureView);
      }

      // Checks the last capture sport
      const captureSport = await getStorageItem(Constants.userCardCaptureSport);
      if (captureSport) {
        setCurrentSportType(captureSport);
      }

      // Checks Stored Captures
      const captureInfo = await getStorageItem(Constants.cardUploadInfo);

      if (captureInfo) {
        setCapturedCards(captureInfo);
      } else {
        resetCapturedCard();
      }

      // Checks Scanning Tips
      const isShowedScanningTips = await getStorageItem(
        Constants.showedScanningTips,
      );

      if (!isShowedScanningTips) {
        setTimeout(() => {
          setIsVisibleScanningTips(true);
        }, 500);
        return;
      }

      setIsShowedScanningTips(true);

      // checkCardsForScanResult();
    } catch (error) {
      console.log(error);
    }
  };

  const checkCardsForScanResult = () => {
    if (cameraFeature !== Constants.openCameraFrom.default) {
      return;
    }

    if (
      (capturedCards && capturedCards.length > 0) ||
      (searchingCards && searchingCards.length > 0) ||
      (searchedCards && searchedCards.length > 0)
    ) {
      setTimeout(() => {
        handleShowSearchResult();
      });
    }
  };

  const storeExistingCaptures = () => {
    if (
      (capturedCards?.length > 0) ||
      (searchingCards?.length > 0) ||
      (Object.keys(possibleMatchCards || {}).length > 0) ||
      (searchedCards?.length > 0) ||
      (uploadingCardMedias?.length > 0)
    ) {
      const captureInfo = {
        capturedCards,
        searchingCards,
        searchedCards,
        uploadingCardMedias,
        possibleMatchCards,
      };
      setStorageItem(Constants.cardUploadInfo, captureInfo);
    }
  };

  const openSportTypeList = () => {
    setTimeout(() => {
      setIsOpenCardType(true);
    }, 0);
  };

  const addCardPhoto = () => {
    if (cameraFeature !== Constants.openCameraFrom.default) {
      // close
      if (onTakeCards) {
        onTakeCards(previewCardPhoto);
      }

      handleClose();
      return;
    }

    const values = {
      uuid: uuidv4(),
      ...previewCardPhoto,
      type: currentSportType,
      source: cardSourceRef.current,
      captureMode: cardCaptureMode,
      captureType: cardCaptureView === Constants.cardCaptureViewFinder.normal ? SchemaTypes.captureType.RAW : SchemaTypes.captureType.GRADED
    };

    if (visualCardPhotoRef.current) {
      values[Constants.cardVisualPhoto] = visualCardPhotoRef.current;
    }

    if (Object.keys(barCodeQrCodeRef.current).length) {
      const barcodes = {};

      if (barCodeQrCodeRef.current[Constants.cardFrontPhoto]) {
        barcodes[Constants.cardFrontPhoto] =
          barCodeQrCodeRef.current[Constants.cardFrontPhoto];
      }

      if (barCodeQrCodeRef.current[Constants.cardBackPhoto]) {
        barcodes[Constants.cardBackPhoto] =
          barCodeQrCodeRef.current[Constants.cardBackPhoto];
      }

      values.barcodes = barcodes;
    }

    addCapturedCard(values);

    resetCardPhotos();
  };

  const takeCameraPhoto = async () => {
    if (!cameraRef?.current) {
      return null;
    }

    if (
      previewCardPhoto[Constants.cardFrontPhoto] &&
      previewCardPhoto[Constants.cardBackPhoto]
    ) {
      return null;
    }

    animateShoot();

    // take a card
    let response = null;

    try {
      response = await cameraRef.current.takePhoto({
        qualityPrioritization: 'speed',
        skipMetadata: true,
        photoCodec: 'jpeg',
        quality: 80,
        enableShutterSound: cameraSoundEffect === Constants.soundEffectSettings.on,
      });
    } catch (error) {
      if (error instanceof CameraCaptureError) {
        switch (error.code) {
          case "capture/file-io-error":
            console.log("Failed to write photo to disk!")
            break
          default:
            console.log(error)
            break
        }
      } else {
        console.log(error)
      }
    }

    if (!response || !response.path) {
      return null;
    }

    let responseUri = response.path;

    if (!responseUri.includes('file://')) {
      responseUri = `file://${responseUri}`;
    }

    recognizeBarcodeQrCode(responseUri);

    // scale
    const responseWidth = Math.min(response.width, response.height);
    const responseHeight = Math.max(response.width, response.height);

    // const aspectRatio = responseWidth / responseHeight;
    const widthScale = responseWidth / cameraWidth;
    const heightScale = responseHeight / cameraHeight;

    const cardImageWidth = Math.ceil(scanAreaLayout.width * widthScale); // Math.ceil(scanAreaLayout.height * heightScale * aspectRatio), // on Android
    const cardImageHeight = Math.ceil(scanAreaLayout.height * heightScale); // Math.ceil((cardImageWidth / scanAreaLayout.width) * scanAreaLayout.height), // 4:3 ratio on Android

    // crop card
    let cardUri = responseUri;

    let currentImageWidth = cardImageWidth;
    let currentImageHeight = cardImageHeight;

    try {
      const offsetX = Math.round((responseWidth - cardImageWidth) / 2);
      const offsetY = Math.round(scanAreaLayout.y * heightScale);

      currentImageWidth = Constants.uploadImageWidth;
      currentImageHeight = Math.ceil(cardImageHeight * (Constants.uploadImageWidth / cardImageWidth));

      if (offsetX >= 0 && offsetY >= 0 && cardImageWidth > 0 && cardImageHeight > 0) {
        cardUri = await ImageEditor.cropImage(responseUri, {
          offset: {
            x: offsetX,
            y: offsetY,
          },
          size: {
            width: cardImageWidth,
            height: cardImageHeight,
          },
          displaySize: {
            width: currentImageWidth,
            height: currentImageHeight,
          },
        });
      }
    } catch (error) {
      console.log(error);
      currentImageWidth = cardImageWidth;
      currentImageHeight = cardImageHeight;
    }

    if (!visualCardPhotoRef.current) {
      // resize the front image for the visual search

      const visualCardImageWidth = Constants.visualSearchImageWidth;
      const visualCardImageHeight = Math.ceil((currentImageHeight * Constants.visualSearchImageWidth) / currentImageWidth);

      try {
        const resizedImage = await ImageResizer.createResizedImage(
          cardUri,
          visualCardImageWidth,
          visualCardImageHeight,
          'JPEG',
          90,
          0,
          // undefined,
          // false,
        );

        visualCardPhotoRef.current = resizedImage.uri;
      } catch (error) {
        console.log(error);
      }

      if (!visualCardPhotoRef.current) {
        visualCardPhotoRef.current = cardUri;
      }
    }

    return cardUri;
  };

  const pickLibraryPhoto = async () => {
    let response = null;

    try {
      response = await launchImageLibrary({
        includeBase64: false,
      });
    } catch (error) {
      console.log(error);
    }

    if (!response || !response.assets || !response.assets.length) {
      return null;
    }

    const currentImage = response.assets[0];
    let cardUri = currentImage.uri;

    animateShoot();

    recognizeBarcodeQrCode(cardUri);

    let currentImageWidth = currentImage.width;
    let currentImageHeight = currentImage.height;

    if (currentImageWidth > Constants.uploadImageWidth) {
      // resize card
      currentImageWidth = Constants.uploadImageWidth;
      currentImageHeight = Math.ceil(currentImage.height * (Constants.uploadImageWidth / currentImage.width));

      try {
        const resizedImage = await ImageResizer.createResizedImage(
          cardUri,
          currentImageWidth,
          currentImageHeight,
          'JPEG',
          90,
          0,
          // undefined,
          // false,
        );

        cardUri = resizedImage.uri;
      } catch (error) {
        console.log(error);

        currentImageWidth = currentImage.width;
        currentImageHeight = currentImage.height;
      }
    }

    if (!visualCardPhotoRef.current) {
      // resize the front image for the visual search

      if (currentImageWidth > Constants.visualSearchImageWidth) {
        const visualCardImageWidth = Constants.visualSearchImageWidth;
        const visualCardImageHeight = Math.ceil(currentImageHeight * (Constants.visualSearchImageWidth / currentImageWidth));

        try {
          const resizedImage = await ImageResizer.createResizedImage(
            cardUri,
            visualCardImageWidth,
            visualCardImageHeight,
            'JPEG',
            90,
            0,
            // undefined,
            // false,
          );

          visualCardPhotoRef.current = resizedImage.uri;
        } catch (error) {
          console.log(error);
        }
      }

      if (!visualCardPhotoRef.current) {
        visualCardPhotoRef.current = cardUri;
      }
    }

    return cardUri;
  };

  const resetCardPhotos = () => {
    previewCardPhotoRef.current = {};
    visualCardPhotoRef.current = null;
    barCodeQrCodeRef.current = {};
    cardSourceRef.current = SchemaTypes.tradingCardSource.CAMERA;
    setPreviewCardPhoto({});
    // setAnimationStep({});
  };

  const recognizeBarcodeQrCode = async imageUri => {
    let barcodeType = null;
    let barcodes = [];

    try {
      const response = await RNQRGenerator.detect({
        uri: imageUri,
      });

      if (response) {
        barcodeType = response.type;
        barcodes = response.values;
      }
    } catch (error) {
      console.log(error);
    }

    if (!barcodes.length) {
      return;
    }

    const barcodeValue = barcodes[0];

    if (!previewCardPhoto[Constants.cardFrontPhoto]) {
      const barCodeQrCode = {...barCodeQrCodeRef.current};
      barCodeQrCode[Constants.cardFrontPhoto] = {
        type: barcodeType,
        value: barcodeValue,
      };
      barCodeQrCodeRef.current = barCodeQrCode;
    } else if (!previewCardPhoto[Constants.cardBackPhoto]) {
      const barCodeQrCode = {...barCodeQrCodeRef.current};
      barCodeQrCode[Constants.cardBackPhoto] = {
        type: barcodeType,
        value: barcodeValue,
      };
      barCodeQrCodeRef.current = barCodeQrCode;
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleInitializedCamera = () => {
    if (!isCheckInitialCards.current) {
      isCheckInitialCards.current = true;

      setTimeout(() => {
        checkCardsForScanResult();
      });
    }

    setIsInitializedCamera(true);
  };

  const handleCloseScanningTips = async () => {
    setIsVisibleScanningTips(false);
    setIsShowedScanningTips(true);

    setStorageItem(Constants.showedScanningTips, 'true');
  };

  const handleCloseScanningCategory = async () => {
    setIsVisibleScanningCategory(false);
  };

  const handleCheckedPermission = () => {
    openSportTypeList();
  };

  const handleClosePhotoAccess = () => {
    setIsVisiblePhotoAccess(false);
  };

  const handleChangeSportType = value => {
    setCurrentSportType(value);
    setStorageItem(Constants.userCardCaptureSport, value);
  };

  const handleLayoutScanArea = layout => {
    setScanAreaLayout(layout);
  };

  const handleLayoutListCard = (cardType, layout) => {
    const cardLayout = {...listCardLayoutRef.current};
    cardLayout[cardType] = layout;
    listCardLayoutRef.current = cardLayout;
    setListCardLayout(cardLayout);
  };

  const handleChangeCaptureMode = (mode) => {
    setCardCaptureMode(mode);
    setStorageItem(Constants.userCardCaptureMode, mode);
  };

  const handleChangeViewFinder = (viewFinder) => {
    setCardCaptureView(viewFinder);
    setStorageItem(Constants.userCardCaptureView, viewFinder);
  }

  const handleChangedStep = (step, cardType) => {
    const currentAnimationStep = animationStepRef.current;

    if (cardType) {
      currentAnimationStep[cardType] = step;
    } else {
      currentAnimationStep[Constants.cardFrontPhoto] = step;

      if (cardCaptureMode === Constants.cardCaptureMode.bothFrontBack) {
        currentAnimationStep[Constants.cardBackPhoto] = step;
      }
    }

    animationStepRef.current = currentAnimationStep;

    if (
      (
        cardCaptureMode === Constants.cardCaptureMode.frontOnly &&
        currentAnimationStep[Constants.cardFrontPhoto] === Constants.cardAnimationSteps.step2
      ) || (
        cardCaptureMode === Constants.cardCaptureMode.bothFrontBack &&
        currentAnimationStep[Constants.cardFrontPhoto] === Constants.cardAnimationSteps.step2 &&
        currentAnimationStep[Constants.cardBackPhoto] === Constants.cardAnimationSteps.step2
      )
    ) {
      addCardPhoto();
    }
  };

  const handleTakePhoto = async () => {
    setIsInTakingPhoto(true);

    const cardUri = await takeCameraPhoto();

    setIsInTakingPhoto(false);

    if (cardUri) {
      animateTakePhoto(cardUri, SchemaTypes.tradingCardSource.CAMERA);
    }
  };

  const handleOpenPhotos = async () => {
    // Checks Photo Library permission
    const isGranted = await checkPhotoLibraryPermission();

    if (!isGranted) {
      setTimeout(() => {
        setIsVisiblePhotoAccess(true);
      });
      return;
    }

    setIsInTakingPhoto(true);

    const cardUri = await pickLibraryPhoto();

    setIsInTakingPhoto(false);

    if (cardUri) {
      animateTakePhoto(cardUri, SchemaTypes.tradingCardSource.LIBRARY);
    }
  };

  const handleShowSearchResult = () => {
    navigation.navigate('CaptureResult', {
      cardType: currentSportType,
    });
  };

  const handleSearchCard = tradingCard => {
    const handleBackSearch = canonicalCardId => {
      if (!canonicalCardId) {
        return;
      }

      const values = {
        card: {
          id: canonicalCardId,
        },
      };

      setIsUpdatingUserCard(true);

      actions.updateTradingCard(
        tradingCard.tradingCardId,
        values,
        {
          onComplete: () => {
            setIsUpdatingUserCard(false);

            updateCapturedCard({
              uuid: tradingCard.uuid,
              cardId: canonicalCardId,
            });
          },
          onError: (error) => {
            setIsUpdatingUserCard(false);

            if (error?.message) {
              showErrorAlert(error?.message);
            }
          },
        },
      );

      navigation.navigate('Camera');
    };

    setHandleSearchBack(handleBackSearch);
    setSearchModalMode(Constants.searchModalMode.capture);

    const {frontImageUrl, backImageUrl} = tradingCard || {};

    actions.navigateScanSearch({
      frontImageUrl,
      backImageUrl,
    });

    // Wrong card
    // const card = {
    //   uuid: capturedCards[currentCardIndex].uuid,
    //   cardState: Constants.cardSearchState.notDetected,
    //   frontImageUrl: capturedCards[currentCardIndex].frontImageUrl,
    //   backImageUrl: capturedCards[currentCardIndex].backImageUrl,
    // };
    // updateCapturedCard(card);
  };

  const handleRetryVisualSearch = card => {
    reuploadVisualSearch(card);
  };

  const handleRetryCreateUserCard = card => {
    recreateUserCard(card);
  };

  const handleRetryUploadMedia = card => {
    reuploadUserCardMedia(card);
  };

  const handleShowCardVariants = card => {
    if (!card) {
      return;
    }

    navigation.navigate('CameraDrawerStackModal', {
      screen: 'CameraDrawer',
      params: {
        userCard: card,
        forcedDark: true,
      },
    });
  };

  const handleRemoveCard = card => {
    // Remove captured card
    removeCapturedCard({
      userId: user.id,
      card,
    });
  };

  const animateShoot = () => {
    animatedOpacityValue.setValue(0);
    Animated.sequence([
      Animated.timing(animatedOpacityValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedOpacityValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateTakePhoto = (photoUri, source) => {
    if (!previewCardPhotoRef.current[Constants.cardFrontPhoto]) {
      const cardPhoto = {...previewCardPhotoRef.current};
      cardPhoto[Constants.cardFrontPhoto] = photoUri;

      previewCardPhotoRef.current = cardPhoto;
      setPreviewCardPhoto(cardPhoto);

      if (animatedViewRef.current) {
        animatedViewRef.current.playAnimationToList(Constants.cardFrontPhoto);
      }

      cardSourceRef.current = source;
    } else if (!previewCardPhotoRef.current[Constants.cardBackPhoto]) {
      const cardPhoto = {...previewCardPhotoRef.current};
      cardPhoto[Constants.cardBackPhoto] = photoUri;

      previewCardPhotoRef.current = cardPhoto;
      setPreviewCardPhoto(cardPhoto);

      if (animatedViewRef.current) {
        animatedViewRef.current.playAnimationToList(Constants.cardBackPhoto);
      }
    }
  };

  const renderMainContent = () => {
    const isDisabledTake =
      (cardCaptureMode === Constants.cardCaptureMode.frontOnly && previewCardPhoto[Constants.cardFrontPhoto]) ||
      (cardCaptureMode === Constants.cardCaptureMode.bothFrontBack && previewCardPhoto[Constants.cardFrontPhoto] && previewCardPhoto[Constants.cardBackPhoto]);

    const isDisabledResult =
      previewCardPhoto[Constants.cardFrontPhoto] ||
      previewCardPhoto[Constants.cardBackPhoto];

    const isDefaultFeature = cameraFeature === Constants.openCameraFrom.default;

    return (
      <>
        <LoadingIndicator isLoading={isUpdatingUserCard} />
        <Animated.View
          style={[styles.cameraFadeContainer, {opacity: animatedOpacityValue}]}
          pointerEvents="none"
        />
        <CameraTopBar
          initialOpen={isOpenCardType}
          navBarHeight={navBarHeight}
          userCardTypes={UserCardCategories}
          currentSportType={currentSportType}
          cardCaptureView={cardCaptureView}
          onChangeViewFinder={handleChangeViewFinder}
          onClose={handleClose}
          onChangeSportType={handleChangeSportType}
        />
        <CameraCenterView
          style={{marginTop: navBarHeight + extraTopBarHeight}}
          rootViewRef={rootViewRef}
          cardCaptureMode={cardCaptureMode}
          cardCaptureView={cardCaptureView}
          onChangeCaptureMode={handleChangeCaptureMode}
          onLayoutScanArea={handleLayoutScanArea}
        />
        <CameraBottomBar
          rootViewRef={rootViewRef}
          cards={capturedCards}
          isDisabledTake={isInTakingPhoto || !!isDisabledTake || !isCameraReady}
          isDisabledLibrary={isInTakingPhoto || !!isDisabledTake}
          isDisabledResult={!!isDisabledResult}
          isShowCardList={isDefaultFeature}
          isPreviewFrontCard={!!previewCardPhoto[Constants.cardFrontPhoto]}
          isPreviewBackCard={!!previewCardPhoto[Constants.cardBackPhoto]}
          cardCaptureMode={cardCaptureMode}
          queryOptions={queryOptions}
          onLayoutListCard={handleLayoutListCard}
          onTakePhoto={handleTakePhoto}
          onOpenPhotos={handleOpenPhotos}
          onShowSearchResult={handleShowSearchResult}
          onSearchCard={handleSearchCard}
          onRetryVisualSearch={handleRetryVisualSearch}
          onRetryCreateUserCard={handleRetryCreateUserCard}
          onRetryUploadMedia={handleRetryUploadMedia}
          onShowCardVariants={handleShowCardVariants}
          onRemoveScan={handleRemoveCard}
        />
        <CameraAnimatedView
          ref={animatedViewRef}
          previewCards={previewCardPhoto}
          cardCaptureMode={cardCaptureMode}
          scanAreaLayout={scanAreaLayout}
          listCardLayout={listCardLayout}
          onChangedStep={handleChangedStep}
        />
      </>
    );
  };

  return (
    <BottomSheetModalProvider>
      <ActionContext.Provider value={actions}>
        <View ref={rootViewRef} style={styles.container}>
          <CameraView
            ref={cameraRef}
            cameraWidth={cameraWidth}
            cameraHeight={cameraHeight}
            isPossibleCameraAllow={!isOpenCardType && isShowedScanningTips}
            onInitialized={handleInitializedCamera}
            onCheckedPermission={handleCheckedPermission}
          />
          {renderMainContent()}
          <Modal
            style={styles.modalContainer}
            visible={isVisibleScanningTips}
            animationType="slide"
            backdropOpacity={0.7}>
            <ScanningTips onClose={handleCloseScanningTips} />
          </Modal>
          <Modal
            style={styles.modalContainer}
            visible={isVisibleScanningCategory}
            animationType="slide"
            backdropOpacity={0.7}>
            <ScanningCategory onClose={handleCloseScanningCategory} />
          </Modal>
          <AllowPhotoLibraryAccessSheet
            isVisible={isVisiblePhotoAccess}
            onClose={handleClosePhotoAccess}
          />
        </View>
      </ActionContext.Provider>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  cameraFadeContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.black,
  },
  modalContainer: {
    marginHorizontal: 0,
  },
});

export default withCapture(CameraPage);
