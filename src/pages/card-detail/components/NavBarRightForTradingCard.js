import React, {useMemo} from 'react';
import {graphql, useFragment} from 'react-relay';
import {View, StyleSheet} from 'react-native';

import {NavBarButton} from 'components';

import {
  analyticsEvents,
  analyticsSendEvent,
} from 'services';
import {decodeId} from 'utils';

const cartIcon = require('assets/icons/cart.png');
const pencilIcon = require('assets/icons/pencil.png');
const exclamationIcon = require('assets/icons/exclamation.png');
const shareIcon = require('assets/icons/share.png');
const heartOutlineIcon = require('assets/icons/heart.png');
const heartFillIcon = require('assets/icons/heart_fill.png');

const NavBarRightForTradingCard = ({
  tradingCard,
  actions,
}) => {
  const styles = useStyle();

  const tradingCardData = useFragment(graphql`
    fragment NavBarRightForTradingCard_tradingCard on TradingCard {
      id
      owner {
        viewer {
          isMe
          amIBlockingThem
          activeDealWithSeller {
            id
          }
        }
      }
      shareUrl
      card {
        id
        number
        set {
          name
        }
        ...on SportCard {
          player {
            name
          }
          team {
            name
          }
        }
      }
      viewer {
        isLikedByMe
        isMine
      }
    }`,
    tradingCard
  );

  const {isMine, isLikedByMe} = tradingCardData.viewer || {};

  const isBlockedByThem = useMemo(() => {
    const {isMe, amIBlockingThem} = tradingCardData?.owner?.viewer || {};
    return !isMe && amIBlockingThem;
  }, [tradingCardData]);

  const isActiveDeal = useMemo(() => (
    !!tradingCardData?.owner?.viewer?.activeDealWithSeller
  ), [tradingCardData]);

  const handleShare = () => {
    actions.shareUrl(tradingCardData.shareUrl);

    const [, tradingCardId] = decodeId(tradingCardData.id);
    analyticsSendEvent(
      analyticsEvents.sharedCard,
      {
        type: 'user',
        id: tradingCardId,
        name: tradingCardData.card?.set?.name,
      },
    );
  };

  const handleDeal = () => {
    if (!isActiveDeal) {
      return;
    }

    const {activeDealWithSeller} = tradingCardData?.owner?.viewer || {};
    if (activeDealWithSeller?.id) {
      actions.navigateDeal(activeDealWithSeller.id);
    }
  };

  const handleEditCard = () => {
    if (!tradingCardData.id) {
      return;
    }

    actions.navigateEditCard({
      tradingCardId: tradingCardData.id,
      isCloseBack: true,
      isCapture: true,
    });
  };

  const handleLike = () => {
    if (!tradingCardData.id) {
      return;
    }

    if (isLikedByMe) {
      actions.dislikeTradingCard(tradingCardData.id)
    } else {
      actions.likeTradingCard(tradingCardData.id)
    }
  };

  const handleReport = () => {
    if (!tradingCardData?.card) {
      return;
    }

    actions.navigateReportIssue({
      forInput: {
        tradingCardId: tradingCardData.id,
      },
    });
  };

  return (
    <View style={styles.container}>
      {isActiveDeal &&
        <NavBarButton
          style={styles.navBarButton}
          icon={cartIcon}
          onPress={handleDeal}
        />
      }
      {isMine &&
        <NavBarButton
          style={styles.navBarButton}
          icon={pencilIcon}
          onPress={handleEditCard}
        />
      }
      {!isMine && !isBlockedByThem &&
        <NavBarButton
          style={styles.navBarButton}
          icon={isLikedByMe ? heartFillIcon : heartOutlineIcon}
          onPress={handleLike}
        />
      }
      <NavBarButton
        style={styles.navBarButton}
        icon={exclamationIcon}
        onPress={handleReport}
      />
      <NavBarButton
        style={styles.navBarButton}
        icon={shareIcon}
        onPress={handleShare}
      />
    </View>
  );
};

export default NavBarRightForTradingCard;

const useStyle = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    navBarButton: {
      flex: 0,
      width: 28,
      height: 28,
      marginHorizontal: 5,
    },
  });