import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Button} from 'components';

import {createUseStyle, Fonts} from 'theme';

const searchIcon = require('assets/icons/search.png');

const NoResult = ({
  style,
  onAddManualCard,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.mainContainer}>
        <Image source={searchIcon} style={styles.iconSearch} />
        <Text style={styles.textNotFoundTitle}>No results found</Text>
        <Text style={styles.textNotFoundDescription}>
          We didn’t find any results with the keyword you entered.
        </Text>
      </View>
      {onAddManualCard ? (
        <Button
          style={[styles.button, {marginBottom: insets.bottom + 5}]}
          label="Add Card Details Manually"
          labelStyle={styles.textButton}
          scale={Button.scaleSize.One}
          onPress={onAddManualCard}
        />
      ) : null}
    </View>
  );
};

NoResult.defaultProps = {};

NoResult.propTypes = {};

export default NoResult;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSearch: {
    width: 80,
    height: 80,
    tintColor: colors.grayText,
  },
  textNotFoundTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 'bold',
    letterSpacing: 0.35,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginBottom: 6,
  },
  textNotFoundDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    textAlign: 'center',
    marginLeft: 8,
  },
}));
