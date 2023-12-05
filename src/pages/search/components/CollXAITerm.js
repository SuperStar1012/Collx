import React, { useMemo } from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {createUseStyle} from 'theme';

const aiBotAvatarIcon = require('assets/icons/more/ai_bot_avatar.png');

const CollXAITerm = ({
  style,
  searchText,
  aiPromptSuggestion,
  onPress,
}) => {
  const styles = useStyle();

  const message = useMemo(() => (
    aiPromptSuggestion ? aiPromptSuggestion : `Tell me about ${searchText}`
  ), [searchText, aiPromptSuggestion]);

  const handleOpenAIChat = () => {
    if (onPress) {
      onPress(message);
    }
  };

  if (!aiPromptSuggestion && !searchText) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handleOpenAIChat}>
      <Text
        style={styles.textDescription}
        numberOfLines={1}
      >
        {message}
      </Text>
      <Image
        style={styles.imageAvatar}
        source={aiBotAvatarIcon}
      />
    </TouchableOpacity>
  );
};

CollXAITerm.defaultProps = {
  onPress: () => {},
};

CollXAITerm.propTypes = {
  onPress: PropTypes.func,
};

export default CollXAITerm;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: colors.secondaryCardBackground,
  },
  textDescription: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    marginRight: 16,
    color: colors.primaryText,
  },
  imageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
}));
