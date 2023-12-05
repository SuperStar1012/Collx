import React, {useEffect, useMemo} from 'react';
import {View, FlatList, Text} from 'react-native';

import {
  NavBarModalHeader,
  NavBarButton,
} from 'components';
import ReportIssueItem from './components/ReportIssueItem';

import ActionContext, {
  useActions,
  createNavigationActions,
} from 'actions';
import {SchemaTypes, Styles} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const closeIcon = require('assets/icons/close.png');

const canonicalCardData = [
  {
    label: 'Image Issues',
    value: SchemaTypes.issueType.IMAGE,
  },
  {
    label: 'Wrong Card Information',
    value: SchemaTypes.issueType.INFO,
  },
  {
    label: 'Something else',
    value: SchemaTypes.issueType.OTHER,
  },
];

const tradingCardData = [
  {
    label: 'Wrong Card Information',
    value: SchemaTypes.issueType.INFO,
  },
  {
    label: 'Something else',
    value: SchemaTypes.issueType.OTHER,
  },
];

const ReportIssuePage = (props) => {
  const {
    navigation,
    route
  } = props;

  const {forInput} = route.params || {};
  const {cardId, tradingCardId} = forInput;

  const styles = useStyle();

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
  };

  const data = useMemo(() => (
    cardId ? canonicalCardData : tradingCardId ? tradingCardData : []
  ), [cardId, tradingCardId]);

  useEffect(() => {
    setNavigationBar();
  }, [styles]);

  const setNavigationBar = () => {
    navigation.setOptions({
      header: NavBarModalHeader,
      headerLeft: () => (
        <NavBarButton
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      ),
    });
  };

  const handleClose = () => {
    actions.navigateGoBack();
  };

  const handleSelect = item => {
    actions.navigateReportIssueDetail({
      forInput,
      issueType: item.value,
      isCloseBack: false,
      tradingCardIdForIssue: null, // Remove later
    });
  };

  const renderItem = ({item}) => (
    <ReportIssueItem {...item} onPress={() => handleSelect(item)} />
  );

  const renderNotes = () => {
    if (!cardId && !tradingCardId) {
      return null;
    }

    let cardDescription = '';

    if (cardId) {
      cardDescription = 'the Recent Transactions table';
    } else if (tradingCardId) {
      cardDescription = 'CollX database';
    }

    return (
      <Text style={[styles.textNote, {marginBottom: Styles.screenSafeBottomHeight + 16}]}>
        <Text style={styles.textNoteBold}>Price not right?</Text> Check the comps in {cardDescription} by tapping on  <Text style={styles.textNoteBold}>“View More Prices.”</Text> If a sale is incorrectly linked, <Text style={styles.textNoteBold}>hit the ⚠️ icon</Text> there to report it. This will flag the price.
      </Text>
    );
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          bounces={false}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        {renderNotes()}
      </View>
    </ActionContext.Provider>
  );
}

export default ReportIssuePage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  iconClose: {
    width: 28,
    height: 28,
  },
  textNote: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.grayText,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  textNoteBold: {
    fontWeight: Fonts.semiBold,
  },
}));
