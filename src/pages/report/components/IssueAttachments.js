import React from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {createUseStyle} from 'theme';

import IssueAttachmentItem from './IssueAttachmentItem';

const IssueAttachments = ({
  style,
  attachments,
  onAddAttachment,
  onRemoveAttachment,
}) => {
  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      {attachments.map((item, index) => (
        <IssueAttachmentItem
          key={index}
          attachment={item}
          onAdd={onAddAttachment}
          onRemove={onRemoveAttachment}
        />
      ))}
    </View>
  );
};

IssueAttachments.defaultProps = {
  onChangeIssue: () => {},
};

IssueAttachments.propTypes = {
  onChangeIssue: PropTypes.func,
};

export default IssueAttachments;

const useStyle = createUseStyle(() => ({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 14,
  },
}));
