/* eslint-disable no-undef */
import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import {createLogger} from 'redux-logger';
import {Provider} from 'react-redux';

import {rootReducer} from './stores';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const customConfigureStore = () => {
  let middlewares = [];

  if (__DEV__) {
    middlewares.push(createLogger());
  }

  middlewares.push(sagaMiddleware)

  const store = configureStore({
    reducer: rootReducer,
    middleware: [...middlewares],
  });

  sagas.forEach(saga => sagaMiddleware.run(saga));
  return {Provider, store};
};
