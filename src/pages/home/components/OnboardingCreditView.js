import React, {useEffect, useMemo, useState} from 'react';
import {graphql, useFragment} from 'react-relay';
import {Text, View} from 'react-native';

import {
  Image,
  Button,
  ProBadge,
} from 'components';
import OnboardingCheckItem from './OnboardingCheckItem';

import {getStorageItem, setStorageItem} from 'utils';
import {Constants, Urls} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {useActions} from 'actions';

const stepBoardImage = require('assets/imgs/home/step_board.png');
const stepBaseIcon = require('assets/imgs/home/circle_base.png');
const stepPolygonIcon = require('assets/imgs/home/step_polygon.png');
const earnFiveIcon = require('assets/imgs/home/earn_five.png');

const baseSteps = [
  'Batter up!',
  'First base',
  'Second base',
  'Third base',
  'Home run',
];

const allCheckSteps = [
  {
    label: 'Scan a card',
    value: Constants.userEngagement.scanned,
    checked: false,
    position: {
      right: 65,
      bottom: 32,
    },
    helpLink: Urls.scanCardVideoUrl,
  },
  {
    label: 'Add to collection',
    value: Constants.userEngagement.added,
    checked: false,
    position: {
      right: 14.5,
      bottom: 92,
    },
    helpLink: Urls.scanCardVideoUrl,
  },
  {
    label: 'Follow a user',
    value: Constants.userEngagement.followed,
    checked: false,
    position: {
      right: 65,
      top: 3,
    },
    helpLink: Urls.followUsersVideoUrl,
  },
  {
    label: 'List a card for sale',
    value: Constants.userEngagement.listed,
    checked: false,
    position: {
      left: 15.5,
      bottom: 92,
    },
    helpLink: Urls.listCardVideoUrl,
  },
];

const OnboardingCreditView = ({
  style,
  viewer,
  onClaimCredit,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const [isDismissedWidget, setIsDismissedWidget] = useState(false);

  const viewerData = useFragment(graphql`
    fragment OnboardingCreditView_viewer on Viewer {
      engagement
      marketing {
        onboardingCredit {
          claimed
          canClaimCredit
          hasCompletedOnboarding

        }
      }
      profile {
        id,
        avatarImageUrl
        name
        location
        ...ProBadge_profile
      }
    }`,
    viewer
  );

  const {
    engagement,
    profile,
  } = viewerData;

  const {
    claimed,
    canClaimCredit,
    hasCompletedOnboarding,
  } = viewerData.marketing?.onboardingCredit || {};

  const completedSteps = useMemo(() => {
    let count = 0;
    let currentStep = -1;
    const steps = [];

    for (let step of allCheckSteps) {
      let checked = false;
      if (engagement?.includes(step.value)) {
        checked = true;
        count++;
      } else if (currentStep === -1) {
        currentStep = count;
      }

      steps.push({
        ...step,
        checked,
      });
    }

    return ({
      currentStep,
      count,
      steps,
    });
  }, [engagement]);

  useEffect(() => {
    getStorageItem(Constants.dismissedOnboardingWidget)
      .then(value => {
        setIsDismissedWidget(value === 'true');
      });
  }, []);

  if (hasCompletedOnboarding && !canClaimCredit && !claimed) {
    return null;
  }

  if (isDismissedWidget) {
    return null;
  }

  const handleDismissOnboarding = () => {
    setIsDismissedWidget(true);
    setStorageItem(Constants.dismissedOnboardingWidget, 'true');
  };

  const handleOnboardingStep = (value) => {
    actions.navigateOnboardingItem(value, profile.id);
  };

  const handleHelp = (value) => {
    const stepItem = allCheckSteps.find(item => item.value === value);
    if (stepItem) {
      actions.helpForOnboardingItem(stepItem.helpLink);
    }
  };

  const handleClaimCredit = () => {
    if (onClaimCredit) {
      onClaimCredit();
    }
  };

  const renderUserInfo = () => (
    <View style={styles.topContentContainer}>
      <Image
        source={profile.avatarImageUrl || Constants.defaultAvatar}
        style={styles.imageAvatar}
      />
      <View style={styles.userInfoContainer}>
        <View style={styles.nameContainer}>
          <Text
            style={styles.textName}
            numberOfLines={1}
          >
            {viewer.profile.name || 'Anonymous'}
          </Text>
          <ProBadge profile={profile} />
        </View>
        {viewer.profile.location ? (
          <Text style={styles.textAddress}>{viewer.profile.location}</Text>
        ) : null}
      </View>
      <View style={styles.stepBaseContainer}>
        <Image
          source={stepBaseIcon}
          style={[styles.iconStepBase, completedSteps.count == 0 ? styles.imageFirstStep : styles.imageOtherStep]}
        />
        <Text style={[styles.textStepBase, completedSteps.count == 0 ? styles.textFirstStep : styles.textOtherStep]}>
          {baseSteps[completedSteps.count]}
        </Text>
      </View>
    </View>
  );

  const renderTitle = () => (
    <Text style={styles.textTitle}>
      {hasCompletedOnboarding
        ? 'Congrats! You hit a home run and earned $5 credit.'
        : 'Earn your first $5 on CollX!'
      }
    </Text>
  );

  const renderDescription = () => {
    if (hasCompletedOnboarding) {
      return null;
    }

    return (
      <Text style={styles.textDescription}>
        CollX is all about building your collection and connecting with collectors. Try out these features to get a home run and <Text style={styles.textEarn}>earn $5 credit.</Text>
      </Text>
    );
  };

  const renderCheckItems = () => (
    <View style={styles.checksContainer}>
      {completedSteps.steps.map((item, index) => (
        <OnboardingCheckItem
          key={index}
          isChecked={item.checked}
          isCurrentStep={completedSteps.currentStep === index}
          label={item.label}
          value={item.value}
          onPress={(value) => handleOnboardingStep(value)}
          onHelp={(value) => handleHelp(value)}
        />
      ))}
    </View>
  );

  const renderStepBoard = () => {
    if (hasCompletedOnboarding || completedSteps.count >= allCheckSteps.length) {
      return (
        <View style={styles.homeRunContainer}>
          <Image style={styles.iconBaseballBat} source={earnFiveIcon} />
          <Text style={styles.textHomeRun}>Home Run</Text>
        </View>
      );
    }

    return (
      <View style={styles.stepBoardContainer}>
        <Image source={stepBoardImage} style={styles.imageStepBoard} />
        <Image source={stepPolygonIcon} style={[styles.iconStep, allCheckSteps[completedSteps.count].position]} />
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderUserInfo()}
      <View style={styles.mainContentContainer}>
        {renderTitle()}
        {renderDescription()}
        <View style={styles.stepCheckContainer}>
          {renderCheckItems()}
          {renderStepBoard()}
        </View>
        {canClaimCredit ? (
          <Button
            style={styles.viewCreditButton}
            label="Claim Credit in My Money"
            labelStyle={styles.textViewCredit}
            scale={Button.scaleSize.One}
            onPress={handleClaimCredit}
          />
        ) : null}
        <Button
          style={styles.closeButton}
          labelStyle={styles.textClose}
          label="Dismiss"
          onPress={handleDismissOnboarding}
        />
      </View>
    </View>
  );
};

export default OnboardingCreditView;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: colors.primaryCardBackground,
    shadowColor: Colors.gray,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  topContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: 8,
  },
  textName: {
    flexShrink: 1,
    fontWeight: Fonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.004,
    color: colors.primaryText,
  },
  textAddress: {
    fontSize: 12,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginTop: 3,
  },
  stepBaseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: colors.secondaryCardBackground,
  },
  iconStepBase: {
    width: 26,
    height: 26,
  },
  textStepBase: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: -0.004,
    marginLeft: 8,
  },
  mainContentContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.primaryBorder,
  },
  textTitle: {
    fontFamily: Fonts.nunitoExtraBold,
    fontWeight: Fonts.extraBold,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginVertical: 8,
  },
  textEarn: {
    color: colors.primary,
  },
  stepCheckContainer: {
    flexDirection: 'row',
  },
  checksContainer: {
    flex: 1,
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  stepBoardContainer: {
    height: 170,
    justifyContent: 'flex-end',
    marginVertical: 4,
  },
  imageStepBoard: {
    width: 150,
    height: 162,
    resizeMode: 'contain',
  },
  iconStep: {
    width: 18,
    height: 23,
    resizeMode: 'contain',
    position: 'absolute',
  },
  homeRunContainer: {
    width: 145,
    height: 162,
    marginVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.secondaryCardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.soft,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 11,
    elevation: 4,
  },
  iconBaseballBat: {
    width: 84,
    height: 84,
    resizeMode: 'contain',
  },
  textHomeRun: {
    fontFamily: Fonts.nunitoExtraBold,
    fontWeight: Fonts.extraBold,
    fontSize: 22,
    lineHeight: 25,
    color: colors.primaryText,
    marginTop: 7,
    textShadowColor: 'rgba(155, 155, 155, 0.25)',
    textShadowOffset: {width: 0, height: 1.25},
    textShadowRadius: 2.5,
  },
  closeButton: {
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 4,
  },
  textClose: {
    fontWeight: Fonts.bold,
    fontSize: 13,
    letterSpacing: -0.004,
    color: colors.grayText,
  },
  imageFirstStep: {
    tintColor: colors.darkGrayText,
  },
  imageOtherStep: {
    tintColor: colors.primary,
  },
  textFirstStep: {
    color: colors.darkGrayText,
  },
  textOtherStep: {
    color: colors.onboardingText,
  },
  viewCreditButton: {
    flex: 1,
    height: 36,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  textViewCredit: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.white,
  },
}));
