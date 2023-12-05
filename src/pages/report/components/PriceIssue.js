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
    label: 'Price too high',
    value: SchemaTypes.issueCategory.PRICE_TOO_HIGH,
  },
  {
    label: 'Price too low',
    value: SchemaTypes.issueCategory.PRICE_TOO_LOW,
  },
  {
    label: 'Other',
    value: SchemaTypes.issueCategory.OTHER,
  },
];

const PriceIssue = ({
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
  }

  const handleChangeNote = (value) => {
    setNotes(value);

    if (onChangeIssue) {
      onChangeIssue({
        notes: value,
        category: issueCategory,
      });
    }
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textDescription}>What’s wrong with the price?</Text>
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

PriceIssue.defaultProps = {
  onChangeIssue: () => {},
};

PriceIssue.propTypes = {
  onChangeIssue: PropTypes.func,
};

export default PriceIssue;

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