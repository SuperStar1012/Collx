import {RESULTS} from 'react-native-permissions';

import {
  createMessageChannel,
  sendMessageToChatBot,
} from 'services';
import {decodeId, checkContactsPermission} from 'utils';

export function createNavigationActions(navigation) {
  return {
    navigateGoBack: () => {
      navigation.goBack();
    },

    navigateCreateAccount: (params) => {
      navigation.navigate('AuthStackModal', {
        screen: 'CreateAccount',
        params,
      });
    },

    pushCanonicalCardDetail: (canonicalCardId, tradingCardIdForIssue) => {
      navigation.push('CardDetailStackScreens', {
        screen: 'CardDetail',
        params: {
          canonicalCardId,
          tradingCardIdForIssue,
          tradingCardId: null,
          scrollToComment: false,
        },
      });
    },

    pushTradingCardDetail: (tradingCardId) => {
      navigation.push('CardDetailStackScreens', {
        screen: 'CardDetail',
        params: {
          canonicalCardId: null,
          tradingCardId,
          scrollToComment: false,
        },
      });
    },

    navigateMatchingTradingCards: (canonicalCardId) => {
      navigation.navigate('CardDetailStackScreens', {
        screen: 'MatchingTradingCards',
        params: {
          canonicalCardId,
        },
      });
    },

    pushCardUsers: (cardId) => {
      navigation.push('CardUsers', {
        cardId,
        tradingCardId: null,
      });
    },

    pushProfile: (profileId) => {
      navigation.push('Profile', {
        profileId,
      });
    },

    navigateEditProfile: () => {
      navigation.navigate('EditProfile');
    },

    navigateSettings: () => {
      navigation.navigate('Settings');
    },

    navigateScanCard: () => {
      navigation.navigate('CameraStackModal');
    },

    navigateAddFriends: async () => {
      const result = await checkContactsPermission();

      if (result === RESULTS.GRANTED) {
        navigation.navigate('FriendsStackScreens', {
          screen: 'FindFriends',
        });
      } else {
        navigation.navigate('FriendsStackScreens');
      }
    },

    pushCardDetailWithComments: (tradingCardId) => {
      navigation.push('CardDetailStackScreens', {
        screen: 'CardDetail',
        params: {
          canonicalCardId: null,
          tradingCardId: tradingCardId,
          scrollToComment: true,
        },
      });
    },

    navigateClaimReferralReward: () => {
      navigation.navigate('ReferralProgramStackScreens', {
        screen: 'RedeemReward',
      });
    },

    navigateCreditHistory() {
      navigation.navigate('MyMoneyScreens', {
        screen: 'CreditHistory',
      });
    },

    navigateOpenReferralProgram: () => {
      navigation.navigate('ReferralProgramStackScreens');
    },

    navigateDeal: (dealId) => {
      navigation.navigate('DealsScreens', {
        screen: 'Deal',
        params: {
          dealId,
        }
      });
    },

    navigateMessageChannel: (params) => {
      navigation.navigate('Message', params);
    },

    navigateMessage: async ({
      currentProfileId,
      peerProfileId,
      channel = null,
      isRootScreen = false,
    }) => {
      const [, currentUserId] = decodeId(currentProfileId);
      const [, peerUserId] = decodeId(peerProfileId);

      const newChannel = await createMessageChannel({
        navigation,
        channel,
        currentUserId,
        peerUserId,
        isRootScreen,
      });

      return newChannel;
    },

    navigateChatBotMessage: (params) => {
      sendMessageToChatBot({
        navigation,
        ...params,
      })
    },

    navigateReportIssue: (params) => {
      navigation.navigate('ReportStackModal', {
        screen: 'ReportIssue',
        params,
      });
    },

    navigateReportIssueDetail: (params) => {
      navigation.navigate('ReportStackModal', {
        screen: 'ReportIssueDetail',
        params,
      });
    },

    navigateReportIssueConfirm: (params) => {
      navigation.navigate('ReportStackModal', {
        screen: 'ReportIssueConfirm',
        params,
      });
    },

    navigateSearch(params) {
      navigation.navigate('SearchStackScreens', {
        screen: 'Search',
        params,
      });
    },

    navigateSearchUsers(params) {
      navigation.navigate('SearchStackScreens', {
        screen: 'UsersSearch',
        params,
      });
    },

    navigateSearchDatabaseCards(params) {
      navigation.navigate('SearchStackScreens', {
        screen: 'DatabaseSearchAllResult',
        params,
      });
    },

    navigateSearchSaleCards(params) {
      navigation.navigate('SearchStackScreens', {
        screen: 'SaleSearchAllResult',
        params,
      });
    },

    navigateScanSearch(params) {
      navigation.navigate('SearchStackScreens', {
        screen: 'ScanSearch',
        params,
      });
    },

    navigateSearchDatabaseCardsModal(params) {
      navigation.navigate('SearchStackModal', {
        screen: 'DatabaseSearchAllResult',
        params,
      });
    },

    navigateAddCardToCollection(params) {
      navigation.navigate('SearchStackModal', {
        screen: 'CardAdd',
        params,
      });
    },

    navigateEditCard(params) {
      navigation.navigate('SearchStackModal', {
        screen: 'CardEdit',
        params
      });
    },

    navigateWebViewer: (params) => {
      navigation.navigate('CommonStackModal', {
        screen: 'WebViewer',
        params,
      });
    },

    navigateCollXProModal: (params) => {
      navigation.navigate('CollXProStackModal', {
        screen: 'GetCollXPro',
        params,
      });
    },

    navigateCheckout(params) {
      navigation.navigate('CheckoutScreens', {
        screen: 'Checkout',
        params,
      });
    },

    navigateCheckoutOrder(params) {
      navigation.navigate('CheckoutScreens', {
        screen: 'OrderDetail',
        params,
      });
    },

    navigateOrderDetail(params) {
      navigation.navigate('OrderScreens', {
        screen: 'OrderDetail',
        params,
      });
    },

    navigateSetSellerSettings: (params) => {
      navigation.navigate('SellerToolsStackModal', {
        screen: 'SetSellerSettings',
        params,
      });
    },

    navigateTaxpayerInformation: () => {
      navigation.navigate('SellerToolsStackModal', {
        screen: 'TaxpayerInformation',
      });
    },

  };
}