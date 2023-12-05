import axios from 'axios';

export const getReferrals = async query => {
  const {referralCode, ...params} = query;

  const response = await axios.get(`/referrals/${referralCode}/users`, {
    params,
  });

  return response.data;
};

export const setReferral = async referralCode => {
  const response = await axios.post(`/referrals/${referralCode}`);

  return response.data;
};

export const setReward = async query => {
  const {userId, ...data} = query;

  const response = await axios.post(`/users/${userId}/rewards`, data);

  return response.data;
};
