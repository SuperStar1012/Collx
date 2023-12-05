import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import {Button, Image} from 'components';

import {Fonts, createUseStyle} from 'theme';

const ContactInvite = props => {
  const {style, name, avatarUri, emailAddresses, phoneNumbers, onInvite} = props;

  const styles = useStyle();

  const getPhoneNumbers = () => {
    if (phoneNumbers.length === 1) {
      return phoneNumbers[0].number;
    } else if (phoneNumbers.length > 1) {
      return `${phoneNumbers.length} phone numbers`;
    }

    return null;
  };

  const getEmails = () => {
    if (emailAddresses.length === 1) {
      return emailAddresses[0].email?.toLowerCase();
    } else if (emailAddresses.length > 1) {
      return `${emailAddresses.length} emails`;
    }

    return null;
  };

  const getDescription = () => {
    const phoneNumber = getPhoneNumbers();
    const email = getEmails();

    const elements = [];
    if (phoneNumber) {
      elements.push(phoneNumber);
    }

    if (email) {
      elements.push(email);
    }

    return elements.join(', ');
  };

  const description = getDescription();

  return (
    <View style={[styles.container, style]}>
      <Image style={styles.imageAvatar} source={avatarUri} />
      <View style={styles.mainContentContainer}>
        <Text style={styles.textName}>{name}</Text>
        {description ? (
          <Text style={styles.textDescription} numberOfLines={1}>
            {description}
          </Text>
        ) : null}
      </View>
      <Button
        style={styles.inviteButton}
        label="Invite"
        labelStyle={styles.textInvite}
        scale={Button.scaleSize.Two}
        onPress={() => onInvite()}
      />
    </View>
  );
};

ContactInvite.defaultProps = {
  onInvite: () => {},
};

ContactInvite.propTypes = {
  name: PropTypes.string,
  avatarUri: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onInvite: PropTypes.func,
};

export default ContactInvite;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 19,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  imageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  mainContentContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    marginHorizontal: 11,
  },
  textName: {
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
  },
  inviteButton: {
    width: 79,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryCardBackground,
  },
  textInvite: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
}));
