import React, {useMemo, useState, useEffect} from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import IssueNote from './IssueNote';

import {createUseStyle, Fonts} from 'theme';
import {SchemaTypes} from 'globals';

const OrderIssue = ({
  style,
  issueCategory,
  onChangeIssue,
}) => {
  const styles = useStyle();

  const [notes, setNotes] = useState('');
  const [currentIssueCategory, setCurrentIssueCategory] = useState(issueCategory || SchemaTypes.issueCategory.OTHER);

  const issueDescription = useMemo(() => {
    switch (issueCategory) {
      case SchemaTypes.issueCategory.REFUND_REQUEST:
        return 'Request Refund';
      case SchemaTypes.issueCategory.CANCEL_ORDER:
        return 'Cancel Order';
    }

    return 'Report Issue'
  }, [issueCategory]);

  useEffect(() => {
    handleChangeIssueCategory(currentIssueCategory);
  }, []);

  const handleChangeIssueCategory = (value) => {
    setCurrentIssueCategory(value);

    if (onChangeIssue) {
      onChangeIssue({
        notes,
        category: value,
      });
    }
  }

  const handleChangeNote = (value) => {
    setNotes(value);

    if (onChangeIssue) {
      onChangeIssue({
        notes: value,
        category: currentIssueCategory,
      });
    }
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textDescription}>Issue</Text>
      <Text style={styles.textIssueType}>{issueDescription}</Text>
      <IssueNote
        title="COMMENT"
        placeholder="Your message"
        onChangeText={handleChangeNote}
      />
    </View>
  );
};

OrderIssue.defaultProps = {
  onChangeIssue: () => {},
};

OrderIssue.propTypes = {
  onChangeIssue: PropTypes.func,
};

export default OrderIssue;

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
  textIssueType: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginTop: 12,
  },
}));