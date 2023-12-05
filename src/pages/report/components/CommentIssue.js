import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  RadioGroup
} from 'components';
import IssueNote from './IssueNote';

import {createUseStyle, Fonts} from 'theme';
import {SchemaTypes} from 'globals';

const data = [
  {
    label: 'Spam',
    value: SchemaTypes.issueCategory.SPAM,
  },
  {
    label: 'Bullying or harassment',
    value: SchemaTypes.issueCategory.HARASSMENT,
  },
  {
    label: 'Illegal activities',
    value: SchemaTypes.issueCategory.ILLEGAL_ACTIVITY,
  },
  {
    label: 'False information',
    value: SchemaTypes.issueCategory.FALSE_INFO,
  },
  {
    label: 'I just don’t like it',
    value: SchemaTypes.issueCategory.DO_NOT_LIKE,
  },
  {
    label: 'Something else (please explain below)',
    value: SchemaTypes.issueCategory.OTHER,
  },
];

const CommentIssue = ({
  style,
  onChangeIssue,
}) => {
  const styles = useStyle();

  const [notes, setNotes] = useState('');
  const [issueCategory, setIssueCategory] = useState(data[0].value);

  useEffect(() => {
    handleChangeIssueCategory(issueCategory);
  }, []);

  const handleChangeIssueCategory = (value) => {
    setIssueCategory(value);

    if (onChangeIssue) {
      onChangeIssue({
        notes,
        category: value,
      });
    }
  };

  const handleChangeNote = (value) => {
    setNotes(value);

    if (onChangeIssue) {
      onChangeIssue({
        notes: value,
        category: issueCategory,
      });
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textDescription}>What’s wrong with this comment?</Text>
      <RadioGroup
        style={styles.radioContainer}
        value={issueCategory}
        data={data}
        onChangeValue={handleChangeIssueCategory}
      />
      <IssueNote onChangeText={handleChangeNote} />
    </View>
  );
};

CommentIssue.defaultProps = {
  onChangeIssue: () => {},
};

CommentIssue.propTypes = {
  onChangeIssue: PropTypes.func,
};

export default CommentIssue;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    margin: 16,
  },
  textDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    textTransform: 'uppercase',
  },
  radioContainer: {
    marginTop: 12,
  },
}));
