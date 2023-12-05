import React, {useMemo} from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {Image} from 'components';
import TransactionStatus from './TransactionStatus';

import {Constants, SchemaTypes} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {getCount, getPrice, getCardPrice} from 'utils';

const MyTransactionListItem = React.memo(({
  style,
  deal,
  transactionType,
  onPress,
}) => {
  const styles = useStyle();

  const dealData = useFragment(graphql`
    fragment MyTransactionListItem_deal on Deal {
      id
      state
      tradingCards {
        state
        sale {
          soldFor {
            amount
          }
        }
        listing {
          askingPrice {
            amount
          }
        }
        marketValue {
          source
          price {
            amount
          }
        }
      }
      offer {
        value {
          formattedAmount
        }
      }
      seller {
        name
        avatarImageUrl
      }
      buyer {
        name
        avatarImageUrl
      }
      chargeBreakdown {
        type
        value {
          amount
        }
      }
      ...TransactionStatus_deal
    }`,
    deal
  );

  const userInfo = transactionType === SchemaTypes.dealsWithMeAs.BUYER ? dealData.seller : dealData.buyer;

  const totalPrice = useMemo(() => {
    let totalPrice = 0;

    if (dealData.chargeBreakdown) {
      const totalItem = dealData.chargeBreakdown?.find(item => item.type === SchemaTypes.chargeBreakdownItemType.TOTAL);
      totalPrice = totalItem?.value?.amount;
    }

    if (!totalPrice) {
      dealData.tradingCards?.forEach(card => {
        const price = getCardPrice(card);
        totalPrice += Number(price || 0);
      });
      totalPrice = totalPrice.toFixed(2);
    }

    return totalPrice;
  }, [dealData.chargeBreakdown, dealData.tradingCards]);

  const handleSelect = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handleSelect}
    >
      <Image
        style={styles.imageAvatar}
        source={userInfo?.avatarImageUrl || Constants.defaultAvatar}
      />
      <View style={styles.userInfoContainer}>
        <Text
          style={styles.textName}
          numberOfLines={1}
        >
          {userInfo?.name || "Anonymous"}
        </Text>
        <Text style={styles.textCards}>
          {`${getCount(dealData.tradingCards.length)} Card${dealData.tradingCards.length > 1 ? 's' : ''}`}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.textDealPrice}>{dealData.offer?.value?.formattedAmount || getPrice(totalPrice)}</Text>
        <TransactionStatus deal={dealData} />
      </View>
    </TouchableOpacity>
  );
});

MyTransactionListItem.displayName = 'MyTransactionListItem';

export default MyTransactionListItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    height: 82,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  imageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfoContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  textName: {
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
  },
  textCards: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.darkGrayText,
    marginTop: 8,
  },
  statusContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  textDealPrice: {
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primary,
    marginBottom: 8,
  },
}));
