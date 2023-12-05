import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
} from 'react-native';

import {
  Button,
} from 'components';

import ActionContext, {
  useActions,
} from 'actions';
import {Colors, Fonts, createUseStyle} from 'theme';
import {getPrice} from 'utils';

const successConfirmIcon = require('assets/icons/more/success_confirm.png');

const CollXCreditCodeSuccessPage = ({
  navigation,
  route,
}) => {
  const {
    amount = 0,
  } = route.params || {};

  const styles = useStyle();
  const actions = useActions();

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  };

  const handleDone = () => {
    navigation.goBack();
  };

  return (
    <ActionContext.Provider value={actions}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Image style={styles.iconSuccess} source={successConfirmIcon} />
          <Text style={styles.textTitle}>Code successfully applied!</Text>
          {amount ? (
            <Text style={styles.textDescription}>
              {`We’ve added ${getPrice(amount)} to your credit.`}
            </Text>
          ) : null}
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

export default CollXCreditCodeSuccessPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  iconSuccess: {
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
