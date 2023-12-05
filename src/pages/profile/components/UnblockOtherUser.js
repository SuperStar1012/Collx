import React from 'react';
import {graphql, useFragment} from 'react-relay';

import {Button} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {useActions} from 'actions';

const UnblockOtherUser = (props) => {
  const styles = useStyle();
  const actions = useActions();

  const profile = useFragment(graphql`
    fragment UnblockOtherUser_profile on Profile {
      id
      viewer {
        areTheyBlockingMe
      }
    }`,
    props.profile
  );

  const handleUnBlockUser = () => {
    actions.setBlockOrUnblockUser(profile.id, false);
    actions.blockOrUnblockUser(profile.id, false);
  };

  if (!profile.viewer.areTheyBlockingMe) {
    return null;
  }

  return (
    <Button
      style={styles.unblockButton}
      label="Unblock"
      labelStyle={styles.textUnlock}
      scale={Button.scaleSize.One}
      onPress={handleUnBlockUser}
    />
  );
}

export default UnblockOtherUser;

const useStyle = createUseStyle(({colors}) => ({
  unblockButton: {
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.secondaryCardBackground,
    marginHorizontal: 16,
    marginVertical: 2,
  },
  textUnlock: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.red,
  },
}));
