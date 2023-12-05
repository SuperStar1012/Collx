import React, {useEffect, useState} from 'react';
import {View, Image, Text, FlatList} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {launchCamera} from 'react-native-image-picker';
import initials from 'initials';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {
  Button,
  LoadingIndicator,
  ProgressStep,
  AllowCameraAccessSheet,
} from 'components';
import CameraItem from './components/CameraItem';
import PhotoItem from './components/PhotoItem';
import AllowPhotoAccess from './components/AllowPhotoAccess';

import {Constants, Styles} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {withUser} from 'store/containers';
import {
  getFilename,
  checkCameraPermission,
  checkPhotoLibraryPermission,
} from 'utils';
import {usePrevious} from 'hooks';

const SignUpAvatar = ({
  navigation,
  route,
  isFetching,
  isUploadingAvatar,
  user,
  uploadAvatar,
}) => {
  const {isAnonymousUser} = route.params || {};

  const styles = useStyle();

  const prevProps = usePrevious({user});

  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [isCheckedPermission, setIsCheckedPermission] = useState(false);
  const [requestPermission, setRequestPermission] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endCursor, setEndCursor] = useState(null);
  const [isVisibleCameraAccess, setIsVisibleCameraAccess] = useState(false);

  useEffect(() => {
    setNavigationBar();
    requestPhotoPermissions();
  }, []);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (
      prevProps?.user?.avatarImageUrl &&
      user?.avatarImageUrl &&
      prevProps?.user?.avatarImageUrl !== user?.avatarImageUrl
    ) {
      navigateFriends(); // navigateReferralCode();
    }
  }, [user]);

  const setNavigationBar = () => {
    navigation.setOptions({
      // title: 'Select Avatar',
    });
  };

  const requestPhotoPermissions = async () => {
    const isGranted = await checkPhotoLibraryPermission();

    if (!isGranted) {
      setRequestPermission('Photos');
    } else {
      getPhotos();
    }

    setIsCheckedPermission(true);
  };

  const requestCameraPermissions = async () => {
    const isGranted = await checkCameraPermission();
    if (!isGranted) {
      setIsVisibleCameraAccess(true);
    } else {
      launchCamera(
        {
          cameraType: 'front',
          includeBase64: false,
          saveToPhotos: false,
        },
        response => {
          // console.log('launchCamera - response: ', response);
          if (response.assets && response.assets.length) {
            setCurrentPhoto(response.assets[0]);
          }
        },
      );
    }
  };

  const getPhotos = () => {
    const params = {
      first: 50,
      assetType: 'Photos',
    };

    if (!hasNextPage) {
      return;
    }

    if (endCursor) {
      params.after = endCursor;
    }

    CameraRoll.getPhotos(params).then(response => {
      // console.log(response);
      if (endCursor === response.page_info.end_cursor) {
        return;
      }
      const newPhotos = response.edges.map(edge => edge.node.image);
      setPhotos([...photos, ...newPhotos]);
      setEndCursor(response.page_info.end_cursor);
      setHasNextPage(response.page_info.has_next_page);
    });
  };

  const uploadAvatarImage = async asset => {
    let avatarUri = asset.uri;

    try {
      const resizedImage = await ImageResizer.createResizedImage(
        avatarUri,
        Constants.avatarImageWidth,
        Math.round((asset.height * Constants.avatarImageWidth) / asset.width),
        'JPEG',
        100,
        0,
        // undefined,
        // false,
      );

      if (resizedImage && resizedImage.uri) {
        avatarUri = resizedImage.uri;
      }
    } catch (error) {
      console.log(error);
    }

    if (avatarUri) {
      uploadAvatar({
        uri: avatarUri,
        type: asset.type,
        name: asset.filename || getFilename(asset.uri) || getFilename(avatarUri),
      });
    }
  };

  // const navigateReferralCode = () => {
  //   navigation.navigate('SignUpReferralCode', {isAnonymousUser});
  // }

  const navigateFriends = () => {
    navigation.navigate('Friends', {
      isSignUp: true,
      isAnonymousUser,
      referral: null,
    });
  };

  const handleSelectPhoto = photo => {
    setCurrentPhoto(photo);
  };

  const handleOpenCamera = () => {
    requestCameraPermissions();
  };

  const handleCloseCameraAccess = () => {
    setIsVisibleCameraAccess(false);
  };

  const handleNext = () => {
    if (currentPhoto) {
      uploadAvatarImage(currentPhoto);
      return;
    }

    navigateFriends(); // navigateReferralCode();
  };

  const handleEndReached = ({distanceFromEnd}) => {
    if (distanceFromEnd < 0) {
      return;
    }

    getPhotos();
  }

  const renderAvatar = () => {
    if (currentPhoto) {
      return <Image style={styles.imageAvatar} source={currentPhoto} />;
    } else if (user && user.name) {
      return <Text style={styles.textInitials}>{initials(user.name)}</Text>;
    }
    return null;
  };

  const renderItem = ({item, index}) => {
    if (index === 0) {
      // Camera
      return <CameraItem onPress={handleOpenCamera} />;
    }

    const photoUri = `${item.uri}/${item.filename}`;
    const currentPhotoUri =
      currentPhoto && `${currentPhoto.uri}/${currentPhoto.filename}`;
    const isSelected = photoUri === currentPhotoUri;
    return (
      <PhotoItem
        key={index}
        photo={item}
        isSelected={isSelected}
        onPress={() => handleSelectPhoto(isSelected ? null : item)}
      />
    );
  };

  const renderMainContent = () => {
    if (!isCheckedPermission) {
      return null;
    }

    if (requestPermission) {
      return <AllowPhotoAccess requestPermission={requestPermission} />;
    }

    return (
      <FlatList
        data={[{item: 'camera'}, ...photos]}
        numColumns={4}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={[
          styles.scrollContentContainer,
          {paddingBottom: Styles.screenSafeBottomHeight + 4},
        ]}
        onEndReachedThreshold={0.2}
        onEndReached={handleEndReached}
      />
    );
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <LoadingIndicator isLoading={isFetching || isUploadingAvatar} />
        <ProgressStep currentStep={5} totalSteps={Constants.authProgressSteps} />
        <View style={styles.mainContainer}>
          <View style={styles.avatarContainer}>{renderAvatar()}</View>
          <Text style={styles.textTitle}>
            Hi {user?.name?.split(' ')[0]}, please select an avatar.
          </Text>
          <Text style={styles.textDescription}>
            Add a face to your collection. Your avatar will help others to know
            you better.
          </Text>
        </View>
        <Button
          style={styles.nextButton}
          labelStyle={styles.textNext}
          label="Next"
          scale={Button.scaleSize.One}
          onPress={() => handleNext()}
        />
        <View style={styles.photosContainer}>{renderMainContent()}</View>
        <AllowCameraAccessSheet
          isVisible={isVisibleCameraAccess}
          onClose={handleCloseCameraAccess}
        />
      </View>
    </BottomSheetModalProvider>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  mainContainer: {
    marginHorizontal: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  textInitials: {
    fontWeight: Fonts.bold,
    fontSize: 46,
    color: Colors.white,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    marginTop: 16,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginTop: 8,
  },
  nextButton: {
    height: 48,
    borderRadius: 10,
    margin: 16,
    backgroundColor: colors.primary,
  },
  textNext: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    color: Colors.white,
  },
  photosContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.secondaryCardBackground,
  },
  scrollContentContainer: {
    padding: 4,
  },
}));

export default withUser(SignUpAvatar);
