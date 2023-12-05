import React, {useState, Suspense} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  FooterIndicator,
} from 'components';
import SetGridView from './SetGridView';

import {createUseStyle} from 'theme';

const SetGridViewContainer = (props) => {
  const {profileId, setId} = props;

  const styles = useStyle();

  const [refreshedQueryOptions] = useState({
    fetchPolicy: 'store-and-network',
  });

  return (
    <View style={styles.container}>
      <Suspense fallback={<FooterIndicator isLoading />}>
        {profileId ? (
          <OtherSetGridView
            {...props}
            profileId={profileId}
            setId={setId}
            queryOptions={refreshedQueryOptions}
            />
        ) : (
          <MySetGridView
            {...props}
            setId={setId}
            queryOptions={refreshedQueryOptions}
          />
        )}
      </Suspense>
    </View>
  );
};

const MySetGridView = (props) => {
  const mySetData = useLazyLoadQuery(graphql`
    query SetGridViewContainerMyQuery($setId: ID!) {
      set(with: {id: $setId}) {
        id
        ...SetGridViewMy_set
      }
    }`,
    {setId: props.setId},
    props.queryOptions
  );

  if (!mySetData) {
    return null;
  }

  return (
    <SetGridView
      {...props}
      set={mySetData.set}
    />
  );
};

const OtherSetGridView = (props) => {
  const otherSetData = useLazyLoadQuery(graphql`
    query SetGridViewContainerOtherQuery($setId: ID!, $profileId: ID!) {
      set(with: {id: $setId}) {
        id
        ...SetGridViewOther_set @arguments(profileId: $profileId)
      }
    }`,
    {
      setId: props.setId,
      profileId: props.profileId
    },
    props.queryOptions
  );

  if (!otherSetData) {
    return null;
  }

  return (
    <SetGridView
      {...props}
      profileId={props.profileId}
      set={otherSetData.set}
    />
  );
};

export default SetGridViewContainer;


const useStyle = createUseStyle(() => ({
  container: {},
}));
