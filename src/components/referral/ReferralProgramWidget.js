import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Button} from 'components';
import ReferralFriends from './ReferralFriends';

import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {wp, getStorageItem, setStorageItem} from 'utils';
import {useActions} from 'actions';

const closeIcon = require('assets/icons/close.png');

const ReferralProgramWidget = ({
  style,
  viewer,
}) => {
  const styles = useStyle();

  const actions = useActions();

  const viewerData = useFragment(graphql`
    fragment ReferralProgramWidget_viewer on Viewer {
      marketing {
        referralProgramRefer5 {
          claimed
          remainingRedemptions
          ...ReferralFriends_ReferralProgramRefer,
        }
      }
    }`,
    viewer
  );

  const [isDismissedProgram, setIsDismissedProgram] = useState(true);

  const isClaimYourReward = viewerData.marketing.referralProgramRefer5?.remainingRedemptions === 0;
  const isVisible = !viewerData.marketing.referralProgramRefer5?.claimed;

  useEffect(() => {
    checkProgramDismiss();
  }, []);

  const checkProgramDismiss = async () => {
    // Checks Referral Program Dismiss
    const isDismissed = await getStorageItem(
      Constants.dismissedReferralProgram,
    );

    setIsDismissedProgram(isDismissed === 'true');
  };

  const handleClose = () => {
    setStorageItem(Constants.dismissedReferralProgram, 'true');
    setIsDismissedProgram(true);
  };

  const handleAction = () => {
    if (isClaimYourReward) {
      actions.navigateClaimReferralReward();
    } else {
      actions.navigateOpenReferralProgram();
    }
  };

  if (!isVisible || isDismissedProgram) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Button
        style={styles.closeButton}
        iconStyle={styles.iconClose}
        icon={closeIcon}
        onPress={handleClose}
      />
      <ReferralFriends
        style={styles.referralFriendContainer}
        itemStyle={styles.referralFriendItemContainer}
        referralProgram={viewerData.marketing.referralProgramRefer5}
      />
      <View style={styles.mainContainer}>
        <Text style={styles.textTitle}>Refer 5 friends, get a free pack.</Text>
        <Text style={styles.textDescription}>
          For the first 5 friends you invite that scan a card, we'll send you a
          free pack of trading cards.
        </Text>
      </View>
      <Button
        style={styles.button}
        label={isClaimYourReward ? 'Claim Your Reward' : 'See How It Works'}
        labelStyle={styles.textButton}
        scale={Button.scaleSize.One}
        onPress={handleAction}
      />
    </View>
  );
};

ReferralProgramWidget.defaultProps = {};

ReferralProgramWidget.propTypes = {};

export default ReferralProgramWidget;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: colors.primaryCardBackground,
  },
  closeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  iconClose: {
    width: 24,
    height: 24,
    tintColor: colors.darkGrayText,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    textTransform: 'capitalize',
    textAlign: 'center',
    marginTop: 12,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginTop: 12,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    color: Colors.white,
  },
  referralFriendContainer: {
    marginHorizontal: 34,
  },
  referralFriendItemContainer: {
    width: wp(9.6),
    height: wp(9.6),
    borderRadius: wp(4.8),
  },
}));
