import React, {Suspense} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
} from 'components';
import SavedForLaterList from './components/SavedForLaterList';

import {createUseStyle} from 'theme';

const SavedForLaterContent = (props) => {
  const {queryOptions} = props;

  const styles = useStyle();

  const data = useLazyLoadQuery(
    graphql`
      query SavedForLaterContentQuery {
        viewer {
          ...SavedForLaterListQuery_viewer,
        }
      }
    `,
    {},
    queryOptions
  );

  return (
    <View style={styles.container}>
      <Suspense fallback={<LoadingIndicator isLoading />}>
        <SavedForLaterList
          viewer={data.viewer}
        />
      </Suspense>
    </View>
  );
};

export default SavedForLaterContent;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));
