import {commitLocalUpdate} from 'react-relay';

const redeemRewardMutation = (
  environment,
  referralData,
) => {
  return new Promise((resolve, reject) => {
    commitLocalUpdate(environment, store => {
      try {
        const viewer = store.getRoot().getLinkedRecord('viewer');
        const marketing = viewer.getLinkedRecord('marketing');
        const referralProgramRefer5 = marketing.getLinkedRecord('referralProgramRefer5');

        referralProgramRefer5.setValue(true, 'claimed');

        resolve(referralData);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default redeemRewardMutation;
