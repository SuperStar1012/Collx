import UserCardCategories from './UserCardCategories';
import Constants from './Constants';
import SchemaTypes from './SchemaTypes';

const filterNames = {
  acceptingOffers: 'Accepting Offers',
  autographed: 'Autographed',
  category: 'Category',
  condition: 'Condition',
  freeShipping: 'Free Shipping',
  grade: 'Grade',
  memorabilia: 'Memorabilia',
  numbered: 'Numbered',
  rarity: 'Rarity',
  rookie: 'Rookie',
  sellerDiscount: 'Seller Discount',
  sortBy: 'Sort By',

  // sub names
  graded: 'Graded',
  grader: 'Grader',
  grades: 'Grades'
};

const valueTypes = {
  option: 'Option',
  range: 'Range',
  parent: 'Parent',
};

const filterValues = {
  allItems: 'all-items',
  allGrader: 'all-grader',
  allGrades: 'all-grades',
  allUsers: 'all-users',
  yes: 'yes',
  no: 'no',
  psa: 'psa',
  bgs: 'bgs',
  sgc: 'sgc',
  other: 'other',

  // Orders
  bestMatch: 'best-match',
  recentlyAdded: 'recently-added',
  lowestPrice: 'lowest-price',
  highestPrice: 'highest-price',
  oldestFirst: 'oldest-first',
  newestFirst: 'newest-first',
  mostFollowers: 'most-followers',
  mostCards: 'most-cards',
};

const filterOptions = [
  {
    label: 'All Items',
    value: filterValues.allItems,
  },
  {
    label: 'Yes',
    value: filterValues.yes,
  },
  {
    label: 'No',
    value: filterValues.no,
  },
  {
    label: 'All Grader',
    value: filterValues.allGrader,
  },
  {
    label: 'All Grades',
    value: filterValues.allGrades,
  },
  {
    label: 'PSA',
    value: filterValues.psa,
  },
  {
    label: 'BGS',
    value: filterValues.bgs,
  },
  {
    label: 'SGC',
    value: filterValues.sgc,
  },
  {
    label: 'Other',
    value: filterValues.other,
  },
  {
    label: 'All Users',
    value: filterValues.allUsers,
  },

  // Orders
  {
    label: 'Best Match',
    value: filterValues.bestMatch,
  },
  {
    label: 'Recently Added',
    value: filterValues.recentlyAdded,
  },
  {
    label: 'Lowest Price',
    value: filterValues.lowestPrice,
  },
  {
    label: 'Highest Price',
    value: filterValues.highestPrice,
  },
  {
    label: 'Oldest First',
    value: filterValues.oldestFirst,
  },
  {
    label: 'Newest First',
    value: filterValues.newestFirst,
  },
  {
    label: 'Most Followers',
    value: filterValues.mostFollowers,
  },
  {
    label: 'Most Cards',
    value: filterValues.mostCards,
  },
];

// Options
const allItemsOption = filterOptions.find(item => item.value === filterValues.allItems);

const booleanOptions = [
  filterOptions.find(item => item.value === filterValues.yes),
  filterOptions.find(item => item.value === filterValues.no),
];

const cardOptions = [
  allItemsOption,
  ...booleanOptions,
];

const userOptions = [
  filterOptions.find(item => item.value === filterValues.allUsers),
  ...booleanOptions,
];

const canonicalCardsSortByOptions = [
  {
    ...filterOptions.find(item => item.value === filterValues.bestMatch),
    schemaValue: null,
  },
  {
    ...filterOptions.find(item => item.value === filterValues.oldestFirst),
    schemaValue: SchemaTypes.searchCardsOrder.OLDEST_FIRST,
  },
  {
    ...filterOptions.find(item => item.value === filterValues.newestFirst),
    schemaValue: SchemaTypes.searchCardsOrder.NEWEST_FIRST,
  },
  {
    ...filterOptions.find(item => item.value === filterValues.lowestPrice),
    schemaValue: SchemaTypes.searchCardsOrder.LOWEST_PRICE,
  },
  {
    ...filterOptions.find(item => item.value === filterValues.highestPrice),
    schemaValue: SchemaTypes.searchCardsOrder.HIGHEST_PRICE,
  },
];

const userCardsSortByOptions = [
  {
    ...filterOptions.find(item => item.value === filterValues.bestMatch),
    schemaValue: null,
  },
  {
    ...filterOptions.find(item => item.value === filterValues.recentlyAdded),
    schemaValue: SchemaTypes.searchListedTradingCardsOrder.NEWEST_FIRST,
  },
  {
    ...filterOptions.find(item => item.value === filterValues.lowestPrice),
    schemaValue: SchemaTypes.searchListedTradingCardsOrder.LOWEST_PRICE,
  },
  {
    ...filterOptions.find(item => item.value === filterValues.highestPrice),
    schemaValue: SchemaTypes.searchListedTradingCardsOrder.HIGHEST_PRICE,
  },
];

const usersSortByOptions = [
  {
    ...filterOptions.find(item => item.value === filterValues.bestMatch),
    schemaValue: null,
  },
  {
    ...filterOptions.find(item => item.value === filterValues.mostFollowers),
    schemaValue: SchemaTypes.searchProfilesOrder.N_FOLLOWERS_DESC,
  },
  {
    ...filterOptions.find(item => item.value === filterValues.mostCards),
    schemaValue: SchemaTypes.searchProfilesOrder.N_TRADING_CARDS_DESC,
  },
];

const graderOptions = [
  filterOptions.find(item => item.value === filterValues.allGrader),
  filterOptions.find(item => item.value === filterValues.psa),
  filterOptions.find(item => item.value === filterValues.bgs),
  filterOptions.find(item => item.value === filterValues.sgc),
  filterOptions.find(item => item.value === filterValues.other),
];

const gradesRange = {
  min: 1,
  max: 10,
};

const gradeOptions = [
  {
    label: filterNames.graded,
    value: cardOptions[0].value,
    child: {
      name: filterNames.graded,
      optionType: valueTypes.option,
      options: cardOptions,
    },
  },
  // {
  //   label: filterNames.grader,
  //   value: graderOptions[0].value,
  //   child: {
  //     name: filterNames.grader,
  //     optionType: valueTypes.option,
  //     options: graderOptions,
  //   },
  // },
  // {
  //   label: filterNames.grades,
  //   value: filterValues.allGrades,
  //   child: {
  //     name: filterNames.grades,
  //     optionType: valueTypes.range,
  //     ranges: gradesRange,
  //   },
  // },
];

const canonicalCards = [
  {
    // Sort By
    name: filterNames.sortBy,
    optionType: valueTypes.option,
    options: canonicalCardsSortByOptions,
  },
  {
    // Category
    name: filterNames.category,
    optionType: valueTypes.option,
    options: [
      allItemsOption,
      ...UserCardCategories,
    ],
  },
  {
    // Rookie
    name: filterNames.rookie,
    optionType: valueTypes.option,
    options: cardOptions,
    schemaValue: SchemaTypes.sportCardFlag.RC,
  },
  {
    // Autographed
    name: filterNames.autographed,
    optionType: valueTypes.option,
    options: cardOptions,
    schemaValue: SchemaTypes.sportCardFlag.AU,
  },
  {
    // Numbered
    name: filterNames.numbered,
    optionType: valueTypes.option,
    options: cardOptions,
    schemaValue: SchemaTypes.sportCardFlag.SN,
  },
  {
    // Memorabilia
    name: filterNames.memorabilia,
    optionType: valueTypes.option,
    options: cardOptions,
    schemaValue: SchemaTypes.sportCardFlag.MEM,
  },
  {
    // Rarity
    name: filterNames.rarity,
    optionType: valueTypes.option,
    options: cardOptions,
    schemaValue: SchemaTypes.sportCardFlag.HOF,
  },
];

const userCards = [
  {
    // Sort By
    name: filterNames.sortBy,
    optionType: valueTypes.option,
    options: userCardsSortByOptions,
  },
  {
    // Category
    name: filterNames.category,
    optionType: valueTypes.option,
    options: [
      allItemsOption,
      ...UserCardCategories,
    ],
  },
  {
    // Accepting Offers
    name: filterNames.acceptingOffers,
    optionType: valueTypes.option,
    options: cardOptions,
  },
  {
    // Seller Discount
    name: filterNames.sellerDiscount,
    optionType: valueTypes.option,
    options: cardOptions,
  },
  {
    // Free Shipping
    name: filterNames.freeShipping,
    optionType: valueTypes.option,
    options: cardOptions,
  },
  {
    // Condition
    name: filterNames.condition,
    optionType: valueTypes.option,
    options: [
      allItemsOption,
      ...Constants.cardConditions.map(item => ({
        label: item.long,
        value: item.abbreviation,
      })),
    ],
  },
  {
    // Grade
    name: filterNames.grade,
    optionType: valueTypes.parent,
    options: gradeOptions,
  },
  ...canonicalCards.slice(2, 7),
];

const users = [
  {
    // Sort By
    name: filterNames.sortBy,
    optionType: valueTypes.option,
    options: usersSortByOptions,
  },
  {
    // Accepting Offers
    name: filterNames.acceptingOffers,
    optionType: valueTypes.option,
    options: userOptions,
  },
  {
    // Seller Discount
    name: filterNames.sellerDiscount,
    optionType: valueTypes.option,
    options: userOptions,
  },
  {
    // Free Shipping
    name: filterNames.freeShipping,
    optionType: valueTypes.option,
    options: userOptions,
  },
];

export default {
  canonicalCards,
  userCards,
  users,
  valueTypes,
  filterNames,
  filterValues,
  filterOptions,

  cardOptions,
  gradeOptions,
};
