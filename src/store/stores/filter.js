import {createSlice} from '@reduxjs/toolkit';

import user from './user';
import {Constants} from 'globals';
import {encodeId} from 'utils';

const initialState = {
  isFetching: false,
  sort: {}, // selected sort by user
  filter: {}, // selected filter by user
  cardFilters: {},
  drawerOpenMode: {},
  isEnabledPreserveSettings: false,
  errorText: '',
};

const filter = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSort: () => {},
    setSortSuccess: (state, {payload}) => {
      const {profileId, sort_by} = payload;

      state.sort[profileId] = {sort_by};
    },
    setFilter: () => {},
    setFilterSuccess: (state, {payload}) => {
      const {profileId, filter_by} = payload;

      state.filter[profileId] = filter_by;
    },
    setDrawerOpenMode: () => {},
    setDrawerOpenModeSuccess: (state, {payload}) => {
      const {profileId, drawerOpenMode} = payload;

      state.drawerOpenMode[profileId] = drawerOpenMode;
    },
    setEnabledPreserveSettings: () => {},
    setEnabledPreserveSettingsSuccess: (state, {payload}) => {
      state.isEnabledPreserveSettings = payload;
    },
    getUserCardFilters: state => {
      state.isFetching = true;
      state.errorText = '';
    },
    getUserCardFiltersSuccess: (state, {payload}) => {
      const {userId, cardFilters} = payload;
      const profileId = encodeId(Constants.base64Prefix.profile, userId);

      state.isFetching = false;
      state.cardFilters[profileId] = cardFilters;
    },
    getUserCardFiltersFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
  },
  extraReducers: builder => {
    builder.addCase(user.actions.signOut, () => {
      return initialState;
    });
  },
});

export default filter;
