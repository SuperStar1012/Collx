import React, {Suspense} from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  GridView,
} from 'components';

const GridViewContainer = (props) => {
  const {
    profileId,
  } = props;

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
    onPinFeature,
    onPinUnfeature,
  } = props;

  const myProfileData = useLazyLoadQuery(graphql`
    query GridViewContainerMyQuery($sortOption: [TradingCardOrder!], $filterOption: TradingCardsWith) {
      viewer {
        profile {
          ...GridView_profile @arguments(orderBy: $sortOption, with: $filterOption)
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
    <GridView
      {...props}
      profile={myProfileData.viewer.profile}
      onPinFeature={onPinFeature}
      onPinUnfeature={onPinUnfeature}
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
    query GridViewContainerOtherQuery($profileId: ID!, $sortOption: [TradingCardOrder!], $filterOption: TradingCardsWith) {
      profile(with: {id: $profileId}) {
        ...GridView_profile @arguments(orderBy: $sortOption, with: $filterOption)
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
    <GridView
      {...props}
      profile={otherProfileData.profile}
      onPinFeature={null}
      onPinUnfeature={null}
    />
  );
};

export default GridViewContainer;
