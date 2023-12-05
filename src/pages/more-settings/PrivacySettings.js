import React, {useEffect, useState, Suspense, useCallback, useRef} from 'react';
import {View, Text} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  Switch,
} from 'components';

import {Fonts, createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {showErrorAlert} from 'utils';

import {withProfile} from 'store/containers';

const PrivacySettings = (props) => {
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
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
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
      </View>
    </ActionContext.Provider>
  );
};

const Content = ({navigation, queryOptions}) => {
  const styles = useStyle();
  const actions = useActions();

  const [isSaving, setIsSaving] = useState(false);

  const viewData = useLazyLoadQuery(graphql`
    query PrivacySettingsPageQuery {
      viewer {
        privacySettings {
          showCollectionValueInApp
          showCollectionValueOnWeb
        }
      }
    }`,
    {},
    queryOptions
  );

  if (!viewData) {
    return null;
  }

  const [isEnableApp, setEnableApp] = useState(viewData.viewer.privacySettings.showCollectionValueInApp);
  const [isShareWebPage, setShareWebPage] = useState(viewData.viewer.privacySettings.showCollectionValueOnWeb);

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: 'Privacy Settings',
    });
  };

  const handleSave = async (type, val) => {
    setIsSaving(true);

    if (type === 'mobile') {
      setEnableApp(val);
    } else {
      setShareWebPage(val);
    }

    actions.setUserPrivacySettings(
      type === 'mobile' ? val : isEnableApp,
      type === 'web' ? val : isShareWebPage,
      {
        onComplete: () => {
          setIsSaving(false);
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

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isSaving} />
      <View style={styles.sectionContainer}>
        <Text style={styles.textSectionTitle}>Make My Collection Value Public</Text>
        <Switch
          style={styles.itemContainer}
          label="In-app"
          onChangedValue={(val) => handleSave('mobile', val)}
          value={isEnableApp}
        />
        <Switch
          style={styles.itemContainer}
          label="Web share page"
          onChangedValue={(val) => handleSave('web', val)}
          value={isShareWebPage}
        />
      </View>
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  sectionContainer: {
    marginTop: 16,
  },
  itemContainer: {
    height: 44,
    backgroundColor: colors.primaryCardBackground,
    paddingHorizontal: 16,
    borderBottomColor: colors.secondaryBorder,
    borderBottomWidth: 1,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    textTransform: 'uppercase',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 10,
  },
  textEntireCollection: {
    color: colors.primaryText,
  },
}));

export default withProfile(PrivacySettings);
