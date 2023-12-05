import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
} from 'react-native';
import {FormattedText} from 'react-native-formatted-text';

import {Button} from 'components';

import {Constants, Styles, Urls} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {contactSupport} from 'utils';

const content = {
  [Constants.userStatus.suspended]: {
    title: 'Your account was suspended',
    content: [
      {
        title: 'What does this mean?',
        list: [
          'Your account doesn’t follow our Community Guidelines.',
          'This account isn’t visible to people on CollX right now, and you can’t use it.',
        ],
      },
      {
        title: 'What can I do?',
        list: [
          'You still have 30 days left to disagree with this decision.',
          'If you wish to dispute the suspension, please use the button below to contact us.',
        ],
      },
    ]
  },
  [Constants.userStatus.banned]: {
    title: 'Your account is permanently banned.',
    content: [
      {
        description: 'This is because your account didn’t follow our Community Guidelines. This decision is final and cannot be changed.',
      },
    ],
  },
  // [specificSuspend]: {
  //   title: 'Your account was suspended due to the following reason:',
  //   content: [
  //     {
  //       reasons: [
  //         'Bullying and Harassment',
  //       ]
  //     },
  //     {
  //       title: 'What can I do?',
  //       list: [
  //         'You should receive an email from us about this suspension. You can follow the instruction in that email and reply directly.',
  //         'Instead, you can also use the button below to contact us.',
  //       ],
  //     },
  //   ],
  // },
};

const IrregularUser = ({
  navigation,
  route,
}) => {
  const {userStatus} = route.params || {};

  const {t: {colors, icons}} = useTheme();
  const styles = useStyle();

  useEffect(() => {
    setNavigationBar();
  }, [colors, icons]);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerTitle: () => (
        <Image style={styles.iconLogo} source={icons.logo} />
      ),
      headerStyle: {
        backgroundColor: colors.primaryHeaderBackground,
      },
    });
  };

  const handleDisputeSuspension = () => {
    contactSupport();
  };

  const handleCommunityGuidelines = () => {
    navigation.navigate('CommonStackModal', {
      screen: 'WebViewer',
      params: {
        title: 'Community Guidelines',
        url: Urls.communityGuidelinesUrl,
      },
    });
  };

  const renderTitle = () => {
    if (!content[userStatus]?.title) {
      return null;
    }

    return (
      <View style={styles.titleContainer}>
        <Text style={styles.textTitle}>
          {content[userStatus].title}
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    if (!content[userStatus]?.content) {
      return null;
    }

    return (content[userStatus].content.map((item, index) => (
      <View
        key={index}
        style={[styles.sectionContainer, item.reasons && styles.reasonContainer]}
      >
        {item.title ? (
          <Text style={styles.textSubTitle}>
            {item.title}
          </Text>
        ) : null}
        {renderSubContent(item)}
      </View>
    )));
  };

  const renderSubContent = (subContent) => {
    if (!subContent) {
      return null;
    }

    if (subContent.description) {
      return renderText(subContent.description, styles.textDescription);
    } else if (subContent.list) {
      return (subContent.list.map((item, index) => (
        <View
          key={index}
          style={styles.listItem}
        >
          <View style={styles.dot} />
          {renderText(item, styles.textItem)}
        </View>
      )));
    } else if (subContent.reasons) {
      return (subContent.reasons.map((item, index) => (
        <View
          key={index}
          style={styles.listItem}
        >
          <View style={styles.dot} />
          {renderText(item, styles.textItem)}
        </View>
      )));
    }

    return null;
  };

  const renderText = (text, textStyle) => (
    <FormattedText
      style={textStyle}
      matches={[
        {
          text: 'Community Guidelines',
          style: styles.textLink,
          onPress: handleCommunityGuidelines,
        }
      ]}>
      {text}
    </FormattedText>
  );

  return (
    <View style={styles.container}>
      {renderTitle()}
      <ScrollView>
        {renderContent()}
      </ScrollView>
      {userStatus !== Constants.userStatus.banned ? (
        <Button
          style={[styles.disputeButton, {marginBottom: Styles.screenSafeBottomHeight + 16}]}
          labelStyle={styles.textDispute}
          label="Dispute Suspension"
          scale={Button.scaleSize.One}
          onPress={handleDisputeSuspension}
        />
      ) : null}
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.primaryBackground,
  },
  iconLogo: {
    width: 110,
    height: 30,
    resizeMode: 'contain',
  },
  titleContainer: {
    marginTop: 32,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
    color: colors.primaryText,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 24,
  },
  textSubTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryText,
    marginTop: 8,
    marginRight: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginTop: 16,
  },
  reasonContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    backgroundColor: Colors.softGray,
    borderRadius: 6,
  },
  reasonItem: {
    flexDirection: 'row',
    marginTop: 16,
  },
  textItem: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.grayText,
    textAlign: 'center',
  },
  textLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  disputeButton: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  textDispute: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
  },
}));

export default IrregularUser;
