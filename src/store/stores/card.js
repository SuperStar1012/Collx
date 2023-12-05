import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isFetching: false,
  isFetchingCard: false,
  isFetchingSaleCard: false,
  errorText: '',
  searchedCards: [],
  searchedSaleCards: [],
  userCardDetails: {},
};

const card = createSlice({
  name: 'card',
  initialState,
  reducers: {
    searchCards: (state, {payload}) => {
      const {offset} = payload;
      if (offset === 0) {
        state.searchedCards = [];
      }

      state.isFetchingCard = true;
      state.errorText = '';
    },
    searchCardsSuccess: (state, {payload}) => {
      state.isFetchingCard = false;
      state.searchedCards.push(...payload);
    },
    searchCardsFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingCard = false;
      state.errorText = errorText;
    },
    searchSaleCards: (state, {payload}) => {
      const {offset} = payload;
      if (offset === 0) {
        state.searchedSaleCards = [];
      }

      state.isFetchingSaleCard = true;
      state.errorText = '';
    },
    searchSaleCardsSuccess: (state, {payload}) => {
      state.isFetchingSaleCard = false;
      state.searchedSaleCards.push(...payload);
    },
    searchSaleCardsFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingSaleCard = false;
      state.errorText = errorText;
    },
    getUserCard: (state) => {
      state.isFetching = true;
      state.errorText = '';
    },
    getUserCardSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.userCardDetails[payload.id] = payload;
    },
    getUserCardFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
    resetSearchedCards: () => {},
    resetSearchedCardsSuccess: state => {
      state.searchedCards = [];
      state.searchedSaleCards = [];
    },
    resetSearchedCardsFailure: () => {},
  },
  extraReducers: builder => {
    builder.addCase(user.actions.signOut, () => {
      return initialState;
    });
  },
});

export default card;
