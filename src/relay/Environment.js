import {Environment, Network, RecordSource, Store, Observable} from 'relay-runtime';
import {commitLocalUpdate} from 'react-relay';
import axios from 'axios';
import {create} from '@absinthe/socket';
import {Socket as PhoenixSocket} from 'phoenix';
import {createSubscriber} from '@absinthe/socket-relay';
import Config from 'react-native-config';

import {sentryCaptureException} from 'services';

let appAuthToken = undefined;

const environment = new Environment({
  network: Network.create(
    (operation, variables) => {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (appAuthToken) {
        headers['Authorization'] = `Bearer ${appAuthToken}`;
      }

      return axios({
        method: 'POST',
        headers: headers,
        data: JSON.stringify({
          query: operation.text,
          variables,
        }),
        baseURL: Config.GRAPHQL_BASE_URL,
      })
      .then(response => response.data)
      .then(response => {
        if (!response) {
          captureException(operation.name, operation.operationKind, variables, 'Request Failed');
          throw new Error('Server Error: Request Failed');
        } else if (response?.errors && response?.errors.length > 0) {
          captureException(operation.name, operation.operationKind, variables, response.errors[0].message, response.errors);
          throw new Error(`Server Error: ${response.errors[0].message}`);
        } else if (!response.data) {
          captureException(operation.name, operation.operationKind, variables, 'No Data');
          throw new Error('Server Error: No Data');
        }
        return response;
      })
      .catch(error => {
        console.log("Relay Environment Token: ", appAuthToken);
        console.log("Relay Environment operation name: ", operation.name);
        console.log("Relay Environment operation operationKind: ", operation.operationKind);
        console.log("Relay Environment variables: ", variables);
        console.log("Relay Environment Error: ", error);
        throw error;
      });
    },
    (request, variables, cacheConfig) => {
      const websocketUrl = `${Config.GRAPHQL_WEBSOCKET_URL}?Authorization=Bearer%20${appAuthToken}&vsn=2.0.0`;
      const websocket = create(new PhoenixSocket(websocketUrl));
      const legacySubscribe = createSubscriber(websocket);
      return Observable.create((sink) => {
        legacySubscribe(
          request,
          variables,
          cacheConfig,
          {
            onNext: sink.next,
            onError: sink.error,
            onCompleted: sink.complete,
          },
        );
      });
    },
  ),
  store: new Store(new RecordSource()),
});

environment.setBearerToken = (token) => {
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    console.log(`Bearer Token: ${token}`);
  }

  appAuthToken = token;
};

environment.resetEnvironment = () => {
  appAuthToken = undefined;

  commitLocalUpdate(environment, store => {
    store.getRoot().invalidateRecord();
  });
};

const captureException = (name, operationKind, variables, message, errors) => {
  console.log('Relay Request name: ', name);
  console.log('Relay Request operationKind: ', operationKind);
  console.log('Relay Request variables: ', JSON.stringify(variables));

  if (errors) {
    console.log('Relay Request error: ', JSON.stringify(errors));
  }

  sentryCaptureException(message);
};

export default environment;