import React from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';
import {StyleSheet} from 'react-native';

import {Image} from 'components';

import {Constants} from 'globals';

const MatchCardImage = ({
  canonicalCardId,
  queryOptions,
}) => {
  const styles = useStyle();

  const cardData = useLazyLoadQuery(graphql`
    query MatchCardImageQuery($canonicalCardId: ID!) {
      card(with: {id: $canonicalCardId}) {
        frontImageUrl
      }
    }`,
    {
      canonicalCardId
    },
    queryOptions,
  );

  if (!cardData) {
    return null;
  }

  return (
    <Image
      style={styles.imageCard}
      source={cardData.card?.frontImageUrl || Constants.defaultCardImage}
    />
  );
};

export default MatchCardImage;

const useStyle = () =>
  StyleSheet.create({
    imageCard: {
      width: '100%',
      height: '100%',
    },
  });
