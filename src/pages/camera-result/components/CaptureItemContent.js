import React from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  Button,
  CardMainInfo,
  CardPriceLabel,
} from 'components';
import AskingPriceLabel from './AskingPriceLabel';
import TradingCardConditionEdit from './TradingCardConditionEdit';

import {createUseStyle} from 'theme';

const ellipsisIcon = require('assets/icons/ellipsis.png');

const CaptureItemContent = props => {
  const {
    style,
    tradingCardId,
    isEditable,
    queryOptions,
    onPressMoreActions,
    onUpdate,
    onEditAskingPrice,
  } = props;

  const styles = useStyle();

  const queryData = useLazyLoadQuery(graphql`
    query CaptureItemContentTradingCardQuery($tradingCardId: ID!) {
      tradingCard(with: {id: $tradingCardId}) {
        id
        # frontImageUrl
        # backImageUrl(usePlaceholderWhenAbsent: false)
        card {
          ...CardMainInfo_card
        }
        ...AskingPriceLabel_tradingCard
        ...CardPriceLabel_tradingCard
        ...TradingCardListingSheet_tradingCard
        ...TradingCardConditionEdit_tradingCard
      }
      allGradingScales {
        name
        conditions {
          name
        }
      }
      viewer {
        profile {
          isAnonymous
        }
      }
    }`,
    {tradingCardId},
    queryOptions,
  );

  if (!queryData) {
    return null;
  }

  const handleChangedCondition = values => {
    if (onUpdate) {
      onUpdate(values);
    }
  };

  const handleMoreAction = () => {
    if (onPressMoreActions) {
      onPressMoreActions();
    }
  };

  const handleAskingPrice = () => {
    if (onEditAskingPrice) {
      onEditAskingPrice(queryData.tradingCard);
    }
  };

  const isAnonymous = queryData.viewer?.profile?.isAnonymous;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.infoTopContainer}>
        <CardMainInfo
          style={styles.infoTextsContainer}
          card={queryData.tradingCard?.card}
        />
        <Button
          style={styles.actionButton}
          icon={ellipsisIcon}
          iconStyle={styles.iconEllipsis}
          scale={Button.scaleSize.Four}
          disabled={!isEditable}
          onPress={handleMoreAction}
        />
      </View>
      <View style={styles.priceContainer}>
        <CardPriceLabel
          style={[styles.cardPriceContainer, isAnonymous && styles.cardPriceFullContainer]}
          priceStyle={styles.textPrice}
          stateStyle={styles.textPriceState}
          tradingCard={queryData.tradingCard}
          isShowIcon
        />
        {!isAnonymous ? (
          <AskingPriceLabel
            style={styles.cardPriceContainer}
            disabled={!isEditable}
            tradingCard={queryData.tradingCard}
            onEditAskingPrice={handleAskingPrice}
          />
        ) : null}
      </View>
      <TradingCardConditionEdit
        tradingCard={queryData.tradingCard}
        gradingScales={queryData.allGradingScales}
        disabled={!isEditable}
        onChangedCondition={handleChangedCondition}
      />
    </View>
  );
};

CaptureItemContent.defaultProps = {
  onPressMoreActions: () => {},
  onUpdate: () => {},
  onEditAskingPrice: () => {},
};

CaptureItemContent.propTypes = {
  card: PropTypes.object,
  onPressMoreActions: PropTypes.func,
  onUpdate: PropTypes.func,
  onEditAskingPrice: PropTypes.func,
};

export default CaptureItemContent;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    height: '100%',
    marginLeft: 12,
    justifyContent: 'space-between',
    elevation: 1,
  },
  infoTopContainer: {
    flexDirection: 'row',
  },
  infoTextsContainer: {
    flex: 1,
    marginHorizontal: 0,
    marginTop: 0,
  },
  actionButton: {
    width: 40,
    height: 30,
    marginRight: -8,
    marginTop: -8,
  },
  iconEllipsis: {
    width: 28,
    height: 28,
    tintColor: colors.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  cardPriceContainer: {
    marginTop: 3,
    width: '48%',
    height: 40,
    borderRadius: 4,
  },
  cardPriceFullContainer: {
    width: '100%',
  },
  textPriceState: {
    fontSize: 8,
  },
  textPrice: {
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: 0,
  },
}));
