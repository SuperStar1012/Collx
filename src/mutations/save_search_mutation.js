import {graphql, commitMutation, ConnectionHandler} from 'react-relay';

const saveSearchMutation = (
  environment,
  params,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation saveSearchMutation($input: SaveSearchInput!) {
        saveSearch(input: $input) {
          success
          errors {
            message
          }
          savedSearch {
            id
            query
          }
        }
      }`,
      variables: {
        input: params,
      },
      updater: (store, {saveSearch: payload}) => {
        if (!payload?.success) {
          return;
        }

        const viewer = store.getRoot().getLinkedRecord("viewer");

        const {savedSearch} = payload || {};

        if (!viewer || !savedSearch) {
          return;
        }

        const savedSearchesConnection = ConnectionHandler.getConnection(
          viewer,
          'RecentSearches_viewer__savedSearches'
        );

        const newSavedSearch = store.get(savedSearch.id);

        if (!savedSearchesConnection || !newSavedSearch) {
          return;
        }

        const newSavedSearchEdge = ConnectionHandler.createEdge(
          store,
          savedSearchesConnection,
          newSavedSearch,
          'SavedSearchEdge'
        );

        if (!newSavedSearchEdge) {
          return;
        }

        ConnectionHandler.insertEdgeBefore(
          savedSearchesConnection,
          newSavedSearchEdge,
        );
      },
      onError: reject,
      onCompleted: ({saveSearch: payload}) => {
        if (payload?.success) {
          resolve();
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default saveSearchMutation;
