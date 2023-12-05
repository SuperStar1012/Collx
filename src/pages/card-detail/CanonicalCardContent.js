import React, {useEffect, useState, Suspense} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  KeyboardAvoidingCommentView,
  AIFloatingButton,
  FloatingButtonSize,
  CardMainInfo,
  CardFlags,
  OtherOwnersOfCardList,
  RecentSales,
} from 'components';

import NavBarRightForCanonicalCard from './components/NavBarRightForCanonicalCard';
import CardView from './components/CardView';
import CardReportInfo from './components/CardReportInfo';
import CollectionUserCardInfo from './components/CollectionUserCardInfo';

import {useActions} from 'actions';
import {createUseStyle} from 'theme';
import {withCardDetail} from 'store/containers';
import {Constants} from 'globals';
import {analyticsNavigationRoute} from 'services'

const CanonicalCardContent = ({
  navigation,
  canonicalCardId,
  tradingCardIdForIssue,
  queryOptions,
  setEmailVerifiedAction,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const queryData = useLazyLoadQuery(graphql`
    query CanonicalCardContentQuery($canonicalCardId: ID!) {
      card(with: {id: $canonicalCardId}) {
        name
        frontImageUrl
        name
        number
        set {
          name
        }
        backImageUrl(usePlaceholderWhenAbsent: false)
        ...CardFlags_card
        ...CardMainInfo_card
        ...RecentSales_card
        ...NavBarRightForCanonicalCard_card
        ...OtherOwnersOfCardList_card
        ...CardReportInfo_card
        ...CollectionUserCardInfo_card
      }
      viewer {
        profile {
          id
          isAnonymous
          type
        }
      }
    }`,
    {canonicalCardId},
    queryOptions,
  );

  if (!queryData) {
    return null;
  }

  const {card} = queryData;

  if (!card) {
    return null;
  }

  const [isVisibleAIChatButton, setIsVisibleAIChatButton] = useState(true);

  useEffect(() => {
    setNavigationBar();
  }, [card]);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerRight: () => (
        <Suspense fallback={<View />}>
          <NavBarRightForCanonicalCard card={card} actions={actions} />
        </Suspense>
      ),
    });
  };

  const handleWillShowKeyboard = () => {
    setIsVisibleAIChatButton(false);
  };

  const handleWillHideKeyboard = () => {
    setIsVisibleAIChatButton(true);
  };

  const handleOpenAIChat = () => {
    const {type: profileType} = queryData.viewer?.profile || {};
    const isProUser = profileType === Constants.userType.pro;

    if (!isProUser) {
      actions.navigateCollXProModal({
        source: analyticsNavigationRoute.CanonicalCard,
      });
      return;
    }

    setEmailVerifiedAction(() => {
      actions.navigateChatBotMessage({
        profileId: queryData.viewer?.profile?.id,
        canonicalCard: queryData.card,
        source: analyticsNavigationRoute.Card,
      });
    });
  };

  const handleViewUserCard = (tradingCardId) => {
    if (tradingCardId) {
      actions.pushTradingCardDetail(tradingCardId);
    }
  };

  const handleViewAllUserCards = () => {
    if (canonicalCardId) {
      actions.navigateMatchingTradingCards(canonicalCardId);
    }
  };

  return (
    <>
      <KeyboardAvoidingCommentView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          isVisibleAIChatButton && {paddingBottom: FloatingButtonSize + 16},
        ]}
        onWillShowKeyboard={handleWillShowKeyboard}
        onWillHideKeyboard={handleWillHideKeyboard}
        onRefresh={() => actions.refresh()}>
        <CollectionUserCardInfo
          card={card}
          onViewUserCard={handleViewUserCard}
          onViewAllUserCards={handleViewAllUserCards}
        />
        <CardMainInfo
          style={styles.cardMainInfoContainer}
          card={card}
        />
        <CardFlags
          style={styles.cardTagsContainer}
          card={card}
        />
        <CardReportInfo canonicalCard={card} />
        <CardView
          frontImageUrl={card.frontImageUrl}
          backImageUrl={card.backImageUrl}
        />
        <RecentSales
          card={card}
          tradingCardIdForIssue={tradingCardIdForIssue}
        />
        {!queryData.viewer.profile.isAnonymous ? (
          <OtherOwnersOfCardList card={card} />
        ) : null}
      </KeyboardAvoidingCommentView>
      <AIFloatingButton
        onPress={handleOpenAIChat}
      />
    </>
  );
};

export default withCardDetail(CanonicalCardContent);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    paddingBottom: 8,
  },
  cardMainInfoContainer: {
    marginBottom: 12,
  },
  cardTagsContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
}));
