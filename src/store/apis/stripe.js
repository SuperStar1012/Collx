import Config from 'react-native-config';
import axios from 'axios';
import qs from 'qs';

export const updateCustomer = async (customerId, data) => {
  // Update a Customer
  const response = await axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Config.STRIPE_SECRET_KEY}`
    },
    baseURL: Config.STRIPE_API_BASE_URL,
    url: `/customers/${customerId}`,
    data: qs.stringify(data),
  });

  return response.data;
};

export const getPaymentMethod = async paymentMethodId => {
  // Get a PaymentMethod
  const response = await axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${Config.STRIPE_SECRET_KEY}`
    },
    baseURL: Config.STRIPE_API_BASE_URL,
    url: `payment_methods/${paymentMethodId}`,
  });

  return response.data;
};

export const getPaymentMethods = async customerId => {
  // Get a Customer's PaymentMethods
  const response = await axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${Config.STRIPE_SECRET_KEY}`
    },
    baseURL: Config.STRIPE_API_BASE_URL,
    url: `customers/${customerId}/payment_methods`,
    params: {
      type: 'card',
    },
  });

  return response.data;
};

export const attachPaymentMethod = async (paymentMethodId, customerId) => {
  // Attach a PaymentMethod to a Customer
  const response = await axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Config.STRIPE_SECRET_KEY}`
    },
    baseURL: Config.STRIPE_API_BASE_URL,
    url: `/payment_methods/${paymentMethodId}/attach`,
    data: qs.stringify({
      customer: customerId,
    }),
  });

  return response.data;
};

export const detachPaymentMethod = async (paymentMethodId) => {
  // Detach a PaymentMethod from a Customer
  const response = await axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Config.STRIPE_SECRET_KEY}`
    },
    baseURL: Config.STRIPE_API_BASE_URL,
    url: `/payment_methods/${paymentMethodId}/detach`,
  });

  return response.data;
};

export const getAccount = async stripeConnectedAccountId => {
  // Gets account
  const response = await axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${Config.STRIPE_SECRET_KEY}`
    },
    baseURL: Config.STRIPE_API_BASE_URL,
    url: `/accounts/${stripeConnectedAccountId}`,
  });

  return response.data;
};

export const updateAccount = async (stripeConnectedAccountId, parameters) => {
  // Updates Stripe account
  const response = await axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Config.STRIPE_SECRET_KEY}`
    },
    baseURL: Config.STRIPE_API_BASE_URL,
    url: `/accounts/${stripeConnectedAccountId}`,
    data: qs.stringify(parameters),
  });

  return response.data;
};

export const getBankAccounts = async stripeConnectedAccountId => {
  // Gets bank accounts
  const response = await axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${Config.STRIPE_SECRET_KEY}`
    },
    baseURL: Config.STRIPE_API_BASE_URL,
    url: `/accounts/${stripeConnectedAccountId}/external_accounts`,
  });

  return response.data;
};

export const createBankAccount = async (stripeConnectedAccountId, externalAccount) => {
  // Creates a bank account
  const response = await axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Config.STRIPE_SECRET_KEY}`
    },
    baseURL: Config.STRIPE_API_BASE_URL,
    url: `/accounts/${stripeConnectedAccountId}/external_accounts`,
    data: qs.stringify({
      external_account: {
        object: 'bank_account',
        ...externalAccount,
      }
    }),
  });

  return response.data;
};

export const deleteBankAccount = async (stripeConnectedAccountId, bankAccountId) => {
  // Deletes a bank account
  const response = await axios({
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Config.STRIPE_SECRET_KEY}`
    },
    baseURL: Config.STRIPE_API_BASE_URL,
    url: `/accounts/${stripeConnectedAccountId}/external_accounts/${bankAccountId}`,
  });

  return response.data;
};

export const updateBankAccount = async (stripeConnectedAccountId, bankAccountId, externalAccount) => {
  // Updates a bank account
  const response = await axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Config.STRIPE_SECRET_KEY}`
    },
    baseURL: Config.STRIPE_API_BASE_URL,
    url: `/accounts/${stripeConnectedAccountId}/external_accounts/${bankAccountId}`,
    data: qs.stringify(externalAccount),
  });

  return response.data;
};

