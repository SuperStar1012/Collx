import React, {useEffect, useState} from 'react';
import {StyleSheet, Image as NativeImage} from 'react-native';

import {Button, Image} from 'components';

import {wp, isValidUrl} from 'utils';

const CardImage = ({
  style,
  icon,
  iconStyle,
  onPress,
}) => {
  const styles = useStyle();
  const [currentIconStyle, setCurrentIconStyle] = useState(styles.imageCard);

  useEffect(() => {
    if (isValidUrl(icon)) {
      NativeImage.getSize(icon, (width, height) => {
        if (width > height) {
          setCurrentIconStyle({
            width: iconStyle?.height || styles.imageCard.height,
            height: iconStyle?.width || styles.imageCard.width,
            transform: [{rotate: '90deg'}],
          });
        }
      });
    }
  }, [icon, iconStyle]);

  if (!onPress) {
    // Image

    return (
      <Image
        style={[styles.imageCard, currentIconStyle, iconStyle]}
        source={icon}
      />
    );
  }

  return (
    <Button
      style={[styles.imageCard, style]}
      icon={icon}
      iconStyle={currentIconStyle}
      scale={Button.scaleSize.Two}
      onPress={onPress}
    />
  );
};

export default CardImage;

const useStyle = () =>
  StyleSheet.create({
    imageCard: {
      width: wp(44),
      height: wp(60),
    },
  });
