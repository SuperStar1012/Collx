import React, {useState, Suspense} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  FooterIndicator,
} from 'components';
import CollapseSetsView from './CollapseSetsView';

import {createUseStyle} from 'theme';

const CollapseSetsViewContainer = (props) => {
  const {profileId, setId, tradingCardFilterOption} = props;

  const styles = useStyle();

  const [refreshedQueryOptions] = useState({
    fetchPolicy: 'store-and-network',
  });

  return (
    <View style={styles.container}>
      <Suspense fallback={<FooterIndicator isLoading />}>
        {profileId ? (
          <OtherCollapseSetsView
            {...props}
            profileId={profileId}
            setId={setId}
            tradingCardFilterOption={tradingCardFilterOption}
            queryOptions={refreshedQueryOptions}
            />
        ) : (
          <MyCollapseSetsView
            {...props}
            setId={setId}
            tradingCardFilterOption={tradingCardFilterOption}
            queryOptions={refreshedQueryOptions}
          />
        )}
      </Suspense>
    </View>
  );
};

const MyCollapseSetsView = (props) => {
  const mySetData = useLazyLoadQuery(graphql`
    query CollapseSetsViewContainerMyQuery(
      $setId: ID!,
      $tradingCardFilterOption: TradingCardsWith,
    ) {
      set(with: {id: $setId}) {
        id
        viewer {
          ...CollapseSetsView_setViewer @arguments(with: $tradingCardFilterOption)
        }
      }
    }`,
    {
      setId: props.setId,
      tradingCardFilterOption: props.tradingCardFilterOption,
    },
    props.queryOptions
  );

  if (!mySetData) {
    return null;
  }

  return (
    <CollapseSetsView
      {...props}
      setViewer={mySetData.set.viewer}
    />
  );
};

const OtherCollapseSetsView = (props) => {
  const otherSetData = useLazyLoadQuery(graphql`
    query CollapseSetsViewContainerOtherQuery(
      $setId: ID!,
      $profileId: ID!,
      $tradingCardFilterOption: TradingCardsWith,
    ) {
      set(with: {id: $setId}) {
        id
        viewer (asProfile: $profileId) {
          ...CollapseSetsView_setViewer @arguments(with: $tradingCardFilterOption)
        }
      }
    }`,
    {
      setId: props.setId,
      profileId: props.profileId,
      tradingCardFilterOption: props.tradingCardFilterOption,
    },
    props.queryOptions
  );

  if (!otherSetData) {
    return null;
  }

  return (
    <CollapseSetsView
      {...props}
      setViewer={otherSetData.set.viewer}
    />
  );
};

export default CollapseSetsViewContainer;


const useStyle = createUseStyle(() => ({
  container: {
    minHeight: 50, // FooterIndicator's height
  },
}));
