import React, { useEffect } from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useRefetchableFragment} from 'react-relay';

import {Fonts, createUseStyle} from 'theme';
import {getCount} from 'utils';
import {usePrevious} from 'hooks';

const subTitleHeight = 20;

const CollectionSummary = (props) => {
  const {
    style,
    userCardType,
    filterOption,
    refetchKey,
    onChangeUserCardCount,
  } = props;

  const styles = useStyle();
  const prevProps = usePrevious({filterOption, refetchKey});

  const [profile, refetch] = useRefetchableFragment(
    graphql`
      fragment CollectionSummary_profile on Profile
      @argumentDefinitions(
        with: {type: "TradingCardsWith"}
      )
      @refetchable(queryName: "CollectionSummaryRefetchQuery") {
        summaryTradingCards: tradingCards(with: $with) {
          count
          marketValue {
            formattedAmount
          }
        }
      }
    `,
    props.profile
  );

  const price = profile?.summaryTradingCards?.marketValue?.formattedAmount || 0;
  const count = profile?.summaryTradingCards?.count || 0;

  const subTitle = `${getCount(count)} ${count > 1 ? 'Items' : 'Item'}, ${price} Value`;

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    handleRefetch();
  }, [filterOption, refetchKey]);

  useEffect(() => {
    if (!userCardType) {
      return;
    }

    onChangeUserCardCount({
      userCardType,
      count,
    })
  }, [filterOption, count]);

  const handleRefetch = () => {
    refetch({
      with: filterOption,
    }, {
      fetchPolicy: 'network-only',
    });
  };

  if (!count) {
    return <View style={styles.emptyContainer} />;
  }

  return <Text style={[styles.textSubTitle, style]}>{subTitle}</Text>;
};

CollectionSummary.defaultProps = {
  refetchKey: 0,
  onChangeUserCardCount: () => {},
};

CollectionSummary.propTypes = {
  userCardType: PropTypes.object,
  filterOption: PropTypes.object,
  refetchKey: PropTypes.number,
  onChangeUserCardCount: PropTypes.func,
};

export default CollectionSummary;

const useStyle = createUseStyle(({colors}) => ({
  emptyContainer: {
    height: subTitleHeight,
  },
  textSubTitle: {
    fontFamily: Fonts.nunitoSemiBold,
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: subTitleHeight,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    textAlign: 'center',
  },
}));