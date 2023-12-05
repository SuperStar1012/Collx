const logoIcon = require('assets/icons/logo/light/logo.png');
const americanExpressIcon = require('assets/icons/payment-method/light/american_express.png');
const applePayIcon = require('assets/icons/payment-method/light/apple_pay.png');
const defaultCardIcon = require('assets/icons/payment-method/light/default_card.png');
const dinersClubIcon = require('assets/icons/payment-method/light/diners_club.png');
const discoverIcon = require('assets/icons/payment-method/light/discover.png');
const googlePayIcon = require('assets/icons/payment-method/light/google_pay.png');
const jcbIcon = require('assets/icons/payment-method/light/jcb.png');
const mastercardIcon = require('assets/icons/payment-method/light/mastercard.png');
const unionPayIcon = require('assets/icons/payment-method/light/union_pay.png');
const visaIcon = require('assets/icons/payment-method/light/visa.png');

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

