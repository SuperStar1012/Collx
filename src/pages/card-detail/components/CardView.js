import React, {useMemo, useState} from 'react';
import {View, Text, Image} from 'react-native';

import {ImageZoomView, CardImage} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {wp} from 'utils';

const exclamationIcon = require('assets/icons/exclamation.png');

const CardView = ({
  warnAboutNonUGC = false,
  frontImageUrl,
  backImageUrl,
}) => {
  const styles = useStyle();

  const [isVisibleCardZoom, setIsVisibleCardZoom] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  if (!frontImageUrl && !backImageUrl) {
    return null;
  }

  const zoomImages = useMemo(() => {
    const images = [];
    if (frontImageUrl) {
      images.push(frontImageUrl);
    }

    if (backImageUrl) {
      images.push(backImageUrl);
    }

    return images;
  }, [frontImageUrl, backImageUrl]);

  const handleShowCards = (index) => {
    setInitialIndex(zoomImages.length > 1 ? index : 0);
    setIsVisibleCardZoom(true);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.cardContainer, zoomImages.length === 2 ? styles.cardBothContainer : styles.cardOneContainer]}>
          {frontImageUrl ? (
            <CardImage
              icon={frontImageUrl}
              onPress={() => handleShowCards(0)}
            />
          ) : null}
          {backImageUrl ? (
            <CardImage
              icon={backImageUrl}
              onPress={() => handleShowCards(1)}
            />
          ) : null}
        </View>
        <View style={styles.descriptionContainer}>
          {warnAboutNonUGC &&
            <View style={styles.notUserPhotoContainer}>
              <Image style={styles.iconExclamation} source={exclamationIcon} />
              <Text style={styles.textNotUserPhoto}>Not user photos</Text>
              <View style={styles.dot} />
            </View>
          }
          <Text style={styles.textCardTap}>Tap to view larger image</Text>
        </View>
      </View>
      <ImageZoomView
        isVisible={isVisibleCardZoom}
        images={zoomImages}
        initialIndex={initialIndex}
        onClose={() => setIsVisibleCardZoom(false)}
      />
    </>
  );
};

export default CardView;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: wp(100),
    height: wp(75),
    backgroundColor: colors.secondaryCardBackground,
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(4.3),
    marginTop: wp(5.8),
  },
  cardOneContainer: {
    justifyContent: 'center',
  },
  cardBothContainer: {
    justifyContent: 'space-between',
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  notUserPhotoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCardTap: {
    fontWeight: Fonts.semiBold,
    fontSize: 10,
    letterSpacing: -0.004,
    textAlign: 'center',
    color: colors.lightGrayText,
  },
  iconExclamation: {
    width: 17,
    height: 17,
    tintColor: Colors.yellow,
    marginRight: 6,
  },
  textNotUserPhoto: {
    fontWeight: Fonts.semiBold,
    fontSize: 10,
    letterSpacing: -0.004,
    textAlign: 'center',
    color: Colors.yellow,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.lightGrayText,
    marginHorizontal: 6,
  },
}));
