import React, {Suspense} from 'react';
import {FlatList, Text, View} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {
  LoadingIndicator,
  DealCardItem,
} from 'components';

import {SchemaTypes} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const DealList = (props) => {
  const {
    style,
    isMeBuyer,
    onSelectCard,
    onSaveForLater,
    onRemoveCard,
  } = props;

  const styles = useStyle();

  const deal = useFragment(graphql`
    fragment DealList_deal on Deal {
      tradingCards {
        id
        ...DealCardItem_tradingCard
      }
      state
    }`,
    props.deal
  );

  const isBuyerPending = isMeBuyer && deal.state === SchemaTypes.dealState.PENDING;

  const renderItem = ({item}) => (
    <DealCardItem
      key={item.id}
      tradingCard={item}
      onSelectCard={onSelectCard}
      onSaveForLater={isBuyerPending ? onSaveForLater : null}
      onRemoveCard={isBuyerPending ? onRemoveCard : null}
    />
  );

  return (
    <View style={[styles.container, style]}>
      <Suspense fallback={<LoadingIndicator isLoading />}>
        <Text style={styles.textTitle}>All Items</Text>
        <FlatList
          style={styles.listContainer}
          data={deal.tradingCards || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </Suspense>
    </View>
  );
}

export default DealList;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 25,
  },
  listContainer: {
    borderTopColor: colors.quaternaryBorder,
    borderTopWidth: 1,
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 15,
    lineHeight: 18,
    color: colors.primaryText,
    marginHorizontal: 16,
    marginBottom: 13,
  },
}));
