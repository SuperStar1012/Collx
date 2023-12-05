import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image as NativeImage,
} from 'react-native';
import Config from 'react-native-config';
import moment from 'moment';

import {Button, Image, VideoPlay} from 'components';
import PostVideo from './PostVideo';

import {Colors, Fonts, createUseStyle} from 'theme';
import {wp, openUrl} from 'utils';

const logoIcon = require('assets/imgs/logo.png');

const horizontalMargin = 16;
const horizontalPadding = 12;

const mediaCoverWidth = wp(100) - (horizontalMargin + horizontalPadding) * 2;

const PostViewItem = ({
  style,
  post,
  parentViewRef,
  parentContentHeight,
  parentContentOffsetY,
}) => {
  const styles = useStyle();

  const viewLayout = useRef(null);
  const [isActivePost, setIsActivePost] = useState(false);

  const {
    // category,
    ctaLink,
    callToAction,
    timestamp,
    blurb,
    socialNetwork,
  } = post?.attributes || {};

  useEffect(() => {
    if (!viewLayout.current) {
      return;
    }

    const topOffset = Math.round(viewLayout.current.offsetY + viewLayout.current.height / 2);
    const bottomOffset = Math.round(viewLayout.current.offsetY + viewLayout.current.height / 2 - parentContentHeight);

    if (parentContentOffsetY < topOffset && parentContentOffsetY > bottomOffset) {
      if (!isActivePost) {
        setIsActivePost(true);
      }
    } else {
      if (isActivePost) {
        setIsActivePost(false);
      }
    }
  }, [parentContentOffsetY, parentContentHeight]);

  if (!post) {
    return null;
  }

  const handleAction = (actionLink) => {
    if (!actionLink) {
      return;
    }

    // System
    openUrl(actionLink);
  };

  const handlePlay = (mediaLink) => {
    handleAction(mediaLink);
  };

  const handleLayout = ({target, nativeEvent: {layout}}) => {
    if (!parentViewRef || !target) {
      return;
    }

    target.measureLayout(parentViewRef.current, (x, y) => {
      viewLayout.current = {
        ...layout,
        offsetY: y,
      };
    });
  };

  const renderUser = (socialNetwork, timestamp) => {
    const {username, link, icon} = socialNetwork?.data?.attributes || {};
    const {url: socialIconUrl} = icon?.data?.attributes || {};

    return (
      <View style={styles.topContainer}>
        <NativeImage style={styles.iconLogo} source={logoIcon} />
        <View style={styles.topContentContainer}>
          <Text style={styles.textUsername}>{username}</Text>
          <Text style={styles.textTimestamp}>{moment(timestamp).fromNow(true)}</Text>
        </View>
        {socialIconUrl && link ? (
          <Button
            style={styles.socialButton}
            icon={`${Config.STRAPI_BASE_URL}${socialIconUrl}`}
            iconStyle={styles.iconSocial}
            scale={Button.scaleSize.One}
            onPress={() => handleAction(link)}
          />
        ) : null}
      </View>
    );
  };

  const renderCover = (post) => {
    const {
      playButtonOverlay,
      autoPlay,
      media,
      mediaLink,
    } = post?.attributes || {};

    const {
      url: mediaUrl,
      mime,
      width = 0,
      height = 0,
    } = media?.data?.attributes || {};
    if (mime.includes('image')) {
      const containerWidth = mediaCoverWidth;
      const containerHeight = Math.round(mediaCoverWidth / width * height);

      return (
        <View style={[styles.coverContainer, {width: containerWidth, height: containerHeight}]}>
          <Image source={`${Config.STRAPI_BASE_URL}${mediaUrl}`} style={styles.imageCover} />
          <VideoPlay
            isVisiblePlay={playButtonOverlay}
            onPlay={() => handlePlay(mediaLink)}
          />
        </View>
      );
    } else if (mime.includes('video')) {
      return (
        <PostVideo
          style={styles.coverContainer}
          mediaWidth={mediaCoverWidth}
          videoUrl={mediaUrl}
          isAutoPlay={autoPlay}
          isActivePost={isActivePost}
        />
      );
    }

    return null;
  };

  return (
    <View
      style={[styles.container, style]}
      onLayout={handleLayout}
    >
      {renderUser(socialNetwork, timestamp)}
      {renderCover(post)}
      {blurb ? (
        <Text style={styles.textDescription}>{blurb}</Text>
      ) : null}
      {callToAction ? (
        <Button
          style={styles.button}
          label={callToAction}
          labelStyle={styles.textButton}
          scale={Button.scaleSize.One}
          onPress={() => handleAction(ctaLink)}
        />
      ) : null}
    </View>
  );
};

PostViewItem.defaultProps = {};

PostViewItem.propTypes = {};

export default PostViewItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: horizontalMargin,
    marginVertical: 8,
    paddingHorizontal: horizontalPadding,
    paddingTop: 12,
    paddingBottom: 16,
    borderRadius: 8,
    backgroundColor: colors.primaryCardBackground,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topContentContainer: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  textTimestamp: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.grayText,
  },
  iconLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  textUsername: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  socialButton: {
    paddingVertical: 6,
  },
  iconSocial: {
    width: 32,
    height: 24,
    resizeMode: 'contain',
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginTop: 12,
  },
  coverContainer: {
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: 8,
    marginTop: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCover: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  button: {
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.secondaryCardBackground,
    marginTop: 12,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.primary,
  },
}));
