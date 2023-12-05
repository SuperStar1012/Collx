import React from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';

import CollectionSummary from './CollectionSummary';

const CollectionSummaryContainer = (props) => {
  const {
    profileId,
  } = props;

  if (profileId) {
    return (
      <OtherProfile
        {...props}
        profileId={profileId}
      />
    );
  }

  return (
    <MyProfile
      {...props}
    />
  );
};

const MyProfile = (props) => {
  const myProfileData = useLazyLoadQuery(graphql`
    query CollectionSummaryContainerMyQuery($filterOption: TradingCardsWith) {
      viewer {
        profile {
          ...CollectionSummary_profile @arguments(with: $filterOption)
        }
      }
    }`,
    {
      filterOption: props.filterOption,
    },
    {},
  );

  if (!myProfileData) {
    return null;
  }

  return (
    <CollectionSummary
      {...props}
      profile={myProfileData.viewer.profile}
    />
  );
};

const OtherProfile = (props) => {
  const otherProfileData = useLazyLoadQuery(graphql`
    query CollectionSummaryContainerOtherQuery($profileId: ID!, $filterOption: TradingCardsWith) {
      profile(with: {id: $profileId}) {
        ...CollectionSummary_profile @arguments(with: $filterOption)
      }
    }`,
    {
      profileId: props.profileId,
      filterOption: props.filterOption,
    },
    {},
  );

  if (!otherProfileData) {
    return null;
  }

  return (
    <CollectionSummary
      {...props}
      profile={otherProfileData.profile}
    />
  );
};

export default CollectionSummaryContainer;
