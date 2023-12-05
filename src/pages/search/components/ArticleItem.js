import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {Image} from 'components';

import {Fonts, createUseStyle} from 'theme';

const ArticleItem = ({
  style,
  article,
  onPress,
}) => {
  const styles = useStyle();

  const articleData = useFragment(graphql`
    fragment ArticleItem_article on Article {
      source
      thumbnailImageUrl
      title
      url
    }`,
    article
  );

  const {
    source,
    thumbnailImageUrl,
    title,
    url,
  } = articleData || {};

  const handlePress = () => {
    if (onPress) {
      onPress(url);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handlePress}>
      <View style={styles.infoContainer}>
        <Text
          style={styles.textTitle}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text
          style={styles.textSubTitle}
          numberOfLines={1}
        >
          {source}
        </Text>
      </View>
      {thumbnailImageUrl ? (
        <Image
          style={styles.imageCover}
          source={thumbnailImageUrl}
        />
      ) : null}
    </TouchableOpacity>
  );
};

ArticleItem.defaultProps = {
  onPress: () => {},
};

ArticleItem.propTypes = {
  article: PropTypes.object,
  onPress: PropTypes.func,
};

export default ArticleItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
  },
  textSubTitle: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.grayText,
    marginTop: 4,
  },
  imageCover: {
    width: 75,
    height: 75,
    borderRadius: 10,
  },
}));
