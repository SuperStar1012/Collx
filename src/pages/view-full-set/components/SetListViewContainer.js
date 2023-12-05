import React, {useState, Suspense} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  FooterIndicator,
} from 'components';
import SetListView from './SetListView';

import {createUseStyle} from 'theme';

const SetListViewContainer = (props) => {
  const {profileId, setId} = props;

  const styles = useStyle();

  const [refreshedQueryOptions] = useState({
    fetchPolicy: 'store-and-network',
  });

  return (
    <View style={styles.container}>
      <Suspense fallback={<FooterIndicator isLoading />}>
        {profileId ? (
          <OtherSetListView
            {...props}
            profileId={profileId}
            setId={setId}
            queryOptions={refreshedQueryOptions}
            />
        ) : (
          <MySetListView
            {...props}
            setId={setId}
            queryOptions={refreshedQueryOptions}
          />
        )}
      </Suspense>
    </View>
  );
};

const MySetListView = (props) => {
  const mySetData = useLazyLoadQuery(graphql`
    query SetListViewContainerMyQuery($setId: ID!) {
      set(with: {id: $setId}) {
        id
        ...SetListViewMy_set
      }
    }`,
    {setId: props.setId},
    props.queryOptions
  );

  if (!mySetData) {
    return null;
  }

  return (
    <SetListView
      {...props}
      set={mySetData.set}
    />
  );
};

const OtherSetListView = (props) => {
  const otherSetData = useLazyLoadQuery(graphql`
    query SetListViewContainerOtherQuery($setId: ID!, $profileId: ID!) {
      set(with: {id: $setId}) {
        id
        ...SetListViewOther_set @arguments(profileId: $profileId)
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
    <SetListView
      {...props}
      profileId={props.profileId}
      set={otherSetData.set}
    />
  );
};

export default SetListViewContainer;


const useStyle = createUseStyle(() => ({
  container: {},
}));
