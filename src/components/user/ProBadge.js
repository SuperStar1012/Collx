import React from 'react';
import {
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {useFragment, graphql} from 'react-relay';

import {createUseStyle} from 'theme';
import {Constants} from 'globals';

export const ProColorVariant = {
  primary: 'primary',
  white: 'white',
};

const proIcon = require('assets/icons/more/collx_pro.png');
const proWhiteIcon = require('assets/icons/more/collx_pro_white.png');

const ProBadge = ({
  style,
  imageStyle,
  profile,
  colorVariant,
  isForceVisible,
}) => {

  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment ProBadge_profile on Profile {
      type
    }`,
    profile,
  );

  if (!isForceVisible && profileData?.type !== Constants.userType.pro) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        style={[styles.iconPro, imageStyle]}
        source={colorVariant === ProColorVariant.primary ? proIcon : proWhiteIcon}
      />
    </View>
  );
};

ProBadge.defaultProps = {
  colorVariant: ProColorVariant.primary,
};

ProBadge.propTypes = {
  colorVariant: PropTypes.string,
};

export default ProBadge;

const useStyle = createUseStyle(() => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  iconPro: {
    resizeMode: 'contain',
    width: 40,
    height: 18,
  },
}));
