import React, {Suspense} from 'react';
import {View, Text} from 'react-native';

import {CardPhotos, LoadingIndicator} from 'components';
import MatchCardImage from './MatchCardImage';

import {Fonts, createUseStyle} from 'theme';
import {wp} from 'utils';

const CardsView = ({
  frontImageUrl,
  backImageUrl,
  canonicalCardId,
  queryOptions,
}) => {
  const styles = useStyle();

  if (!frontImageUrl && !backImageUrl) {
    return null;
  }

  const isBothCards = frontImageUrl && backImageUrl;

  const renderMatchCardImage = () => (
    <Suspense fallback={<LoadingIndicator isLoading />}>
      <MatchCardImage
        canonicalCardId={canonicalCardId}
        queryOptions={queryOptions}
      />
    </Suspense>
  );

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Text style={styles.textCardTitle}>Your Scan</Text>
        <CardPhotos
          style={isBothCards ? styles.cardTwoPhotoContainer : styles.cardOnePhotoContainer}
          imageContainerStyle={isBothCards ? styles.cardTwoPhotoItemContainer : styles.cardOnePhotoItemContainer}
          isCameraCapture={true}
          frontUri={frontImageUrl}
          backUri={backImageUrl}
        />
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.textCardTitle}>CollX Match</Text>
        <View style={styles.cardOnePhotoContainer}>
          {renderMatchCardImage()}
        </View>
      </View>
    </View>
  );
};

export default CardsView;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: wp(100),
    height: wp(77),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  itemContainer: {
    height: '100%',
    justifyContent: 'center',
  },
  cardTwoPhotoContainer: {
    width: wp(43.7),
    height: wp(61.6),
    marginHorizontal: 0,
    marginTop: 6,
  },
  cardTwoPhotoItemContainer: {
    width: wp(41),
    height: wp(59),
  },
  cardOnePhotoContainer: {
    width: wp(41.8),
    height: wp(58.6),
    marginHorizontal: 0,
    marginTop: 11,
  },
  cardOnePhotoItemContainer: {
    width: wp(41.8),
    height: wp(58.6),
  },
  textCardTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    textTransform: 'uppercase',
    color: colors.lightGrayText,
  },
}));
