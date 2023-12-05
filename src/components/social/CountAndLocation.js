import React from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';

import {getCount} from 'utils';
import {createUseStyle} from 'theme';

const squareStackIcon = require('assets/icons/square_stack.png');
const mapMarkerIcon = require('assets/icons/more/map_marker.png');

const CountAndLocation = React.memo(({style, location, count}) => {
  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      {count ? (
        <View style={styles.itemContainer}>
          <Image style={styles.iconSquareStack} source={squareStackIcon} />
          <Text style={styles.textDescription} numberOfLines={1}>
            {getCount(count)} Card{count > 1 ? 's' : ''}
          </Text>
        </View>
      ) : null}
      {location ? (
        <View style={[styles.itemContainer, styles.locationContainer]}>
          <Image style={styles.iconMapMarker} source={mapMarkerIcon} />
          <Text style={styles.textDescription} numberOfLines={1}>
            {location}
          </Text>
        </View>
      ) : null}
    </View>
  );
});

CountAndLocation.displayName = 'CountAndLocation';

export default CountAndLocation;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  locationContainer: {
    flex: 1,
  },
  iconMapMarker: {
    width: 12,
    height: 12,
    tintColor: colors.darkGrayText,
    marginRight: 3,
  },
  iconSquareStack: {
    width: 16,
    height: 16,
    tintColor: colors.darkGrayText,
    marginRight: 3,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
  },
}));
