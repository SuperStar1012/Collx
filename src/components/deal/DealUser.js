import React from 'react';
import {useFragment, graphql} from 'react-relay';
import {Text, View} from 'react-native';

import UserView from '../user/UserView';

import {Fonts, createUseStyle} from 'theme';
import {useActions} from 'actions';

const DealUser = ({
  style,
  isMeBuyer,
  myProfile,
  otherProfile,
  onMessage,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const myProfileData = useFragment(
    graphql`
      fragment DealUser_my_profile on Profile {
        id
      }
    `,
    myProfile,
  );

  const otherProfileData = useFragment(
    graphql`
      fragment DealUser_other_profile on Profile {
        id
        ...UserView_profile
      }
    `,
    otherProfile,
  );

  const handleMessage = () => {
    if (onMessage) {
      onMessage(myProfileData.id, otherProfileData.id, true);
    }
  };

  const handleProfile = () => {
    actions.pushProfile(otherProfileData.id);
  };

  if (!otherProfileData) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textTitle}>{`${isMeBuyer ? 'Seller' : 'Buyer'}'s Info`}</Text>
      <UserView
        profile={otherProfileData}
        isVisibleMessage
        onMessage={handleMessage}
        onPress={handleProfile}
      />
    </View>
  );
};

export default DealUser;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 16,
  },
  textTitle: {
    fontFamily: Fonts.nunitoExtraBold,
    fontWeight: Fonts.extraBold,
    fontSize: 15,
    lineHeight: 18,
    color: colors.primaryText,
    marginHorizontal: 16,
    marginBottom: 13,
  },
}));
