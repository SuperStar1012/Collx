import React, {Suspense, useEffect, useState, useCallback} from 'react';
import {View, Text, Image} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  KeyboardAvoidingScrollView,
  Switch,
  NavBarButton,
  ErrorBoundaryWithRetry,
  ErrorView,
  Button,
} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {showErrorAlert} from 'utils';
import createActions from './actions';

const exclamationIcon = require('assets/icons/exclamation_circle.png')

const SellerMinimumPage = (props) => {
  const {navigation} = props;

  const styles = useStyle();

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
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

const Content = (props) => {
  const {navigation, queryOptions, route} = props;

  const styles = useStyle();
  const actions = useActions();

  const viewerData = useLazyLoadQuery(graphql`
    query SellerMinimumPageQuery {
      viewer {
        sellerSettings {
          id
          minimum
        }
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  const sellerSettings = viewerData?.viewer?.sellerSettings || {};

  const [isMinimumEnabled, setMinimumEnabled] = useState(!!(sellerSettings?.minimum));
  const [minimum, setMinimum] = useState(((sellerSettings?.minimum / 100).toFixed(2) || 0))

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNavigationBar();
  }, [minimum]);

  useEffect(() => {
    if (route.params?.amount) {
      setMinimum(Number(route.params?.amount))
    }
  }, [route.params]);

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
          // disabled={isDisabled}
          onPress={handleSave}
        />
      ),
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    setIsSaving(true);

    actions.setSellerShippingSettings({
      minimum: Number(minimum) * 100 || 0,
    },
      {
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
      }
    );
  };

  const handleChangeValue = (value) => {
    setMinimumEnabled(value);

    if (value) {
      setMinimum(minimum)
    } else {
      setMinimum(0)
    }
  };

  const handleEditAmount = () => {
    actions.navigateEditMinimumAmount({
      amount: minimum,
    })
  };

  return (
    <KeyboardAvoidingScrollView style={styles.container}>
      <LoadingIndicator isLoading={isSaving} />
      <Switch
        style={styles.switchContainer}
        label="Require minimum amount per order"
        value={isMinimumEnabled}
        onChangedValue={handleChangeValue}
      />
      <Text style={styles.textSectionTitle}>
        Minimum Amount
      </Text>
      <View style={styles.minimumContainer}>
        <Text style={styles.minimumAmount}>${Number(minimum).toFixed(2)}</Text>
        <Button
          style={styles.editButton}
          label="Edit"
          labelStyle={styles.textEditButton}
          scale={Button.scaleSize.One}
          onPress={handleEditAmount}
          disabled={!isMinimumEnabled}
        />
      </View>
      {isMinimumEnabled && !!minimum && (
        <>
          <Text style={styles.textSectionTitle}>
            Preview
          </Text>
          <View style={styles.reviewContainer}>
            <View style={styles.reviewContentContainer}>
              <Image style={styles.iconInfo} source={exclamationIcon} />
              <Text style={styles.textReview}>
                Seller minimum of ${minimum} per order
              </Text>
            </View>
          </View>
        </>
      )}
    </KeyboardAvoidingScrollView>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  navBarButton: {
    minWidth: 70,
    paddingHorizontal: 10,
  },
  switchContainer: {
    height: 44,
    backgroundColor: colors.primaryCardBackground,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  minimumContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryCardBackground,
    paddingHorizontal: 16,
  },
  minimumAmount: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: Fonts.semiBold,
    color: colors.primaryText,
  },
  editButton: {
    width: 50,
    height: 30,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.gray,
  },
  textEditButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    letterSpacing: -0.24,
    textTransform: 'capitalize',
    color: Colors.gray,
  },
  reviewContainer: {
    padding: 16,
    backgroundColor: colors.primaryCardBackground,
  },
  reviewContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colors.secondaryBackground,
  },
  iconInfo: {
    width: 23,
    height: 23,
    tintColor: colors.primary,
  },
  textReview: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primary,
    marginHorizontal: 2,
  },
}));

export default SellerMinimumPage;
