import React, {useEffect, useState} from 'react';
import {graphql, useRefetchableFragment} from 'react-relay';
import {useNavigation} from '@react-navigation/native';
import {openInbox} from 'react-native-email-link';

import {
  VerifyUserEmailSheet,
  LoadingIndicator,
} from 'components';

import {withUserProvider} from 'store/containers';
import {Constants} from 'globals';
import {useActions} from 'actions';
import {
  showErrorAlert,
  removeStorageItem,
} from 'utils';

const UserProvider = ({
  profile,
  verifiedAction,
  isEmailVerified,
  setEmailVerifiedAction,
}) => {
  const navigation = useNavigation();
  const actions = useActions();

  const [isVisible, setIsVisible] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const [profileData, refetch] = useRefetchableFragment(
    graphql`
      fragment UserProvider_profile on Profile
      @refetchable(queryName: "UserProviderRefetchQuery") {
        status
        email
        type
        viewer {
          isMyEmailVerified
        }
      }
    `,
    profile,
  );

  if (!profileData) {
    return null;
  }

  const {
    status,
    email,
    type: profileType,
  } = profileData || {};
  const {isMyEmailVerified} = profileData?.viewer || {};

  useEffect(() => {
    const isProUser = profileType === Constants.userType.pro;

    if (!isProUser) {
      removeStorageItem(Constants.cardUploadInfo);
    }
  }, []);

  useEffect(() => {
    if (status === Constants.userStatus.suspended || status === Constants.userStatus.banned) {
      navigation.navigate('IrregularUserModal', {
        userStatus: status,
      });
    }
  }, [status]);

  useEffect(() => {
    if (isEmailVerified) {
      refetch({}, {fetchPolicy: 'network-only'})
    }
  }, [isEmailVerified]);

  useEffect(() => {
    if (!verifiedAction) {
      return;
    }

    if (isUnverifiedMyEmail()) {
      setIsVisible(true);
    } else {
      verifiedAction();
    }
  }, [isMyEmailVerified, verifiedAction]);

  const isUnverifiedMyEmail = () => {
    if (isMyEmailVerified) {
      return false;
    }

    return true;
  };

  const handleClose = () => {
    setIsVisible(false);

    setEmailVerifiedAction(null);
  };

  const handleResendVerificationEmail = () => {
    setIsVerifyingEmail(true);

    actions.initiateEmailVerification({
      onComplete: () => {
        setIsVerifyingEmail(false);

        try {
          openInbox({
            removeText: true,
          });
        } catch (error) {
          console.log(error);
        }
      },
      onError: (error) => {
        setIsVerifyingEmail(false);

        if (error?.message) {
          showErrorAlert(error?.message);
        }
      },
    });
  };

  return (
    <>
      <LoadingIndicator isLoading={isVerifyingEmail} />
      <VerifyUserEmailSheet
        isVisible={isVisible}
        email={email}
        onResend={handleResendVerificationEmail}
        onClose={handleClose}
      />
    </>
  );
};

export default withUserProvider(UserProvider);
