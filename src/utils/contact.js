import {Image, Platform} from 'react-native';
import Contacts from 'react-native-contacts';
import isEmail from 'validator/lib/isEmail';
import md5 from 'react-native-md5';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Mailer from 'react-native-mail';
import SendSMS from 'react-native-sms';

import {Constants} from 'globals';
import {
  analyticsEvents,
  analyticsSendEvent,
} from 'services';

import collxImage from 'assets/imgs/collx.png';

const inviteTitle = 'Join me on CollX and get free cards!';
const inviteMessage =
  'I started using CollX, an app that helps me figure out how much my trading cards are worth. You should get it, too, and check out my collection, and add yours! Sign up at http://collx.app';

const contactPermission = Platform.select({
  ios: PERMISSIONS.IOS.CONTACTS,
  android: PERMISSIONS.ANDROID.READ_CONTACTS,
});

export const checkContactsPermission = async () => {
  let result = RESULTS.UNAVAILABLE;

  try {
    result = await check(contactPermission);
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const requestContactsPermission = async () => {
  let result = RESULTS.UNAVAILABLE;

  try {
    result = await request(contactPermission);
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const sortContact = (a, b) => {
  const nameA = `${a.familyName}${a.givenName}`;
  const nameB = `${b.familyName}${b.givenName}`;

  if (nameA < nameB) {
    return -1;
  } else if (nameA > nameB) {
    return 1;
  } else if (a.company < b.company) {
    return -1;
  } else if (a.company > b.company) {
    return 1;
  }

  return 0; //default return value (no sorting)
};

export const getContacts = async userEmail => {
  const contactAll = [];
  const emailHashes = [];

  try {
    const contactResult = await Contacts.getAll();
    contactResult.sort(sortContact);
    const filteredContacts = contactResult.filter(
      contact => contact.givenName || contact.familyName,
    );

    const emailAddresses = [];

    filteredContacts.map(contact => {
      const emailIndex = contact.emailAddresses.findIndex(
        item => item.email === userEmail,
      );

      if (emailIndex === -1) {
        contactAll.push({
          name: `${contact.givenName} ${contact.familyName}`,
          company: contact.company,
          emailAddresses: contact.emailAddresses,
          phoneNumbers: contact.phoneNumbers,
          text: 'Invite to CollX',
          following: false,
          avatarUri: contact.thumbnailPath || Constants.defaultAvatar,
        });

        for (const item of contact.emailAddresses) {
          if (isEmail(item.email)) {
            emailAddresses.push(item.email);
          }
        }
      }
    });

    for (const email of emailAddresses) {
      if (email) {
        const hashValue = md5.hex_md5(email.trim().toLowerCase());
        emailHashes.push(hashValue);
      }
    }
  } catch (error) {
    console.log(error);
  }

  return {
    contacts: contactAll,
    emailHashes,
  };
};

export const filterInviteContacts = (contacts, hashFriends) => {
  const filteredContacts = [];

  for (const contact of contacts) {
    const emailHashes = [];
    for (const item of contact.emailAddresses) {
      if (isEmail(item.email)) {
        const hashValue = md5.hex_md5(item.email.trim().toLowerCase());
        emailHashes.push(hashValue);
      }
    }

    const response = hashFriends.findIndex(
      friend =>
        emailHashes.findIndex(hash => hash === friend.hashedEmail) !== -1,
    );

    if (response === -1) {
      filteredContacts.push(contact);
    }
  }

  return filteredContacts;
};

export const sendSms = (phoneNumber, message) => {
  SendSMS.send(
    {
      body: message || inviteMessage,
      recipients: [phoneNumber],
      successTypes: ['sent', 'queued'],
      allowAndroidSendWithoutReadPermission: true,
    },
    (completed, cancelled, error) => {
      console.log(
        `SMS Callback: completed: ${completed}, cancelled: ${cancelled}, error: ${error}`,
      );
    },
  );
};

export const sendEmail = async (email, message) => {
  try {
    const metadata = await Image.resolveAssetSource(collxImage);
    Mailer.mail({
      subject: inviteTitle,
      recipients: [email],
      body: message || inviteMessage,
      attachments: [
        {
          uri: metadata.uri,
          type: 'png',
          name: 'collx.png',
        },
      ],
    }, (error, event) => {
      console.log(`Email Callback: event: ${event}, error: ${error}`);
    });
  } catch (error) {
    console.log(error);
  }
};

export const contactSupport = () => {
  try {
    Mailer.mail({
      subject: 'Need Help',
      recipients: [Constants.contactUs],
      body: '',
      isHTML: true,
    }, (error, event) => {
      console.log('Error: ', error);
      console.log('Event: ', event);
    });

    analyticsSendEvent(
      analyticsEvents.contactedSupport,
    );
  } catch (error) {
    console.log(error);
  }
};

export const getInviteOptions = contact => {
  const {emailAddresses, phoneNumbers} = contact;

  if (!emailAddresses.length && !phoneNumbers.length) {
    return [];
  } else if (emailAddresses.length === 1 && !phoneNumbers.length) {
    sendEmail(emailAddresses[0].email);
    return [];
  } else if (!emailAddresses.length && phoneNumbers.length === 1) {
    sendSms(phoneNumbers[0].number);
    return [];
  }

  return [...phoneNumbers, ...emailAddresses];
};

export const getReferralMessage = code => {
  return `I started using CollX, an app that helps me figure out how much my trading cards are worth. You should get it, too! Check out my collection and add yours. Use my referral code, ${code}, when signing up. http://collx.app`;
};
