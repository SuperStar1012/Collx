import React, {useState, useRef} from 'react';
import {View} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {graphql, useFragment} from 'react-relay';
import ImagePicker from 'react-native-image-crop-picker';

import {
  Image,
  Button,
  AllowCameraAccessSheet,
  AllowPhotoLibraryAccessSheet,
} from 'components';

import {Constants} from 'globals';
import {Fonts, createUseStyle, useTheme} from 'theme';
import {
  checkCameraPermission,
  checkPhotoLibraryPermission,
} from 'utils';

const actionLabels = [
  'Take a Photo',
  'Choose from Library',
  'Cancel',
];

const AvatarEdit = ({
  profile,
  onUploadAvatar,
}) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment AvatarEdit_profile on Profile {
      avatarImageUrl
    }`,
    profile
  );

  const [isVisibleCameraAccess, setIsVisibleCameraAccess] = useState(false);
  const [isVisiblePhotoAccess, setIsVisiblePhotoAccess] = useState(false);

  const actionSheetRef = useRef(null);

  const uploadAvatarImage = croppingResult => {
    const path = croppingResult.path;
    const filename = path.split('/').pop();
    if (croppingResult && onUploadAvatar) {
      onUploadAvatar({
        uri: croppingResult.path,
        type: croppingResult.mime,
        name: filename,
      });
    }
  };

  const handleCloseCameraAccess = () => {
    setIsVisibleCameraAccess(false);
  };

  const handleClosePhotoAccess = () => {
    setIsVisiblePhotoAccess(false);
  };

  const handleChangeAvatar = () => {
    setTimeout(() => {
      actionSheetRef.current?.show();
    });
  };

  const handleSelectAction = async index => {
    switch (index) {
      case 0: {
        // Camera
        const isGranted = await checkCameraPermission();
        if (!isGranted) {
          setIsVisibleCameraAccess(true);
          return;
        }

        const croppingResult = await ImagePicker.openCamera({
          width: 300,
          height: 300,
          cropping: true,
          cropperCircleOverlay: true,
        });

        uploadAvatarImage(croppingResult);

        break;
      }
      case 1: {
        // Library
        const isGranted = await checkPhotoLibraryPermission();
        if (!isGranted) {
          setIsVisiblePhotoAccess(true);
          return;
        }

        const croppingResult = await ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: true,
          cropperCircleOverlay: true,
        });

        uploadAvatarImage(croppingResult);
        break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={profileData.avatarImageUrl || Constants.defaultAvatar}
        style={styles.imageAvatar}
      />
      <Button
        style={styles.changeButton}
        label="Change"
        labelStyle={styles.textChange}
        scale={Button.scaleSize.Four}
        onPress={() => handleChangeAvatar()}
      />
      <AllowCameraAccessSheet
        isVisible={isVisibleCameraAccess}
        onClose={handleCloseCameraAccess}
      />
      <AllowPhotoLibraryAccessSheet
        isVisible={isVisiblePhotoAccess}
        onClose={handleClosePhotoAccess}
      />
      <ActionSheet
        ref={actionSheetRef}
        tintColor={colors.primaryText}
        options={actionLabels}
        cancelButtonIndex={actionLabels.length - 1}
        onPress={handleSelectAction}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginVertical: 16,
    alignItems: 'center',
  },
  imageAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  changeButton: {
    width: 96,
    height: 31,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginTop: 12,
  },
  textChange: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
}));

export default AvatarEdit;