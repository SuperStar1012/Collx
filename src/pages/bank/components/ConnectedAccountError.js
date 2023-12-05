import React, { useMemo } from 'react';
import {View, Text} from 'react-native';

import {Colors, createUseStyle} from 'theme';
import {contactSupport} from 'utils';

const errorMessages = {
  'requirements.past_due': 'Additional verification information is required to enable payout or charge capabilities on this account.',
  'requirements.pending_verification': 'Stripe is currently verifying information on the connected account.',
  'listed': 'Account might be on a prohibited persons or companies list (Stripe will investigate and either reject or reinstate the account appropriately).',
  'platform_paused': 'Account is disabled.',
  'rejected.fraud': 'Account is rejected due to suspected fraud or illegal activity.',
  'rejected.listed': 'Account is rejected because it’s on a third-party prohibited persons or companies list (such as financial services provider or government).',
  'rejected.terms_of_service': 'Account is rejected due to suspected terms of service violations.',
  'rejected.other': 'This account has been rejected by Stripe.',
  'under_review': 'Account is under review by Stripe.',
  'other': 'Account is disabled while being reviewed by Stripe',
};

const ConnectedAccountError = ({
  style,
  connectedAccount,
}) => {
  const styles = useStyle();

  const errorMessage = useMemo(() => {
    if (!connectedAccount) {
      return null;
    }

    const disabledReason = connectedAccount.requirements?.disabled_reason;
    if (!disabledReason) {
      return null;
    }

    const message = errorMessages[disabledReason];
    if (message) {
      return message;
    }

    return errorMessages.other;
  }, [connectedAccount]);

  const handleContactSupport = () => {
    contactSupport();
  };

  if (!errorMessage) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textErrors}>
        {`${errorMessage}  `}
        <Text
          style={styles.textContactSupport}
          onPress={handleContactSupport}
        >
          Contact Support
        </Text>
      </Text>
    </View>
  );
};

export default ConnectedAccountError;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    margin: 16,
  },
  textErrors: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.red,
  },
  textContactSupport: {
    color: colors.primary,
    marginLeft: 10,
  },
}));
