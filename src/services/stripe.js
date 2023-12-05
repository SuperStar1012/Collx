/* eslint-disable no-undef */
import {initStripe} from '@stripe/stripe-react-native';
import Config from 'react-native-config';

export const stripeInit = async () => {
  await initStripe({
    publishableKey: Config.STRIPE_PUBLISHABLE_KEY,
    merchantIdentifier: Config.APPLE_MERCHANT_IDENTIFIER,
    urlScheme: 'collx',
    setReturnUrlSchemeOnAndroid: true,
  });
};
