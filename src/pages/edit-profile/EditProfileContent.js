import React, {useState, useEffect} from 'react';
import {Alert, View, RefreshControl} from 'react-native';
import {CommonActions, StackActions} from '@react-navigation/native';
import isEmail from 'validator/lib/isEmail';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  NavBarButton,
  LoadingIndicator,
  KeyboardAvoidingScrollView,
} from 'components';
import AvatarEdit from './components/AvatarEdit';
import UserMainInfoEdit from './components/UserMainInfoEdit';
import SocialInfoEdit from './components/SocialInfoEdit';

import {createUseStyle, useTheme} from 'theme';
import {
  correctEmailTypo,
  showErrorAlert,
} from 'utils';
import {usePrevious} from 'hooks';
import {withProfile} from 'store/containers';
import {useActions} from 'actions';

const EditProfileContent = ({
  navigation,
  isUpdatingUser,
  isUploadingAvatar,
  user,
  queryOptions,
  uploadAvatar,
  updateUser,
  signOut,
  errorText,
}) => {
  const styles = useStyle();
  const {t: {colors}} = useTheme();

  const actions = useActions();

  const viewerData = useLazyLoadQuery(graphql`
    query EditProfileContentQuery {
      viewer {
        profile {
          email
          ...AvatarEdit_profile
          ...UserMainInfoEdit_profile
          ...SocialInfoEdit_profile
        }
      }
    }`,
    {},
    queryOptions
  );

  const prevProps = usePrevious({
    isUpdatingUser,
    isUploadingAvatar,
    email: user?.email,
    errorText,
  });

  const [mainUserInfo, setMainUserInfo] = useState(null);
  const [correctEmail, setCorrectEmail] = useState('');

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [socialInfo, setSocialInfo] = useState(null);

  useEffect(() => {
    if (
      errorText?.updateUser &&
      !prevProps?.errorText?.updateUser &&
      prevProps?.errorText?.updateUser !== errorText?.updateUser
    ) {
      Alert.alert(
        'An error has occurred',
        errorText?.updateUser,
        [
          {
            text: 'OK',
            // onPress: handleCancel,
          },
        ],
      );
    }
  }, [errorText]);

  useEffect(() => {
    setNavigationBar();
  }, [
    mainUserInfo,
    socialInfo,
    isUpdatingUser,
    isUploadingAvatar,
    isSavingProfile,
  ]);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (prevProps.isUpdatingUser && !isUpdatingUser) {
      if (prevProps.email === user?.email) {
        handleCancel();
        return;
      }

      Alert.alert(
        'CollX',
        'Since your email has changed, you will need to log in again with your new email to continue using the app.',
        [
          {
            text: 'OK',
            onPress: handleLogout,
          },
        ],
      );
    }
  }, [isUpdatingUser, user]);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (prevProps.isUploadingAvatar && !isUploadingAvatar) {
      actions.updateProfileInLocal({
        avatarImageUrl: user.avatarImageUrl,
      });
    }
  }, [isUploadingAvatar, user]);

  const setNavigationBar = () => {
    const {name, email} = mainUserInfo || {};
    const isDisabled = !name?.trim() || !email || !isEmail(email);

    navigation.setOptions({
      title: 'Edit Profile Info',
      headerLeft: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Cancel"
          onPress={handleCancel}
        />
      ),
      headerRight: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Save"
          disabled={isDisabled}
          onPress={handleSave}
        />
      ),
    });
  };

  const updateMainUserInfo = () => {
    if (!mainUserInfo) {
      return;
    }

    updateUser(mainUserInfo);

    actions.updateProfileInLocal(mainUserInfo);
  };

  const updateSocialInfo = () => {
    if (!socialInfo) {
      updateMainUserInfo();
      return;
    }

    setIsSavingProfile(true);

    actions.updateProfile({
      socialMedia: socialInfo,
    }, {
      onComplete: () => {
        setIsSavingProfile(false);
        updateMainUserInfo();
      },
      onError: (error) => {
        console.log(error);
        setIsSavingProfile(false);

        if (error?.message) {
          showErrorAlert(error?.message);
        }
      }
    });
  };

  const handleCancel = () => {
    if (isUpdatingUser || isUploadingAvatar) {
      return;
    }

    navigation.goBack();
  };

  const handleSave = () => {
    if (isUpdatingUser || isUploadingAvatar || isSavingProfile) {
      return;
    }

    const {email} = mainUserInfo;

    const checkedEmail = correctEmailTypo(email);
    if (!correctEmail && email !== checkedEmail) {
      setCorrectEmail(checkedEmail);
      return;
    }

    updateSocialInfo();
  };

  const handleLogout = () => {
    signOut();

    navigation.dispatch(StackActions.popToTop());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{
          name: 'AuthStackScreens',
          state: {
            routes: [
              {
                name: "Welcome",
              },
            ],
          },
        }],
      }),
    );
  };

  const handleRefresh = () => {
    actions.refresh();
  };

  const handleUploadAvatar = asset => {
    uploadAvatar(asset);
  };

  const handleUpdateUser = info => {
    setMainUserInfo(info);
  };

  const handleUpdateSocials = info => {
    setSocialInfo(info);
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isUpdatingUser || isUploadingAvatar || isSavingProfile} />
      <KeyboardAvoidingScrollView
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={false}
            tintColor={colors.primary}
            onRefresh={handleRefresh}
          />
        }
      >
        <AvatarEdit
          profile={viewerData.viewer?.profile}
          onUploadAvatar={handleUploadAvatar}
        />
        <UserMainInfoEdit
          profile={viewerData.viewer?.profile}
          correctEmail={correctEmail}
          onUpdateUser={handleUpdateUser}
        />
        <SocialInfoEdit
          profile={viewerData.viewer?.profile}
          onUpdateSocials={handleUpdateSocials}
        />
      </KeyboardAvoidingScrollView>
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  navBarButton: {
    minWidth: 70,
    paddingHorizontal: 10,
  },
  scrollContentContainer: {
    paddingHorizontal: 16,
  },
}));

export default withProfile(EditProfileContent);
