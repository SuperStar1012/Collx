import {put, call, takeEvery} from 'redux-saga/effects';

import {card} from '../stores';
import {
  getCards,
  getUserCard,
  getSaleUserCards,
} from '../apis';

function* searchCardsSaga({payload}) {
  try {
    const result = yield call(getCards, payload);
    yield put(card.actions.searchCardsSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(card.actions.searchCardsFailure({errorText}));
  }
}

function* searchSaleCardsSaga({payload}) {
  try {
    const result = yield call(getSaleUserCards, payload);
    yield put(card.actions.searchSaleCardsSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(card.actions.searchSaleCardsFailure({errorText}));
  }
}

function* resetSearchedCardsSaga() {
  try {
    yield put(card.actions.resetSearchedCardsSuccess());
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(card.actions.resetSearchedCardsFailure({errorText}));
  }
}

function* getUserCardSaga({payload}) {
  try {
    const result = yield call(getUserCard, payload);
    yield put(card.actions.getUserCardSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(card.actions.getUserCardFailure({errorText}));
  }
}

export default function* cardSaga() {
  yield takeEvery(card.actions.searchCards, searchCardsSaga);
  yield takeEvery(card.actions.searchSaleCards, searchSaleCardsSaga);
  yield takeEvery(card.actions.resetSearchedCards, resetSearchedCardsSaga);
  yield takeEvery(card.actions.getUserCard, getUserCardSaga);
}
