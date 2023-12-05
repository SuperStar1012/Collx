import {graphql, commitMutation} from 'react-relay';

const createIssueAttachmentMutation = (
  environment,
  filename,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation createIssueAttachmentMutation($input: CreateIssueAttachmentInput!) {
          createIssueAttachment(input: $input) {
            success
            errors {
              message
            }
            issueAttachment {
              id
              filename
              uploadUrl
            }
          }
        }
      `,
      variables: {
        input: {
          filename,
        },
      },
      onError: reject,
      onCompleted: ({createIssueAttachment: payload}) => {
        if (payload?.success && payload?.issueAttachment) {
          resolve(payload.issueAttachment);
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default createIssueAttachmentMutation;
