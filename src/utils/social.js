import {
  LoginManager,
  Settings,
  AccessToken,
  Profile,
} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';
import {Urls} from 'globals';

const getFullName = (firstName, lastName, nickName = '') => {
  let fullName = '';

  if (firstName) {
    fullName = firstName;
  }

  if (lastName) {
    fullName += (fullName ? ' ' : '') + lastName;
  }

  if (!fullName) {
    fullName = nickName;
  }

  return fullName;
};

export const logInWithApple = async (onSuccess, onFail) => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    // use credentialState response to ensure the user is authenticated
    if (credentialState !== appleAuth.State.AUTHORIZED) {
      const errorMessage = 'Apple Login failed with the Auth error.';
      console.log(errorMessage);

      if (onFail) {
        onFail(new Error(errorMessage));
      }
      return;
    }

    // Apple only returns the full name and email on the first login
    // However: You can get the email address by parsing the JWT token that's returned from any authentication
    const {email} = jwt_decode(appleAuthRequestResponse.identityToken);

    if (onSuccess) {
      let name = null;
      if (appleAuthRequestResponse.fullName) {
        name = getFullName(
          appleAuthRequestResponse.fullName.givenName,
          appleAuthRequestResponse.fullName.familyName,
          appleAuthRequestResponse.fullName.nickname
        );
      }

      onSuccess({
        email,
        name,
        appleId: appleAuthRequestResponse.user,
        appleToken: appleAuthRequestResponse.authorizationCode,
      });
    }
  } catch (error) {
    console.log('Apple Login failed with error: ', error);
    if (onFail) {
      onFail(error);
    }
  }
};

const getFacebookProfile = async token => {
  let result = null;

  try {
    const fetchResult = await fetch(`${Urls.facebookApiUrl}?fields=email,name&access_token=${token}`);
    if (fetchResult) {
      result = await fetchResult.json();
    }
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const logInWithFacebook = async (onSuccess, onFail) => {
  Settings.initializeSDK();
  LoginManager.logInWithPermissions(['public_profile', 'email']).then(
    async result => {
      if (result.isCancelled) {
        console.log('Login cancelled');
        return;
      }

      const accessTokenData = await AccessToken.getCurrentAccessToken();

      if (!accessTokenData) {
        const errorMessage = 'Facebook Login failed with wrong access token';
        console.log(errorMessage);
        if (onFail) {
          onFail(errorMessage);
        }
        return;
      }

      let currentProfile = await Profile.getCurrentProfile();

      if (!currentProfile) {
        currentProfile = await getFacebookProfile(accessTokenData.accessToken);
      }

      if (!currentProfile) {
        const errorMessage = 'Facebook Login failed with wrong profile';
        console.log(errorMessage);
        if (onFail) {
          onFail(errorMessage);
        }
        return;
      }

      if (onSuccess) {
        onSuccess({
          email: currentProfile.email,
          name: currentProfile.name,
          // avatarUri: currentProfile.imageURL,
          facebookId:
            currentProfile.id ||
            currentProfile.userID ||
            accessTokenData.userID,
          facebookToken: accessTokenData.accessToken,
        });
      }
    },
    error => {
      console.log('Facebook Login failed with error: ' + error);
      if (onFail) {
        onFail(error);
      }
    },
  );
};

export const logInWithGoogle = async (onSuccess, onFail) => {
  GoogleSignin.configure();
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    if (userInfo && userInfo.user) {
      const userTokens = await GoogleSignin.getTokens();

      const googleData = {
        email: userInfo.user.email,
        name: userInfo.user.name,
        // avatarUri: userInfo.user.photo,
        googleId: userInfo.user.id,
        googleToken: userTokens.accessToken,
      };

      if (onSuccess) {
        onSuccess(googleData);
      }
    }
  } catch (error) {
    console.log('Google Login failed with error: ', error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }

    if (onFail) {
      onFail(error);
    }
  }
};
