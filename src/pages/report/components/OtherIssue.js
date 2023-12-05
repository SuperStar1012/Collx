import React, {useEffect} from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import IssueNote from './IssueNote';

import {createUseStyle, Fonts} from 'theme';
import {SchemaTypes} from 'globals';

const OtherIssue = ({
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
      <Text style={styles.textDescription}>What’s the issue you want to report?</Text>
      <IssueNote
        hiddenTitle
        placeholder="Your notes..."
        onChangeText={handleChangeNote}
      />
    </View>
  );
};

OtherIssue.defaultProps = {
  onChangeIssue: () => {},
};

OtherIssue.propTypes = {
  onChangeIssue: PropTypes.func,
};

export default OtherIssue;

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
}));