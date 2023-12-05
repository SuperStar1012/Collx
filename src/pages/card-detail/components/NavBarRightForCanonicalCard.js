import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {View, StyleSheet} from 'react-native';

import {NavBarButton} from 'components';

import {
  analyticsEvents,
  analyticsSendEvent,
} from 'services';
import {decodeId} from 'utils';

const exclamationIcon = require('assets/icons/exclamation.png');
const shareIcon = require('assets/icons/share.png');
const stackPlusIcon = require('assets/icons/square_stack_plus.png');

const NavBarRightForCanonicalCard = ({
  card,
  actions,
}) => {
  const styles = useStyle();

  const cardData = useFragment(graphql`
    fragment NavBarRightForCanonicalCard_card on Card {
      id
      number
      shareUrl
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
    }`,
    card
  );

  const handleShare = () => {
    actions.shareUrl(cardData.shareUrl);

    const [, canonicalCardId] = decodeId(cardData.id);
    analyticsSendEvent(
      analyticsEvents.sharedCard,
      {
        type: 'canonical',
        id: canonicalCardId,
        name: cardData?.set?.name,
      },
    );
  };

  const handleReport = () => {
    if (!cardData?.id) {
      return;
    }

    actions.navigateReportIssue({
      forInput: {
        cardId: cardData.id,
      },
    });
  };

  const handleAddCard = () => {
    if (!cardData?.id) {
      return;
    }

    actions.navigateAddCardToCollection({
      canonicalCardId: cardData.id,
      isCloseBack: true,
    })
  }

  return (
    <View style={styles.container}>
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
      <NavBarButton
        style={styles.navBarButton}
        icon={stackPlusIcon}
        onPress={handleAddCard}
      />
    </View>
  );
};

export default NavBarRightForCanonicalCard;

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