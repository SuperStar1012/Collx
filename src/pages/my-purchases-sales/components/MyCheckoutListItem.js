import React, {useMemo} from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Rating} from 'react-native-ratings';

import {Image, Button} from 'components';
import OrderGroupStatus from './OrderGroupStatus';

import {Constants, SchemaTypes} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {getCount} from 'utils';

const squareStackPlusIcon = require('assets/icons/square_stack_plus.png');
const squareStackMinusIcon = require('assets/icons/square_stack_minus.png');

const MyCheckoutListItem = React.memo(({
  style,
  order,
  ordersWithUserAs,
  onPress,
  onAddToCollection,
  onRemoveFromCollection,
}) => {
  const styles = useStyle();
  const {t: {colors}} = useTheme();

  const orderData = useFragment(graphql`
    fragment MyCheckoutListItem_order on Order {
      id
      state
      stateGroup
      ratingRecordedForBuyer
      ratingRecordedForSeller
      deal {
        tradingCards {
          id
        }
      }
      seller {
        name
        avatarImageUrl
      }
      buyer {
        id
        name
        avatarImageUrl
      }
      chargeBreakdown {
        type
        value {
          formattedAmount
        }
      }
      viewer {
        canCardsBeMovedToCollection
        canCardsBeRemovedFromSellersCollection
      }
      ...OrderGroupStatus_order
    }`,
    order
  );

  const isMeBuyer = ordersWithUserAs === SchemaTypes.ordersWithMeAs.BUYER;
  const userInfo = isMeBuyer ? orderData.seller : orderData.buyer;

  const totalPrice = useMemo(() => {
    const merchandiseItem = orderData.chargeBreakdown?.find(item => item.type === SchemaTypes.chargeBreakdownItemType.MERCHANDISE_VALUE);
    return merchandiseItem?.value.formattedAmount;
  }, [orderData.chargeBreakdown]);

  const isCompleted = useMemo(() => (
    orderData.stateGroup === SchemaTypes.orderStateGroup.COMPLETED
  ), [orderData.stateGroup]);

  const handleSelect = () => {
    if (!orderData.id || !orderData.buyer?.id) {
      return;
    }

    if (onPress) {
      onPress(orderData.id, orderData.buyer.id, orderData.state);
    }
  };

  const handleAddToCollection = () => {
    if (orderData?.id && onAddToCollection) {
      onAddToCollection(orderData.id);
    }
  };

  const handleRemoveFromCollection = () => {
    if (orderData?.id && onRemoveFromCollection) {
      onRemoveFromCollection(orderData.id);
    }
  };

  const renderAction = () => {
    if (!isCompleted) {
      return <View />;
    }

    if (isMeBuyer && orderData.viewer.canCardsBeMovedToCollection) {
      // For Buyer
      return (
        <Button
          icon={squareStackPlusIcon}
          iconStyle={[styles.iconSquareStack, styles.iconPlus]}
          label="Add to my collection"
          labelStyle={[styles.textCollection, styles.textAddTo]}
          scale={Button.scaleSize.Two}
          onPress={handleAddToCollection}
        />
      );
    } else if (!isMeBuyer && orderData.viewer.canCardsBeRemovedFromSellersCollection) {
      // For Seller
      return (
        <Button
          icon={squareStackMinusIcon}
          iconStyle={[styles.iconSquareStack, styles.iconMinus]}
          label="Remove from my collection"
          labelStyle={[styles.textCollection, styles.textRemoveFrom]}
          scale={Button.scaleSize.Two}
          onPress={handleRemoveFromCollection}
        />
      );
    }

    return <View />;
  };

  const renderRating = () => {
    if (!isCompleted) {
      return null;
    }

    return (
      <Rating
        type='custom'
        readonly
        ratingColor={colors.primary}
        tintColor={colors.primaryBackground}
        ratingBackgroundColor={colors.darkGrayText}
        imageSize={18}
        startingValue={isMeBuyer ? orderData.ratingRecordedForSeller : orderData.ratingRecordedForBuyer}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handleSelect}
    >
      <View style={styles.contentContainer}>
        <Image
          style={styles.imageAvatar}
          source={userInfo?.avatarImageUrl || Constants.defaultAvatar}
        />
        <View style={styles.userInfoContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.textName}>{userInfo?.name || "Anonymous"}</Text>
            <Text style={styles.textPrice}>{totalPrice}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.textCards}>
              {`${getCount(orderData.deal?.tradingCards?.length)} Card${orderData.deal?.tradingCards?.length > 1 ? 's' : ''}`}
            </Text>
            <OrderGroupStatus order={orderData} />
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        {renderAction()}
        {renderRating()}
      </View>
    </TouchableOpacity>
  );
});

MyCheckoutListItem.displayName = 'MyCheckoutListItem';

export default MyCheckoutListItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  contentContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  textPrice: {
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primary,
    marginBottom: 8,
  },
  bottomContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  iconSquareStack: {
    width: 28,
    height: 28,
    marginRight: 4,
  },
  iconPlus: {
    tintColor: colors.primary,
  },
  iconMinus: {
    tintColor: Colors.red,
  },
  textCollection: {
    fontSize: 13,
    letterSpacing: -0.08,
  },
  textAddTo: {
    color: colors.primary,
  },
  textRemoveFrom: {
    color: Colors.red,
  },
}));
