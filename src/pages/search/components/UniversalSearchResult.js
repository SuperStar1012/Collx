import React, {Suspense, useMemo, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  KeyboardAvoidingScrollView,
} from 'components';

import ArticleSearchResult from './ArticleSearchResult';
import DatabaseSearchResult from './DatabaseSearchResult';
import SaleSearchResult from './SaleSearchResult';
import NoResult from './NoResult';
import CollXAITerm from './CollXAITerm';

import {createUseStyle} from 'theme';
import {useActions} from 'actions';
import {openUrl} from 'utils';
import {SchemaTypes} from 'globals';

const UniversalSearchResult = props => (
  <Suspense fallback={<LoadingIndicator isLoading />}>
    <Content {...props} />
  </Suspense>
);

const Content = ({
  searchText,
  aiPromptSuggestion,
  searchedCategories,
  selectedCategory,
  queryOptions,
  onChangeSearchCategory,
  onOpenCollXAI,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const keyboardAvoidScrollViewRef = useRef(null);
  const saleCardsListRef = useRef(null);

  const withOptions = useMemo(() => {
    const options = {};

    if (selectedCategory?.sport) {
      options.sport = selectedCategory.sport;
    } else if (selectedCategory?.game) {
      options.game = selectedCategory.game;
    }

    return options;
  }, [selectedCategory]);

  const searchData = useLazyLoadQuery(graphql`
    query UniversalSearchResultQuery(
      $keywords: String!,
      $canonicalCardsWith: SearchCardsWith,
      $articlesWith: SearchArticlesWith,
      $listedTradingCardsWith: SearchListedTradingCardsWith
      $skip: Boolean!
    ) {
      search(keywords: $keywords) @skip(if: $skip) {
        ...DatabaseSearchResultSearch @arguments(canonicalCardsWith: $canonicalCardsWith)
        ...ArticleSearchResultSearch @arguments(articlesWith: $articlesWith)
        ...SaleSearchResultSearch @arguments(listedTradingCardsWith: $listedTradingCardsWith)
      }
    }`,
    {
      keywords: searchText || '',
      canonicalCardsWith: withOptions,
      articlesWith: {},
      listedTradingCardsWith: withOptions,
      skip: !searchText,
    },
    queryOptions,
  );

  useEffect(() => {
    if (!keyboardAvoidScrollViewRef.current) {
      return;
    }

    keyboardAvoidScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  }, [searchText]);

  const saveSearch = (topics = []) => {
    actions.saveSearch({
      query: searchText,
      source: SchemaTypes.savedSearchSource.DEFAULT,
      topics: topics,
    });
  };

  const handleSelectCanonicalCard = cardId => {
    saveSearch([SchemaTypes.savedSearchTopic.CARD]);
    actions.pushCanonicalCardDetail(cardId);
  };

  const handleSelectTradingCard = tradingCardId => {
    saveSearch([SchemaTypes.savedSearchTopic.TRADING_CARD]);
    actions.pushTradingCardDetail(tradingCardId);
  };

  const handleSelectArticle = articleUrl => {
    saveSearch([]);
    openUrl(articleUrl);
  };

  const handleViewAllCanonicalCards = () => {
    actions.navigateDatabaseSearchAll({
      searchText,
    });
  };

  const handleViewAllArticles = () => {
    actions.navigateArticleSearchAll({
      searchText,
    });
  };

  const handleViewAllSaleCards = () => {
    actions.navigateSaleSearchAll({
      searchText,
    });
  };

  const handleRefresh = () => {
    actions.refresh();
  };

  const handleEndReached = () => {
    if (!saleCardsListRef.current) {
      return;
    }

    saleCardsListRef.current.loadNextSaleCards();
  };

  return (
    <BottomTabBarHeightContext.Consumer>
      {tabBarHeight => (
        <KeyboardAvoidingScrollView
          ref={keyboardAvoidScrollViewRef}
          style={styles.container}
          isInitialKeyboard
          bottomOffset={tabBarHeight || 0}
          refreshing={false}
          onRefresh={handleRefresh}
          onEndReachedThreshold={0.2}
          onEndReached={handleEndReached}
        >
          <CollXAITerm
            searchText={searchText}
            aiPromptSuggestion={aiPromptSuggestion}
            onPress={onOpenCollXAI}
          />
          <DatabaseSearchResult
            search={searchData.search}
            onChangeSearchCategory={onChangeSearchCategory}
            onViewAllCanonicalCards={handleViewAllCanonicalCards}
            onSelectCanonicalCard={handleSelectCanonicalCard}
          />
          <ArticleSearchResult
            search={searchData.search}
            onChangeSearchCategory={onChangeSearchCategory}
            onViewAllArticles={handleViewAllArticles}
            onSelectArticle={handleSelectArticle}
          />
          <SaleSearchResult
            ref={saleCardsListRef}
            search={searchData.search}
            onChangeSearchCategory={onChangeSearchCategory}
            onViewAllSaleCards={handleViewAllSaleCards}
            onSelectTradingCard={handleSelectTradingCard}
          />
          {!searchedCategories.length ? <NoResult /> : null}
        </KeyboardAvoidingScrollView>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
};

UniversalSearchResult.defaultProps = {
  onChangeSearchCategory: () => {},
};

UniversalSearchResult.propTypes = {
  onChangeSearchCategory: PropTypes.func,
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));

export default UniversalSearchResult;
