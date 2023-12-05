import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import SearchPage from '../pages/search/SearchPage';
import UniversalSearchPage from '../pages/search/UniversalSearchPage';
import DatabaseSearchAllResultPage from '../pages/search/DatabaseSearchAllResultPage';
import ArticleSearchAllResultPage from '../pages/search/ArticleSearchAllResultPage';
import SaleSearchAllResultPage from '../pages/search/SaleSearchAllResultPage';
import SearchFiltersPage from '../pages/search/SearchFiltersPage';
import UsersSearchPage from '../pages/search/UsersSearchPage';
import ScanSearchPage from '../pages/search/ScanSearchPage';

import CardAddPage from '../pages/card-edit/CardAddPage';
import CardEditPage from '../pages/card-edit/CardEditPage';

import PossibleMatchesPage from '../pages/camera-matches/CameraPossibleMatchesPage';

import ProfilePage from '../pages/profile/ProfilePage';
import FollowingThemPage from '../pages/following-them/FollowingThemPage';
import TheyFollowingPage from '../pages/they-following/TheyFollowingPage';

import ChatPage from '../pages/messages/ChatPage';

import {CollectionNavigation} from './collection';
import {CardDetailNavigation} from './card-detail';

import {Styles} from 'globals';

const SearchStack = createStackNavigator();

export const SearchNavigation = React.memo(({route}) => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  const headerStatusBarHeight = route?.name?.includes('Modal') ? Styles.headerStatusBarHeight : undefined;

  return (
    <SearchStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStatusBarHeight,
      }}>
      <SearchStack.Screen
        name="Search"
        component={SearchPage}
      />
      <SearchStack.Screen
        name="UniversalSearch"
        component={UniversalSearchPage}
        options={{
          title: null,
          headerShadowVisible: false,
        }}
      />
      <SearchStack.Screen
        name="DatabaseSearchAllResult"
        component={DatabaseSearchAllResultPage}
        options={{title: null}}
      />
      <SearchStack.Screen
        name="ArticleSearchAllResult"
        component={ArticleSearchAllResultPage}
        options={{title: null}}
      />
      <SearchStack.Screen
        name="SaleSearchAllResult"
        component={SaleSearchAllResultPage}
        options={{title: null}}
      />
      <SearchStack.Screen
        name="SearchFilters"
        component={SearchFiltersPage}
        options={{title: 'Filters'}}
      />
      <SearchStack.Screen
        name="UsersSearch"
        component={UsersSearchPage}
        options={{title: null}}
      />
      <SearchStack.Screen
        name="ScanSearch"
        component={ScanSearchPage}
        options={{
          title: null,
          headerTransparent: true,
          headerLeft: null,
        }}
      />
      <SearchStack.Screen
        name="CardAdd"
        component={CardAddPage}
        options={{
          title: 'Add To Collection'
        }}
      />
      <SearchStack.Screen
        name="CardEdit"
        component={CardEditPage}
        options={{
          title: 'Edit Card Details',
        }}
      />
      <SearchStack.Screen
        name="PossibleMatches"
        component={PossibleMatchesPage}
        options={{
          title: 'Other Possible Matches',
        }}
      />
      <SearchStack.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          title: null,
          headerShadowVisible: false,
        }}
      />
      <SearchStack.Screen
        name="FollowingThem"
        component={FollowingThemPage}
        options={{title: 'Followers'}}
      />
      <SearchStack.Screen
        name="TheyFollowing"
        component={TheyFollowingPage}
        options={{title: 'Following'}}
      />
      <SearchStack.Screen
        name="Message"
        component={ChatPage}
        options={{
          headerTitleAlign: 'left',
          title: null,
        }}
      />
      <SearchStack.Screen
        name="CollectionStackScreens"
        component={CollectionNavigation}
        options={{headerShown: false}}
      />
      <SearchStack.Screen
        name="CardDetailStackScreens"
        component={CardDetailNavigation}
        options={{headerShown: false}}
      />
    </SearchStack.Navigator>
  );
});

SearchNavigation.displayName = 'SearchNavigation';
