import React, {Suspense, useEffect, useState, useCallback, useRef, forwardRef} from 'react';
import {View, Alert} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import ActionSheet from 'react-native-actionsheet';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import NavBarRightForMe from './components/NavBarRightForMe';
import NavBarRightForOtherUsers from './components/NavBarRightForOtherUsers';
import ProfileContent from './ProfileContent';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions'
import {withProfile} from 'store/containers';
import {createUseStyle, useTheme} from 'theme';
import {SchemaTypes} from 'globals';

const actionLabels = [
  'Report User',
  'Block User',
  'Cancel',
];

const otherUserProfileQuery = (profileId, queryOptions) =>
  useLazyLoadQuery(graphql`
    query ProfilePageOtherUserQuery($profileId: ID!) {
      profile(with: {id: $profileId}) {
        id
        name
        viewer {
          isMe
          areTheyBlockingMe
        }
        ...NavBarRightForMe_profile
        ...NavBarRightForOtherUsers_profile
        ...ProfileContent_profile
      }
      viewer {
        ...ProfileContent_viewer
      }
    }`,
    {profileId},
    queryOptions
  );


const myProfileQuery = (queryOptions) =>
  useLazyLoadQuery(graphql`
    query ProfilePageMyProfileQuery {
      viewer {
        profile {
          id
          viewer {
            isMe
          }
          ...NavBarRightForMe_profile
          ...ProfileContent_profile
        }
        ...ProfileContent_viewer
      }
    }`,
    {},
    queryOptions
  );

const ProfilePage = (props) => {
  const {
    navigation,
    route,
    setFilter,
    setBlock,
  } = props;

  const styles = useStyle();

  const actionSheetRef = useRef(null);
  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const displayUserActionSheet = () => {
    setTimeout(() => {
      actionSheetRef.current?.show();
    });
  };

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({
      navigation,
      setFilter,
      setBlock,
    }),
    refresh: handleRefresh,
    displayUserActionSheet,
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <Content
              ref={actionSheetRef}
              profileId={route.params?.profileId}
              queryOptions={refreshedQueryOptions ?? {}}
              navigation={navigation}
              styles={styles}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const Content = forwardRef((props, ref) => {
  const {
    navigation,
    profileId,
    queryOptions,
  } = props;

  const actions = useActions();
  const {t: {colors}} = useTheme();

  const profileData = profileId ? otherUserProfileQuery(profileId, queryOptions) : myProfileQuery(queryOptions);

  if (!profileData) {
    return null;
  }

  const profile = profileId ? profileData.profile : profileData.viewer?.profile;

  useEffect(() => {
    setNavigationBar();
  }, [profile, actions]);

  const setNavigationBar = () => {
    const {isMe, areTheyBlockingMe} = profile.viewer;

    let headerRight = null;
    if (isMe) {
      headerRight = <NavBarRightForMe profile={profile} actions={actions} />;
    } else if (!areTheyBlockingMe) {
      headerRight = <NavBarRightForOtherUsers profile={profile} actions={actions} />;
    }

    navigation.setOptions({
      headerRight: () => headerRight,
    });
  };

  const handleBlockUser = () => {
    if (profile.id) {
      actions.setBlockOrUnblockUser(profile.id, true);
      actions.blockOrUnblockUser(profile.id, true);
    }
  };

  const handleReportUser = () => {
    if (profile.id) {
      actions.navigateReportIssueDetail({
        forInput: {
          profileId: profile.id,
        },
        issueType: SchemaTypes.issueType.USER,
        isCloseBack: true,
      });
    }
  };

  const handleSelectAction = async index => {
    switch (index) {
      case 0:
        // Report User
        handleReportUser();
        break;
      case 1:
        // Block User
        Alert.alert(
          'Block User',
          `${profile.name} will no longer be able to follow or message you, and you will not see notifications from ${profile.name}.`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Block',
              style: 'destructive',
              onPress: handleBlockUser,
            },
          ],
        );
        break;
    }
  };

  return (
    <>
      <ProfileContent
        profile={profile}
        viewer={profileData.viewer}
      />
      <ActionSheet
        ref={ref}
        tintColor={colors.primary}
        options={actionLabels}
        cancelButtonIndex={actionLabels.length - 1}
        destructiveButtonIndex={1}
        onPress={handleSelectAction}
      />
    </>
  );
});

Content.displayName = 'Content';

export default withProfile(ProfilePage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginTop: 7,
    marginHorizontal: 16,
  },
  moreActionsContainer: {
    marginVertical: 11,
  },
  iconAction: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
}));
