import _ from 'lodash';
import {formatCurrency} from "react-native-format-currency";

import {Constants, SchemaTypes} from 'globals';
import {Colors} from 'theme';
import {encodeId} from './id';

const priceTagIcon = require('assets/icons/tag_fill.png');

export const groupBySet = (data, sort, chunks = 0, categoryLabel) => {
  return _(data)
    .groupBy(item => getSortBy(sort, item, categoryLabel))
    .map((value, key) => ({
      title: getSortByValue(sort, key),
      data: chunks > 0 ? _.chunk(value, chunks) : value,
    }))
    .sortBy(item => {
      if (sort === Constants.cardSorts.condition.label) {
        const index = Constants.cardConditions.findIndex(
          condition => condition.long === item.title,
        );
        return index > -1 ? index : Constants.cardConditions.length;
      }

      if (
        sort === Constants.cardSorts.player.label ||
        sort === Constants.cardSorts.team.label ||
        sort === Constants.cardSorts.year.label ||
        sort === Constants.cardSorts.condition.label ||
        sort === Constants.cardSorts.set.label
      ) {
        return item.title;
      }

      return '';
    })
    .value();
};

export const getSortBy = (sortBy, item, categoryLabel) => {
  const tradingCard = item.node;

  if (!tradingCard) {
    return '';
  }

  switch (sortBy) {
    case Constants.cardSorts.player.label:
      return tradingCard.card?.player?.name;
    case Constants.cardSorts.team.label:
      return tradingCard.card?.team?.name;
    case Constants.cardSorts.year.label:
      return tradingCard.card?.year;
    case Constants.cardSorts.condition.label:
      return tradingCard.condition?.name;
    case Constants.cardSorts.set.label:
      return tradingCard.card?.set?.name;
  }

  if (categoryLabel) {
    return tradingCard.featured ? Constants.cardFeature.featured.label : categoryLabel;
  }

  return '';
};

export const getSortByValue = (sortBy, value) => {
  switch (sortBy) {
    case Constants.cardSorts.condition.label: {
      const condition = Constants.cardConditions.find(
        item => item.abbreviation === value || item.long === value,
      );
      return condition ? condition.long : value;
    }
    default:
      return value;
  }
};

export const getSortLabel = sortBy => {
  const value = sortBy?.sort_by;

  if (!value) {
    return null;
  }

  const sortKey = Object.keys(Constants.cardSorts).find(
    item => Constants.cardSorts[item].value === value,
  );

  if (sortKey) {
    return Constants.cardSorts[sortKey].label;
  }

  return null;
};

export const getFilterLabel = filterBy => {
  const keys = Object.keys(filterBy || {});
  let key = '';

  if (keys.length === 0) {
    return null;
  } else if (keys.length === 1) {
    key = keys[0];
  } else if (keys.findIndex(item => item === 'set') > -1) {
    return filterBy.set;
  } else {
    key = keys.find(item => item !== 'set');
  }

  const cardFilters = {
    ...Constants.cardFeature,
    ...Constants.cardFilters,
  };

  const filterKey = Object.keys(cardFilters).find(item => cardFilters[item].value === key);

  const filterItem = cardFilters[filterKey];

  switch (filterItem?.label) {
    case cardFilters.sale.label:
    case cardFilters.sold.label:
    case cardFilters.unidentified.label:
    case cardFilters.featured.label:
      return filterItem.label;
    default:
      return filterBy[key];
  }
};

export const getNumber = number => {
  if (!number) {
    return '';
  }

  return number && Number.isInteger(Number(number)) ? `#${number}` : number;
};

export const getSectionTitle = (title, sort) => {
  if (title && title !== 'null') {
    return title;
  }

  let unknown = 'Unknown';
  if (sort === Constants.cardSorts.set.label) {
    unknown = 'Unknown Set';
  } else if (sort === Constants.cardSorts.player.label) {
    unknown = 'Unidentified';
  }

  return unknown;
};

export const getSetName = set => {
  return set || 'Unknown Set';
};

export const getTeamName = team => {
  return team || 'Unknown Team';
};

export const getPlayerName = (player, name, userId, cardId) => {
  if (userId && !cardId) {
    return 'Unidentified';
  }

  return player || name;
};

export const getNumberAndPlayer = (number, player, name, userId, cardId) => {
  const cardNumber = getNumber(number);
  const playerName = getPlayerName(player, name, userId, cardId);
  if (!cardNumber) {
    return playerName;
  }

  return `${cardNumber} ${playerName}`;
};

export const getPrice = price => {
  const currencyCode = SchemaTypes.currencyCode.USD;

  if (price !== 0 && !price) {
    return Constants.cardPriceNone;
  }

  return `${Number(price) < 0 ? '-' : ''}${formatCurrency({ amount: Math.abs(price).toFixed(2), code: currencyCode })[0]}`;
};

export const getCount = count => {
  return (count || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getFixedPrice = price => {
  return typeof price === 'number' ? price.toFixed(2) : '';
};

export const getCardPriceForApi = (card, colors) => {
  const {
    listed,
    saleType,
    salePrice,
    askingPrice,
    averagePrice,
    lastSalePrice,
    estimatedPrice,
  } = card;

  if (saleType) {
    return {
      label: 'Sold For',
      price: getFixedPrice(salePrice),
      color: colors?.primaryText,
      icon: priceTagIcon,
    };
  } else if (listed) {
    return {
      label: 'Asking Price',
      price: getFixedPrice(askingPrice),
      color: colors?.primary,
      icon: priceTagIcon,
    };
  } else if (averagePrice) {
    return {
      label: 'Avg Price',
      price: getFixedPrice(averagePrice),
      color: colors?.darkGrayText,
    };
  } else if (lastSalePrice) {
    return {
      label: 'Last Sale',
      price: getFixedPrice(lastSalePrice),
      color: colors?.darkGrayText,
    };
  } else if (estimatedPrice) {
    return {
      label: 'Est Price',
      price: getFixedPrice(estimatedPrice),
      color: colors?.darkGrayText,
    };
  }

  return {
    label: 'No Recent Sale',
    price: null,
    color: Colors.darkGray,
  };
};

export const getGradingScales = (graders, graderValue) => {
  const newGradingScales = [];
  const foundGrader = graders.find(grader => grader.id === graderValue);

  if (foundGrader) {
    foundGrader.gradingScale.map(scale => {
      newGradingScales.unshift({
        label: scale,
        value: scale,
      });
    });
  }

  return newGradingScales;
};

export const checkUserCard = card => {
  if (Object.keys(card).length > 1 && Object.prototype.hasOwnProperty.call(card, 'cardId')) {
    return true;
  } else if (Object.keys(card).length > 1 && !Object.prototype.hasOwnProperty.call(card, 'cardId')) {
    return false;
  } else if (Object.keys(card).length === 0) {
    return false;
  }

  return true;
};

export const getCardMarketPrice = (cardValues, colors) => {
  switch (cardValues.marketValue?.source) {
    case SchemaTypes.marketValueSource.AVERAGE:
      return {
        label: 'Avg Price',
        price: cardValues.marketValue?.price.formattedAmount,
        color: colors.darkGrayText,
      };
    case SchemaTypes.marketValueSource.LAST_SALE:
      return {
        label: 'Last Sale',
        price: cardValues.marketValue?.price.formattedAmount,
        color: colors.darkGrayText,
      };
    case SchemaTypes.marketValueSource.ESTIMATION:
      return {
        label: 'Est Price',
        price: cardValues.marketValue?.price.formattedAmount,
        color: colors.darkGrayText,
      };
    default: {
      return {
        label: 'No Recent Sale',
        price: null,
        color: colors.darkGrayText,
      };
    }
  }
};

export const getCardFormattedPrice = (cardValues, colors = {}) => {
  switch (cardValues.state) {
    case SchemaTypes.tradingCardState.SOLD:
      return {
        label: 'Sold For',
        price: cardValues.sale?.soldFor?.formattedAmount || Constants.cardPriceNone,
        color: colors.primaryText,
        icon: priceTagIcon,
      };
    case SchemaTypes.tradingCardState.LISTED:
      return {
        label: 'Asking Price',
        price: cardValues.listing?.askingPrice?.formattedAmount,
        color: colors.primary,
        icon: priceTagIcon,
      };
    case SchemaTypes.tradingCardState.ACCEPTING_OFFERS: {
      return getCardMarketPrice(cardValues, colors)
    }
    default: {
      return getCardMarketPrice(cardValues, colors);
    }
  }
};

export const getCardPrice = (cardValues) => {
  switch (cardValues.state) {
    case SchemaTypes.tradingCardState.SOLD:
      return cardValues.sale?.soldFor?.amount;
    case SchemaTypes.tradingCardState.LISTED:
      return cardValues.listing?.askingPrice?.amount;
    case SchemaTypes.tradingCardState.ACCEPTING_OFFERS:
    default: {
      switch (cardValues.marketValue?.source) {
        case SchemaTypes.marketValueSource.AVERAGE:
          return cardValues.marketValue?.price.amount;
        case SchemaTypes.marketValueSource.LAST_SALE:
          return cardValues.marketValue?.price.amount;
        case SchemaTypes.marketValueSource.ESTIMATION:
          return cardValues.marketValue?.price.amount;
        default: {
          return 0;
        }
      }
    }
  }
};

export const getCardGradeAndCondition = condition => {
  const gradingScale = condition?.gradingScale?.name;

  const gradeValue = gradingScale && gradingScale !== Constants.cardGradingScaleRaw ? condition.name : null;
  const conditionValue = gradingScale && gradingScale === Constants.cardGradingScaleRaw ? condition.name : null;

  return ({
    grade: gradeValue,
    condition: conditionValue,
  });
};

export const getConditionAbbreviation = condition => {
  const cardCondition = Constants.cardConditions.find(item => item.long === condition);
  return cardCondition ? cardCondition.abbreviation : condition;
};

export const isSportCard = cardType => (
  Constants.sportCardTypes.includes(Number(cardType))
);

export const encodeCanonicalCardId = (cardType, cardId) => {
  if (!cardType || !cardId) {
    return null;
  }

  return encodeId(
    isSportCard(cardType) ? Constants.base64Prefix.sportCard : Constants.base64Prefix.gameCard,
    cardId,
  );
};

export const encodeScanId = (scanId) => {
  if (!scanId) {
    return null;
  }

  return encodeId(Constants.base64Prefix.scan, scanId);
};
