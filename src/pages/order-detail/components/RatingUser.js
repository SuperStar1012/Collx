import React, { useMemo, useState } from 'react';
import {Text, View} from 'react-native';
import {Rating} from 'react-native-ratings';
import {graphql, useFragment} from 'react-relay';

import {Button} from 'components';

import {Fonts, createUseStyle, useTheme} from 'theme';
import {SchemaTypes} from 'globals';

const RatingUser = ({
  style,
  order,
  isMeBuyer,
  onChangeRating,
}) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const orderData = useFragment(graphql`
    fragment RatingUser_order on Order {
      id
      stateGroup
      ratingRecordedForBuyer
      ratingRecordedForSeller
    }`,
    order
  );

  const [rating, setRating] = useState(isMeBuyer ? orderData.ratingRecordedForSeller : orderData.ratingRecordedForBuyer);
  const [isEditMode, setIsEditMode] = useState(!rating);

  const isEditable = useMemo(() => (
    orderData.stateGroup === SchemaTypes.orderStateGroup.COMPLETED
  ), [orderData.stateGroup])

  const handleAddRating = () => {
    if (onChangeRating) {
      onChangeRating(rating);
    }

    setIsEditMode(false);
  };

  const handleChangeRating = () => {
    setRating(null);
    setIsEditMode(true);
  };

  if (!isEditable) {
    return null;
  }

  const renderActions = () => {
    if (!rating) {
      return null;
    }

    if (isEditMode) {
      return (
        <Button
          style={[styles.button, styles.addRatingButton]}
          label="Add Rating"
          labelStyle={[styles.textButton, styles.textAddRating]}
          scale={Button.scaleSize.One}
          onPress={handleAddRating}
        />
      );
    }

    return (
      <Button
        style={[styles.button, styles.changeRatingButton]}
        label="Change Rating"
        labelStyle={[styles.textButton, styles.textChangeRating]}
        scale={Button.scaleSize.One}
        onPress={handleChangeRating}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textTitle}>
        {`Rate the ${isMeBuyer ? 'Seller' : 'Buyer'}`}
      </Text>
      <View style={styles.contentContainer}>
        <Rating
          type='custom'
          readonly={!isEditMode}
          ratingColor={colors.primary}
          tintColor={colors.primaryBackground}
          ratingBackgroundColor={colors.darkGrayText}
          imageSize={24}
          jumpValue={0.1}
          startingValue={rating}
          onFinishRating={setRating}
        />
        {renderActions()}
      </View>
    </View>
  );
}

export default RatingUser;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 24,
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 15,
    lineHeight: 18,
    color: colors.primaryText,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  contentContainer: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderTopColor: colors.quaternaryBorder,
    borderTopWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
    borderBottomWidth: 1,
  },
  button: {
    height: 30,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 4,
  },
  addRatingButton: {
    borderColor: colors.primary,
  },
  changeRatingButton: {
    borderColor: colors.grayText,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    textTransform: 'capitalize',
  },
  textAddRating: {
    color: colors.primary,
  },
  textChangeRating: {
    color: colors.grayText,
  },
}));
