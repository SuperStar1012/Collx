import {createSlice} from '@reduxjs/toolkit';

import {Constants} from 'globals';
import user from './user';

const initialState = {
  searchModalMode: Constants.none,
  onBackSearch: null,
  selectedCategory: null,
  mainFilterOptions: null,
  modalFilterOptions: null,
};

const search = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchModalMode: () => {},
    setSearchModalModeSuccess: (state, {payload}) => {
      state.searchModalMode = payload;
    },
    setSearchModalModeFailure: () => {},
    setHandleSearchBack: () => {},
    setHandleSearchBackSuccess: (state, {payload}) => {
      state.onBackSearch = payload;
    },
    setHandleSearchBackFailure: () => {},
    setSearchCategory: () => {},
    setSearchCategorySuccess: (state, {payload}) => {
      state.selectedCategory = payload;
    },
    setSearchCategoryFailure: () => {},
    setMainFilterOptions: () => {},
    setMainFilterOptionsSuccess: (state, {payload}) => {
      state.mainFilterOptions = payload;
    },
    setMainFilterOptionsFailure: () => {},
    setModalFilterOptions: () => {},
    setModalFilterOptionsSuccess: (state, {payload}) => {
      state.modalFilterOptions = payload;
    },
    setModalFilterOptionsFailure: () => {},
  },
  extraReducers: builder => {
    builder.addCase(user.actions.signOut, () => {
      return initialState;
    });
  },
});

export default search;
