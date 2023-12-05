const logoIcon = require('assets/icons/logo/dark/logo.png');
const americanExpressIcon = require('assets/icons/payment-method/dark/american_express.png');
const applePayIcon = require('assets/icons/payment-method/dark/apple_pay.png');
const defaultCardIcon = require('assets/icons/payment-method/dark/default_card.png');
const dinersClubIcon = require('assets/icons/payment-method/dark/diners_club.png');
const discoverIcon = require('assets/icons/payment-method/dark/discover.png');
const googlePayIcon = require('assets/icons/payment-method/dark/google_pay.png');
const jcbIcon = require('assets/icons/payment-method/dark/jcb.png');
const mastercardIcon = require('assets/icons/payment-method/dark/mastercard.png');
const unionPayIcon = require('assets/icons/payment-method/dark/union_pay.png');
const visaIcon = require('assets/icons/payment-method/dark/visa.png');

export default {
  logo: logoIcon,
  paymentMethodIcons: {
    // Stripe
    amex: americanExpressIcon,
    cartes_bancaires: defaultCardIcon,
    diners: dinersClubIcon,
    discover: discoverIcon,
    jcb: jcbIcon,
    mastercard: mastercardIcon,
    visa: visaIcon,
    unionpay: unionPayIcon,
    // More
    apple: applePayIcon,
    google: googlePayIcon,
    default: defaultCardIcon,
  },
};

