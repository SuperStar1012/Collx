import {graphql, commitMutation} from 'react-relay';

const addIssueAttachmentsToIssueMutation = (
  environment,
  issueId,
  issueAttachmentIds,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation addIssueAttachmentsToIssueMutation($input: AddIssueAttachmentsToIssueInput!) {
          addIssueAttachmentsToIssue(input: $input) {
            success
            errors {
              message
            }
          }
        }
      `,
      variables: {
        input: {
          issueAttachmentIds,
          with: {
            issueId,
          },
        },
      },
      onError: reject,
      onCompleted: ({addIssueAttachmentsToIssue: payload}) => {
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

export default addIssueAttachmentsToIssueMutation;
