import React, {Suspense} from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  ListView,
} from 'components';

const ListViewContainer = (props) => {
  const {profileId} = props;

  return (
    <Suspense fallback={<LoadingIndicator isLoading />}>
      {profileId ? (
        <OtherProfile
          {...props}
          profileId={profileId}
        />
      ) : (
        <MyProfile
          {...props}
        />
      )}
    </Suspense>
  );
};

const MyProfile = (props) => {
  const {
    filterOption,
    sortOption,
  } = props;

  const myProfileData = useLazyLoadQuery(graphql`
    query ListViewContainerMyQuery($sortOption: [TradingCardOrder!], $filterOption: TradingCardsWith) {
      viewer {
        profile {
          ...ListView_profile @arguments(orderBy: $sortOption, with: $filterOption)
        }
      }
    }`,
    {
      sortOption,
      filterOption,
    },
    {},
  );

  if (!myProfileData) {
    return null;
  }

  return (
    <ListView
      {...props}
      profile={myProfileData.viewer.profile}
    />
  );
};

const OtherProfile = (props) => {
  const {
    profileId,
    filterOption,
    sortOption,
  } = props;

  const otherProfileData = useLazyLoadQuery(graphql`
    query ListViewContainerOtherQuery($profileId: ID!, $sortOption: [TradingCardOrder!], $filterOption: TradingCardsWith) {
      profile(with: {id: $profileId}) {
        ...ListView_profile @arguments(orderBy: $sortOption, with: $filterOption)
      }
    }`,
    {
      profileId,
      sortOption,
      filterOption,
    },
    {},
  );

  if (!otherProfileData) {
    return null;
  }

  return (
    <ListView
      {...props}
      profile={otherProfileData.profile}
    />
  );
};

export default ListViewContainer;
