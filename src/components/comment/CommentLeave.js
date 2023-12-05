import React from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {Image, Button} from 'components';

import {Constants} from 'globals';
import {createUseStyle} from 'theme';

const CommentLeave = props => {
  const {style, avatarImageUrl, onPress} = props;

  const styles = useStyle();

  const handleLeaveComment = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        style={styles.imageAvatar}
        source={avatarImageUrl || Constants.defaultAvatar}
      />
      <Button
        style={styles.leaveButton}
        labelStyle={styles.textLeave}
        label="Leave a comment"
        scale={Button.scaleSize.One}
        onPress={handleLeaveComment}
      />
    </View>
  );
};

CommentLeave.defaultProps = {
  onPress: () => {},
};

CommentLeave.propTypes = {
  avatarImageUrl: PropTypes.string,
  onPress: PropTypes.func,
};

export default CommentLeave;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  imageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  leaveButton: {
    flex: 1,
    height: 34,
    borderRadius: 4,
    marginLeft: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.secondaryCardBackground,
  },
  textLeave: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.placeholderText,
  },
}));
