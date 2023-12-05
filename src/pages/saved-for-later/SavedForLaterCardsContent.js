import React, {Suspense} from 'react';
import {View} from 'react-native';

import {
  LoadingIndicator,
} from 'components';
import SavedForLaterCardsList from './components/SavedForLaterCardsList';

import {createUseStyle} from 'theme';

const SavedForLaterCardsContent = ({
  queryOptions,
  savedForLater,
}) => {
  const styles = useStyle();

  return (
    <View style={styles.container}>
      <Suspense fallback={<LoadingIndicator isLoading />}>
        <SavedForLaterCardsList
          queryOptions={queryOptions}
          savedForLater={savedForLater}
        />
      </Suspense>
    </View>
  );
};

export default SavedForLaterCardsContent;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));
