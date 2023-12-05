import React from 'react';
import {View, Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Colors, Fonts, createUseStyle} from 'theme';
import {Constants} from 'globals';

const AccountSuspended = ({profile}) => {
  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment AccountSuspended_profile on Profile {
      status
    }`,
    profile
  );

  if (profileData.status !== Constants.accountStatus.suspended) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textSuspended}>Account Suspended</Text>
    </View>
  );
}

export default AccountSuspended;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 36,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 2,
    backgroundColor: colors.secondaryCardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSuspended: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.red,
  },
}));
