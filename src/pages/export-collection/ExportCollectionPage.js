import React, {useEffect, useState, Suspense, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';
import isEmail from 'validator/lib/isEmail';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  Button,
  LoadingIndicator,
  KeyboardAvoidingScrollView,
  ErrorBoundaryWithRetry,
  ErrorView,
  EmailSuggestion,
} from 'components';

import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions'
import {withExportCollection} from 'store/containers';
import {usePrevious} from 'hooks';
import {Constants} from 'globals';
import {
  correctEmailTypo,
} from 'utils';

const proWhiteIcon = require('assets/icons/more/collx_pro_white.png');

const ExportCollectionPage = (props) => {
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
    ...createActions({
      navigation,
    }),
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
  isSettingExportCollection,
  exportCollection,
  setExportCollection,
}) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();
  const actions = useActions();

  const prevProps = usePrevious({exportCollection});

  const profileData = useLazyLoadQuery(graphql`
    query ExportCollectionPageQuery {
      viewer {
        profile {
          email
        }
      }
    }`,
    {},
    {}
  );

  const [email, setEmail] = useState(profileData.viewer?.profile?.email);
  const [correctEmail, setCorrectEmail] = useState('');

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (!prevProps.exportCollection.length && exportCollection.length) {
      actions.navigateExportCollectionProgress();
    }
  }, [exportCollection]);

  const handleChangeText = (value) => {
    setEmail(value);
    setCorrectEmail('');
  };

  const handleExportCollection = async () => {
    const checkedEmail = correctEmailTypo(email);
    if (!correctEmail && email !== checkedEmail) {
      setCorrectEmail(checkedEmail);
      return;
    }

    setExportCollection({
      email,
      type: Constants.exportCollectionType.collection,
    });
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isSettingExportCollection} />
      <KeyboardAvoidingScrollView
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <Text style={styles.textTitle}>Your Email</Text>
          <TextInput
            style={styles.textInputEmail}
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Your email"
            placeholderTextColor={colors.placeholderText}
            keyboardType="email-address"
            value={email}
            underlineColorAndroid="transparent"
            onChangeText={handleChangeText}
          />
          <EmailSuggestion email={correctEmail} />
        </View>
        <Text style={styles.textDescription}>
          Collection exports take some time. When your collection export is complete, we will send it to the email address you provided above.
        </Text>
        <Button
          style={styles.exportCollectionButton}
          labelStyle={styles.textExportCollection}
          label="Export Collection"
          iconStyle={styles.iconPro}
          icon={proWhiteIcon}
          scale={Button.scaleSize.One}
          disabled={!isEmail(email)}
          activeBackgroundColor={colors.primary}
          inactiveBackgroundColor={Colors.gray}
          onPress={handleExportCollection}
        />
      </KeyboardAvoidingScrollView>
    </View>
  );
};

export default withExportCollection(ExportCollectionPage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.primaryText,
    textTransform: 'uppercase',
  },
  textInputEmail: {
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
    marginTop: 12,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  exportCollectionButton: {
    height: 48,
    borderRadius: 10,
    margin: 16,
    flexDirection: 'row-reverse',
  },
  textExportCollection: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.white,
  },
  iconPro: {
    width: 45,
    height: 18,
    marginLeft: 5,
  },
}));
