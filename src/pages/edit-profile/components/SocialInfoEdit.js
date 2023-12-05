import React, {useState, useEffect, useMemo, useRef} from 'react';
import {graphql, useFragment} from 'react-relay';
import {useSelector} from 'react-redux';

import UserInfoTextInput from './UserInfoTextInput';

import {SchemaTypes} from 'globals';

const SocialInfoEdit = ({
  profile,
  onUpdateSocials,
}) => {
  const profileData = useFragment(graphql`
    fragment SocialInfoEdit_profile on Profile {
      socialMedia {
        userId
        site
      }
    }`,
    profile
  );

  const appearanceMode = useSelector(state => state.user.appearanceMode);

  const initialSocials = useMemo(() => {
    const socials = {};

    profileData.socialMedia?.map(item => {
      socials[item.site] = item.userId;
    });

    return socials;
  }, [profileData]);

  const isInit = useRef(false);

  const [instagram, setInstagram] = useState(initialSocials[SchemaTypes.socialSite.INSTAGRAM] || '');
  const [tiktok, setTiktok] = useState(initialSocials[SchemaTypes.socialSite.TIKTOK] || '');
  const [twitterBlack, setTwitterBlack] = useState(initialSocials[SchemaTypes.socialSite.TWITTER_BLACK] || '');
  const [twitterWhite, setTwitterWhite] = useState(initialSocials[SchemaTypes.socialSite.TWITTER_WHITE] || '');
  const [facebook, setFacebook] = useState(initialSocials[SchemaTypes.socialSite.FACEBOOK] || '');

  useEffect(() => {
    if (isInit.current) {
      updateSocialInfo();
    } else {
      isInit.current = true;
    }
  }, [
    instagram,
    tiktok,
    twitterBlack,
    twitterWhite,
    facebook,
  ]);

  const updateSocialInfo = () => {
    const socials = [];

    if (instagram) {
      socials.push({
        site: SchemaTypes.socialSite.INSTAGRAM,
        userId: instagram,
      });
    }

    if (tiktok) {
      socials.push({
        site: SchemaTypes.socialSite.TIKTOK,
        userId: tiktok,
      });
    }

    if (twitterBlack && appearanceMode !== 'on') {
      socials.push({
        site: SchemaTypes.socialSite.TWITTER_BALCK,
        userId: twitter,
      });
    }

    if (twitterWhite && appearanceMode === 'on') {
      socials.push({
        site: SchemaTypes.socialSite.TWITTER_WHITE,
        userId: twitter,
      });
    }

    if (facebook) {
      socials.push({
        site: SchemaTypes.socialSite.FACEBOOK,
        userId: facebook,
      });
    }

    if (onUpdateSocials) {
      onUpdateSocials(socials);
    }
  };

  return (
    <>
      <UserInfoTextInput
        label="Instagram"
        isOptional
        placeholder="@instagramhandle"
        value={instagram}
        onChangeText={setInstagram}
      />
      <UserInfoTextInput
        label="Tiktok"
        isOptional
        placeholder="@tiktokhandle"
        value={tiktok}
        onChangeText={setTiktok}
      />
      <UserInfoTextInput
        label="Twitter"
        isOptional
        placeholder="@twitterhandle"
        value={appearanceMode === 'on' ? twitterWhite : twitterBlack}
        onChangeText={appearanceMode === 'on' ? setTwitterWhite : setTwitterBlack}
      />
      <UserInfoTextInput
        label="Facebook"
        isOptional
        placeholder="@facebookhandle"
        value={facebook}
        onChangeText={setFacebook}
      />
    </>
  );
};

export default SocialInfoEdit;
