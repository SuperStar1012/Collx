import {commitLocalUpdate} from 'react-relay';

const addEngagementMutation = (
  environment,
  engagement,
) => {
  return new Promise((resolve, reject) => {
    commitLocalUpdate(environment, store => {
      try {
        const viewer = store.getRoot().getLinkedRecord("viewer");

        let engagementValues = viewer.getValue('engagement') || [];
        if (engagementValues && engagementValues.indexOf(engagement) === -1) {
          engagementValues = [engagement, ...engagementValues];
          viewer.setValue(engagementValues, 'engagement');
        }

        resolve(engagementValues);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default addEngagementMutation;
