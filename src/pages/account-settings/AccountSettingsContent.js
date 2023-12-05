import React, {useEffect, useMemo} from 'react';
import {Alert, FlatList, View} from 'react-native';
import {CommonActions, StackActions} from '@react-navigation/native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {LoadingIndicator} from 'components';
import SettingsItem from './components/SettingsItem';

import {createUseStyle} from 'theme';
import {withSettings} from 'store/containers';
import {usePrevious} from 'hooks';

const settingsNormalData = [
  {
    label: 'Edit Profile Info',
    route: 'EditProfile',
    icon: require('assets/icons/person_circle.png'),
  },
  {
    label: 'Change Username',
    route: 'ChangeUsername',
    icon: require('assets/icons/a_circle.png'),
  },
  {
    label: 'Change Password',
    route: 'ChangePassword',
    icon: require('assets/icons/key.png'),
  },
  {
    label: 'Privacy Settings',
    route: 'PrivacySettings',
    icon: require('assets/icons/hand-raised.png'),
  },
  {
    label: 'Delete My Account',
    alert: 'delete',
    icon: require('assets/icons/person_circle_plus.png'),
  },
];

const settingsAnonymousData = [
  {
    label: 'Delete My Account',
    alert: 'delete',
    icon: require('assets/icons/person_circle_plus.png'),
  },
];

const AccountSettingsContent = ({
  navigation,
  user,
  isDeletingUser,
  queryOptions,
  deleteUser,
  errorText,
  signOut,
}) => {
  const styles = useStyle();

  const prevProps = usePrevious({isDeletingUser});

  const queryData = useLazyLoadQuery(graphql`
    query AccountSettingsContentQuery {
      viewer {
        canIDeleteMyAccount
      }
    }`,
    {},
    queryOptions
  );

  const settingsData = useMemo(() => {
    if (user.anonymous) {
      return settingsAnonymousData;
    }

    return settingsNormalData;
  }, [user.anonymous]);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (prevProps.isDeletingUser && !isDeletingUser && !errorText?.deleteUser) {
      handleLogOut();
    }
  }, [isDeletingUser]);

  const displayAlertDeleteAccount = () => {
    const {canIDeleteMyAccount} = queryData.viewer;

    if (canIDeleteMyAccount) {
      Alert.alert(
        'Are you sure?',
        'Deleting your account is permanent and cannot be undone. You will lose all the cards in your collection.',
        [
          {
            text: 'Yes',
            style: 'destructive',
            onPress: handleDeleteAccount,
          },
          {
            text: 'No',
            style: 'cancel',
          },
        ],
      );

      return;
    }

    Alert.alert(
      'CollX',
      'You cannot delete your account since you have a current balance, pending purchases, or pending sales. Please complete your transactions and withdraw funds before deleting.',
      [
        {
          text: 'View Balance',
          onPress: () => {
            navigation.navigate('MyMoneyScreens', {
              screen: 'MyMoney'
            });
          },
        },
        {
          text: 'View Purchases',
          onPress: () => {
            navigation.navigate('OrderScreens', {
              screen: 'MyPurchases',
            });
          },
        },
        {
          text: 'View Sales',
          onPress: () => {
            navigation.navigate('OrderScreens', {
              screen: 'MySales',
            });
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    if (user?.id) {
      deleteUser(user?.id);
    }
  };

  const handleLogOut = () => {
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

  const handleSelect = item => {
    if (item.route) {
      navigation.navigate(item.route);
    } else if (item.alert === 'delete') {
      displayAlertDeleteAccount();
    }
  };

  const renderItem = ({item}) => (
    <SettingsItem
      {...item}
      onPress={() => handleSelect(item)}
    />
  );

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isDeletingUser} />
      <FlatList
        data={settingsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));

export default withSettings(AccountSettingsContent);
