import React from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';
import {StyleSheet} from 'react-native';

import {
  CardMainInfo,
  RecentSales,
} from 'components';

const CanonicalCardView = ({
  canonicalCardId,
  queryOptions,
}) => {
  const styles = useStyle();

  const cardData = useLazyLoadQuery(graphql`
    query CanonicalCardViewQuery($canonicalCardId: ID!) {
      card(with: {id: $canonicalCardId}) {
        number
        shareUrl
        set {
          name
        }
        ...on SportCard {
          player {
            name
          }
          team {
            name
          }
        }
        ...CardMainInfo_card
        ...RecentSales_card
      }
    }`,
    {
      canonicalCardId
    },
    queryOptions
  );

  if (!cardData) {
    return null;
  }

  return (
    <>
      <CardMainInfo card={cardData.card} />
      <RecentSales
        style={styles.recentSalesContainer}
        card={cardData.card}
      />
    </>
  );
};

export default CanonicalCardView;

const useStyle = () =>
  StyleSheet.create({
    recentSalesContainer: {
      marginTop: 16,
    },
  });
