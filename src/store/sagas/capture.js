import {Platform} from 'react-native';
import {put, call, select, takeEvery} from 'redux-saga/effects';

import {capture, collection} from '../stores';
import {
  uploadVisualSearch,
  updateUserCardMedia,
  uploadUserCardPhotosToCloud,
} from '../apis';
import {Constants, SchemaTypes, UserCardCategories} from 'globals';
import {
  getImageLink,
  encodeCanonicalCardId,
  encodeScanId,
  isSportCard,
} from 'utils';

function* sleep(sleepSeconds) {
  yield new Promise(resolve => {
    setTimeout(() => {
      resolve(sleepSeconds);
    }, sleepSeconds * 1000);
  });
}

function* searchCardVisualSaga() {
  let captureState = yield select(state => state.capture);

  if (captureState.currentSearchingCard) {
    return;
  }

  while (captureState.searchingCards.length > 0) {
    const userState = yield select(state => state.user);

    if (!userState.user.id) {
      console.log('Search-Card User: Invalid User');
      break;
    }

    const currentCard = captureState.searchingCards.find(card => (
      card.cardState !== Constants.cardSearchState.failedVisualSearch &&
      card.cardState !== Constants.cardSearchState.failedCreate &&
      card.cardState !== Constants.cardSearchState.failedMedia
    ));

    if (!currentCard) {
      break;
    }

    try {
      // sets current card in searching
      yield put(capture.actions.setCurrentSearchingCardSuccess(currentCard));

      const appConfig = yield select(state => state.config.config);
      let visionUrl = null;

      if (appConfig) {
        visionUrl = appConfig.default_vision_endpoint;
        const typeKey = Object.keys(appConfig.type_ids).find(
          item => appConfig.type_ids[item] === currentCard.type,
        );

        if (typeKey) {
          visionUrl = appConfig.vision_endpoints_by_type[typeKey];
        }
      }

      const response = yield call(uploadVisualSearch, visionUrl, currentCard);

      let matchedCard = {};
      let possibleMatches = [];

      if (response && response.cards?.length > 0) {
        possibleMatches = response.cards;

        const mostConfidence = response.results.reduce(
          (prev, current) => prev.confidence > current.confidence ? prev : current
        );

        const bestCard = possibleMatches.find(match => match?.id === mostConfidence?.card_id) || {};

        matchedCard = {
          ...currentCard,
          ...bestCard,
          scanId: response.id,
          type: currentCard.type, // TODO: remove when we got correct type from backend
          cardState: Constants.cardSearchState.detected,
        };
      } else {
        matchedCard = {
          ...currentCard,
          cardState: Constants.cardSearchState.notDetected,
        };
      }

      yield put(
        capture.actions.searchCardVisualSuccess({matchedCard, possibleMatches}),
      );

      // Sleep for "nextSleepForCardUpload" second
      yield sleep(Constants.nextSleepForCardUpload).next().value;
    } catch (error) {
      console.log(`Visual-Search ${error}`);

      console.log('Current Card : ', currentCard);

      const matchedCard = {
        ...currentCard,
        cardState: Constants.cardSearchState.notDetected,
      };

      yield put(
        capture.actions.searchCardVisualSuccess({matchedCard, possibleMatches: []}),
      );

      // Sleeps for "retryTimeoutForFailedCardUpload" second
      yield sleep(Constants.retryTimeoutForFailedCardUpload).next().value;
    }

    // gets the latest updates
    captureState = yield select(state => state.capture);
  }

  // sets current card to null in searching
  yield put(capture.actions.setCurrentSearchingCardSuccess(null));
}

function* addCapturedCardSaga({payload}) {
  try {
    const currentCard = {
      ...payload,
      cardState: Constants.cardSearchState.searching,
    };

    yield put(capture.actions.addCapturedCardSuccess(currentCard));
  } catch (error) {
    console.log('Error : ', error);
    yield put(capture.actions.addCapturedCardFailure());
  }
}

function* createUserCardsSaga() {
  let captureState = yield select(state => state.capture);

  if (captureState.currentUserCard) {
    return;
  }

  const mutationActions = captureState.mutationActions;

  if (!mutationActions) {
    console.log('Create-Card Mutation: Invalid Mutation Actions');
    return;
  }

  while (captureState.searchedCards.length > 0) {
    const userState = yield select(state => state.user);

    if (!userState.user.id) {
      console.log('Create-Card User: Invalid User');
      break;
    }

    const searchedCard = captureState.searchedCards.find(card => (
      card.cardState !== Constants.cardSearchState.failedVisualSearch &&
      card.cardState !== Constants.cardSearchState.failedCreate &&
      card.cardState !== Constants.cardSearchState.failedMedia
    ));

    if (!searchedCard) {
      break;
    }

    // gets first card in the queue
    const currentCard = captureState.capturedCards.find(
      card => card.uuid === searchedCard.uuid,
    );

    if (!currentCard) {
      console.log('Create-Card Card: Invalid UserCard');
      break;
    }

    try {
      // sets current card in creating
      yield put(capture.actions.setCurrentUserCardSuccess(currentCard));

      let from = null;
      if (currentCard.scanId) {
        from = {
          scanId: encodeScanId(currentCard.scanId),
        };
      } else if (currentCard.id) {
        from = {
          cardId: encodeCanonicalCardId(currentCard.type, currentCard.id),
        };
      }

      const withValues = {
        pending: true,
        platform: Platform.OS.toUpperCase(),
        source: currentCard.source?.toUpperCase() ,
        captureType: currentCard.captureType || SchemaTypes.captureType.captureType.UNKNOWN,
      };

      const cardType = UserCardCategories.find(item => item.value === currentCard.type);
      if (cardType) {
        if (isSportCard(currentCard.type)) {
          // Sport Card
          withValues.sport = cardType.sport;
        } else {
          // Game Card
          withValues.game = cardType.game;
        }
      }

      const userCardResponse = yield call(
        mutationActions.createTradingCardAsync,
        from,
        withValues,
      );

      if (!userCardResponse && !userCardResponse.id) {
        throw new Error('Server Error: Invalid User Card');
      }

      let cardState = currentCard.cardState;
      if (!currentCard.id) {
        cardState = Constants.cardSearchState.notDetected;
      } else if (
        currentCard.cardState !== Constants.cardSearchState.notDetected &&
        currentCard.cardState !== Constants.cardSearchState.retryingUploadMedia
      ) {
        cardState = Constants.cardSearchState.created;
      }

      yield put(
        capture.actions.createUserCardsSuccess({
          ...currentCard,
          cardState,
          tradingCardId: userCardResponse.id,
          frontImageUrl: currentCard.front,
          backImageUrl: currentCard.back,
          frontImageUploadUrl: userCardResponse.viewer?.frontImageUploadUrl,
          backImageUploadUrl: userCardResponse.viewer?.backImageUploadUrl,
        }),
      );

      // Sleeps for "nextSleepForCardUpload" second
      yield sleep(Constants.nextSleepForCardUpload).next().value;
    } catch (error) {
      console.log(`Create-Card ${error}`);

      console.log('Current Card: ', currentCard);

      const errorText = error.message;

      yield put(
        capture.actions.createUserCardsFailure({
          currentCard: {
            ...currentCard,
            cardState: Constants.cardSearchState.failedCreate,
          },
          errorText,
        }),
      );

      // Sleeps for "retryTimeoutForFailedCardUpload" second
      yield sleep(Constants.retryTimeoutForFailedCardUpload).next().value;
    }

    // gets the latest updates
    captureState = yield select(state => state.capture);
  }

  yield put(capture.actions.setCurrentUserCardSuccess(null));
}

function* uploadUserCardMediasSaga() {
  let captureState = yield select(state => state.capture);

  if (captureState.currentUserCardMedia) {
    return;
  }

  const mutationActions = captureState.mutationActions;

  if (!mutationActions) {
    console.log('Create-Card-Media: Invalid Mutation Actions');
    return;
  }

  while (captureState.uploadingCardMedias.length > 0) {
    const userState = yield select(state => state.user);

    if (!userState.user.id) {
      console.log('Create-Card-Media User: Invalid User');
      break;
    }

    const uploadingCard = captureState.uploadingCardMedias.find(card => (
      card.cardState !== Constants.cardSearchState.failedVisualSearch &&
      card.cardState !== Constants.cardSearchState.failedCreate &&
      card.cardState !== Constants.cardSearchState.failedMedia
    ));

    if (!uploadingCard) {
      break;
    }

    // gets first card in the queue
    const currentCard = captureState.capturedCards.find(
      card => card.uuid === uploadingCard.uuid,
    );

    if (!currentCard) {
      console.log('Create-Card-Media Card: Invalid UserCard');
      break;
    }

    try {
      // sets current card in uploading
      yield put(capture.actions.setCurrentUserCardMediaSuccess(currentCard));

      let moreUserCard = {};

      if (currentCard.tradingCardId && (currentCard.frontImageUploadUrl || currentCard.backImageUploadUrl)) {
        // Uploads to Google Could
        const imageValues = yield call(uploadUserCardPhotosToCloud, currentCard);

        if (imageValues && Object.keys(imageValues).length) {
          yield call(
            mutationActions.updateTradingCardImage,
            currentCard?.tradingCardId,
            imageValues,
          );

          moreUserCard = {
            ...currentCard,
            frontImageUrl: imageValues.frontImageUploadUrl ? getImageLink(imageValues.frontImageUploadUrl) : currentCard.frontImageUrl,
            backImageUrl: imageValues.backImageUploadUrl ? getImageLink(imageValues.backImageUploadUrl) : currentCard.backImageUrl,
          };
        }
      } else {
        // Uploads to our backend
        const userCard = {
          userId: userState.user.id,
          userCardId: currentCard.id,
          frontImage: currentCard.frontImageUrl,
          backImage: currentCard.backImageUrl,
        };

        const userCardResponse = yield call(updateUserCardMedia, userCard);

        moreUserCard = {
          ...currentCard,
          ...userCardResponse,
        };
      }

      let cardState = currentCard.cardState;
      if (currentCard.cardState !== Constants.cardSearchState.notDetected &&
        currentCard.cardState !== Constants.cardSearchState.retryingCreate
      ) {
        cardState = Constants.cardSearchState.created;
      }

      yield put(
        capture.actions.uploadUserCardMediasSuccess({
          ...uploadingCard,
          ...moreUserCard,
          cardState,
          completed: true,
        }),
      );

      // Sleeps for "nextSleepForCardUpload" second
      yield sleep(Constants.nextSleepForCardUpload).next().value;

    } catch (error) {
      console.log(`Create-Card-Media ${error}`);

      console.log('Current Card: ', currentCard);

      const errorText = error.message;

      yield put(
        capture.actions.uploadUserCardMediasFailure({
          currentCard: {
            ...currentCard,
            cardState: Constants.cardSearchState.failedMedia,
          },
          errorText,
        }),
      );

      // Sleeps for "retryTimeoutForFailedCardUpload" second
      yield sleep(Constants.retryTimeoutForFailedCardUpload).next().value;
    }

    // gets the latest updates
    captureState = yield select(state => state.capture);
  }

  yield put(capture.actions.setCurrentUserCardMediaSuccess(null));
}

function* updateCapturedCardSaga({payload}) {
  try {
    yield put(capture.actions.updateCapturedCardSuccess(payload));
  } catch (error) {
    console.log('updateCapturedCardSaga Error : ', error);
    yield put(capture.actions.updateCapturedCardFailure());
  }
}

function* removeCapturedCardSaga({payload}) {
  try {
    const {card} = payload;
    yield put(capture.actions.removeCapturedCardSuccess(card));
  } catch (error) {
    console.log('removeCapturedCardSaga Error : ', error);
    if (error?.message?.includes('500')) {
      const {card} = payload;
      yield put(capture.actions.removeCapturedCardSuccess(card));
      return;
    }
    yield put(capture.actions.removeCapturedCardFailure());
  }
}

function* resetCapturedCardSaga() {
  try {
    yield put(capture.actions.resetCapturedCardSuccess());
  } catch (error) {
    console.log('Error : ', error);
    yield put(capture.actions.resetCapturedCardFailure());
  }
}

function* confirmUserCardSaga({payload}) {
  const {cards} = payload;

  try {
    if (cards.length) {
      yield put(collection.actions.updateUserCardsCount());

      yield put(capture.actions.confirmUserCardSuccess(cards));
    }
  } catch (error) {
    console.log('confirmUserCardSaga Error : ', error);
    const errorText = error.message;
    yield put(capture.actions.confirmUserCardFailure({errorText}));
  }
}

function* reuploadVisualSearchSaga({payload}) {
  try {
    yield put(capture.actions.reuploadVisualSearchSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(capture.actions.reuploadVisualSearchFailure(payload));
  }
}

function* recreateUserCardSaga({payload}) {
  try {
    yield put(capture.actions.recreateUserCardSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(capture.actions.recreateUserCardFailure());
  }
}

function* reuploadUserCardMediaSaga({payload}) {
  try {
    yield put(capture.actions.reuploadUserCardMediaSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(capture.actions.reuploadUserCardMediaFailure());
  }
}

function* setCapturedCardsSaga({payload}) {
  try {
    yield put(capture.actions.setCapturedCardsSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(capture.actions.setCapturedCardsFailure());
  }
}

function* setShowScanningCategorySaga({payload}) {
  try {
    yield put(capture.actions.setShowScanningCategorySuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(capture.actions.setShowScanningCategoryFailure());
  }
}

function* addPossibleMatchCardsSaga({payload}) {
  try {
    yield put(capture.actions.setPossibleMatchCardsSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(capture.actions.setPossibleMatchCardsFailure());
  }
}

function* setMutationActionsSaga({payload}) {
  try {
    yield put(capture.actions.setMutationActionsSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(capture.actions.setMutationActionsFailure());
  }
}

export default function* captureSaga() {
  yield takeEvery(capture.actions.searchCardVisual, searchCardVisualSaga);
  yield takeEvery(capture.actions.addCapturedCard, addCapturedCardSaga);
  yield takeEvery(capture.actions.createUserCards, createUserCardsSaga);
  yield takeEvery(capture.actions.uploadUserCardMedias, uploadUserCardMediasSaga);
  yield takeEvery(capture.actions.updateCapturedCard, updateCapturedCardSaga);
  yield takeEvery(capture.actions.removeCapturedCard, removeCapturedCardSaga);
  yield takeEvery(capture.actions.resetCapturedCard, resetCapturedCardSaga);
  yield takeEvery(capture.actions.confirmUserCard, confirmUserCardSaga);
  yield takeEvery(capture.actions.setCapturedCards, setCapturedCardsSaga);
  yield takeEvery(capture.actions.reuploadUserCardMedia, reuploadUserCardMediaSaga);
  yield takeEvery(capture.actions.recreateUserCard, recreateUserCardSaga);
  yield takeEvery(capture.actions.reuploadVisualSearch, reuploadVisualSearchSaga);
  yield takeEvery(capture.actions.setShowScanningCategory, setShowScanningCategorySaga);
  yield takeEvery(capture.actions.setPossibleMatchCards, addPossibleMatchCardsSaga);
  yield takeEvery(capture.actions.setMutationActions, setMutationActionsSaga);
}
