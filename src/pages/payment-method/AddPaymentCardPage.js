import React, {Suspense, useState, useEffect, useCallback} from 'react';
import {View, Text, TextInput} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import {CardField, useStripe} from '@stripe/stripe-react-native';

import {
  NavBarButton,
  LoadingIndicator,
  ShippingAddress,
  KeyboardAvoidingScrollView,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';

import {Fonts, createUseStyle, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {withPaymentMethods} from 'store/containers';
import {usePrevious} from 'hooks';
import {Constants} from 'globals';

const AddPaymentCardPage = (props) => {
  const {navigation} = props;

  const styles = useStyle();

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
  };

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState({
    fetchPolicy: 'store-and-network',
  });

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}
        >
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <Content
              {...props}
              queryOptions={refreshedQueryOptions}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const Content = props => {
  const {
    navigation,
    isAttachingPaymentMethod,
    queryOptions,
    attachPaymentMethod,
  } = props;

  const {createPaymentMethod} = useStripe();
  const styles = useStyle();
  const {t: {colors}} = useTheme();

  const prevProps = usePrevious({isAttachingPaymentMethod});

  const viewerData = useLazyLoadQuery(graphql`
    query AddPaymentCardPageQuery {
      viewer {
        profile {
          name
        }
        buyerSettings {
          stripeCustomerId
        }
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  const customerId = viewerData.viewer.buyerSettings?.stripeCustomerId;

  const [isSaving, setIsSaving] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    name: viewerData?.viewer?.profile?.name,
  });
  const [currentCard, setCurrentCard] = useState({});

  useEffect(() => {
    setNavigationBar();
  }, [currentAddress, currentCard]);

  useEffect(() => {
    if (prevProps && prevProps.isAttachingPaymentMethod && !isAttachingPaymentMethod) {
      handleClose();
    }
  }, [isAttachingPaymentMethod]);

  const setNavigationBar = () => {
    const {name, address1, city, state, postalCode} = currentAddress;
    const isDisabledSave = !currentCard.complete || !name?.trim() || !address1 || !city || !state || !postalCode;

    navigation.setOptions({
      headerLeft: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Cancel"
          onPress={handleClose}
        />
      ),
      headerRight: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Save"
          disabled={isDisabledSave}
          onPress={handleSave}
        />
      ),
    });
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    const {address1, address2, city, state, country, name, postalCode} = currentAddress;

    setIsSaving(true);

    const billingDetails = {
      // email: 'shangwangzhang@gmail.com',
      // phone: '+1234567890',
      name: name?.trim(),
      address: {
        city,
        country,
        line1: address1,
        line2: address2,
        postalCode,
        state,
      },
    };

    const {paymentMethod, error} = await createPaymentMethod({
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails
      },
    });

    setIsSaving(false);

    if (error) {
      console.log(error);
      return;
    }

    if (customerId && paymentMethod?.id ) {
      attachPaymentMethod({
        customerId: customerId,
        paymentMethodId: paymentMethod.id,
      });
    }
  };

  const handleChangeFullName = value => {
    setCurrentAddress({
      ...currentAddress,
      name: value,
    });
  }

  const handleChangeAddress = address => {
    setCurrentAddress({
      ...currentAddress,
      ...address,
    });
  };

  const handleChangeCard = cardData => {
    setCurrentCard(cardData);
  };

  return (
    <KeyboardAvoidingScrollView style={styles.container}>
      <LoadingIndicator isLoading={isSaving || isAttachingPaymentMethod} />
      <Text style={styles.textSectionTitle}>
        Card Number
      </Text>
      <CardField
        style={styles.cardInputContainer}
        cardStyle={styles.textInputCard}
        postalCodeEnabled={false}
        onCardChange={handleChangeCard}
      />
      <Text style={styles.textSectionTitle}>
        Name
      </Text>
      <TextInput
        style={styles.textInputName}
        autoCorrect={false}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        placeholder="Your Name"
        placeholderTextColor={colors.placeholderText}
        value={currentAddress?.name}
        maxLength={Constants.nameMaxLength}
        onChangeText={handleChangeFullName}
      />
      <ShippingAddress
        style={styles.addressContainer}
        address={currentAddress}
        onChangeAddress={handleChangeAddress}
      />
    </KeyboardAvoidingScrollView>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  navBarButton: {
    minWidth: 70,
    paddingHorizontal: 10,
  },
  addressContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginHorizontal: 16,
    marginTop: 20,
    textTransform: 'uppercase',
  },
  textInputName: {
    height: 40,
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 2,
    color: colors.primaryText,
    backgroundColor: colors.secondaryCardBackground,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  cardInputContainer: {
    height: 40,
    borderRadius: 2,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  textInputCard: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    backgroundColor: colors.secondaryCardBackground,
  },
}));

export default withPaymentMethods(AddPaymentCardPage);
