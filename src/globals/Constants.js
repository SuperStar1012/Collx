import DeviceInfo from 'react-native-device-info';

import SchemaTypes from './SchemaTypes';

const systemVersion = parseInt(DeviceInfo.getSystemVersion(), 10);

const defaultAvatar = require('assets/icons/more/avatar_default.png');
const anonymousAvatar = require('assets/icons/more/avatar_anonymous.png');
const disabledAvatar = require('assets/icons/more/avatar_disable.png');
const defaultCardImage = require('assets/imgs/no_card_image.png');

export default {
  systemVersion,

  dateFormat: 'MM/DD/YYYY',
  timeFormat: 'h:mm A',
  inputDateFormat: 'YYYY-MM-DD',
  historyDateFormat: 'MMM DD, YYYY',
  exportCollectionDateFormat: 'MM/DD/YYYY h:mm A',
  joinedSinceDateFormat: 'MMM-YYYY',
  orderStatusDateFormat: 'MMM D, H:mmA',

  createAccountVariant: {
    create: 'create',
    continue: 'continue',
  },

  accountStatus: {
    active: 'active',
    banned: 'banned',
    deleted: 'deleted',
    suspended: 'suspended',
  },

  // Axios Error
  axiosResponseError: {
    none: 0,
    auth: 1,
    maintenance: 2
  },
  axiosRetryTimeout: 15, // seconds

  // Cloud Error
  cloudErrorCode: {
    accessDenied: 'AccessDenied',
    expiredToken: 'ExpiredToken',
    signatureDoesNotMatch: 'SignatureDoesNotMatch',
  },

  // AsyncStorage
  userInfo: 'UserInfo',
  lastLoggedInUserEmail: 'LastLoggedInUserEmail',
  showedOnboarding: 'ShowedOnboarding',
  cardUploadInfo: 'CardUploadInfo',
  showedScanningTips: 'ShowedScanningTips',
  dismissedOnboardingWidget: 'DismissedActivityOnboarding',
  showedInAppReview: 'ShowedInAppReview',
  dismissedReferralProgram: 'DismissedReferralProgram',
  dismissedReleaseNote: 'DismissedReleaseNote',
  darkAppearanceMode: 'DarkAppearanceMode',
  cameraSoundEffect: 'CameraSoundEffect',
  showedPushNotificationSplash: 'ShowedPushNotificationSplash',
  showedDealOnboarding: 'ShowedDealOnboarding',
  showedMarketplaceIntroduce: 'ShowedMarketplaceIntroduce',
  userCardCaptureMode: 'CardCaptureMode',
  userCardCaptureView: 'CardCaptureView',
  userCardCaptureSport: 'CardCaptureSport',
  showedIntroduceUsername: 'ShowedIntroduceUsername',
  analyticsSessionData: 'AnalyticsSessionData',
  collectionSettings: 'CollectionSettings',

  defaultCardImage,
  defaultAvatar,
  anonymousAvatar,
  disabledAvatar,
  defaultName: 'Anonymous User',
  unknownName: 'Unknown Name',
  collxName: 'CollX User',
  avatarImageWidth: 200,
  userCardsForAppReview: 50,
  nameMaxLength: 40,
  userCardsLimitInCollection: 500,

  orderByMode: {
    ascending: 'asc',
    descending: 'desc',
  },

  userEngagement: {
    scanned: 'scanned',
    added: 'added',
    followed: 'followed',
    invited: 'invited',
    commented: 'commented',
    listed: 'listed',
    sold: 'sold',
    messaged: 'messaged',
    ordered: 'ordered',
  },

  userType: {
    standard: 'standard',
    pro: 'pro',
  },

  userStatus: {
    active: 'active',
    banned: 'banned',
    inactive: 'inactive',
    suspended: 'suspended',
  },

  appearanceSettings: {
    on: 'on',
    off: 'off',
    system: 'system',
  },

  soundEffectSettings: {
    on: 'on',
    off: 'off',
  },

  colorSchemeName: {
    none: null,
    light: 'light',
    dark: 'dark',
  },

  // Encode / Decode ID
  base64Prefix: {
    cardComment: 'CardComment',
    deal: 'Deal',
    gameCard: 'GameCard',
    order: 'Order',
    profile: 'Profile',
    sportCard: 'SportCard',
    scan: 'Scan',
    tradingCard: 'TradingCard',
  },

  contactUs: 'support@collx.app',

  // Notification

  notificationTypeName: {
    commentNotification: 'CommentNotification',
    commentReplyNotification: 'CommentReplyNotification',
    creditNotification: 'CreditNotification',
    deeplinkNotification: 'DeeplinkNotification',
    followNotification: 'FollowNotification',
    infoNotification: 'InfoNotification',
    likeNotification: 'LikeNotification',
    updateNotification: 'UpdateNotification',
    weblinkNotification: 'WeblinkNotification',
    orderNotification: 'OrderNotification',
  },

  notificationRequestType: {
    askToEnable: 1,
    askToReenable: 2,
  },

  // Steam Message

  streamMessageType: {
    card: 'card',
    deal: 'deal',
  },

  rewardReferralCount: 5,
  referralStatus: {
    pending: 'pending',
    approved: 'approved',
    flagged: 'flagged',
  },

  authProgressSteps: 6,

  // Collection
  collectionSelectMode: {
    none: 0,
    currentUser: 1,
    otherUser: 2,
  },

  // Fetch Limit
  feedFetchLimit: 10,
  defaultFetchLimit: 20,
  recentActivitiesFetchLimit: 10,
  recentAddedCardsFetchLimit: 3,
  featuredCardsFetchLimit: 10,
  topUsersFetchLimit: 3,
  recentSearchesFetchLimit: 10,
  installationFetchLimit: 20,
  friendsFetchLimit: 5,
  collectionSetCardsFetchLimit: 200,

  // Search

  searchCategories: {
    database: 'Database',
    forSale: 'For Sale',
    articles: 'Articles',
  },

  // Card
  cardCaptureMode: {
    frontOnly: 'frontonly',
    bothFrontBack: 'front&back',
  },
  cardCaptureViewFinder: {
    normal: 'normal',
    grade: 'grade',
  },
  cardFrontPhoto: 'front',
  cardBackPhoto: 'back',
  cardVisualPhoto: 'visual',
  searchDelayDebounce: 400, // milliseconds
  uploadImageWidth: 640,
  visualSearchImageWidth: 400,
  openCameraFrom: {
    default: 0,
    addCollection: 1,
  },
  searchModalMode: {
    none: 0, // None
    capture: 1, // Captured Cards
    edit: 2, // Edit Card Details
  },
  cardPriceNone: 'N/A',

  internalCardSaleSource: 'CollX',

  nextSleepForCardUpload: 0.2, // seconds
  retryTimeoutForFailedCardUpload: 1, // seconds

  // minSearchCharLength: 3,

  cardAnimationSteps: {
    step0: 0,
    step1: 1,
    step2: 2,
  },

  allUserCardType: {
    label: 'All Items',
    sport: 'ALL',
    value: 0,
    price: 0,
  },

  sportCardTypes: [1, 2, 3, 4, 5, 6, 10],

  cardSearchState: {
    none: 0,
    current: 1,
    searching: 2,
    detected: 3,
    notDetected: 4,
    created: 5,
    updated: 6,
    failedVisualSearch: 7,
    retryingCreate: 8,
    retryingUploadMedia: 9,
    failedMedia: 10,
    failedCreate: 11,
  },

  cardSortFilterCategory: {
    sort: 'Sort',
    filter: 'Filter',
  },

  cardSortFilterDisplay: {
    both: 'both', // both sort & filter
    sort: 'sort',
    filter: 'filter',
  },

  // "date", "player", "team", "set", "year" or "condition".
  // "price-asc" and "price-desc" f

  cardSorts: {
    recentAddedDate: {
      label: 'Date added (most recent first)',
      value: SchemaTypes.tradingCardOrder.NEWEST_FIRST,
    },
    oldAddedDate: {
      label: 'Date added (oldest first)',
      value: SchemaTypes.tradingCardOrder.OLDEST_FIRST,
    },
    player: {
      label: 'Player',
      value: SchemaTypes.tradingCardOrder.PLAYER_NAME,
    },
    team: {
      label: 'Team',
      value: SchemaTypes.tradingCardOrder.TEAM_NAME,
    },
    year: {
      label: 'Year',
      value: SchemaTypes.tradingCardOrder.YEAR,
    },
    condition: {
      label: 'Condition',
      value: SchemaTypes.tradingCardOrder.CONDITION,
    },
    priceAsc: {
      label: 'Price (lowest to highest)',
      value: SchemaTypes.tradingCardOrder.PRICE_LOWEST_FIRST,
    },
    priceDsc: {
      label: 'Price (highest to lowest)',
      value: SchemaTypes.tradingCardOrder.PRICE_HIGHEST_FIRST,
    },
    set: {
      label: 'Set',
      value: SchemaTypes.tradingCardOrder.SET_NAME,
    },
  },

  cardFeature: {
    featured: {
      label: 'Featured',
      value: 'featured',
    },
  },

  cardFilters: {
    sale: {
      label: 'Listed for sale',
      value: 'listed',
    },
    sold: {
      label: 'Previously sold',
      value: 'sold',
    },
    team: {
      label: 'Team',
      value: 'team',
    },
    year: {
      label: 'Year',
      value: 'year',
    },
    condition: {
      label: 'Condition',
      value: 'condition',
    },
    graded: {
      label: 'Graded',
      value: 'graded',
    },
    unidentified: {
      label: 'Unidentified',
      value: 'unidentified',
    },
  },

  cardFilterAllSets: 'All sets',

  // year, set, team, player, free text
  cardSearchCategories: {
    year: 'Year',
    set: 'Set',
    team: 'Team',
    player: 'Player',
    q: 'Q',
  },

  cardGradingScaleRaw: 'RAW',

  cardConditions: [
    {
      abbreviation: 'MT',
      long: 'Mint',
    },
    {
      abbreviation: 'NM', // 'NR-MT',
      long: 'Near Mint',
    },
    {
      abbreviation: 'VG',
      long: 'Very Good',
    },
    {
      abbreviation: 'FR',
      long: 'Fair',
    },
    {
      abbreviation: 'PR',
      long: 'Poor',
    },
  ],

  gradedOptions: {
    Yes: {
      label: 'Graded',
      value: true,
    },
    No: {
      label: 'RAW',
      value: false,
    },
  },

  cardBasicListingStatus: [
    {
      // notForSale: 'Not For Sale',
      label: 'Not For Sale',
      value: null,
    }, {
      // forSale: 'For Sale',
      label: 'For Sale',
      value: SchemaTypes.tradingCardState.LISTED,
    },
  ],

  cardSoldListingStatus: [
    {
      // soldOnCollX: 'Sold on CollX',
      label: 'Sold on CollX',
      value: SchemaTypes.soldTradingCardType.COLLX,
    }, {
      // soldElsewhere: 'Sold Elsewhere',
      label: 'Sold Elsewhere',
      value: SchemaTypes.soldTradingCardType.OTHER,
    },
  ],

  cardSaleTypes: {
    collx: 'collx',
    other: 'other',
  },

  cardRecentTransactionsHeader: [
    'Date',
    'Source',
    '',
    'Grade',
    'Price',
  ],

  cardGraders: {
    psa: 'PSA',
    collx: 'CollX',
  },

  paymentMethodTypes: {
    apple: 'apple',
    google: 'google',
    card: 'card',
  },

  extraPaymentMethods: {
    apple: {
      id: 'apple_pay',
      type: 'apple',
      apple: {
        brand: "apple",
        label: "Apple Pay",
      },
    },
    google: {
      id: 'google_pay',
      type: 'google',
      google: {
        brand: "google",
        label: "Google Pay",
      },
    },
  },

  minimumRawWeight: 0.4,
  minimumGradedWeight: 3,

  addressName: {
    shipping: 'shipping',
    tax: 'tax',
  },

  // RevenueCat
  revenueCatPackageType: {
    monthly: 'MONTHLY',
    annual: 'ANNUAL',
  },

  exportCollectionType: {
    collection: 'collection',
    setChecklist: 'set-checklist',
  },

  exportCollectionStatus: {
    queued: 'queued',
    processing: 'processing',
    completed: 'completed',
    failed: 'failed',
  },

};
