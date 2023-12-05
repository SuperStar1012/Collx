import React, {useEffect, useState, useMemo, Suspense, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  Button,
  LoadingIndicator,
  KeyboardAvoidingScrollView,
  ErrorBoundaryWithRetry,
  ErrorView,
  DealTradingCards,
} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {getPrice, getCardPrice, showErrorAlert} from 'utils';
import {withMakeOffer} from 'store/containers';

const MakeOfferPage = (props) => {
  const {navigation} = props;

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions(prev => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    refresh: handleRefresh,
  };

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: 'Make Offer',
    });
  };

  return (
    <ActionContext.Provider value={actions}>
      <KeyboardAvoidingScrollView style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <Content
              {...props}
              queryOptions={refreshedQueryOptions}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </KeyboardAvoidingScrollView>
    </ActionContext.Provider>
  );
};

const Content = ({
  navigation,
  route,
  queryOptions,
  setEmailVerifiedAction,
}) => {
  const {dealId, sellerId, buyerId} = route.params || {};

  const styles = useStyle();
  const actions = useActions();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hasFocus, setHasFocus] = useState(false);
  const [customAmount, setCustomAmount] = useState(0);
  const [isMakingOffer, setIsMakingOffer] = useState(false);

  const queryData = useLazyLoadQuery(
    graphql`
      query MakeOfferPageQuery($dealId: ID!) {
        deal(with: {id: $dealId}) {
          seller {
            id
            flags
          }
          buyer {
            id
            flags
          }
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
          ...DealTradingCards_deal,
        }
        viewer {
          profile {
            id
          }
        }
      }
    `,
    {
      dealId: dealId,
    },
    queryOptions,
  );

  const isMeBuyer = queryData.deal?.buyer?.id === queryData.viewer?.profile?.id;

  const totalPrice = useMemo(() => {
    let totalPrice = 0;
    queryData.deal.tradingCards?.forEach(card => {
      const price = getCardPrice(card);
      totalPrice += Number(price || 0);
    });

    return totalPrice;
  }, [queryData.deal.tradingCards]);

  useEffect(() => {
    setCustomAmount(totalPrice.toFixed(2));
  }, [totalPrice]);

  const priceList = [
    {price: (totalPrice * 0.9).toFixed(2), percent: '10% Off'},
    {price: (totalPrice * 0.95).toFixed(2), percent: '5% off'},
    {price: totalPrice.toFixed(2), percent: 'Est Total'},
  ];

  const handleSelectPrice = (index, price) => {
    setSelectedIndex(index);
    setCustomAmount(Number(price).toFixed(2));
  };

  const handleChangeValue = (value) => {
    setCustomAmount(value);
    setSelectedIndex(-1);
  };

  const handleMakeOffer = () => {
    const offerParams = {
      offerAmount: Number(customAmount),
    };

    if (sellerId) {
      offerParams.sellerId = sellerId;
    } else if (buyerId) {
      offerParams.buyerId = buyerId;
    }

    const {marketplace: buyerMarketplace} = queryData.deal?.buyer?.flags || {};
    const {marketplace: sellerMarketplace} = queryData.deal?.seller?.flags || {};

    setIsMakingOffer(true);

    actions.makeAnOffer(
      offerParams,
      {
        onComplete: () => {
          setIsMakingOffer(false);

          navigation.goBack();

          if (buyerMarketplace && sellerMarketplace){
            return;
          }

          setEmailVerifiedAction(() => {
            actions.navigateMessage({
              currentProfileId: queryData.viewer.profile.id,
              peerProfileId: isMeBuyer ? queryData.deal.seller.id : queryData.deal.buyer.id,
              isRootScreen: true,
            });
          });
        },
        onError: (error) => {
          setIsMakingOffer(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      }
    );
  };

  return (
    <>
      <LoadingIndicator isLoading={isMakingOffer} />
      <DealTradingCards deal={queryData.deal} />
      <View style={styles.pricesContainer}>
        {priceList.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.priceButton, selectedIndex === index ? styles.activePriceButton : {}]}
            activeOpacity={0.9}
            onPress={() => handleSelectPrice(index, item.price)}
          >
            <Text style={[styles.textPrice, selectedIndex === index ? styles.textActivePrice : {}]}>
              {getPrice(item.price)}
            </Text>
            <Text style={[styles.textPercent, selectedIndex === index ? styles.textActivePercent : {}]}>
              {item.percent}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.orContainer}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.orLine} />
      </View>
      <Text style={styles.textEnterAmount}>Enter a custom amount</Text>
      <View
        style={[
          styles.textInputContainer,
          hasFocus ? styles.textInputActiveContainer : styles.textInputInactiveContainer,
        ]}
      >
        <Text style={[styles.textPrefix, hasFocus ? styles.textActivePrefix : {}]}>$</Text>
        <TextInput
          style={styles.textInput}
          onBlur={() => setHasFocus(false)}
          onFocus={() => setHasFocus(true)}
          value={customAmount.toString()}
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          onChangeText={handleChangeValue}
        />
      </View>
      <View style={styles.bottomContainer}>
        {isMeBuyer ? (
          <Text style={styles.textDescription}>
            Your offer is not a payment. Final purchase details are arranged with the seller.
          </Text>
        ) : null}
        <Button
          style={styles.submitOfferButton}
          label="Submit Offer"
          labelStyle={styles.textSubmitOffer}
          scale={Button.scaleSize.One}
          onPress={handleMakeOffer}
        />
      </View>
    </>
  );
};

export default withMakeOffer(MakeOfferPage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  pricesContainer: {
    marginVertical: 16,
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  priceButton: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.grayBorder,
    backgroundColor: colors.secondaryCardBackground,
  },
  activePriceButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  textPrice: {
    fontWeight: Fonts.heavy,
    fontFamily: Fonts.nunitoBlack,
    fontSize: 20,
    lineHeight: 24,
    color: colors.primary,
  },
  textActivePrice: {
    color: Colors.white,
  },
  textPercent: {
    fontWeight: Fonts.bold,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.004,
    color: Colors.gray,
    marginTop: 6,
  },
  textActivePercent: {
    color: Colors.white,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightGrayText,
  },
  orText: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginHorizontal: 18,
  },
  textEnterAmount: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    marginTop: 16,
    marginHorizontal: 16,
  },
  textInputContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
    paddingHorizontal: 11,
    marginHorizontal: 16,
    marginTop: 12,
  },
  textInputActiveContainer: {
    borderColor: colors.primary,
  },
  textInputInactiveContainer: {
    borderColor: colors.secondaryCardBackground,
  },
  textPrefix: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.38,
    color: colors.lightGrayText,
    marginRight: 6,
  },
  textActivePrefix: {
    color: colors.primary,
  },
  textInput: {
    flex: 1,
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    letterSpacing: -0.41,
    color: colors.primaryText,
  },
  bottomContainer: {
    flex: 1,
    marginHorizontal: 16,
    justifyContent: 'flex-end',
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginVertical: 12,
  },
  submitOfferButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  textSubmitOffer: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    color: Colors.white,
  },
}));
