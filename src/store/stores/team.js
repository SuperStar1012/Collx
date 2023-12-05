import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isFetching: false,
  errorText: '',
  teamLeagues: [],
  teamYears: [],
};

const team = createSlice({
  name: 'team',
  initialState,
  reducers: {
    getTeamLeagues: state => {
      state.isFetching = true;
      state.teamLeagues = [];
      state.teamYears = [];
      state.errorText = '';
    },
    getTeamLeaguesSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.teamLeagues = payload;
    },
    getTeamLeaguesFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
    getTeamYears: state => {
      state.isFetching = true;
      state.teamYears = [];
      state.errorText = '';
    },
    getTeamYearsSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.teamYears = payload;
    },
    getTeamYearsFailure: (state, {payload}) => {
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

export default team;
