import React, {useMemo, useState, useEffect} from 'react';
import {Image, Platform} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import {createUseStyle} from 'theme';
import {Constants} from 'globals';
import {isValidUrl} from 'utils';

const getResizeMode = rootStyle => {
  let resizeMode = rootStyle?.resizeMode;

  if (!resizeMode && rootStyle?.length > 0) {
    const reversedRootStyle = [...rootStyle].reverse();

    for (let itemStyle of reversedRootStyle) {
      resizeMode = itemStyle?.resizeMode;

      if (!resizeMode && itemStyle?.length > 0) {
        return getResizeMode(itemStyle);
      }

      if (resizeMode) {
        return resizeMode;
      }
    }
  }

  return resizeMode;
};

const CustomImage = ({
  style,
  source,
  ...otherProps
}) => {
  const styles = useStyle();
  const [isLoading, setIsLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  const resizeMode = useMemo(() => (
    getResizeMode(style || {})
  ), [style]);

  const isSourceString = source && typeof source === 'string';

  useEffect(() => {
    if (Platform.OS === 'android' && isValidUrl(source)) {
      Image.getSize(source, (width) => {
        if (width > Math.round(Constants.uploadImageWidth * 1.5)) {
          setIsFallback(true);
        }
      });
    }
  }, [source]);

  if (!isValidUrl(source)) {
    // For local images
    return (
      <Image
        {...otherProps}
        style={[styles.image, style]}
        source={isSourceString ? {uri: source} : source}
      />
    );
  }

  // For remote images
  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <FastImage
      {...otherProps}
      style={[styles.image, isLoading && styles.remoteImage, style]}
      source={{uri: source}}
      fallback={isFallback}
      resizeMode={resizeMode || styles.image.resizeMode}
      onLoadEnd={handleLoadEnd}
    />
  );
};

CustomImage.defaultProps = {};

CustomImage.propTypes = {
  source: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CustomImage;

const useStyle = createUseStyle(({colors}) => ({
  image: {
    resizeMode: 'cover',
  },
  remoteImage: {
    backgroundColor: colors.secondaryCardBackground
  },
}));
