import React, {useEffect, useState, useRef, useMemo} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet';
import {v4 as uuidv4} from 'uuid';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {
  Button,
  NavBarModalHeader,
  NavBarButton,
  KeyboardAvoidingView,
  LoadingIndicator,
  AllowCameraAccessSheet,
  AllowPhotoLibraryAccessSheet,
} from 'components';
import ImageIssue from './components/ImageIssue';
import InfoIssue from './components/InfoIssue';
import OrderIssue from './components/OrderIssue';
import OtherIssue from './components/OtherIssue';
import PriceIssue from './components/PriceIssue';
import UserIssue from './components/UserIssue';
import CommentIssue from './components/CommentIssue';
import IssueAttachments from './components/IssueAttachments';

import ActionContext, {
  useActions,
  createNavigationActions,
  createCloudActions,
} from 'actions';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {SchemaTypes} from 'globals';
import {
  checkCameraPermission,
  checkPhotoLibraryPermission,
  getFilename,
  getReportTitle,
  showErrorAlert,
} from 'utils';

const closeIcon = require('assets/icons/close.png');

const actionLabels = [
  'Take a Photo',
  'Choose from Library',
  'Cancel',
];

const maxAttachmentCount = 8;
const addNewImage = 'add';

const ReportIssueDetailPage = ({
  navigation,
  route,
}) => {
  const {
    forInput,
    issueType,
    issueCategory,
    isCloseBack,
    tradingCardIdForIssue, // Remove later
  } = route.params || {};

  const styles = useStyle();
  const {t: {colors}} = useTheme();

  const [currentIssue, setCurrentIssue] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  const actionSheetRef = useRef(null);

  const attachmentsRef = useRef([addNewImage]);

  const [attachments, setAttachments] = useState(attachmentsRef.current);
  const [isVisibleCameraAccess, setIsVisibleCameraAccess] = useState(false);
  const [isVisiblePhotoAccess, setIsVisiblePhotoAccess] = useState(false);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createCloudActions(),
  };

  const isDisabledReport = useMemo(() => (
    attachments.findIndex(item => item !== addNewImage && item.isUploading) > -1
  ), [attachments]);

  useEffect(() => {
    setNavigationBar();
  }, [issueType, styles]);

  const setNavigationBar = () => {
    const options = {
      title: getReportTitle(issueType),
      header: NavBarModalHeader,
    };

    if (isCloseBack) {
      options.headerLeft = () => (
        <NavBarButton
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      );
    }

    navigation.setOptions(options);
  };

  const updateAttachment = (attachment) => {
    const index = attachmentsRef.current.findIndex(item => item.uuid === attachment.uuid);

    if (index === -1) {
      return;
    }

    attachmentsRef.current[index] = {
      ...attachmentsRef.current[index],
      ...attachment,
    }

    setAttachments([...attachmentsRef.current]);
  };

  const uploadIssueImage = async asset => {
    const filename = asset.fileName || asset.filename || getFilename(asset.uri);

    const oldAttachments = attachmentsRef.current.filter(item => item !== addNewImage);

    const newAttachment = {
      ...asset,
      uuid: uuidv4(),
      isUploading: true,
    };
    oldAttachments.push(newAttachment);

    if (oldAttachments.length < maxAttachmentCount) {
      oldAttachments.push(addNewImage);
    }

    attachmentsRef.current = oldAttachments;
    setAttachments(attachmentsRef.current);

    actions.createIssueAttachment(filename, {
      onComplete: ({id, uploadUrl}) => {
        if (!id || !uploadUrl) {
          updateAttachment({
            ...newAttachment,
            isUploading: false,
          });
          return;
        }

        actions.uploadFileToCloud(uploadUrl, asset.uri, {
          onComplete: () => {
            updateAttachment({
              ...newAttachment,
              attachmentId: id,
              isUploading: false,
            });
          },
          onError: (errorCode, errorMessage) => {
            console.log(errorCode, errorMessage);
            updateAttachment({
              ...newAttachment,
              isUploading: false,
            });

            if (errorMessage) {
              showErrorAlert(errorMessage);
            }
          },
        });
      },
      onError: (error) => {
        console.log(error);
        updateAttachment({
          ...newAttachment,
          isUploading: false,
        });

        if (error?.message) {
          showErrorAlert(error?.message);
        }
      },
    });
  };

  const handleClose = () => {
    if (!isCloseBack) {
      navigation.dispatch(StackActions.popToTop());
    }

    navigation.goBack();
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

        launchCamera(
          {
            saveToPhotos: false,
          },
          async response => {
            // console.log('launchCamera - response: ', response);
            if (response.assets && response.assets.length > 0) {
              uploadIssueImage(response.assets[0]);
            }
          },
        );
        break;
      }
      case 1: {
        // Library
        const isGranted = await checkPhotoLibraryPermission();
        if (!isGranted) {
          setIsVisiblePhotoAccess(true);
          return;
        }

        launchImageLibrary({
          includeBase64: false,
        }, async response => {
          // console.log('launchImageLibrary - response: ', response);
          if (response.assets && response.assets.length > 0) {
            uploadIssueImage(response.assets[0]);
          }
        });
        break;
      }
    }
  };

  const handleCloseCameraAccess = () => {
    setIsVisibleCameraAccess(false);
  };

  const handleClosePhotoAccess = () => {
    setIsVisiblePhotoAccess(false);
  };

  const handleAddAttachment = () => {
    setTimeout(() => {
      actionSheetRef.current?.show();
    });
  };

  const handleRemoveAttachment = (attachment) => {
    const filteredAttachments = attachmentsRef.current.filter(item => item.uuid !== attachment.uuid);

    const index = filteredAttachments.findIndex(item => item === addNewImage);
    if (index === -1 && filteredAttachments.length < maxAttachmentCount) {
      filteredAttachments.push(addNewImage);
    }

    attachmentsRef.current = filteredAttachments;
    setAttachments(attachmentsRef.current);
  };

  const handleChangeIssue = values => {
    setCurrentIssue(values);
  }

  const handleSendReport = () => {
    setIsCreating(true);

    const issueAttachmentIds = [];
    attachments.map((item) => {
      if (item !== addNewImage && item.attachmentId) {
        issueAttachmentIds.push(item.attachmentId);
      }
    });

    actions.createIssue({
      forInput,
      type: issueType,
      tradingCardIdForIssue,
      ...currentIssue,
    }, {
      onComplete: (issueId) => {
        if (!issueId) {
          setIsCreating(false);
          return;
        }

        if (!issueAttachmentIds.length) {
          setIsCreating(false);
          actions.navigateReportIssueConfirm({
            issueType
          });
          return;
        }

        actions.addIssueAttachmentsToIssue(issueId, issueAttachmentIds, {
          onComplete: () => {
            setIsCreating(false);
            actions.navigateReportIssueConfirm({
              issueType
            });
          },
          onError: (error) => {
            console.log(error);
            setIsCreating(false);

            if (error?.message) {
              showErrorAlert(error?.message);
            }
          },
        });
      },
      onError: (error) => {
        console.log(error);
        setIsCreating(false);

        if (error?.message) {
          showErrorAlert(error?.message);
        }
      },
    });
  };

  const renderIssue = () => {
    switch (issueType) {
      case SchemaTypes.issueType.COMMENT: {
        return <CommentIssue onChangeIssue={handleChangeIssue} />;
      }
      case SchemaTypes.issueType.IMAGE: {
        return <ImageIssue onChangeIssue={handleChangeIssue} />;
      }
      case SchemaTypes.issueType.INFO: {
        const {cardId} = forInput;
        return <InfoIssue isCanonicalCardInfo={cardId} onChangeIssue={handleChangeIssue} />;
      }
      case SchemaTypes.issueType.ORDER: {
        return <OrderIssue issueCategory={issueCategory} onChangeIssue={handleChangeIssue} />;
      }
      case SchemaTypes.issueType.OTHER: {
        return <OtherIssue onChangeIssue={handleChangeIssue} />;
      }
      case SchemaTypes.issueType.PRICE: {
        return <PriceIssue onChangeIssue={handleChangeIssue} />;
      }
      case SchemaTypes.issueType.USER: {
        return <UserIssue onChangeIssue={handleChangeIssue} />;
      }
    }

    return null;
  };

  const renderIssueAttachments = () => {
    if (issueType === SchemaTypes.issueType.COMMENT) {
      return null;
    }

    return (
      <IssueAttachments
        attachments={attachments}
        onAddAttachment={handleAddAttachment}
        onRemoveAttachment={handleRemoveAttachment}
      />
    );
  };

  return (
    <BottomSheetModalProvider>
      <ActionContext.Provider value={actions}>
        <SafeAreaView style={styles.container}>
          <LoadingIndicator isLoading={isCreating} />
          <KeyboardAvoidingView>
            <ScrollView>
              {renderIssue()}
              {renderIssueAttachments()}
            </ScrollView>
            <Button
              style={styles.sendReportButton}
              label="Send Report"
              labelStyle={styles.textSendReport}
              scale={Button.scaleSize.One}
              disabled={(issueType === SchemaTypes.issueType.OTHER && !currentIssue?.notes) || isDisabledReport}
              onPress={handleSendReport}
            />
          </KeyboardAvoidingView>
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
        </SafeAreaView>
      </ActionContext.Provider>
    </BottomSheetModalProvider>
  );
}

export default ReportIssueDetailPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  iconClose: {
    width: 28,
    height: 28,
  },
  sendReportButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  textSendReport: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
  },
}));
