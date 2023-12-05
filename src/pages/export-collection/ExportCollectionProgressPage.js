import React, {useEffect, useState, Suspense, useCallback} from 'react';
import {
  View,
  Text,
} from 'react-native';
import moment from 'moment';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import ExportStatus from './components/ExportStatus';
import ExportStatusBar from './components/ExportStatusBar';

import {Colors, Fonts, createUseStyle} from 'theme';
import {Constants} from 'globals';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {withExportCollection} from 'store/containers';
import {contactSupport} from 'utils';

const exportStates = {
  [Constants.exportCollectionStatus.queued]: {
    color: Colors.yellow,
    label: 'In Progress',
    description: 'Your export is in progress.',
    icon: require('assets/icons/clock_arrow_two_circle.png'),
  },
  [Constants.exportCollectionStatus.processing]: {
    color: Colors.yellow,
    label: 'In Progress',
    description: 'Your export is in progress.',
    icon: require('assets/icons/clock_arrow_two_circle.png'),
  },
  [Constants.exportCollectionStatus.completed]: {
    color: Colors.green,
    label: 'Complete',
    description: 'Your export completed.',
    icon: require('assets/icons/checkmark_circle_outline.png'),
  },
  [Constants.exportCollectionStatus.failed]: {
    color: Colors.red,
    label: 'Fail',
    description: 'Your export failed.',
    icon: require('assets/icons/close_circle_outline.png'),
  },
};

const ExportCollectionProgressPage = (props) => {
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
      title: 'Export Collection',
    });
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

const Content = ({
  exportCollection,
}) => {
  const styles = useStyle();

  const collectionInfo = exportCollection.length > 0 ? exportCollection[0] : {};

  const handleContactUs = () => {
    contactSupport();
  };

  return (
    <View style={styles.container}>
      {collectionInfo.status === Constants.exportCollectionStatus.queued || collectionInfo.status === Constants.exportCollectionStatus.processing ? (
        <ExportStatusBar status={exportStates[collectionInfo.status]} />
      ) : null}
      <View style={styles.contentContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.textFieldName}>Requested</Text>
          <Text style={styles.textFieldValue}>
            {moment(collectionInfo.createdAt).format(Constants.exportCollectionDateFormat)}
          </Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.textFieldName}>Your Email</Text>
          <Text style={styles.textFieldValue}>
            {collectionInfo.email}
          </Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.textFieldName}>Export Status</Text>
          <ExportStatus status={exportStates[collectionInfo.status]} />
        </View>
      </View>
      <View style={styles.needHelpContainer}>
        <Text style={styles.textNeedHelp}>Need help?</Text>
        <Text style={styles.textContactUs} onPress={handleContactUs}>Contact us</Text>
      </View>
    </View>
  );
};

export default withExportCollection(ExportCollectionProgressPage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    flex: 1,
    margin: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  textFieldName: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textFieldValue: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  needHelpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  textNeedHelp: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.grayText,
  },
  textContactUs: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
    marginLeft: 5,
  },
}));
