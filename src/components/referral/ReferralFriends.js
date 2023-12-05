import React from 'react';
import {
  View,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import ReferralFriendsItem from './ReferralFriendsItem';

import {createUseStyle} from 'theme';

const ReferralFriends = props => {
  const {style, itemStyle} = props;

  const styles = useStyle();

  const referralProgram = useFragment(graphql`
    fragment ReferralFriends_ReferralProgramRefer on ReferralProgramRefer {
      redemptions {
        ...ReferralFriendsItem_ReferralProgramReferRedemption
      }
    }`,
    props.referralProgram
  );

  const currentReferrals = [];
  if (referralProgram) {
    Array.from(Array(5)).map((item, index) => {
      currentReferrals.push(referralProgram.redemptions[index]);
    });
  }

  return (
    <View style={[styles.container, style]}>
      {currentReferrals.map((item, index) => (
        <ReferralFriendsItem
          key={index}
          style={itemStyle}
          redemption={item}
        />
      ))}
    </View>
  );
};

ReferralFriends.defaultProps = {};

ReferralFriends.propTypes = {};

export default ReferralFriends;

const useStyle = createUseStyle(() => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginVertical: 10,
  },
}));
