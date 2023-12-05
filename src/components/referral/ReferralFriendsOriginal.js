import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import ReferralFriendsItem from './ReferralFriendsItemOriginal';

const ReferralFriendsOriginal = props => {
  const {style, itemStyle, referrals, onPressReferral} = props;

  const styles = useStyle();

  const currentReferrals = [];
  Array.from(Array(5)).map((item, index) => {
    currentReferrals.push(referrals[index] || {});
  });

  const handleSelectReferral = item => {
    if (onPressReferral) {
      onPressReferral(item);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {currentReferrals.map((item, index) => (
        <ReferralFriendsItem
          key={index}
          style={itemStyle}
          referral={item}
          onPress={() => handleSelectReferral(item)}
        />
      ))}
    </View>
  );
};

ReferralFriendsOriginal.defaultProps = {
  onPressReferral: () => {},
};

ReferralFriendsOriginal.propTypes = {
  referrals: PropTypes.array,
  onPressReferral: PropTypes.func,
};

export default ReferralFriendsOriginal;

const useStyle = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 24,
      marginVertical: 10,
    },
  });
