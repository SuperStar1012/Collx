import React, {Suspense, useEffect, useState, useCallback} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  LoadingIndicator,
  TextInputUnit,
  NavBarButton,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';

import {createUseStyle, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';

const SellerMinimumAmountEdit = (props) => {
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
}

const Content = (props) => {
  const {navigation, route} = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();
  const actions = useActions();

  const [minimum, setMinimum] = useState('0')

  useEffect(() => {
    setNavigationBar();
  }, [minimum]);

  useEffect(() => {
    if (route.params?.amount) {
      setMinimum(route.params?.amount.toString())
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
          onPress={handleSave}
        />
      ),
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    actions.navigateSellerMinimum({
      amount: minimum,
    });
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <TextInputUnit
        style={styles.fieldValue}
        textInputStyle={styles.textFieldValue}
        unitStyle={styles.textFieldValuePrefix}
        autoCorrect={false}
        autoCapitalize="none"
        placeholderTextColor={colors.placeholderText}
        unitPrefix="$"
        value={minimum}
        onChangeText={setMinimum}
      />
    </KeyboardAwareScrollView>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 1,
    flex: 1,
    backgroundColor: colors.secondaryBackground,
    paddingHorizontal: 10,
  },
  navBarButton: {
    minWidth: 70,
    paddingHorizontal: 10,
  },
  fieldValue: {
    marginTop: 15,
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
  },
  textFieldValue: {
    fontSize: 15,
    letterSpacing: -0.24,
    color: colors.primaryText,
    textAlign: 'left',
  },
  textFieldValuePrefix: {
    fontSize: 15,
    letterSpacing: -0.24,
  },
}));

export default SellerMinimumAmountEdit