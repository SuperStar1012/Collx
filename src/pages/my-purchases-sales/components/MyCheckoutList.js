import React, {useState, Suspense} from 'react';
import {graphql, usePaginationFragment} from 'react-relay';
import {FlatList} from 'react-native';

import {LoadingIndicator, FooterIndicator} from 'components';
import MyCheckoutListItem from './MyCheckoutListItem'
import NoResult from './NoResult';

import {Constants, SchemaTypes} from 'globals';
import {useActions} from 'actions';
import {createUseStyle} from 'theme';
import {showErrorAlert} from 'utils';

const MyCheckoutList = ({
  viewer,
  ordersWithUserAs,
  orderStateGroup
}) => {
  const actions = useActions();
  const styles = useStyle();

  const [isUpdating, setIsUpdating] = useState(false);

  const {data: viewerData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment MyCheckoutListQuery_viewer on Viewer
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
      orderBy: {type: "[AllOrdersOrder!]", defaultValue: [UPDATED_AT_DESC]}
      ordersCondition: {type: "OrdersWith"}
    )
    @refetchable(queryName: "MyCheckoutListPaginationQuery") {
      orders(after: $after, first: $first, orderBy: $orderBy, with:$ordersCondition)
      @connection(key: "MyCheckoutListQuery_viewer__orders") {
        edges {
          node {
            id
            ...MyCheckoutListItem_order
          }
        }
      }
      profile {
        id
      }
    }`,
    viewer
  );

  if (!viewerData) {
    return null;
  }

  const handleRefetch = () => {
    const query = {
      ordersCondition: {meAs: ordersWithUserAs},
      orderBy: [SchemaTypes.allOrdersOrder.UPDATED_AT_DESC],
    };

    if (orderStateGroup) {
      query.ordersCondition.stateGroup = orderStateGroup;
    }

    refetch(query, {fetchPolicy: 'network-only'});
  };

  const handleSelectCheckout = (orderId, buyerId, orderState) => {
    if (!orderId) {
      return;
    }

    if (buyerId === viewerData.profile?.id && orderState === SchemaTypes.orderState.CREATED) {
      actions.navigateCheckout({
        orderId,
        ordersWithUserAs: SchemaTypes.ordersWithMeAs.BUYER,
      });
      return;
    }

    actions.navigateOrderDetail({
      orderId,
      isFromCheckout: false,
    });
  };

  const handleAddToCollection = (orderId) => {
    setIsUpdating(true);

    actions.addCardsFromOrderToCollection(
      orderId,
      {
        onComplete: () => {
          setIsUpdating(false);
        },
        onError: (error) => {
          console.log(error);
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      },
    );
  };

  const handleRemoveFromCollection = (orderId) => {
    setIsUpdating(true);

    actions.removeCardsFromSellersCollection(
      orderId,
      {
        onComplete: () => {
          setIsUpdating(false);
        },
        onError: (error) => {
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const handleEndReached = () => {
    if (isLoadingNext) {
      return;
    }

    if (hasNext) {
      loadNext(Constants.defaultFetchLimit);
    }
  };

  const renderItem = ({item: edge}) => (
    <Suspense fallback={<LoadingIndicator isLoading />}>
      <MyCheckoutListItem
        order={edge.node}
        ordersWithUserAs={ordersWithUserAs}
        onPress={handleSelectCheckout}
        onAddToCollection={handleAddToCollection}
        onRemoveFromCollection={handleRemoveFromCollection}
      />
    </Suspense>
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNext} />
  );

  return (
    <>
      <LoadingIndicator isLoading={isUpdating} />
      <FlatList
        style={styles.container}
        contentContainerStyle={viewerData.orders?.edges?.length > 0 ? {} : styles.contentContainer}
        data={viewerData.orders?.edges || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onRefresh={handleRefetch}
        refreshing={false}
        ListEmptyComponent={<NoResult />}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.2}
        onEndReached={handleEndReached}
      />
    </>
  );
};

export default MyCheckoutList;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    flexGrow: 1,
  },
}));
