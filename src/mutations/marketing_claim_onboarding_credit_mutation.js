import {graphql, commitMutation} from 'react-relay';

const marketingClaimOnboardingCreditMutation = (
  environment,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation marketingClaimOnboardingCreditMutation {
          marketingClaimOnboardingCredit {
            success
            errors {
              message
            }
            viewer {
              marketing {
                onboardingCredit {
                  claimed
                  canClaimCredit
                  hasCompletedOnboarding
                }
              }
            }
          }
        }
      `,
      variables: {},
      onError: reject,
      onCompleted: ({marketingClaimOnboardingCredit: payload}) => {
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

export default marketingClaimOnboardingCreditMutation;
