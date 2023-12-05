import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import UniversalSectionHeader from './UniversalSectionHeader';
import ArticleItem from './ArticleItem';

import {createUseStyle} from 'theme';
import {Constants} from 'globals';

const ArticleSearchResult = ({
  search,
  onChangeSearchCategory,
  onViewAllArticles,
  onSelectArticle,
}) => {
  const styles = useStyle();

  const allArticlesData = useFragment(graphql`
    fragment ArticleSearchResultSearch on Search
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 2}
      after: {type: "String"}
      articlesWith: {type: "SearchArticlesWith"}
    ) {
      articles(after: $after, first: $first, with: $articlesWith) {
        edges {
          node {
            ...ArticleItem_article
          }
        }
      }
    }`,
    search
  );

  const {articles} = allArticlesData || {};

  const isHasArticles = !!articles?.edges?.length;

  useEffect(() => {
    if (onChangeSearchCategory) {
      onChangeSearchCategory(Object.keys(Constants.searchCategories)[2], isHasArticles);
    }
  }, [isHasArticles]);

  if (!isHasArticles) {
    return null;
  }

  const handleSelect = articleUrl => {
    if (articleUrl && onSelectArticle) {
      onSelectArticle(articleUrl);
    }
  };

  const handleViewAll = () => {
    if (onViewAllArticles) {
      onViewAllArticles();
    }
  };

  const renderHeader = () => (
    <UniversalSectionHeader
      title="Articles"
      onViewAll={handleViewAll}
    />
  );

  const renderItem = ({item}) => (
    <ArticleItem
      article={item.node}
      onPress={handleSelect}
    />
  );

  return (
    <FlatList
      style={styles.container}
      data={articles?.edges || []}
      scrollEnabled={false}
      keyboardShouldPersistTaps="handled"
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      renderItem={renderItem}
    />
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexGrow: 0,
    backgroundColor: colors.primaryBackground,
    paddingBottom: 8,
  },
}));

export default ArticleSearchResult;
