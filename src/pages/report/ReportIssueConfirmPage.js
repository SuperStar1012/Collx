import React, {useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
} from 'react-native';
import {StackActions} from '@react-navigation/native';

import {
  Button,
  NavBarModalHeader,
  NavBarButton,
} from 'components';

import ActionContext, {
  useActions,
} from 'actions';
import {Colors, Fonts, createUseStyle} from 'theme';
import {getReportTitle} from 'utils';

const closeIcon = require('assets/icons/close.png');
const successConfirmIcon = require('assets/icons/more/success_confirm.png');

const ReportIssueConfirmPage = ({
  navigation,
  route,
}) => {
  const {
    issueType,
  } = route.params || {};

  const styles = useStyle();
  const actions = useActions();

  useEffect(() => {
    setNavigationBar();
  }, [issueType, styles]);

  const setNavigationBar = () => {
    navigation.setOptions({
      header: NavBarModalHeader,
      title: getReportTitle(issueType),
      headerLeft: () => (
        <NavBarButton
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      )
    });
  };

  const handleClose = () => {
    navigation.dispatch(StackActions.popToTop());
    navigation.goBack();
  };

  const handleDone = () => {
    handleClose();
  };

  return (
    <ActionContext.Provider value={actions}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Image style={styles.iconReport} source={successConfirmIcon} />
          <Text style={styles.textTitle}>We’ve received your report</Text>
          <Text style={styles.textDescription}>
            Thank you for helping to build a better card collecting community on CollX.
          </Text>
        </View>
        <Button
          style={styles.doneButton}
          label="Done"
          labelStyle={styles.textDone}
          scale={Button.scaleSize.One}
          onPress={handleDone}
        />
      </SafeAreaView>
    </ActionContext.Provider>
  );
}

export default ReportIssueConfirmPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  iconClose: {
    width: 28,
    height: 28,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  iconReport: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.primaryText,
    letterSpacing: 0.35,
    textAlign: 'center',
    marginTop: 20,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginTop: 12,
  },
  doneButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  textDone: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
  },
}));
