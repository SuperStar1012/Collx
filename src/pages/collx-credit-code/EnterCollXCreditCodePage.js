import React, {Suspense, useState, useEffect, useCallback, useMemo} from 'react';
import {View, Text, TextInput} from 'react-native';

import {
  NavBarButton,
  LoadingIndicator,
  KeyboardAvoidingScrollView,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';

import {Colors, createUseStyle, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';

const EnterCollXCreditCodePage = (props) => {
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

const Content = ({
  navigation,
}) => {
  const actions = useActions();
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [currentCode, setCurrentCode] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const borderColor = useMemo(() => {
    let color = colors.secondaryCardBackground;

    if (errorMessage) {
      color = Colors.red
    } else if (currentCode) {
      color = colors.primary;
    }

    return color;
  }, [currentCode, errorMessage, colors]);

  useEffect(() => {
    setNavigationBar();
  }, [currentCode, errorMessage]);

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
          disabled={!currentCode || !!errorMessage}
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

    actions.useRedemptionCode(
      currentCode,
      {
        onComplete: (redemptionCode) => {
          setIsSaving(false);

          let amount = 0;
          redemptionCode?.actions?.map(action => {
            if (action.credit) {
              amount += action.credit.amount;
            }
          });

          actions.navigateCollXCreditCodeSuccessSuccess(amount);
        },
        onError: (error) => {
          console.log(error);
          setIsSaving(false);

          if (error.message) {
            setErrorMessage(error.message);
          }
        }
      }
    );
  };

  const handleChangeCode = value => {
    setCurrentCode(value);
    setErrorMessage(null);
  };

  return (
    <KeyboardAvoidingScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <LoadingIndicator isLoading={isSaving} />
      <TextInput
        style={[styles.textInput, errorMessage && styles.textError, {borderColor}]}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="CollX credit code"
        placeholderTextColor={colors.placeholderText}
        value={currentCode}
        onChangeText={handleChangeCode}
      />
      {errorMessage ? (
        <Text style={[styles.textDescription, styles.textError]}>
          {errorMessage}
        </Text>
      ) : null}
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
  contentContainer: {
    paddingHorizontal: 16,
  },
  textInput: {
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.secondaryCardBackground,
    backgroundColor: colors.secondaryCardBackground,
    fontSize: 15,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginTop: 16,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    marginTop: 16,
  },
  textError: {
    color: Colors.red,
  },
}));

export default EnterCollXCreditCodePage;
