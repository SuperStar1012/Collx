import React, {useEffect, useMemo, useState} from 'react';
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
import {wp} from 'utils';

const canonicalCardData = [
  {
    label: 'Player',
    value: SchemaTypes.issueCategory.INCORRECT_PLAYER,
  },
  {
    label: 'Rookie card year',
    value: SchemaTypes.issueCategory.INCORRECT_ROOKIE_YEAR,
  },
  {
    label: 'Team',
    value: SchemaTypes.issueCategory.INCORRECT_TEAM,
  },
  {
    label: 'Set',
    value: SchemaTypes.issueCategory.INCORRECT_SET,
  },
  {
    label: 'Card number',
    value: SchemaTypes.issueCategory.INCORRECT_CARD_NUMBER,
  },
  {
    label: 'Other',
    value: SchemaTypes.issueCategory.OTHER,
  },
];

const tradingCardData = [
  {
    label: 'Player',
    value: SchemaTypes.issueCategory.INCORRECT_PLAYER,
  },
  {
    label: 'Rookie card year',
    value: SchemaTypes.issueCategory.INCORRECT_ROOKIE_YEAR,
  },
  {
    label: 'Team',
    value: SchemaTypes.issueCategory.INCORRECT_TEAM,
  },
  {
    label: 'Set',
    value: SchemaTypes.issueCategory.INCORRECT_SET,
  },
  {
    label: 'Condition',
    value: SchemaTypes.issueCategory.INCORRECT_CONDITION,
  },
  {
    label: 'Grade',
    value: SchemaTypes.issueCategory.INCORRECT_GRADE,
  },
  {
    label: 'Card number',
    value: SchemaTypes.issueCategory.INCORRECT_CARD_NUMBER,
  },
  {
    label: 'Serial number',
    value: SchemaTypes.issueCategory.INCORRECT_SERIAL_NUMBER,
  },
  {
    label: 'Description/Notes',
    value: SchemaTypes.issueCategory.INCORRECT_DESCRIPTION,
  },
  {
    label: 'Incorrect image',
    value: SchemaTypes.issueCategory.INCORRECT_IMAGE,
  },
  {
    label: 'Other',
    value: SchemaTypes.issueCategory.OTHER,
  },
];

const InfoIssue = ({
  style,
  isCanonicalCardInfo,
  onChangeIssue,
}) => {
  const data = useMemo(() => (
    isCanonicalCardInfo ? canonicalCardData : tradingCardData
  ), [isCanonicalCardInfo]);

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
      <Text style={styles.textDescription}>What information is wrong?</Text>
      <RadioGroup
        style={styles.radioContainer}
        buttonStyle={styles.radioButton}
        value={issueCategory}
        data={data}
        onChangeValue={handleChangeIssueCategory}
      />
      <IssueNote onChangeText={handleChangeNote} />
    </View>
  );
};

InfoIssue.defaultProps = {
  onChangeIssue: () => {},
};

InfoIssue.propTypes = {
  onChangeIssue: PropTypes.func,
};

export default InfoIssue;

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
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  radioButton: {
    width: Math.floor((wp(100) - 16 * 2) / 2),
  },
}));
