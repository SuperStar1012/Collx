import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {Image} from 'components';

import {Constants, Styles} from 'globals';
import {wp} from 'utils';

const CollapseViewItem = ({
  style,
  tradingCard,
  onPress,
}) => {
  const tradingCardData = useFragment(graphql`
    fragment CollapseViewItem_tradingCard on TradingCard {
      id
      frontImageUrl
      owner {
        id
      }
      card {
        id,
        name
        number
        set {
          name
        }
        ...on SportCard {
          player {
            name
          }
        }
      }
      condition {
        name
        gradingScale {
          name
        }
      }
    }`,
    tradingCard
  );

  const {frontImageUrl} = tradingCardData;

  const handleSelect = () => {
    onPress(tradingCardData);
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handleSelect}>
      <Image
        style={styles.imageCover}
        source={frontImageUrl || Constants.defaultCardImage}
      />
    </TouchableOpacity>
  );
};

CollapseViewItem.defaultProps = {
  onPress: () => {},
};

CollapseViewItem.propTypes = {
  onPress: PropTypes.func,
};

export default CollapseViewItem;

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
    marginHorizontal: Styles.gridCardHorizontalPadding,
  },
  container: {
    width: Styles.gridCardWidth,
    margin: 3,
  },
  imageCover: {
    width: '100%',
    height: wp(22.6),
  },
});
