import React from 'react';
import {View, Text} from 'react-native';

import {
  Button,
} from 'components';

import {createUseStyle, Fonts} from 'theme';

const ConfirmRedeemItem = ({
  id,
  title,
  subtitle1,
  subtitle2,
  onEdit,
}) => {

  const styles = useStyle();

  const handelEdit = () => {
    if (onEdit) {
      onEdit(id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionLeftContentContainer}>
        <Text style={styles.textTitle}>
          {title}
        </Text>
        {subtitle1 ? (
          <Text style={styles.textSubtitle}>
            {subtitle1}
          </Text>
        ) : null}
        {subtitle2 ? (
          <Text style={styles.textSubtitle}>
            {subtitle2}
          </Text>
        ) : null}
      </View>
      <Button
        style={styles.editButton}
        label="Edit"
        labelStyle={styles.textEditButton}
        scale={Button.scaleSize.One}
        onPress={handelEdit}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 2,
    backgroundColor: colors.primaryCardBackground,
  },
  sectionLeftContentContainer: {
    flex: 1,
  },
  textTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primaryText,
    marginTop: 6,
  },
  editButton: {
    width: 50,
    height: 30,
    borderWidth: 1,
    borderRadius: 4,
    marginLeft: 10,
    borderColor: colors.grayText,
  },
  textEditButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    textTransform: 'capitalize',
    color: colors.grayText,
  },
}));

export default ConfirmRedeemItem;
