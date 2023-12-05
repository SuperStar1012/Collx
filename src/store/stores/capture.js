import {createSlice} from '@reduxjs/toolkit';

import user from './user';
import {Constants} from 'globals';
import {
  removeStorageItem,
  decodeId,
} from 'utils';

const initialState = {
  isFetching: false,
  errorText: '',
  capturedCards: [],
  updatedCardIds: [],
  uploadingCardMedias: [],

  // visual search
  searchingCards: [],
  possibleMatchCards: {},
  searchedCards: [],
  currentSearchingCard: null,
  currentUserCard: null,
  currentUserCardMedia: null,
  mutationActions: null, // graphql mutation
  isShowScanningCategory: false,
};

const capture = createSlice({
  name: 'capture',
  initialState,
  reducers: {
    addCapturedCard: () => {},
    addCapturedCardSuccess: (state, {payload}) => {
      state.capturedCards.push(payload);
      state.searchingCards.push(payload);
    },
    addCapturedCardFailure: () => {},
    updateCapturedCard: () => {},
    updateCapturedCardSuccess: (state, {payload}) => {
      const index = state.capturedCards.findIndex(
        card => card.uuid === payload.uuid,
      );

      if (index > -1) {
        const newCard = {};

        // delete newCard.frontImageUrl;
        // delete newCard.frontImageThumbnailUrl;
        // delete newCard.backImageUrl;
        // delete newCard.backImageThumbnailUrl;

        if (payload.cardId) {
          const [, cardId] = decodeId(payload.cardId);
          newCard.id = Number(cardId);
        }

        state.capturedCards[index] = {
          ...state.capturedCards[index],
          ...newCard,
          cardState: payload.cardState || Constants.cardSearchState.updated,
        };

        if (!state.updatedCardIds.includes(payload.uuid)) {
          state.updatedCardIds.push(payload.uuid);
        }
      }
    },
    updateCapturedCardFailure: () => {},
    removeCapturedCard: () => {},
    removeCapturedCardSuccess: (state, {payload}) => {
      state.searchingCards = state.searchingCards.filter(
        card => card.uuid !== payload.uuid,
      );

      state.searchedCards = state.searchedCards.filter(
        card => card.uuid !== payload.uuid,
      );

      state.capturedCards = state.capturedCards.filter(
        card => card.uuid !== payload.uuid,
      );

      state.uploadingCardMedias = state.uploadingCardMedias.filter(
        card => card.uuid !== payload.uuid,
      );

      delete state.possibleMatchCards[payload.uuid];
    },
    removeCapturedCardFailure: () => {},

    setCurrentSearchingCard: () => {},
    setCurrentSearchingCardSuccess: (state, {payload}) => {
      state.currentSearchingCard = payload;
    },
    setCurrentSearchingCardFailure: state => {
      state.currentSearchingCard = null;
    },
    searchCardVisual: state => {
      // state.isFetching = true;
      state.errorText = '';
    },
    searchCardVisualSuccess: (state, {payload}) => {
      // state.isFetching = false;
      const {matchedCard, possibleMatches} = payload;

      const searchingIndex = state.searchingCards.findIndex(
        card => card.uuid === matchedCard.uuid,
      );

      if (searchingIndex > -1) {
        state.searchedCards.push(matchedCard);

        if (possibleMatches?.length > 0) {
          state.possibleMatchCards[matchedCard.uuid] = possibleMatches;
        }
      }

      const cardIndex = state.capturedCards.findIndex(
        card => card.uuid === matchedCard.uuid,
      );

      if (cardIndex > -1) {
        state.capturedCards[cardIndex] = {
          ...state.capturedCards[cardIndex],
          ...matchedCard,
        };
      }

      state.searchingCards = state.searchingCards.filter(
        card => card.uuid !== matchedCard.uuid,
      );
    },
    searchCardVisualFailure: (state, {payload}) => {
      const {currentCard, errorText} = payload;

      const cardIndex = state.capturedCards.findIndex(
        card => card.uuid === currentCard.uuid,
      );

      if (cardIndex > -1) {
        state.capturedCards[cardIndex] = {
          ...state.capturedCards[cardIndex],
          ...currentCard,
        };
      }

      const searchingIndex = state.searchingCards.findIndex(
        card => card.uuid === currentCard.uuid,
      );

      if (searchingIndex > -1) {
        state.searchingCards[searchingIndex] = currentCard;
      }

      state.errorText = errorText;
    },

    createUserCards: state => {
      // state.isFetching = true;
      state.errorText = '';
    },
    createUserCardsSuccess: (state, {payload}) => {
      // state.isFetching = false;
      const cardIndex = state.capturedCards.findIndex(
        card => card.uuid === payload.uuid,
      );

      if (cardIndex > -1) {
        state.capturedCards[cardIndex] = {
          ...state.capturedCards[cardIndex],
          ...payload,
        };
      }

      const uploadingIndex = state.uploadingCardMedias.findIndex(
        card => card.uuid === payload.uuid,
      );

      if (cardIndex > -1 && uploadingIndex === -1) {
        state.uploadingCardMedias.push({
          ...state.capturedCards[cardIndex],
          ...payload,
        });
      }

      state.searchedCards = state.searchedCards.filter(
        card => card.uuid !== payload.uuid,
      );

      // if (
      //   state.currentUserCard &&
      //   state.currentUserCard.uuid === payload.uuid
      // ) {
      //   state.currentUserCard = null;
      // }
    },
    createUserCardsFailure: (state, {payload}) => {
      const {currentCard, errorText} = payload;

      const cardIndex = state.capturedCards.findIndex(
        card => card.uuid === currentCard.uuid,
      );

      if (cardIndex > -1) {
        state.capturedCards[cardIndex] = {
          ...state.capturedCards[cardIndex],
          ...currentCard,
        };
      }

      const searchingIndex = state.searchedCards.findIndex(
        card => card.uuid === currentCard.uuid,
      );

      if (searchingIndex > -1) {
        state.searchedCards[searchingIndex] = currentCard;
      }

      state.errorText = errorText;
    },
    setCurrentUserCard: () => {},
    setCurrentUserCardSuccess: (state, {payload}) => {
      state.currentUserCard = payload;
    },
    setCurrentUserCardFailure: state => {
      state.currentUserCard = null;
    },
    uploadUserCardMedias: state => {
      // state.isFetching = true;
      state.errorText = '';
    },
    uploadUserCardMediasSuccess: (state, {payload}) => {
      // state.isFetching = false;
      const cardIndex = state.capturedCards.findIndex(
        card => card.uuid === payload.uuid,
      );

      if (cardIndex > -1) {
        state.capturedCards[cardIndex] = {
          ...state.capturedCards[cardIndex],
          ...payload,
        };
      }

      state.uploadingCardMedias = state.uploadingCardMedias.filter(
        card => card.uuid !== payload.uuid,
      );
    },
    uploadUserCardMediasFailure: (state, {payload}) => {
      const {currentCard, errorText} = payload;

      const cardIndex = state.capturedCards.findIndex(
        card => card.uuid === currentCard.uuid,
      );

      if (cardIndex > -1) {
        state.capturedCards[cardIndex] = {
          ...state.capturedCards[cardIndex],
          ...currentCard,
        };
      }

      const uploadingIndex = state.uploadingCardMedias.findIndex(
        card => card.uuid === currentCard.uuid,
      );

      if (uploadingIndex > -1) {
        state.uploadingCardMedias[uploadingIndex] = {
          ...state.uploadingCardMedias[uploadingIndex],
          ...currentCard,
        };
      }

      state.errorText = errorText;
    },
    setCurrentUserCardMedia: () => {},
    setCurrentUserCardMediaSuccess: (state, {payload}) => {
      state.currentUserCardMedia = payload;
    },
    setCurrentUserCardMediaFailure: state => {
      state.currentUserCardMedia = null;
    },
    confirmUserCard: state => {
      state.isFetching = true;
      state.errorText = '';
    },
    confirmUserCardSuccess: (state, {payload}) => {
      // reset
      state.isFetching = false;
      const addedCards = payload;

      if (addedCards.length === state.capturedCards.length) {
        state.capturedCards = [];
        state.searchingCards = [];
        state.searchedCards = [];
        state.uploadingCardMedias = [];
        state.updatedCardIds = [];
        state.possibleMatchCards = {};
        state.currentSearchingCard = null;
        state.currentUserCard = null;
        state.currentUserCardMedia = null;

        removeStorageItem(Constants.cardUploadInfo);
      } else {
        state.capturedCards = state.capturedCards.filter(
          captureCard => addedCards.findIndex(card => card.uuid === captureCard.uuid) === -1,
        );

        state.searchingCards = state.searchingCards.filter(
          searchingCard => addedCards.findIndex(card => card.uuid === searchingCard.uuid) === -1,
        );

        state.searchedCards = state.searchedCards.filter(
          searchedCard => addedCards.findIndex(card => card.uuid === searchedCard.uuid) === -1,
        );

        state.uploadingCardMedias = state.uploadingCardMedias.filter(
          uploadingCard => addedCards.findIndex(card => card.uuid === uploadingCard.uuid) === -1,
        );

        state.updatedCardIds = state.updatedCardIds.filter(
          cardId => addedCards.findIndex(card => card.uuid === cardId) === -1,
        );

        addedCards.map(card => {
          delete state.possibleMatchCards[card.uuid];
        });
      }
    },
    confirmUserCardFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
    setCapturedCards: () => {},
    setCapturedCardsSuccess: (state, {payload}) => {
      state.capturedCards = payload.capturedCards || [];
      state.searchingCards = payload.searchingCards || [];
      state.searchedCards = payload.searchedCards || [];
      state.uploadingCardMedias = payload.uploadingCardMedias || [];
      state.possibleMatchCards = payload.possibleMatchCards || {};
    },
    setCapturedCardsFailure: () => {},
    reuploadVisualSearch: state => {
      state.errorText = '';
    },
    reuploadVisualSearchSuccess: (state, {payload}) => {
      const currentCard = payload;

      const cardIndex = state.capturedCards.findIndex(
        card => card.uuid === currentCard.uuid,
      );

      if (cardIndex > -1) {
        state.capturedCards[cardIndex] = {
          ...state.capturedCards[cardIndex],
          ...currentCard,
          cardState: Constants.cardSearchState.searching,
        };
      }

      const searchingIndex = state.searchingCards.findIndex(
        card => card.uuid === currentCard.uuid,
      );

      if (searchingIndex > -1) {
        state.searchingCards[searchingIndex] = {
          ...state.searchingCards[searchingIndex],
          cardState: Constants.cardSearchState.searching,
        };
      }
    },
    reuploadVisualSearchFailure: () => {},
    recreateUserCard: state => {
      state.errorText = '';
    },
    recreateUserCardSuccess: (state, {payload}) => {
      const currentCard = payload;

      const cardIndex = state.capturedCards.findIndex(
        card => card.uuid === currentCard.uuid,
      );

      const cardState = Constants.cardSearchState.retryingCreate;

      if (cardIndex > -1) {
        state.capturedCards[cardIndex] = {
          ...state.capturedCards[cardIndex],
          ...currentCard,
          cardState,
        };
      }

      const searchedIndex = state.searchedCards.findIndex(
        card => card.uuid === currentCard.uuid,
      );

      if (searchedIndex > -1) {
        state.searchedCards[searchedIndex] = {
          ...state.searchedCards[searchedIndex],
          cardState,
        };
      }

      // const uploadingIndex = state.uploadingCardMedias.findIndex(
      //   card => card.uuid === currentCard.uuid,
      // );

      // if (uploadingIndex > -1) {
      //   state.uploadingCardMedias[uploadingIndex] = {
      //     ...state.uploadingCardMedias[uploadingIndex],
      //     ...currentCard,
      //     cardState,
      //   };
      // }
    },
    recreateUserCardFailure: () => {},
    reuploadUserCardMedia: state => {
      state.errorText = '';
    },
    reuploadUserCardMediaSuccess: (state, {payload}) => {
      const currentCard = payload;

      const cardState = Constants.cardSearchState.retryingUploadMedia;

      const cardIndex = state.capturedCards.findIndex(
        card => card.uuid === currentCard.uuid,
      );

      if (cardIndex > -1) {
        state.capturedCards[cardIndex] = {
          ...state.capturedCards[cardIndex],
          ...currentCard,
          cardState,
        };
      }

      const searchedIndex = state.searchedCards.findIndex(
        card => card.uuid === currentCard.uuid,
      );

      if (searchedIndex > -1) {
        state.searchedCards[searchedIndex] = {
          ...state.searchedCards[searchedIndex],
          cardState,
        };
      }

      const uploadingIndex = state.uploadingCardMedias.findIndex(
        card => card.uuid === currentCard.uuid,
      );

      if (uploadingIndex > -1) {
        state.uploadingCardMedias[uploadingIndex] = {
          ...state.uploadingCardMedias[uploadingIndex],
          ...currentCard,
          cardState,
        };
      }
    },
    reuploadUserCardMediaFailure: () => {},
    setMutationActions: () => {},
    setMutationActionsSuccess: (state, {payload}) => {
      state.mutationActions = payload;
    },
    setMutationActionsFailure: () => {},
    setShowScanningCategory: () => {},
    setShowScanningCategorySuccess: (state, {payload}) => {
      state.isShowScanningCategory = payload;
    },
    setShowScanningCategoryFailure: state => {
      state.isShowScanningCategory = false;
    },
    setPossibleMatchCards: () => {},
    setPossibleMatchCardsSuccess: (state, {payload}) => {
      state.possibleMatchCards[payload.uuid] = [...payload.cards];
    },
    setPossibleMatchCardsFailure: () => {},
    resetCapturedCard: () => {},
    resetCapturedCardSuccess: state => {
      state.capturedCards = [];
      state.updatedCardIds = [];
      state.searchingCards = [];
      state.possibleMatchCards = {};
      state.currentSearchingCard = null;
      state.searchedCards = [];
      state.uploadingCardMedias = [];
      state.currentUserCard = null;
      state.currentUserCardMedia = null;
      // state.mutationActions = null;
    },
    resetCapturedCardFailure: () => {},
  },
  extraReducers: builder => {
    builder.addCase(user.actions.signOut, () => {
      return initialState;
    });
  },
});

export default capture;
