import React, {useEffect, useMemo} from 'react';
import {View, Text, Image} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, usePaginationFragment} from 'react-relay';

import ContentView from './ContentView';
import GridViewItem from './GridViewItem';
import NoCardsFound from './NoCardsFound';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {groupBySet, getSectionTitle} from 'utils';
import {usePrevious} from 'hooks';

const proIcon = require('assets/icons/more/collx_pro.png');

const GridView = props => {
  const {
    contentContainerStyle,
    profile,
    sortOption,
    filterOption,
    sortLabel,
    categoryLabel,
    selectMode,
    selectedCards,
    refetchKey,
    onSelect,
    onRefresh,
    onPinFeature,
    onPinUnfeature,
    ...otherProps
  } = props;

  const styles = useStyle();
  const prevProps = usePrevious({sortOption, filterOption, refetchKey});

  const {data: profileData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment GridView_profile on Profile
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
      orderBy: {type: "[TradingCardOrder!]", defaultValue: [NEWEST_FIRST]}
      with: {type: "TradingCardsWith"}
    )
    @refetchable(queryName: "GridViewPaginationQuery") {
      tradingCards(after: $after, first: $first, orderBy: $orderBy, with: $with)
      @connection(key: "GridView_profile__tradingCards") {
        edges {
          node {
            id
            featured
            condition {
              name
            }
            card {
              year
              set {
                name
              }
              ...on SportCard {
                player {
                  name
                }
                team {
                  name
                }
              }
            }
            ...GridViewItem_tradingCard
          }
        }
      }
    }`,
    profile
  );

  if (!profileData) {
    return null;
  }

  const tradingCardSections = useMemo(() => (
    groupBySet(profileData.tradingCards?.edges || [], sortLabel, 2, categoryLabel)
  ), [profileData.tradingCards, sortLabel, categoryLabel]);

  useEffect(() => {
    if (!prevProps && tradingCardSections?.length) {
      return;
    }

    handleRefetch();
  }, [sortOption, filterOption, refetchKey]);

  const handleRefetch = () => {
    refetch({
      orderBy: sortOption,
      with: filterOption,
    }, {
      fetchPolicy: 'network-only',
    });

    if (onRefresh) {
      onRefresh();
    }
  };

  const handleEndReached = () => {
    if (isLoadingNext) {
      return;
    }

    if (hasNext) {
      loadNext(Constants.defaultFetchLimit);
    }
  }

  const handleSelectCard = tradingCard => {
    if (onSelect) {
      onSelect(tradingCard);
    }
  };

  const renderSectionHeader = ({section}) => {
    if (!section.title) {
      return null;
    }

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.textSectionTitle}>
          {getSectionTitle(section.title, sortLabel)}
        </Text>
        {section.title === Constants.cardFeature.featured.label ? (
          <Image style={styles.iconPro} source={proIcon} />
        ) : null}
      </View>
    );
  };

  const renderItems = ({item}) => (
    <View style={styles.dataListContainer}>
      {item.map((item, index) => renderItem(item.node, index))}
    </View>
  );

  const renderItem = (tradingCard, index) => {
    const isSelected = selectedCards && selectedCards.findIndex(cardId => cardId === tradingCard.id) > -1;

    return (
      <GridViewItem
        key={index}
        tradingCard={tradingCard}
        selectMode={selectMode}
        isSelected={isSelected}
        onPress={handleSelectCard}
        onPinFeature={onPinFeature}
        onPinUnfeature={onPinUnfeature}
      />
    );
  };

  if (!tradingCardSections?.length) {
    return <NoCardsFound />
  }

  return (
    <ContentView
      {...otherProps}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      refreshing={isLoadingNext}
      sections={tradingCardSections}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItems}
      renderSectionHeader={renderSectionHeader}
      onRefresh={handleRefetch}
      onEndReachedThreshold={0.2}
      onEndReached={handleEndReached}
    />
  );
};

GridView.defaultProps = {
  sortOption: [],
  filterOption: null,
  sortLabel: null,
  selectMode: Constants.collectionSelectMode.none,
  selectedCards: [],
  refetchKey: 0,
  onSelect: () => {},
  onRefresh: () => {},
};

GridView.propTypes = {
  sortOption: PropTypes.array,
  filterOption: PropTypes.object,
  sortLabel: PropTypes.string,
  selectMode: PropTypes.number,
  selectedCards: PropTypes.array,
  refetchKey: PropTypes.number,
  onSelect: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default GridView;

const useStyle = createUseStyle(({colors}) => ({
  contentContainer: {
    paddingHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: colors.primaryBackground,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.primaryText,
  },
  iconPro: {
    width: 45,
    height: 18,
    resizeMode: 'contain',
    marginLeft: 8,
  },
  dataListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}));
