import React, {useEffect, useState} from 'react';
import {View, SectionList, Text} from 'react-native';

import {Check, Switch, LoadingIndicator} from 'components';

import {Fonts, createUseStyle} from 'theme';

const data = [
  {
    title: 'Frequency',
    data: [
      {
        label: 'Daily',
        value: 'daily',
      },
      {
        label: 'Weekly',
        value: 'weekly',
      },
      {
        label: 'Monthly',
        value: 'monthly',
      },
    ],
  },
];

const WinnersSettings = props => {
  const {navigation} = props;

  const styles = useStyle();

  const [isEmail, setIsEmail] = useState(true);
  const [isPush, setIsPush] = useState(true);
  const [frequency, setFrequency] = useState(data[0].data[0].value);

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: 'Winners',
    });
  };

  const renderSectionHeader = ({section}) => (
    <Text style={styles.textSectionTitle}>{section.title}</Text>
  );

  const renderItem = ({item}) => (
    <Check
      style={styles.itemContainer}
      label={item.label}
      value={frequency === item.value}
      onChangedValue={() => setFrequency(item.value)}
    />
  );

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={false} />
      <View style={styles.sectionContainer}>
        <Switch
          style={styles.itemContainer}
          label="Notify by email"
          value={isEmail}
          onChangedValue={setIsEmail}
        />
        <Switch
          style={styles.itemContainer}
          label="Notify by push"
          value={isPush}
          onChangedValue={setIsPush}
        />
      </View>
      <SectionList
        sections={data}
        bounces={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  sectionContainer: {
    marginTop: 20,
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
    marginTop: 20,
    marginBottom: 10,
  },
}));

export default WinnersSettings;
