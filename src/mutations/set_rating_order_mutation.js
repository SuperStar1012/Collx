import {graphql, commitMutation} from 'react-relay';

const setRatingOrderMutation = (
  environment,
  orderId,
  rating,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation setRatingOrderMutation($input: SetRatingOnOrderInput!) {
        setRatingOnOrder(input: $input) {
          success
          errors {
            message
          }
          order {
            id
            ratingRecordedForBuyer
            ratingRecordedForSeller
          }
        }
      }`,
      variables: {
        input: {
          orderId,
          rating,
        },
      },
      onError: reject,
      onCompleted: ({setRatingOnOrder: payload}) => {
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

export default setRatingOrderMutation;
