import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  ErrorBoundaryWithRetry,
  ErrorView,
  CardImage,
  Button,
  ImageZoomView,
  BottomSheetView,
} from 'components';
import ScanSearchResult from './components/ScanSearchResult';

import {createUseStyle, Colors, Fonts} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {Constants, SearchFilterOptions} from 'globals';
import {withSearch} from 'store/containers';
import {wp, hp} from 'utils';

const expandIcon = require('assets/icons/expand.png');
const chevronBackIcon = require('assets/icons/chevron_backward.png');

const ScanSearchPage = (props) => {
  const {navigation, route, searchModalMode} = props;
  const {frontImageUrl, backImageUrl} = route.params || {};

  const insets = useSafeAreaInsets();
  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);
  const [isVisibleCardZoom, setIsVisibleCardZoom] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const [mainLayoutY, setMainLayoutY] = useState(0);

  const cardImages = useMemo(() => {
    const images = [];
    if (frontImageUrl) {
      images.push(frontImageUrl);
    }

    if (backImageUrl) {
      images.push(backImageUrl);
    }

    return images;
  }, [frontImageUrl, backImageUrl]);

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({
      navigation,
    }),
  };

  const handlePreview = imageUrl => {
    const index = cardImages.findIndex(item => item === imageUrl);

    if (index > -1) {
      setInitialIndex(index);
      setIsVisibleCardZoom(true);
    }
  };

  const handlePhotosLayout = ({nativeEvent: {layout}}) => {
    setMainLayoutY(layout.y + layout.height);
  };

  const renderCardPhotos = () => (
    <View
      style={[styles.cardPhotosContainer, {top: (insets.top || 0)}]}
      onLayout={handlePhotosLayout}
    >
      {cardImages.map(imageUrl => (
        <View key={imageUrl}>
          <CardImage
            iconStyle={styles.cardPhoto}
            icon={imageUrl}
          />
          <Button
            style={styles.previewButton}
            icon={expandIcon}
            iconStyle={styles.iconPreview}
            scale={Button.scaleSize.Four}
            onPress={() => handlePreview(imageUrl)}
          />
        </View>
      ))
    }
    </View>
  );

  const renderMainContent = () => {
    return (
      <ActionContext.Provider value={actions}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Content
            queryOptions={refreshedQueryOptions}
            mainLayoutY={mainLayoutY}
            {...props}
          />
        </ErrorBoundaryWithRetry>
      </ActionContext.Provider>
    );
  };

  const renderRootContent = () => (
    <View style={styles.container}>
      {renderCardPhotos()}
      {renderMainContent()}
      <ImageZoomView
        isVisible={isVisibleCardZoom}
        images={cardImages}
        initialIndex={initialIndex}
        onClose={() => setIsVisibleCardZoom(false)}
      />
    </View>
  );

  if (searchModalMode) {
    return (
      <BottomSheetModalProvider>
        {renderRootContent()}
      </BottomSheetModalProvider>
    );
  }

  return renderRootContent();
};

const Content = ({
  navigation,
  mainLayoutY,
  setHandleSearchBack,
  setSearchModalMode,
  setMainFilterOptions,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyle();

  useEffect(() => {
    setNavigationBar();

    setMainFilterOptions(SearchFilterOptions.canonicalCards);

    return () => {
      setHandleSearchBack(null);
      setSearchModalMode(Constants.searchModalMode.none);
    };
  }, []);

  const setNavigationBar = () => {};

  const handleBack = () => {
    navigation.goBack();
  };

  const renderHeaderBack = () => (
    <Button
      style={styles.backButton}
      iconStyle={styles.iconBack}
      icon={chevronBackIcon}
      scale={Button.scaleSize.One}
      onPress={handleBack}
    />
  );

  return (
    <BottomSheetView
      style={styles.sheetViewContainer}
      titleStyle={styles.textTitle}
      title="Search For A Card"
      snapPoints={[hp(100) - mainLayoutY, hp(100) - (insets.top || 20)]}
      headerLeft={renderHeaderBack}
    >
      <ScanSearchResult />
    </BottomSheetView>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: Colors.blackAlpha5,
  },
  sheetViewContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.primaryBackground,
  },
  backButton: {},
  iconBack: {
    width: 34,
    height: 34,
    tintColor: colors.primary,
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    letterSpacing: -0.004,
    color: colors.headerTitleColor,
  },
  cardPhotosContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  cardPhoto: {
    width: wp(33.6),
    height: wp(48),
    marginHorizontal: 8,
  },
  previewButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'absolute',
    right: 12,
    bottom: 4,
    backgroundColor: Colors.blackAlpha6,
  },
  iconPreview: {
    width: 28,
    height: 28,
    tintColor: Colors.white,
  },
}));

export default withSearch(ScanSearchPage);
