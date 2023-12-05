import React from 'react';
import {graphql, useFragment} from 'react-relay'

import {Image} from 'components';

import {Constants} from 'globals'

const Avatar = (props) => {
  const profile = useFragment(graphql`
    fragment Avatar_profile on Profile {
      isAnonymous
      avatarImageUrl
    }`,
    props.profile
  );

  return (
    <Image
      style={props.style}
      source={
        profile?.isAnonymous
          ? Constants.anonymousAvatar
          : (profile?.avatarImageUrl || Constants.defaultAvatar)
      }
    />
  );
};

export default Avatar;
