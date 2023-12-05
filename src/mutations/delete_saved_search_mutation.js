import {graphql, commitMutation, ConnectionHandler} from 'react-relay';

const deleteSavedSearchMutation = (
  environment,
  savedSearchIds,
  isDeleteAll = false,
) => {
  const input = {};
  if (savedSearchIds?.length && !isDeleteAll) {
    input.with = {
      ids: savedSearchIds,
    };
  }

  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation deleteSavedSearchMutation($input: DeleteSavedSearchInput!) {
        deleteSavedSearch(input: $input) {
          success
          errors {
            message
          }
        }
      }`,
      variables: {
        input,
      },
      updater: (store, {deleteSavedSearch: payload}) => {
        if (!payload?.success) {
          return;
        }

        const viewer = store.getRoot().getLinkedRecord("viewer");

        if (!viewer) {
          return;
        }

        const savedSearchesConnection = ConnectionHandler.getConnection(
          viewer,
          'RecentSearches_viewer__savedSearches'
        );

        if (!savedSearchesConnection) {
          return;
        }

        savedSearchIds?.map(savedSearchId => {
          ConnectionHandler.deleteNode(savedSearchesConnection, savedSearchId);
        });
      },
      onError: reject,
      onCompleted: ({deleteSavedSearch: payload}) => {
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

export default deleteSavedSearchMutation;
