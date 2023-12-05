import React, {useEffect, useState, useRef} from 'react';
import {
  View,
} from 'react-native';

import {
  NavBarButton,
  NavBarModalHeader,
  SearchBar,
} from 'components';
import RecentSearches from './components/RecentSearches';
import SuggestSearches from './components/SuggestSearches';

import {Constants} from 'globals';
import {createUseStyle} from 'theme';
import {withSearch} from 'store/containers';
import {decodeQuery} from 'utils';

const closeIcon = require('assets/icons/close.png');

const SearchPage = ({
  navigation,
  route,
  searchModalMode,
  selectedCategory,
  setHandleSearchBack,
  setSearchModalMode,
}) => {
  const {
    isCloseBack,
    query,
  } = route.params || {};

  const styles = useStyle();

  const [initialSearchText, setInitialSearchText] = useState(decodeQuery(query) || '');
  const [searchText, setSearchText] = useState(decodeQuery(query) || '');
  const [isSearchMode, setIsSearchMode] = useState(false);

  const searchBarRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (searchBarRef.current) {
        searchBarRef.current.focus();
      }
    }, 250);

    return () => {
      setHandleSearchBack(null);
      setSearchModalMode(Constants.searchModalMode.none);
    };
  }, []);

  useEffect(() => {
    if (!query) {
      return;
    }

    setSearchText(decodeQuery(query));
    setInitialSearchText(decodeQuery(query));

    navigation.navigate('UniversalSearch', {
      query: decodeQuery(query),
    });
  }, [query]);

  useEffect(() => {
    setNavigationBar();
  }, [selectedCategory, searchText]);

  const setNavigationBar = () => {
    const navigationOptions = {};

    if (isCloseBack) {
      const headerLeft = () => (
        <NavBarButton
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      );
      navigationOptions.headerLeft = headerLeft;
    }

    if (searchModalMode) {
      navigationOptions.header = NavBarModalHeader;
      navigationOptions.headerTitle = 'Search For A Card';
    } else {
      navigationOptions.headerTitle = renderSearchBar;
      navigationOptions.headerTitleContainerStyle = styles.headerContainer;
    }

    navigation.setOptions(navigationOptions);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSelectRecentSearch = item => {
    navigation.navigate('UniversalSearch', {
      query: item.query,
    });
  };

  const handleSelectSuggestSearch = item => {
    if (item.__typename === 'Character' && !item.aiPromptSuggestion) {
      navigation.navigate('UniversalSearch', {
        query: item.name,
      });
      return;
    }
    navigation.navigate('UniversalSearch', {
      query: item.name,
      aiPromptSuggestion: item.aiPromptSuggestion,
    });
  };

  const handleSelectSearchText = text => {
    navigation.navigate('UniversalSearch', {
      query: text,
    });
  };

  const handleChangeSearch = value => {
    setSearchText(value);
  };

  const handleCancelSearch = () => {
    setIsSearchMode(false);
    setSearchText('');
  };

  const handleDeleteSearch = () => {
    setSearchText('');
  };

  const handleFocusSearch = () => {
    setIsSearchMode(true);
  };

  const handleSearch = () => {
    handleSelectSearchText(searchText);
  };

  const renderSearchBar = () => {
    const categoryLabel = selectedCategory ? selectedCategory.label : 'All';
    return (
      <SearchBar
        ref={searchBarRef}
        style={[styles.searchBarContainer, searchModalMode ? styles.modalSearchBar : {}]}
        placeholder={`Search ${categoryLabel?.toLowerCase()} cards`}
        defaultValue={searchText}
        searchValue={initialSearchText}
        onChangeText={handleChangeSearch}
        onDelete={handleDeleteSearch}
        onCancel={handleCancelSearch}
        onFocus={handleFocusSearch}
        onSearch={handleSearch}
      />
    );
  };

  const renderMainContent = () => {
    if (isSearchMode && searchText) {
      return (
        <SuggestSearches
          searchText={searchText}
          selectedCategory={selectedCategory}
          onSelectSearch={handleSelectSuggestSearch}
          onSelectSearchText={handleSelectSearchText}
        />
      );
    }

    return (
      <RecentSearches
        onSelectSearch={handleSelectRecentSearch}
      />
    );
  };

  return (
    <View style={styles.container}>
      {searchModalMode ? renderSearchBar() : null}
      {renderMainContent()}
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  headerContainer: {
    width: '100%',
  },
  modalSearchBar: {
    marginBottom: 5,
  },
  iconClose: {
    width: 28,
    height: 28,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  searchBarContainer: {
    marginLeft: 10,
  },
}));

export default withSearch(SearchPage);
