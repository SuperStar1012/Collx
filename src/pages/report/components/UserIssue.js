import React, {useEffect} from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import IssueNote from './IssueNote';

import {createUseStyle, Fonts} from 'theme';
import {SchemaTypes} from 'globals';

const UserIssue = ({
  style,
  onChangeIssue,
}) => {
  const styles = useStyle();

  useEffect(() => {
    handleChangeNote('');
  }, []);

  const handleChangeNote = (value) => {
    if (onChangeIssue) {
      onChangeIssue({
        notes: value,
        category: SchemaTypes.issueCategory.OTHER,
      });
    }
  }

  return (
    <View style={[styles.container, style]}>
      <IssueNote
        style={styles.issueNoteContainer}
        hiddenTitle
        placeholder="Tell us why you want to report this user"
        onChangeText={handleChangeNote}
      />
    </View>
  );
};

UserIssue.defaultProps = {
  onChangeIssue: () => {},
};

UserIssue.propTypes = {
  onChangeIssue: PropTypes.func,
};

export default UserIssue;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  issueNoteContainer: {
    marginTop: 0,
  },
  textDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    textTransform: 'uppercase',
  },
}));