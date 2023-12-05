import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isFetchingExportCollection: false,
  isSettingExportCollection: false,
  isSettingPrintChecklist: false,
  isDidPrintChecklist: false,
  userCardsActionCount: 0,
  exportCollection: [],
  errorText: '',
};

const collection = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    updateUserCardsCount: () => {},
    updateUserCardsCountSuccess: (state) => {
      state.userCardsActionCount += 1;
    },
    updateUserCardsCountFailure: () => {},
    getExportCollection: (state) => {
      state.isFetchingExportCollection = true;
      state.exportCollection = [];
    },
    getExportCollectionSuccess: (state, {payload}) => {
      state.isFetchingExportCollection = false;
      state.exportCollection = payload || [];
    },
    getExportCollectionFailure: (state) => {
      state.isFetchingExportCollection = false;
    },
    setExportCollection: (state) => {
      state.isSettingExportCollection = true;
    },
    setExportCollectionSuccess: (state, {payload}) => {
      state.isSettingExportCollection = false;
      if (payload) {
        state.exportCollection.unshift(payload);
      }
    },
    setExportCollectionFailure: (state) => {
      state.isSettingExportCollection = false;
    },
    setPrintChecklist: (state) => {
      state.isSettingPrintChecklist = true;
      state.isDidPrintChecklist = false;
    },
    setPrintChecklistSuccess: (state, {payload}) => {
      state.isSettingPrintChecklist = false;
      state.isDidPrintChecklist = true;

      if (payload) {
        state.exportCollection.unshift(payload);
      }
    },
    setPrintChecklistFailure: (state) => {
      state.isSettingPrintChecklist = false;
    },
  },
  extraReducers: builder => {
    builder.addCase(user.actions.signOut, () => {
      return initialState;
    });
  },
});

export default collection;
