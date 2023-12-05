import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef} from 'react';
import {graphql, usePaginationFragment} from 'react-relay';
import {Text, View} from 'react-native';

import {
  FooterIndicator,
  Activity,
} from 'components';
import PostViewItem from './PostViewItem';
import ProductViewItem from './ProductViewItem';

import {Fonts, createUseStyle} from 'theme';
import {Constants} from 'globals';
import {usePrevious} from 'hooks';

const FeedType = {
  activity: 0,
  post: 1,
  product: 2,
};

const ActivityList = forwardRef(({
  style,
  title,
  isFetchingPosts,
  isFetchingProducts,
  posts,
  products,
  viewer,
  parentViewRef,
  parentContentHeight,
  parentContentOffsetY,
  category,
  onLeaveComment,
}, ref) => {
  const styles = useStyle();
  const prevProps = usePrevious({category});

  const allRecentActivities = useRef([]);
  const prevRecentActivitiesLength = useRef(0);
  const pageIndex = useRef(0);

  const {data: viewerData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment ActivityList_viewer on Viewer 
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 10}
      after: {type: "String"}
      with: {type: "ActivityWith", defaultValue: {}}
    )
    @refetchable(queryName: "ActivityListPaginationQuery") {
      ...Activity_viewer
      recommendations {
        recentActivity(after: $after, first: $first, with: $with)
        @connection(key: "ActivityList_recommendations__recentActivity") {
          edges {
            node {
              id
              ...Activity_activity
            }
          }
        }
      }
    }`,
    viewer
  );

  if (!viewerData) {
    return null;
  }

  const {recentActivity} = viewerData.recommendations || {};

  const filteredPostsAndProducts = useMemo(() => {
    if (!category) {
      return ({
        posts,
        products,
      });
    }

    const categoryName = (category.sport || category.game || '').toLowerCase();

    const filteredPosts = posts.filter(item => {
      const itemCategory = item?.attributes?.category?.toLowerCase();
      return itemCategory === 'all' || itemCategory === categoryName;
    });
    const filteredProducts = products.filter(item => {
      const itemCategory = item?.attributes?.category?.toLowerCase();
      return itemCategory === 'all' || itemCategory === categoryName;
    });

    return ({
      posts: filteredPosts || [],
      products: filteredProducts || [],
    });
  }, [category, posts, products]);

  const listData = useMemo(() => {
    const nextRecentActivitiesLength = recentActivity?.edges?.length;

    if (!nextRecentActivitiesLength) {
      return [];
    }

    const {posts, products} = filteredPostsAndProducts;

    if (isFetchingPosts || isFetchingProducts || (!products?.length && !posts?.length)) {
      return recentActivity?.edges || [];
    }

    if (prevRecentActivitiesLength.current === nextRecentActivitiesLength) {
      return allRecentActivities.current;
    }

    const extraItems = [];

    if (posts?.length) {
      let currentPosts = [];

      if (pageIndex.current % 2 === 0) {
        currentPosts = posts.filter(item => item.attributes?.priority) || [];
      }

      if (!currentPosts.length) {
        currentPosts = posts;
      }

      const randomIndex = Math.floor(Math.random() * currentPosts.length);
      extraItems.push({
        feedType: FeedType.post,
        ...currentPosts[randomIndex],
      });
    }

    if (products?.length) {
      let currentProducts = [];

      if (pageIndex.current % 2 === 0) {
        currentProducts = products.filter(item => item.attributes?.priority) || [];
      }

      if (!currentProducts.length) {
        currentProducts = products;
      }

      const randomIndex = Math.floor(Math.random() * currentProducts.length);
      extraItems.push({
        feedType: FeedType.product,
        ...currentProducts[randomIndex],
      });
    }

    const recentActivities = recentActivity?.edges?.slice(prevRecentActivitiesLength.current, nextRecentActivitiesLength + 1) || [];

    allRecentActivities.current.push(
      ...extraItems,
      ...recentActivities,
    );

    // sets
    prevRecentActivitiesLength.current = nextRecentActivitiesLength;
    pageIndex.current ++;

    return allRecentActivities.current;
  }, [isFetchingPosts, isFetchingProducts, filteredPostsAndProducts, recentActivity]);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (prevProps.category?.value === category?.value) {
      return;
    }

    const options = {};

    if (category?.sport) {
      options.sport = category.sport;
    } else if (category?.game) {
      options.game = category.game;
    }

    allRecentActivities.current = [];
    prevRecentActivitiesLength.current = 0;
    pageIndex.current = 0;

    refetch({with: options}, {fetchPolicy: 'network-only'});
  }, [category]);

  const loadNextActivities = () => {
    if (!hasNext) {
      return;
    }

    loadNext(Constants.feedFetchLimit);
  };

  useImperativeHandle(ref, () => ({
    loadNextActivities,
  }));

  const renderItem = (index, item) => {
    if (item.node) {
      return (
        <Activity
          key={index}
          viewer={viewerData}
          activity={item.node}
          onLeaveComment={onLeaveComment}
        />
      );
    } else if (item.feedType === FeedType.post) {
      return (
        <PostViewItem
          key={index}
          parentViewRef={parentViewRef}
          parentContentHeight={parentContentHeight}
          parentContentOffsetY={parentContentOffsetY}
          post={item}
        />
      );
    } else if (item.feedType === FeedType.product) {
      return (
        <ProductViewItem
          key={index}
          parentViewRef={parentViewRef}
          parentContentOffsetY={parentContentOffsetY}
          product={item}
        />
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, style]}>
      {title ? (
        <Text style={styles.textTitle}>{title}</Text>
      ) : null}
      {listData.map((edge, index) => renderItem(index, edge))}
      <FooterIndicator isLoading={isLoadingNext} />
    </View>
  );
});

ActivityList.displayName = 'ActivityList';

export default ActivityList;

const useStyle = createUseStyle(({colors}) => ({
  container: {},
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginHorizontal: 16,
  },
}));
