import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';

import {Image, Button} from 'components';

import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {useActions} from 'actions';
import {getCount} from 'utils';

const messageFillIcon = require('assets/icons/message_fill.png');
const heartOutlineIcon = require('assets/icons/heart.png');
const heartFillIcon = require('assets/icons/heart_fill.png');
const bubbleIcon = require('assets/icons/bubble.png');

const CardOwnerView = ({
  style,
  viewer,
  tradingCard,
  onComment,
  onSendUserCard,
}) => {
  const actions = useActions();

  const styles = useStyle();

  const tradingCardData = useFragment(graphql`
    fragment CardOwnerView_tradingCard on TradingCard {
      id
      owner {
        id
        name
        isAnonymous
        avatarImageUrl
      }
      likes {
        totalCount
      }
      allComments: comments {
        totalCount
      }
      addedAt
      viewer {
        canStartConversation
        isAnonymous
        isLikedByMe
        isMine
      }
    }`,
    tradingCard
  );

  const viewerData = useFragment(graphql`
    fragment CardOwnerView_viewer on Viewer {
      profile {
        id
      }
    }`,
    viewer
  );

  const handleSelectUser = () => {
    if (tradingCardData.owner?.id) {
      actions.pushProfile(tradingCardData.owner?.id);
    }
  };

  const handleConversation = () => {
    if (tradingCardData.viewer.isAnonymous) {
      actions.navigateCreateAccount();
      return;
    }

    if (onSendUserCard) {
      onSendUserCard(viewerData.profile?.id, tradingCardData.owner?.id, tradingCardData.id);
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.userContainer}
        activeOpacity={0.9}
        onPress={handleSelectUser}>
        <Image
          style={styles.imageAvatar}
          source={tradingCardData.owner?.avatarImageUrl || Constants.defaultAvatar}
        />
        <View style={styles.textsContentContainer}>
          <Text style={styles.textName} numberOfLines={1}>
            {tradingCardData.owner?.name || Constants.defaultName}
          </Text>
          <Text style={styles.textDescription} numberOfLines={1}>
            Added to collection {moment(tradingCardData.addedAt).fromNow()}
          </Text>
        </View>
        {tradingCardData.viewer.canStartConversation &&
          <Button
            style={styles.messageButton}
            icon={messageFillIcon}
            iconStyle={styles.iconMessage}
            scale={Button.scaleSize.One}
            onPress={handleConversation}
          />
        }
      </TouchableOpacity>
      <View style={styles.cardInfoContainer}>
        <View
          style={[styles.cardInfoItemContainer, styles.cardInfoItemLeftContainer]}>
          <Image style={styles.iconCardInfo} source={tradingCardData.viewer.isLikedByMe ? heartFillIcon : heartOutlineIcon} />
          <Text style={styles.textCardInfo}>
            {tradingCardData.likes.totalCount} Likes
          </Text>
        </View>
        <Button
          style={[styles.cardInfoItemContainer, styles.cardInfoItemRightContainer]}
          icon={bubbleIcon}
          iconStyle={styles.iconCardInfo}
          label={`${getCount(tradingCardData.allComments.totalCount)} Comment${tradingCardData.allComments.totalCount > 1 ? 's' : ''}`}
          labelStyle={styles.textCardInfo}
          scaleDisabled
          onPress={handleComment}
        />
      </View>
    </View>
  );
};

export default CardOwnerView;

const useStyle = createUseStyle(({colors}) => ({
  container: {},
  userContainer: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.secondaryCardBackground,
  },
  imageAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textsContentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  textName: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    marginBottom: 4,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
  },
  messageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  iconMessage: {
    width: 24,
    height: 24,
    marginLeft: 1,
    marginTop: 2,
    tintColor: Colors.white,
  },
  cardInfoContainer: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  cardInfoItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    backgroundColor: colors.secondaryCardBackground,
  },
  cardInfoItemLeftContainer: {
    borderBottomLeftRadius: 10,
  },
  cardInfoItemRightContainer: {
    borderBottomRightRadius: 10,
    marginLeft: 1,
  },
  textCardInfo: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
  },
  iconCardInfo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.primary,
    marginRight: 4,
  },
}));
