import React, {useState} from 'react';
import {graphql, useFragment} from 'react-relay';
import {View, Text} from 'react-native';

import {Button, Image} from 'components';
import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {getCount, wp} from 'utils';
import {useActions} from 'actions';

const avatarSize = 36;

const OtherOwnersOfCardList = (props) => {

  const styles = useStyle();
  const actions = useActions();

  const card = useFragment(graphql`
    fragment OtherOwnersOfCardList_card on Card {
      id
      otherTradingCards: tradingCards(first: 10) {
        edges {
          node {
            owner {
              id
              avatarImageUrl
            }
          }
        }
        totalCount
      }
    }`,
    props.card
  );

  const [maxWidth, setMaxWidth] = useState(wp(58));

  const handleLayout = event => {
    const layout = event.nativeEvent.layout;
    const layoutWidth = Math.round(layout.width);

    if (maxWidth !== layoutWidth) {
      setMaxWidth(layoutWidth);
    }
  };

  const handleViewMoreUsers = () => {
    if (card.id) {
      actions.pushCardUsers(card.id);
    }
  };

  const AvatarSpread = ({profiles}) => {
    const avatarComponents = [];
    let currentLeft = 0;
    const avatarSpace = (avatarSize / 3) * 2;
    let zIndex = Math.ceil(maxWidth / avatarSpace);

    for (const profile of profiles) {
      avatarComponents.push(
        <View
          key={`profile.id-${zIndex}`}
          style={[
            styles.avatarContainer,
            {left: currentLeft, zIndex},
          ]}>
          <Image
            style={styles.imageAvatar}
            source={profile?.avatarImageUrl || Constants.defaultAvatar}
          />
        </View>,
      );
      zIndex -= 1;
      currentLeft += avatarSpace;

      if (currentLeft > maxWidth - avatarSize ) {
        break;
      }
    }

    return (
      <View style={styles.usersContainer}>
        <View style={styles.avatarsContainer} onLayout={handleLayout}>
          {avatarComponents}
        </View>
        {card.otherTradingCards.totalCount > avatarComponents.length ? (
          <Text style={[styles.textGeneral, styles.textMore]}>
            +{getCount(card.otherTradingCards.totalCount - avatarComponents.length)}
          </Text>
        ) : null}
      </View>
    );
  };

  if (!card.otherTradingCards?.totalCount) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.textGeneral, styles.textTitle]}>
        {getCount(card.otherTradingCards.totalCount)} {card.otherTradingCards.totalCount > 1 ? 'users have this card' : 'user has this card'}
      </Text>
      <View style={styles.mainContainer}>
        <AvatarSpread profiles={card.otherTradingCards.edges.map((edge) => edge.node.owner)} />
        <Button
          style={styles.viewButton}
          labelStyle={[styles.textGeneral, styles.textView]}
          label="View"
          disabled={!card.id}
          scale={Button.scaleSize.Four}
          onPress={handleViewMoreUsers}
        />
      </View>
    </View>
  );
};

export default OtherOwnersOfCardList;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  textGeneral: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  textTitle: {
    color: colors.primaryText,
    marginBottom: 12,
  },
  textView: {
    color: Colors.white,
  },
  textMore: {
    color: Colors.mediumGray,
    marginHorizontal: 7,
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usersContainer: {
    flex: 1,
    height: avatarSize,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
    overflow: 'hidden',
  },
  avatarsContainer: {
    flex: 1,
    height: avatarSize,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  viewButton: {
    width: 67,
    height: 36,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  avatarContainer: {
    position: 'absolute',
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    borderWidth: 2,
    borderColor: colors.primaryBackground,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageAvatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
  },
}));
