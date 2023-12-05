import React from 'react';
import {View, Text, FlatList} from 'react-native';

import SellerToolsItem from './components/SellerToolsItem';

import {Fonts, createUseStyle} from 'theme';

const settingsData = [
  {
    label: 'Name and Address',
    route: 'NameAndAddress',
  },
  {
    label: 'Add SSN/TIN',
    route: 'AddSsnTin',
  },
];

const TaxpayerInformationPage = props => {
  const {navigation} = props;

  const styles = useStyle();

  const handleSelect = item => {
    if (item.route) {
      navigation.navigate(item.route);
    }
  };

  const renderItem = ({item}) => (
    <SellerToolsItem
      {...item}
      onPress={() => handleSelect(item)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listContainer}
        data={settingsData}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <Text style={styles.textDescription}>
        Federal regulations require CollX to provide a {'\n'}1099-K tax form <Text style={styles.textBold}>once gross sales exceed $600</Text>.{'\n'}
        Please enter your SSN or TIN. All information is {'\n'}stored securely and only used for identity {'\n'}verification and tax purposes.
      </Text>
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  listContainer: {
    flexGrow: 0,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    margin: 16,
  },
  textBold: {
    fontWeight: Fonts.bold,
  },
}));

export default TaxpayerInformationPage;
