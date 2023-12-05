import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';
import {Grayscale} from 'react-native-color-matrix-image-filters';

import {Image} from 'components';

import {Constants, Styles} from 'globals';
import {wp} from 'utils';

const SetGridViewCanonicalCardItem = ({
  style,
  canonicalCard,
  onPress,
}) => {
  const queryCanonicalCard = useFragment(graphql`
    fragment SetGridViewCanonicalCardItem_card on Card {
      id
      frontImageUrl
    }`,
    canonicalCard
  );

  const {frontImageUrl} = queryCanonicalCard;

  const handleSelect = () => {
    if (onPress) {
      onPress(queryCanonicalCard);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handleSelect}>
      <Grayscale>
        <Image
          style={styles.imageCover}
          source={frontImageUrl || Constants.defaultCardImage}
        />
      </Grayscale>
    </TouchableOpacity>
  );
};

SetGridViewCanonicalCardItem.defaultProps = {
  onPress: () => {},
};

SetGridViewCanonicalCardItem.propTypes = {
  onPress: PropTypes.func,
};

export default SetGridViewCanonicalCardItem;

const styles = StyleSheet.create({
  container: {
    width: Styles.gridCardWidth,
    margin: 3,
  },
  imageCover: {
    width: '100%',
    height: wp(22.6),
  },
});
