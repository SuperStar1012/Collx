import React, {Suspense, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Accordion from 'react-native-collapsible/Accordion';
import {graphql, usePaginationFragment} from 'react-relay';

import {
  Button,
  FooterIndicator,
  LoadingIndicator,
} from 'components';
import ContentView from './ContentView';
import CollapseSetsViewContainer from './CollapseSetsViewContainer';
import NoCardsFound from './NoCardsFound';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {getSectionTitle} from 'utils';
import {useActions} from 'actions';
import {usePrevious} from 'hooks';

const chevronDownIcon = require('assets/icons/chevron_down.png');
const chevronUpIcon = require('assets/icons/chevron_up.png');

const CollapseView = props => {
  const {
    tradingCardFilterOption,
    refetchKey,
    profileId,
    isVisibleViewAll = true,
    profile,
    onSelect,
    onRefresh,
    ...otherProps
  } = props;

  const styles = useStyle();
  const actions = useActions();
  const prevProps = usePrevious({refetchKey});

  let paginationFragment = {};

  if (!profileId) {
    // My Sets
    paginationFragment = usePaginationFragment(graphql`
      fragment CollapseViewMe_profile on Profile
      @argumentDefinitions(
        first: {type: "Int", defaultValue: 40}
        after: {type: "String"}
        with: {type: "SetsWith"}
      )
      @refetchable(queryName: "CollapseViewMePaginationQuery") {
        collapseSetsMe: sets(after: $after, first: $first, with: $with)
        @connection(key: "CollapseViewMe_profile__collapseSetsMe") {
          totalCount
          edges {
            node {
              id
              name
              numberOfCards
              viewer {
                numberOfCards
              }
            }
          }
        }
      }`,
      profile
    );
  } else {
    // Other Sets
    paginationFragment = usePaginationFragment(graphql`
      fragment CollapseViewOther_profile on Profile
      @argumentDefinitions(
        first: {type: "Int", defaultValue: 40}
        after: {type: "String"}
        profileId: {type: "ID"}
        with: {type: "SetsWith"}
      )
      @refetchable(queryName: "CollapseViewOtherPaginationQuery") {
        collapseSetsOther: sets(after: $after, first: $first, with: $with)
        @connection(key: "CollapseViewOther_profile__collapseSetsOther") {
          totalCount
          edges {
            node {
              id
              name
              numberOfCards
              viewer (asProfile: $profileId) {
                numberOfCards
              }
            }
          }
        }
      }`,
      profile
    );
  }

  const {
    data: dataSets,
    loadNext: loadNextSets,
    isLoadingNext: isLoadingNextSets,
    hasNext: hasNextSets,
    refetch: refetchSets,
  } = paginationFragment;

  if (!dataSets) {
    return null;
  }

  const [activeSections, setActiveSections] = useState([0]);

  const totalCount = !profileId ? dataSets.collapseSetsMe?.totalCount : dataSets.collapseSetsOther?.totalCount;
  const tradingCardSections = !profileId ? dataSets.collapseSetsMe?.edges : dataSets.collapseSetsOther?.edges;

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    handleRefetch();
  }, [refetchKey]);

  const handleRefetch = () => {
    refetchSets({
      // with: filterOption,
    }, {
      fetchPolicy: 'network-only',
    });

    if (onRefresh) {
      onRefresh();
    }

    setActiveSections([]);
  };

  const handleEndReached = () => {
    if (isLoadingNextSets) {
      return;
    }

    if (hasNextSets) {
      loadNextSets(Constants.collectionSetCardsFetchLimit * 2);
    }
  };

  const handleChangeAccordion = indexes => {
    setActiveSections(indexes);
  };

  const handleSelectCard = tradingCard => {
    if (onSelect) {
      onSelect(tradingCard);
    }
  };

  const handleViewAllSet = (setData) => {
    actions.navigateViewFullSet({
      profileId,
      setId: setData.id,
    });
  };

  const renderSectionHeader = (section, index, isActive) => {
    const item = section.node;
    return (
      <View style={styles.sectionHeader}>
        <Image
          style={styles.iconChevron}
          source={isActive ? chevronUpIcon : chevronDownIcon}
        />
        <View style={styles.textsContainer}>
          <Text style={styles.textSectionHeaderTitle} numberOfLines={1}>
            {getSectionTitle(item?.name, Constants.cardSorts.set.label)}
          </Text>
          <Text style={styles.textCount} numberOfLines={1}>
            ({item?.viewer?.numberOfCards}/{item?.numberOfCards})
          </Text>
        </View>
        {isVisibleViewAll ? (
          <Button
            label="View all"
            labelStyle={styles.textAllButton}
            scale={Button.scaleSize.Four}
            onPress={() => handleViewAllSet(item)}
          />
        ) : null}
      </View>
    );
  };

  const renderItem = (section, index, isActive) => {
    if (!isActive) {
      return <View />;
    }

    return (
      <Suspense fallback={<LoadingIndicator isLoading />}>
        <CollapseSetsViewContainer
          profileId={profileId}
          setId={section.node.id}
          tradingCardFilterOption={tradingCardFilterOption}
          onSelect={handleSelectCard}
        />
      </Suspense>
    );
  };

  if (!tradingCardSections?.length) {
    return <NoCardsFound />
  }

  return (
    <ContentView
      {...otherProps}
      isCollapseView
      refreshing={isLoadingNextSets}
      onRefresh={handleRefetch}
      onEndReached={handleEndReached}
    >
      <View style={styles.stickyHeaderContainer}>
        <Text style={styles.textSet}>{`${totalCount} Set${totalCount > 1 ? 's' : ''}`}</Text>
      </View>
      <Accordion
        sectionContainerStyle={styles.sectionContainer}
        // expandMultiple
        sections={tradingCardSections}
        activeSections={activeSections}
        renderHeader={renderSectionHeader}
        renderContent={renderItem}
        onChange={handleChangeAccordion}
      />
      <FooterIndicator isLoading={isLoadingNextSets} />
    </ContentView>
  );
};

CollapseView.defaultProps = {
  refetchKey: 0,
  filterOption: {},
  onSelect: () => {},
  onRefresh: () => {},
};

CollapseView.propTypes = {
  refetchKey: PropTypes.number,
  filterOption: PropTypes.object,
  onSelect: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default CollapseView;

const useStyle = createUseStyle(({colors}) => ({
  stickyHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.primaryBackground,
  },
  textSet: {
    fontSize: 14,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
  },
  textAllButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    letterSpacing: -0.004,
    color: colors.primary,
  },
  sectionContainer: {
    marginBottom: 8,
  },
  sectionHeader: {
    height: 32,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryCardBackground,
  },
  textsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSectionHeaderTitle: {
    flexShrink: 1,
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.primaryText,
    marginHorizontal: 8,
  },
  textCount: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.grayText,
    marginRight: 8,
  },
  iconChevron: {
    width: 20,
    height: 20,
    tintColor: colors.primary,
  },
}));
