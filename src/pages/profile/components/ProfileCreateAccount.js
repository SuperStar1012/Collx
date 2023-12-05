import React from 'react';
import {graphql, useFragment} from 'react-relay';

import {Button} from 'components';

import {useActions} from 'actions';
import {Colors, Fonts, createUseStyle} from 'theme';

const ProfileCreateAccount = (props) => {
  const styles = useStyle();
  const actions = useActions();

  const profile = useFragment(graphql`
    fragment ProfileCreateAccount_profile on Profile {
        isAnonymous
    }`,
    props.profile
  );

  if (!profile.isAnonymous) {
    return null;
  }

  const handleCreateAccount = () => {
    actions.navigateCreateAccount();
  };

  return (
    <Button
      style={styles.createAccountButton}
      label="Create My Account"
      labelStyle={styles.textCreateAccount}
      scale={Button.scaleSize.One}
      onPress={handleCreateAccount}
    />
  );
}

export default ProfileCreateAccount;

const useStyle = createUseStyle(({colors}) => ({
  createAccountButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  textCreateAccount: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
  }
}));
