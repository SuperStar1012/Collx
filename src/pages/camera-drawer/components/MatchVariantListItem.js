import React from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {Image} from 'components';

import {Colors, createUseStyle} from 'theme';
import {Constants} from 'globals';

export const matchVariantItemWidth = 40;
export const matchVariantItemHeight = 48;

const MatchVariantListItem = (props) => {
  const {style, isActive, frontImageUrl, onSelect} = props;

  const styles = useStyle();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.8}
      onPress={onSelect}
    >
      <View style={[styles.contentContainer, isActive && styles.activeContentContainer]}>
        <View style={styles.imageContainer}>
          <Image style={styles.imageCard} source={frontImageUrl || Constants.defaultCardImage} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

MatchVariantListItem.defaultProps = {
  isActive: false,
  onSelect: () => {},
};

MatchVariantListItem.propTypes = {
  frontImageUrl: PropTypes.string,
  isActive: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default MatchVariantListItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: matchVariantItemWidth,
    height: matchVariantItemHeight,
    paddingHorizontal: 2,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeContentContainer: {
    borderRadius: 3,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  imageContainer: {
    width: 32,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imageCard: {
    width: 30,
    height: 42,
    borderRadius: 2,
  },
}));
