import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isFetching: false,
  errorText: '',
  players: [],
  playerYears: [],
};

const player = createSlice({
  name: 'player',
  initialState,
  reducers: {
    getPlayers: (state, {payload}) => {
      const {offset} = payload;
      if (offset === 0) {
        state.players = [];
        state.playerYears = [];
      }

      state.isFetching = true;
      state.errorText = '';
    },
    getPlayersSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.players.push(...payload);
    },
    getPlayersFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
    getPlayerYears: state => {
      state.isFetching = true;
      state.playerYears = [];
      state.errorText = '';
    },
    getPlayerYearsSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.playerYears = payload;
    },
    getPlayerYearsFailure: (state, {payload}) => {
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

export default player;
