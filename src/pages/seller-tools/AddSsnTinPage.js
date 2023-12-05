import React, {Suspense, useEffect, useState, useCallback} from 'react';
import {View, Text} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import TextInputMask from 'react-native-text-input-mask';

import {
  LoadingIndicator,
  NavBarButton,
  Button,
  KeyboardAvoidingScrollView,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';

import {Fonts, createUseStyle} from 'theme';
import {Constants, SchemaTypes} from 'globals';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {showErrorAlert} from 'utils';

const AddSsnTinPage = (props) => {
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
  const {navigation, queryOptions} = props;

  const styles = useStyle();

  const actions = useActions();

  const viewerData = useLazyLoadQuery(graphql`
    query AddSsnTinPageQuery {
      viewer {
        addresses {
          id
          name
        }
        sellerSettings {
          id
          address {
            id
          }
          sellerType
          ssn
          tin
        }
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  const {sellerSettings, addresses} = viewerData?.viewer || {};

  const [isSaving, setIsSaving] = useState(false);
  const [sellerType, setSellerType] = useState(
    sellerSettings?.sellerType || SchemaTypes.sellerType.INDIVIDUAL
  );
  const [ssn, setSsn] = useState(sellerSettings?.ssn);
  const [tin, setTin] = useState(sellerSettings?.tin);

  useEffect(() => {
    setNavigationBar();
  }, [sellerType, ssn, tin]);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerLeft: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Cancel"
          onPress={handleCancel}
        />
      ),
      headerRight: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Save"
          onPress={handleSave}
        />
      ),
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    let addressId = sellerSettings?.address?.id;

    if (!addressId) {
      const taxAddress = addresses?.find(item => item.name === Constants.addressName.tax);
      addressId = taxAddress?.id;
    }

    if (!addressId) {
      return;
    }

    const params = {
      sellerType,
      with: {
        addressId,
      }
    };

    if (sellerType === SchemaTypes.sellerType.INDIVIDUAL && ssn) {
      params.ssn = ssn;
    } else if (sellerType === SchemaTypes.sellerType.BUSINESS && tin) {
      params.tin = tin;
    } else {
      return;
    }

    setIsSaving(true);

    actions.setSellerTaxpayerInformation(params, {
      onComplete: () => {
        setIsSaving(false);
        handleCancel();
      },
      onError: (error) => {
        console.log(error);
        setIsSaving(false);

        if (error?.message) {
          showErrorAlert(error?.message);
        }
      },
    });
  };

  const handleSelectSellerType = type => {
    setSellerType(type);
  };

  const handleChangeSocialSecurityNumber = (formatted, extracted) => {
    setSsn(extracted);
  };

  const handleChangeTaxpayerIdentificationNumber = (formatted, extracted) => {
    setTin(extracted);
  };

  const handleLearnMore = () => {
    actions.navigateWebViewer({
      title: 'SSN / TIN',
      url: Constants.ssnUrl,
    });
  };

  const renderSellerType = () => {
    const isIndividual = sellerType === SchemaTypes.sellerType.INDIVIDUAL;

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.textSectionTitle}>
          Seller Type
        </Text>
        <View style={styles.sellerTypeContainer}>
          <Button
            style={[
              styles.sellerTypeButton,
              isIndividual ? styles.activeSellerTypeButton : styles.inactiveSellerTypeButton,
            ]}
            label="Individual"
            labelStyle={isIndividual ? styles.textActiveButton : styles.textInactiveButton}
            scale={Button.scaleSize.One}
            onPress={() => handleSelectSellerType(SchemaTypes.sellerType.INDIVIDUAL)}
          />
          <Button
            style={[
              styles.sellerTypeButton,
              !isIndividual ? styles.activeSellerTypeButton : styles.inactiveSellerTypeButton,
            ]}
            label="Business"
            labelStyle={!isIndividual ? styles.textActiveButton : styles.textInactiveButton}
            scale={Button.scaleSize.One}
            onPress={() => handleSelectSellerType(SchemaTypes.sellerType.BUSINESS)}
          />
        </View>
      </View>
    );
  };

  const renderSellerTypeValue = () => {
    const isIndividual = sellerType === SchemaTypes.sellerType.INDIVIDUAL;

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.textSectionTitle}>
          {isIndividual ? 'Social Security Number' : 'Taxpayer Identification Number'}
        </Text>
        {isIndividual ? (
          <TextInputMask
            style={styles.textInputValue}
            autoCorrect={false}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            placeholder="SSN"
            mask={"[000]-[00]-[0000]"}
            value={ssn}
            onChangeText={handleChangeSocialSecurityNumber}
          />
        ) : (
          <TextInputMask
            style={styles.textInputValue}
            autoCorrect={false}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            placeholder="TIN"
            mask={"[00]-[0000000]"}
            value={tin}
            onChangeText={handleChangeTaxpayerIdentificationNumber}
          />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingScrollView style={styles.container}>
      <LoadingIndicator isLoading={isSaving} />
      {renderSellerType()}
      {renderSellerTypeValue()}
      <Text style={styles.textDescription}>
        This information is only used for identity verification and tax purposes.
        <Text style={styles.textLearnMore} onPress={handleLearnMore}> Learn More </Text>
      </Text>
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
  sectionContainer: {
    marginTop: 20,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  sellerTypeContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 4,
  },
  sellerTypeButton: {
    flex: 1,
    marginHorizontal: 4,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
  },
  activeSellerTypeButton: {
    borderColor: colors.primary,
  },
  inactiveSellerTypeButton: {
    borderColor: colors.darkGrayText,
  },
  textActiveButton: {
    fontWeight: Fonts.semiBold,
    color: colors.primary,
  },
  textInactiveButton: {
    fontWeight: Fonts.semiBold,
    color: colors.darkGrayText,
  },
  textInputValue: {
    height: 40,
    borderRadius: 2,
    color: colors.primaryText,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: colors.secondaryCardBackground,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    margin: 16,
    textAlign: 'center',
  },
  textLearnMore: {
    color: colors.primary,
    marginHorizontal: 20,
  },
}));

export default AddSsnTinPage;
