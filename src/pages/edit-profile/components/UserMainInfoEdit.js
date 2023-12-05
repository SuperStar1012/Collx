import React, {useState, useEffect} from 'react';
import {Text, TextInput, View} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {
  EmailSuggestion,
} from 'components';
import UserInfoTextInputLabel from './UserInfoTextInputLabel';
import UserInfoTextInput from './UserInfoTextInput';

import {Constants} from 'globals';
import {createUseStyle, useTheme} from 'theme';

const UserMainInfoEdit = ({
  profile,
  correctEmail,
  onUpdateUser,
}) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment UserMainInfoEdit_profile on Profile {
      name
      email
      location
      bio
    }`,
    profile
  );

  const [name, setName] = useState(profileData.name || '');
  const [email, setEmail] = useState(profileData.email || '');
  const [location, setLocation] = useState(profileData.location || '');
  const [bio, setBio] = useState(profileData.bio || '');

  const [currentCorrectEmail, setCurrentCorrectEmail] = useState(correctEmail);

  useEffect(() => {
    updateUserInfo();
  }, [
    name,
    email,
    location,
    bio,
  ]);

  useEffect(() => {
    setCurrentCorrectEmail(correctEmail);
  }, [correctEmail]);

  const updateUserInfo = () => {
    let userInfo = {};
    if (name?.trim()) {
      userInfo.name = name?.trim();
    }

    if (email) {
      userInfo.email = email;
    }

    userInfo.location = location;

    if (bio) {
      userInfo.bio = bio;
    }

    if (onUpdateUser) {
      onUpdateUser(userInfo);
    }
  };

  const handleChangeEmail = (value) => {
    setEmail(value);
    setCurrentCorrectEmail('');
  };

  return (
    <>
      <UserInfoTextInput
        label="Name"
        autoCapitalize="words"
        placeholder="Name"
        value={name}
        maxLength={Constants.nameMaxLength}
        onChangeText={setName}
      />
      <UserInfoTextInput
        label="Email"
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={handleChangeEmail}
      />
      <EmailSuggestion
        style={styles.textErrorEmail}
        email={currentCorrectEmail}
      />
      <UserInfoTextInput
        label="Location"
        isOptional
        placeholder="City, State"
        value={location}
        onChangeText={setLocation}
      />
      <View style={styles.itemContainer}>
        <UserInfoTextInputLabel label="Bio" isOptional />
        <View style={styles.noteWrapper}>
          <TextInput
            style={styles.textInputNote}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Tell us more about yourself..."
            placeholderTextColor={colors.placeholderText}
            multiline
            numberOfLines={3}
            value={bio}
            underlineColorAndroid="transparent"
            onChangeText={(newText) => {
              if (newText.length <= 350) {
                setBio(newText);
              }
            }}
          />
          <Text style={styles.textNoteLengh}>{bio.length}/350</Text>
        </View>
      </View>
    </>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  itemContainer: {
    marginVertical: 12,
  },
  noteWrapper: {
    flex: 1,
    height: 110,
    marginTop: 7,
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
  },
  textInputNote: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 6,
    textAlignVertical: 'top',
  },
  textNoteLengh: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    textAlign: 'right',
    margin: 6,
  },
  textErrorEmail: {
    marginTop: 0,
  },
}));

export default UserMainInfoEdit;
