import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {
  Button,
} from 'components';
import {
  DealTradingCards
} from '../deal';

import OrderDetailItem from './OrderDetailItem';
import PricesInfoForBuyer from './PricesInfoForBuyer';
import PricesInfoForSeller from './PricesInfoForSeller';

import {Fonts, createUseStyle} from 'theme';

const OrderDetail = (props) => {
  const {
    style,
    isCheckout,
    isMeBuyer,
    order,
    onSelectCard,
    onAddShippingAddress,
  } = props;

  const [isVisibleFull, setIsVisibleFull] = useState(true);

  const styles = useStyle();

  const orderData = useFragment(graphql`
    fragment OrderDetail_order on Order {
      state
      deal {
        tradingCards {
          ...OrderDetailItem_tradingCard
        }
        ...DealTradingCards_deal
      }
      ...PricesInfoForBuyer_order
      ...PricesInfoForSeller_order
    }`,
    order
  );

  if (!orderData) {
    return null;
  }

  const handleVisibleMode = () => {
    setIsVisibleFull(!isVisibleFull);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerContainer}>
        <Text style={styles.textTitle}>Order Detail</Text>
        {!isCheckout ? (
          <Button
            label={isVisibleFull ? 'Hide Details' : 'View Full Details'}
            labelStyle={styles.textVisibleMode}
            scale={Button.scaleSize.One}
            onPress={handleVisibleMode}
          />
        ) : null}
      </View>
      <View style={styles.listContainer}>
        {isVisibleFull ?
          orderData?.deal?.tradingCards?.map((item, index) => (
            <OrderDetailItem
              key={index}
              tradingCard={item}
              onSelectCard={onSelectCard}
            />
          ))
        : (
          <DealTradingCards deal={orderData?.deal} />
        )}
      </View>
      {isMeBuyer ? (
        <PricesInfoForBuyer
          isCheckout={isCheckout}
          isVisibleFull={isVisibleFull}
          order={orderData}
          onAddShippingAddress={onAddShippingAddress}
        />
      ) : (
        <PricesInfoForSeller
          order={orderData}
        />
      )}
    </View>
  );
}

export default OrderDetail;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 24,
  },
  listContainer: {
    borderTopColor: colors.quaternaryBorder,
    borderTopWidth: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 13,
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 15,
    lineHeight: 18,
    color: colors.primaryText,
  },
  textVisibleMode: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.primary,
  },
}));
