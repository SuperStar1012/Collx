import React from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  RecentSales,
} from 'components';

import {withCardDetail} from 'store/containers';

const ExtraContent = ({
  canonicalCardId,
  tradingCardIdForIssue,
  queryOptions,
}) => {

  const queryData = useLazyLoadQuery(graphql`
    query ExtraContentQuery($canonicalCardId: ID!) {
      card(with: {id: $canonicalCardId}) {
        name
        frontImageUrl
        name
        number
        set {
          name
        }
        backImageUrl(usePlaceholderWhenAbsent: false)
        ...CardFlags_card
        ...CardMainInfo_card
        ...RecentSales_card
        ...NavBarRightForCanonicalCard_card
        ...OtherOwnersOfCardList_card
        ...CardReportInfo_card
        ...CollectionUserCardInfo_card
      }
      viewer {
        profile {
          id
          isAnonymous
          type
        }
      }
    }`,
    {canonicalCardId},
    queryOptions,
  );

  if (!queryData) {
    return null;
  }

  const {card} = queryData;

  if (!card) {
    return null;
  }

  return (
    <>
        <RecentSales
            flag={false}
            card={card}
            tradingCardIdForIssue={tradingCardIdForIssue}
        />
    </>
  );
};

export default withCardDetail(ExtraContent);