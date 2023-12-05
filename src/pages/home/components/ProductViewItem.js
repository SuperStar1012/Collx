import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Config from 'react-native-config';

import {Image, Button} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {wp, openUrl} from 'utils';
import {useActions} from 'actions';
import {
  analyticsEvents,
  analyticsSendEvent,
} from 'services';

const shareIcon = require('assets/icons/share.png');

const ProductViewItem = ({
  style,
  parentViewRef,
  parentContentOffsetY,
  product,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const layoutOffsetY = useRef(0);

  const currentProduct = product?.attributes || {};
  const {link: brandLink, name: brandName, icon: brandIcon} = currentProduct?.brand?.data?.attributes || {};
  const {url: imageUrl} = currentProduct?.image?.data?.attributes || {};
  const {url: brandIconUrl} = brandIcon?.data?.attributes || {};

  useEffect(() => {
    if (layoutOffsetY.current !== -1 && parentContentOffsetY > layoutOffsetY.current) {
      layoutOffsetY.current = -1;
      sendEvent(analyticsEvents.viewedProduct);
    }
  }, [parentContentOffsetY]);

  const sendEvent = (eventName) => {
    analyticsSendEvent(
      eventName,
      {
        name: currentProduct.name,
        url: currentProduct.appLink,
      },
    );
  };

  const handleOpenBrand = () => {
    if (brandLink) {
      openUrl(brandLink);
    }
  };

  const handleAction = () => {
    if (currentProduct.appLink) {
      const link = (currentProduct.appLink.indexOf('://') === -1) ? `https://${currentProduct.appLink}` : currentProduct.appLink;
      openUrl(link);
    }

    sendEvent(analyticsEvents.openedProduct);
  };

  // const handleLike = () => {};

  // const handleComment = () => {};

  const handleShare = () => {
    if (currentProduct.appLink) {
      actions.share({
        title: currentProduct.name,
        url: currentProduct.appLink
      });
    }

    sendEvent(analyticsEvents.sharedProduct);
  };

  const handleLayout = ({target}) => {
    if (!parentViewRef || !target) {
      return;
    }

    target.measureLayout(parentViewRef.current, (x, y) => {
      layoutOffsetY.current = y;
    });
  };

  return (
    <View
      style={[styles.container, style]}
      onLayout={handleLayout}
    >
      <View style={styles.topContentContainer}>
        <Image
          source={`${Config.STRAPI_BASE_URL}${brandIconUrl}`}
          style={styles.imageBrandLogo}
        />
        <View style={styles.brandNameContainer}>
          <Text style={styles.textBrand} numberOfLines={1}>
            {brandName}
          </Text>
          <Text style={styles.textSponsor}>Sponsored</Text>
        </View>
      </View>
      <Text style={styles.textDescription} numberOfLines={3}>
        {currentProduct.description}
      </Text>
      <TouchableOpacity
        style={styles.brandImageContainer}
        activeOpacity={0.9}
        onPress={handleOpenBrand}
      >
        <Image
          source={`${Config.STRAPI_BASE_URL}${imageUrl}`}
          style={styles.imageCover}
        />
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <Text style={styles.textProductName} numberOfLines={1}>
          {currentProduct.name}
        </Text>
        {currentProduct.callToAction && currentProduct.appLink ? (
          <Button
            style={styles.ctaButton}
            label={currentProduct.callToAction}
            labelStyle={[styles.textBrand, styles.textAction]}
            scale={Button.scaleSize.Two}
            onPress={handleAction}
          />
        ) : null}
      </View>
      <View style={styles.bottomContentContainer}>
        {/* <Button
          icon={currentProduct.viewer.isLikedByMe ? heartFillIcon : heartOutlineIcon}
          iconStyle={styles.iconSocial}
          label={currentProduct.likes.totalCount.toString()}
          labelStyle={styles.textSocial}
          scale={Button.scaleSize.Two}
          onPress={handleLike}
        />
        <Button
          icon={conversationIcon}
          iconStyle={styles.iconSocial}
          label={currentProduct.comments.totalCount?.toString()}
          labelStyle={styles.textSocial}
          scale={Button.scaleSize.Two}
          onPress={handleComment}
        /> */}
        <Button
          icon={shareIcon}
          iconStyle={styles.iconSocial}
          scale={Button.scaleSize.Two}
          onPress={handleShare}
        />
      </View>
    </View>
  );
};

export default ProductViewItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    // width: wp(100) - 16 * 2,
    // height: wp(130),
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: Colors.gray,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 4,
    backgroundColor: colors.primaryCardBackground,
  },
  topContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
  },
  imageBrandLogo: {
    width: 36,
    height: 36,
  },
  brandNameContainer: {
    flex: 1,
    marginLeft: 8,
  },
  textBrand: {
    fontWeight: Fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primaryText,
  },
  textSponsor: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginTop: 2,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primaryText,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  brandImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.primaryBorder,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  imageCover: {
    width: '100%',
    height: wp(70),
    resizeMode: 'contain',
    overflow: 'hidden',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  textProductName: {
    flex: 1,
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  ctaButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  textAction: {
    color: colors.white,
  },
  bottomContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginTop: 4,
    marginBottom: 12,
  },
  iconSocial: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  // textSocial: {
  //   fontWeight: Fonts.semiBold,
  //   fontSize: 12,
  //   lineHeight: 14,
  //   letterSpacing: -0.004,
  //   color: colors.darkGrayText,
  //   marginLeft: 6,
  // },
}));
