import React from 'react';
import {
  View,
} from 'react-native';

import {Button, Image, LoadingIndicator} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {wp} from 'utils';

const itemSize = Math.floor((wp(100) - 14 * 2 - 4 * 4) / 4);

const cameraIcon = require('assets/icons/camera.png');
const closeIcon = require('assets/icons/close_circle_fill.png');

const IssueAttachmentItem = ({
  attachment,
  onAdd,
  onRemove,
}) => {
  const styles = useStyle();

  const isAdd = attachment === 'add';

  const handleAdd = () => {
    if (onAdd) {
      onAdd();
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(attachment);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator
        style={styles.loadingContainer}
        isLoading={attachment.isUploading}
      />
      {isAdd ? (
        <Button
          style={styles.addButton}
          icon={cameraIcon}
          iconStyle={styles.iconCamera}
          label="Add"
          labelStyle={styles.textAdd}
          scale={Button.scaleSize.Two}
          onPress={handleAdd}
        />
      ) : (
        <Image source={attachment.uri} style={styles.imageAttachment} />
      )}
      {!isAdd && !attachment.isUploading ? (
        <Button
          style={styles.removeButton}
          icon={closeIcon}
          iconStyle={styles.iconClose}
          scale={Button.scaleSize.One}
          onPress={handleRemove}
        />
      ) : null}
    </View>
  );
};

IssueAttachmentItem.defaultProps = {};

IssueAttachmentItem.propTypes = {};

export default IssueAttachmentItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: itemSize,
    height: itemSize,
    borderRadius: 4,
    marginHorizontal: 2,
    marginVertical: 4,
    backgroundColor: colors.secondaryCardBackground,
    overflow: 'hidden',
  },
  loadingContainer: {
    backgroundColor: Colors.whiteAlpha2,
  },
  imageAttachment: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  addButton: {
    flex: 1,
    flexDirection: 'column',
  },
  iconCamera: {
    width: 34,
    height: 34,
    tintColor: colors.lightGrayText,
  },
  textAdd: {
    fontWeight: Fonts.semiBold,
    color: colors.lightGrayText,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  iconClose: {
    width: 28,
    height: 28,
    tintColor: Colors.red,
  },
}));
