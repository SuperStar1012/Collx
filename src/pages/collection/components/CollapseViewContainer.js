import React, {Suspense, useMemo} from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  CollapseView,
} from 'components';

const CollapseViewContainer = (props) => {
  const {profileId, filterOption} = props;

  const setOptions = useMemo(() => {
    const options = {};
    const {sport, game, year, set, ...otherOptions} = filterOption;

    if (sport) {
      options.sport = sport;
    } else if (game) {
      options.game = game;
    }

    if (year) {
      options.year = year;
    }

    if (set) {
      const {year, name} = set;

      if (year) {
        options.year = year;
      }

      if (name) {
        options.name = name;
      }
    }

    if (otherOptions) {
      options.tradingCard = otherOptions;
    }

    return options;
  }, [filterOption]);

  if (!filterOption) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingIndicator isLoading />}>
      {profileId ? (
        <OtherProfile
          {...props}
          profileId={profileId}
          setFilterOptions={setOptions}
          tradingCardFilterOption={filterOption}
        />
      ) : (
        <MyProfile
          {...props}
          setFilterOptions={setOptions}
          tradingCardFilterOption={filterOption}
        />
      )}
    </Suspense>
  );
};

const MyProfile = (props) => {
  const myProfileData = useLazyLoadQuery(graphql`
    query CollapseViewContainerMyQuery($setFilterOptions: SetsWith) {
      viewer {
        profile {
          ...CollapseViewMe_profile @arguments(with: $setFilterOptions)
        }
      }
    }`,
    {
      setFilterOptions: props.setFilterOptions,
    },
    {},
  );

  if (!myProfileData) {
    return null;
  }

  return (
    <CollapseView
      {...props}
      profile={myProfileData.viewer.profile}
    />
  );
};

const OtherProfile = (props) => {
  const otherProfileData = useLazyLoadQuery(graphql`
    query CollapseViewContainerOtherQuery($profileId: ID!, $setFilterOptions: SetsWith) {
      profile(with: {id: $profileId}) {
        ...CollapseViewOther_profile @arguments(profileId: $profileId, with: $setFilterOptions)
      }
    }`,
    {
      profileId: props.profileId,
      setFilterOptions: props.setFilterOptions,
    },
    {},
  );

  if (!otherProfileData) {
    return null;
  }

  return (
    <CollapseView
      {...props}
      profile={otherProfileData.profile}
    />
  );
};

export default CollapseViewContainer;
