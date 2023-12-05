import React from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {createUseStyle} from 'theme';

const chevronIcon = require('assets/icons/chevron_forward.png');

const SuggestSearchItem = ({
  style,
  suggestion,
  onPress,
}) => {
  const styles = useStyle();

  const searchSuggestionData = useFragment(graphql`
    fragment SuggestSearchItem_searchSuggestion on SearchSuggestion {
      ...on Set {
        __typename
        id
        name
        aiPromptSuggestion
      }
      ...on Team {
        __typename
        id
        name
        aiPromptSuggestion
      }
      ...on Player {
        __typename
        id
        name
        aiPromptSuggestion
      }
      ...on Character {
        __typename
        id
        name
      }
    }`,
    suggestion
  );

  if (!searchSuggestionData) {
    return null;
  }

  const handlePress = () => {
    if (searchSuggestionData.name && onPress) {
      onPress(searchSuggestionData);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handlePress}>
      <Text
        style={styles.textLabel}
        numberOfLines={1}
      >
        {searchSuggestionData.name}
      </Text>
      <Text
        style={styles.textCategory}
        numberOfLines={1}
      >
        {searchSuggestionData.__typename}
      </Text>
      <Image style={styles.iconCommon} source={chevronIcon} />
    </TouchableOpacity>
  );
};

SuggestSearchItem.defaultProps = {
  onPress: () => {},
};

SuggestSearchItem.propTypes = {
  onPress: PropTypes.func,
};

export default SuggestSearchItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  textLabel: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    paddingVertical: 12,
  },
  textCategory: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.grayText,
    marginHorizontal: 6,
  },
  iconCommon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.grayText,
  },
}));
