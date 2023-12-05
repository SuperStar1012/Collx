import React, {Suspense, useEffect, useState, useCallback} from 'react';
import {View, TextInput, Keyboard} from 'react-native';

import {
  LoadingIndicator,
  NavBarButton,
  KeyboardAvoidingScrollView,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';

import {createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {showErrorAlert} from 'utils';

const AddTrackingCodePage = (props) => {
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

const Content = props => {
  const {navigation, route} = props;
  const {orderId, trackingCode} = route.params || {};

  const styles = useStyle();
  const actions = useActions();

  const [isAddingTrackingCode, setIsAddingTrackingCode] = useState(false);
  const [currentTrackingCode, setCurrentTrackingCode] = useState(trackingCode);

  useEffect(() => {
    setNavigationBar();
  }, [currentTrackingCode]);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: trackingCode ? 'Edit Tracking Code' : 'Add Tracking Code',
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
          disabled={!currentTrackingCode}
          onPress={handleAddTrackingNumber}
        />
      ),
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleAddTrackingNumber = () => {
    if (!orderId || !currentTrackingCode) {
      return;
    }

    Keyboard.dismiss();

    setIsAddingTrackingCode(true);
    actions.setTrackingNumberOnOrder(
      orderId,
      currentTrackingCode,
      {
        onComplete: () => {
          setIsAddingTrackingCode(false);
          handleCancel();
        },
        onError: (error) => {
          console.log(error);
          setIsAddingTrackingCode(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      },
    );
  };

  return (
    <KeyboardAvoidingScrollView style={styles.container}>
      <LoadingIndicator isLoading={isAddingTrackingCode} />
      <TextInput
        style={styles.textInputValue}
        autoCorrect={false}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        placeholder="Tracking code"
        returnKeyType="send"
        value={currentTrackingCode}
        onChangeText={setCurrentTrackingCode}
        onSubmitEditing={handleAddTrackingNumber}
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
  textInputValue: {
    height: 40,
    borderRadius: 2,
    color: colors.primaryText,
    fontSize: 17,
    letterSpacing: -0.41,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 23,
    backgroundColor: colors.secondaryCardBackground,
  },
}));

export default AddTrackingCodePage;
