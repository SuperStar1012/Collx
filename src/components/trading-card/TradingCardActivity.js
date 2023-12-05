import React from 'react';
import {useFragment, graphql} from 'react-relay';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {Image, Button} from 'components';
import TradingCardConditionAndFlags from './TradingCardConditionAndFlags';
import TradingCardMarketValue from './TradingCardMarketValue';
import TradingCardSetNameText from './TradingCardSetNameText';
import TradingCardNumberAndPlayerText from './TradingCardNumberAndPlayerText';

import {Fonts, createUseStyle} from 'theme';
import {wp, decodeId} from 'utils';
import {useActions} from 'actions';
import {
  analyticsEvents,
  analyticsSendEvent,
} from 'services';

const heartOutlineIcon = require('assets/icons/heart.png');
const heartFillIcon = require('assets/icons/heart_fill.png');
const conversationIcon = require('assets/icons/bubble.png');
const shareIcon = require('assets/icons/share.png');

const TradingCardActivity = ({
  style,
  profileViewer,
  tradingCard,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const tradingCardData = useFragment(graphql`
    fragment TradingCardActivity_tradingCard on TradingCard {
      id
      frontImageUrl
      shareUrl
      card {
        set {
          name
        }
      }
      likes {
        totalCount
      }
      comments {
        totalCount
      }
      viewer {
        isLikedByMe
      }
      notes
      ...TradingCardSetNameText_tradingCard
      ...TradingCardNumberAndPlayerText_tradingCard
      ...TradingCardMarketValue_tradingCard
      ...TradingCardConditionAndFlags_tradingCard
    }`,
    tradingCard
  );

  const profileViewerData = useFragment(graphql`
    fragment TradingCardActivity_profileViewer on ProfileViewer {
      isMe
      amIBlockingThem
    }`,
    profileViewer
  );

  const isBlockedByThem = !profileViewerData?.isMe && profileViewerData?.amIBlockingThem;

  const handleCardDetail = () => {
    actions.pushTradingCardDetail(tradingCardData.id);
  };

  const handleCardDetailWithComment = () => {
    actions.pushCardDetailWithComments(tradingCardData.id);
  };

  const handleLike = () => {
    if (tradingCardData.viewer.isLikedByMe) {
      actions.dislikeTradingCard(tradingCardData.id);
    } else {
      actions.likeTradingCard(tradingCardData.id);
    }
  };

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

  const renderExtraActions = () => {
    if (isBlockedByThem) {
      return null;
    }

    return (
      <>
        <Button
          icon={tradingCardData.viewer.isLikedByMe ? heartFillIcon : heartOutlineIcon}
          iconStyle={styles.iconSocial}
          label={tradingCardData.likes.totalCount.toString()}
          labelStyle={styles.textSocial}
          scale={Button.scaleSize.Two}
          onPress={handleLike}
        />
        <Button
          icon={conversationIcon}
          iconStyle={styles.iconSocial}
          label={tradingCardData.comments.totalCount?.toString()}
          labelStyle={styles.textSocial}
          scale={Button.scaleSize.Two}
          onPress={handleCardDetailWithComment}
        />
      </>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.9}
        onPress={handleCardDetail}>
        <View style={styles.cardMainContainer}>
          <Image
            source={tradingCardData.frontImageThumbnailUrl || tradingCardData.frontImageUrl}
            style={styles.imageCover}
          />
          <View style={styles.cardMainContentContainer}>
            <TradingCardSetNameText tradingCard={tradingCardData} />
            <TradingCardNumberAndPlayerText tradingCard={tradingCardData} />
            <TradingCardConditionAndFlags
              style={styles.conditionContainer}
              tradingCard={tradingCardData}
            />
            <View style={styles.statusContainer}>
              <TradingCardMarketValue
                style={styles.statusItemContainer}
                priceStyle={styles.textPrice}
                stateStyle={styles.textState}
                tradingCard={tradingCardData}
              />
            </View>
          </View>
        </View>
        {tradingCardData.notes ? (
          <Text
            style={styles.textNotes}
            numberOfLines={5}
          >
            {tradingCardData.notes}
          </Text>
        ) : null}
      </TouchableOpacity>
      <View
        style={[
          styles.bottomContentContainer,
          isBlockedByThem ? styles.blockContentContainer : styles.unblockContentContainer,
        ]}
      >
        {renderExtraActions()}
        <Button
          icon={shareIcon}
          iconStyle={styles.iconSocial}
          scale={Button.scaleSize.Two}
          onPress={handleShare}
        />
      </View>
    </View>
  );
};

export default TradingCardActivity;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  cardContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  cardMainContainer: {
    flexDirection: 'row',
  },
  imageCover: {
    width: 86,
    height: 121,
    overflow: 'hidden',
  },
  cardMainContentContainer: {
    flex: 1,
    marginLeft: 10,
  },
  conditionContainer: {
    marginTop: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusItemContainer: {
    width: wp(25),
    height: 40,
  },
  textPrice: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 15,
    lineHeight: 18,
  },
  textState: {
    fontWeight: Fonts.bold,
    fontSize: 8,
    lineHeight: 10,
  },
  textNotes: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    marginTop: 12,
    color: colors.primaryText,
  },
  bottomContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginVertical: 8,
  },
  unblockContentContainer: {
    justifyContent: 'space-between',
  },
  blockContentContainer: {
    justifyContent: 'center',
  },
  iconSocial: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  textSocial: {
    fontWeight: Fonts.semiBold,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginLeft: 6,
  },
}));
