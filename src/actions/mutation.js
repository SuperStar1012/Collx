import acceptOfferMutation from '../mutations/accept_offer_mutation';
import addCardsFromOrderToCollectionMutation from '../mutations/add_cards_from_order_to_collection_mutation';
import addEngagementMutation from '../mutations/add_engagement_mutation';
import addTradingCardsToDealMutation from '../mutations/add_trading_cards_to_deal_mutation';
import addTradingCardsToSavedForLaterMutation from '../mutations/add_trading_cards_to_saved_for_later_mutation';
import blockOrUnblockUserMutation from '../mutations/block_unblock_user_mutation';
import buyItNowMutation from '../mutations/buy_it_now_mutation';
import cancelDealMutation from '../mutations/cancel_deal_mutation';
import cancelOrderMutation from '../mutations/cancel_order_mutation';
import checkoutOrderMutation from '../mutations/checkout_order_mutation';
import clearPendingFlagForTradingCardsMutation from '../mutations/clear_pending_flag_for_trading_cards_mutation';
import createAddressMutation from '../mutations/create_address_mutation';
import createCommentMutation from '../mutations/create_comment_mutation';
import addIssueAttachmentsToIssueMutation from '../mutations/add_issue_attachments_to_issue_mutation'
import createIssueAttachmentMutation from '../mutations/create_issue_attachment_mutation';
import createIssueMutation from '../mutations/create_issue_mutation';
import createStripeConnectedAccountMutation from '../mutations/create_stripe_connected_account_mutation';
import createTradingCardMutation from '../mutations/create_trading_card_mutation';
import deleteAddressMutation from '../mutations/delete_address_mutation';
import deleteSavedSearchMutation from '../mutations/delete_saved_search_mutation';
import deleteTradingCardsMutation from '../mutations/delete_trading_cards_mutation';
import dislikeCommentMutation from '../mutations/dislike_comment_mutation';
import dislikeTradingCardMutation from '../mutations/dislike_trading_card_mutation';
import initiateEmailVerificationMutation from '../mutations/initiate_email_verification_mutation';
import likeCommentMutation from '../mutations/like_comment_mutation';
import likeTradingCardMutation from '../mutations/like_trading_card_mutation';
import makeAnOfferMutation from '../mutations/make_an_offer_mutation';
import markOrderAsCompletedMutation from '../mutations/mark_order_as_completed_mutation';
import markOrderAsShippedMutation from '../mutations/mark_order_as_shipped_mutation';
import markReadAllNotificationMutation from '../mutations/mark_read_all_notification_mutation';
import markReturnAsDeliveredMutation from '../mutations/mark_return_as_delivered_mutation';
import markTradingCardAsFeaturedMutation from '../mutations/mark_trading_card_as_featured_mutation';
import markTradingCardAsUnfeaturedMutation from '../mutations/mark_trading_card_as_unfeatured_mutation';
import marketingClaimOnboardingCreditMutation from '../mutations/marketing_claim_onboarding_credit_mutation';
import redeemRewardMutation from '../mutations/redeem_reward_mutation';
import rejectOfferMutation from '../mutations/reject_offer_mutation';
import removeCardsFromSellersCollectionMutation from '../mutations/remove_cards_from_sellers_collection_mutation';
import removeTradingCardAskingPriceMutation from '../mutations/remove_trading_card_asking_price_mutation';
import removeTradingCardMutation from '../mutations/remove_trading_card_mutation';
import removeTradingCardsFromDealMutation from '../mutations/remove_trading_cards_from_deal_mutation';
import removeTradingCardsFromSavedForLaterMutation from '../mutations/remove_trading_cards_from_saved_for_later_mutation';
import renewDealMutation from '../mutations/renew_deal_mutation';
import saveSearchMutation from '../mutations/save_search_mutation';
import setBalanceToApplyToOrderMutation from '../mutations/set_balance_to_apply_to_order_mutation';
import setCreditsToApplyToOrderMutation from '../mutations/set_credits_to_apply_to_order_mutation';
import setDefaultAddressMutation from '../mutations/set_default_address_mutation';
import setRatingOrderMutation from '../mutations/set_rating_order_mutation';
import setSellerAcceptOfferMutation from '../mutations/set_seller_accept_offer_mutation';
import setSellerDiscountMutation from '../mutations/set_seller_discount_mutation';
import setSellerShippingSettingsMutation from '../mutations/set_seller_shipping_settings_mutation';
import setSellerTaxpayerInformationMutation from '../mutations/set_seller_taxpayer_information_mutation';
import setShippingAddressMutation from '../mutations/set_shipping_address_mutation';
import setStripePaymentMethodMutation from '../mutations/set_stripe_payment_method_mutation';
import setTrackingNumberOnOrderMutation from '../mutations/set_tracking_number_on_order_mutation';
import soldTradingCardMutation from '../mutations/sold_trading_card_mutation';
import startFollowingProfileMutation from '../mutations/start_following_profile_mutation';
import stopFollowingProfileMutation from '../mutations/stop_following_profile_mutation';
import updateAddressMutation from '../mutations/update_address_mutation';
import updateProfileInLocalMutation from '../mutations/update_profile_in_local_mutation';
import updateProfileMutation from '../mutations/update_profile_mutation';
import updateStripeConnectedAccountMutation from '../mutations/update_stripe_connected_account_mutation';
import updateTradingCardAskingPriceMutation from '../mutations/update_trading_card_asking_price_mutation';
import updateTradingCardImageMutation from '../mutations/update_trading_card_image_mutation';
import updateTradingCardMutation from '../mutations/update_trading_card_mutation';
import updateUserTypeMutation from '../mutations/update_user_type_mutation';
import updateUsernameMutation from '../mutations/update_username_mutation';
import useRedemptionCodeMutation from '../mutations/use_redemption_code';
import verifyEmailMutation from '../mutations/verify_email_mutation';
import withdrawMoneyMutation from '../mutations/withdraw_money_mutation';
import setUserPrivacySettingsMutation from '../mutations/set_user_privacy_settings_mutation';

export function createMutationActions(relayEnvironment) {
  return {
    acceptOffer(values, {onComplete, onError} = {}) {
      return acceptOfferMutation(relayEnvironment, values)
        .then((deal) => onComplete && onComplete(deal))
        .catch((error) => onError && onError(error));
    },

    addCardsFromOrderToCollection(orderId, {onComplete, onError} = {}) {
      return addCardsFromOrderToCollectionMutation(relayEnvironment, orderId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    addEngagement(engagement, {onComplete, onError} = {}) {
      return addEngagementMutation(relayEnvironment, engagement)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    addTradingCardsToDeal(sellerId, tradingCardIds, {onComplete, onError} = {}) {
      return addTradingCardsToDealMutation(relayEnvironment, sellerId, tradingCardIds)
        .then((deal) => onComplete && onComplete(deal))
        .catch((error) => onError && onError(error));
    },

    addTradingCardsToSavedForLater(values, {onComplete, onError} = {}) {
      return addTradingCardsToSavedForLaterMutation(relayEnvironment, values)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    blockOrUnblockUser(profileId, enabled, {onComplete, onError} = {}) {
      return blockOrUnblockUserMutation(relayEnvironment, profileId, enabled)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    buyItNow(values, {onComplete, onError} = {}) {
      return buyItNowMutation(relayEnvironment, values)
        .then((deal) => onComplete && onComplete(deal))
        .catch((error) => onError && onError(error));
    },

    cancelDeal(values, {onComplete, onError} = {}) {
      return cancelDealMutation(relayEnvironment, values)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    cancelOrder(orderId, {onComplete, onError} = {}) {
      return cancelOrderMutation(relayEnvironment, orderId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    checkoutOrder(orderId, stripePaymentMethod, {onComplete, onError} = {}) {
      return checkoutOrderMutation(relayEnvironment, orderId, stripePaymentMethod)
        .then((order) => onComplete && onComplete(order))
        .catch((error) => onError && onError(error));
    },

    clearPendingFlagForTradingCards(values, {onComplete, onError} = {}) {
      return clearPendingFlagForTradingCardsMutation(relayEnvironment, values)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    createAddress(values, {onComplete, onError} = {}) {
      return createAddressMutation(relayEnvironment, values)
        .then((address) => onComplete && onComplete(address))
        .catch((error) => onError && onError(error));
    },

    createComment(text, forValues, {onComplete, onError} = {}) {
      return createCommentMutation(relayEnvironment, text, forValues)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    addIssueAttachmentsToIssue(issueId, issueAttachmentIds, {onComplete, onError} = {}) {
      return addIssueAttachmentsToIssueMutation(relayEnvironment, issueId, issueAttachmentIds)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    createIssueAttachment(values, {onComplete, onError} = {}) {
      return createIssueAttachmentMutation(relayEnvironment, values)
        .then((values) => onComplete && onComplete(values))
        .catch((error) => onError && onError(error));
    },

    createIssue(values, {onComplete, onError} = {}) {
      return createIssueMutation(relayEnvironment, values)
        .then((issueId) => onComplete && onComplete(issueId))
        .catch((error) => onError && onError(error));
    },

    createStripeConnectedAccount(values, {onComplete, onError} = {}) {
      return createStripeConnectedAccountMutation(relayEnvironment, values)
        .then((buyerSettings) => onComplete && onComplete(buyerSettings))
        .catch((error) => onError && onError(error));
    },

    createTradingCard(from, values, {onComplete, onError} = {}) {
      return createTradingCardMutation(relayEnvironment, from, values)
        .then((tradingCard) => onComplete && onComplete(tradingCard))
        .catch((error) => onError && onError(error));
    },

    async createTradingCardAsync(from, values) {
      return await createTradingCardMutation(relayEnvironment, from, values);
    },

    deleteAddress(addressId, {onComplete, onError} = {}) {
      return deleteAddressMutation(relayEnvironment, addressId)
        .then(() => onComplete && onComplete())
        .catch(error => onError && onError(error));
    },

    deleteSavedSearch(savedSearchIds, isDeleteAll, {onComplete, onError} = {}) {
      return deleteSavedSearchMutation(relayEnvironment, savedSearchIds, isDeleteAll)
        .then(() => onComplete && onComplete())
        .catch(error => onError && onError(error));
    },

    deleteTradingCards(tradingCardIds, filters, {onComplete, onError} = {}) {
      return deleteTradingCardsMutation(relayEnvironment, tradingCardIds, filters)
        .then(() => onComplete && onComplete())
        .catch(error => onError && onError(error));
    },

    dislikeComment(commentId, {onComplete, onError} = {}) {
      return dislikeCommentMutation(relayEnvironment, commentId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    dislikeTradingCard(tradingCardId, {onComplete, onError} = {}) {
      return dislikeTradingCardMutation(relayEnvironment, tradingCardId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    initiateEmailVerification({onComplete, onError} = {}) {
      return initiateEmailVerificationMutation(relayEnvironment)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    likeComment(commentId, {onComplete, onError} = {}) {
      return likeCommentMutation(relayEnvironment, commentId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    likeTradingCard(tradingCardId, {onComplete, onError} = {}) {
      return likeTradingCardMutation(relayEnvironment, tradingCardId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    makeAnOffer(values, {onComplete, onError} = {}) {
      return makeAnOfferMutation(relayEnvironment, values)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    markOrderAsCompleted(orderId, {onComplete, onError} = {}) {
      return markOrderAsCompletedMutation(relayEnvironment, orderId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    markOrderAsShipped(orderId, {onComplete, onError} = {}) {
      return markOrderAsShippedMutation(relayEnvironment, orderId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    markReadAllNotification({onComplete, onError} = {}) {
      return markReadAllNotificationMutation(relayEnvironment)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    markReturnAsDelivered(orderId, {onComplete, onError} = {}) {
      return markReturnAsDeliveredMutation(relayEnvironment, orderId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    markTradingCardAsFeatured(tradingCardIds, {onComplete, onError} = {}) {
      return markTradingCardAsFeaturedMutation(relayEnvironment, tradingCardIds)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    markTradingCardAsUnfeatured(tradingCardIds, {onComplete, onError} = {}) {
      return markTradingCardAsUnfeaturedMutation(relayEnvironment, tradingCardIds)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    marketingClaimOnboardingCredit({onComplete, onError} = {}) {
      return marketingClaimOnboardingCreditMutation(relayEnvironment)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    redeemReward(referralData, {onComplete, onError} = {}) {
      return redeemRewardMutation(relayEnvironment, referralData)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    rejectOffer(values, {onComplete, onError} = {}) {
      return rejectOfferMutation(relayEnvironment, values)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    removeCardsFromSellersCollection(orderId, {onComplete, onError} = {}) {
      return removeCardsFromSellersCollectionMutation(relayEnvironment, orderId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    removeTradingCardAskingPrice(tradingCardId, {onComplete, onError} = {}) {
      return removeTradingCardAskingPriceMutation(relayEnvironment, tradingCardId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    removeTradingCard(tradingCardId, {onComplete, onError} = {}) {
      return removeTradingCardMutation(relayEnvironment, tradingCardId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    removeTradingCardsFromDeal(sellerId, tradingCardIds, {onComplete, onError} = {}) {
      return removeTradingCardsFromDealMutation(relayEnvironment, sellerId, tradingCardIds)
        .then((deal) => onComplete && onComplete(deal))
        .catch((error) => onError && onError(error));
    },

    removeTradingCardsFromSavedForLater(tradingCardIds, isAddToDeal, {onComplete, onError} = {}) {
      return removeTradingCardsFromSavedForLaterMutation(relayEnvironment, tradingCardIds, isAddToDeal)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    renewDeal(dealId, {onComplete, onError} = {}) {
      return renewDealMutation(relayEnvironment, dealId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    setBalanceToApplyToOrder(orderId, price, {onComplete, onError} = {}) {
      return setBalanceToApplyToOrderMutation(relayEnvironment, orderId, price)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    saveSearch(values, {onComplete, onError} = {}) {
      return saveSearchMutation(relayEnvironment, values)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    setCreditsToApplyToOrder(orderId, price, {onComplete, onError} = {}) {
      return setCreditsToApplyToOrderMutation(relayEnvironment, orderId, price)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    setDefaultAddress(addressId, {onComplete, onError} = {}) {
      return setDefaultAddressMutation(relayEnvironment, addressId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    setRatingOrder(orderId, rating, {onComplete, onError} = {}) {
      return setRatingOrderMutation(relayEnvironment, orderId, rating)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    setSellerAcceptOffer(acceptOffer, {onComplete, onError} = {}) {
      return setSellerAcceptOfferMutation(relayEnvironment, acceptOffer)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    setSellerDiscount(discount, threshold, {onComplete, onError} = {}) {
      return setSellerDiscountMutation(relayEnvironment, discount, threshold)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    setSellerShippingSettings(values, {onComplete, onError} = {}) {
      return setSellerShippingSettingsMutation(relayEnvironment, values)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    setSellerTaxpayerInformation(values, {onComplete, onError} = {}) {
      return setSellerTaxpayerInformationMutation(relayEnvironment, values)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    setShippingAddress(orderId, addressId, {onComplete, onError} = {}) {
      return setShippingAddressMutation(relayEnvironment, orderId, addressId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    setStripePaymentMethod(orderId, paymentMethodId, {onComplete, onError} = {}) {
      return setStripePaymentMethodMutation(relayEnvironment, orderId, paymentMethodId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    setTrackingNumberOnOrder(orderId, trackingNumber, {onComplete, onError} = {}) {
      return setTrackingNumberOnOrderMutation(relayEnvironment, orderId, trackingNumber)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    soldTradingCard(tradingCardId, salePrice, type, {onComplete, onError} = {}) {
      return soldTradingCardMutation(relayEnvironment, tradingCardId, salePrice, type)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    startFollowing(profileId, {onComplete, onError} = {}) {
      return startFollowingProfileMutation(relayEnvironment, profileId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    stopFollowing(profileId, {onComplete, onError} = {}) {
      return stopFollowingProfileMutation(relayEnvironment, profileId)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    updateAddress(addressId, values, {onComplete, onError} = {}) {
      return updateAddressMutation(relayEnvironment, addressId, values)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    updateProfileInLocal(profileData, {onComplete, onError} = {}) {
      return updateProfileInLocalMutation(relayEnvironment, profileData)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    updateProfile(profileData, {onComplete, onError} = {}) {
      return updateProfileMutation(relayEnvironment, profileData)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    updateStripeConnectedAccount(values, {onComplete, onError} = {}) {
      return updateStripeConnectedAccountMutation(relayEnvironment, values)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    updateTradingCardListingPrice(tradingCardId, askingPrice, {onComplete, onError} = {}) {
      return updateTradingCardAskingPriceMutation(relayEnvironment, tradingCardId, askingPrice)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    updateTradingCardImage(tradingCardId, values, {onComplete, onError} = {}) {
      return updateTradingCardImageMutation(relayEnvironment, tradingCardId, values)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    updateTradingCard(tradingCardId, values, {onComplete, onError} = {}) {
      return updateTradingCardMutation(relayEnvironment, tradingCardId, values)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    updateUserType(userType, {onComplete, onError} = {}) {
      return updateUserTypeMutation(relayEnvironment, userType)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    updateUsername(username, {onComplete, onError} = {}) {
      return updateUsernameMutation(relayEnvironment, username)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    useRedemptionCode(code, {onComplete, onError} = {}) {
      return useRedemptionCodeMutation(relayEnvironment, code)
        .then((redemptionCode) => onComplete && onComplete(redemptionCode))
        .catch((error) => onError && onError(error));
    },

    verifyEmail(verificationToken, {onComplete, onError} = {}) {
      return verifyEmailMutation(relayEnvironment, verificationToken)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    withdrawMoney(externalAccountId, amountToRedeem, {onComplete, onError} = {}) {
      return withdrawMoneyMutation(relayEnvironment, externalAccountId, amountToRedeem)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    setUserPrivacySettings(showCollectionValueInApp, showCollectionValueOnWeb, {onComplete, onError} = {}) {
      return setUserPrivacySettingsMutation(relayEnvironment, showCollectionValueInApp, showCollectionValueOnWeb)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

  }
}