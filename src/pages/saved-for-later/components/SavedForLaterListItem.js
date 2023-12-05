import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import {Image} from 'components';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {getCount} from 'utils';

const SavedForLaterListItem = React.memo((props) => {
  const {style, onPress} = props;

  const styles = useStyle();

  const savedForLater = useFragment(graphql`
    fragment SavedForLaterListItem_savedForLater on SavedForLater {
      numberOfTradingCards
      seller {
        id
        name
        avatarImageUrl
      }
    }`,
    props.savedForLater
  );

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Image
        style={styles.imageAvatar}
        source={savedForLater.seller.avatarImageUrl || Constants.defaultAvatar}
      />
      <View style={styles.userInfoContainer}>
        <Text style={styles.textName}>{savedForLater.seller.name || "Anonymous"}</Text>
        <Text style={styles.textCards}>
          {`${getCount(savedForLater.numberOfTradingCards)} Card${savedForLater.numberOfTradingCards > 1 ? 's' : ''}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

SavedForLaterListItem.displayName = 'SavedForLaterListItem';

export default SavedForLaterListItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    height: 82,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  imageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfoContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  textName: {
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
  },
  textCards: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.darkGrayText,
    marginTop: 8,
  },
}));
