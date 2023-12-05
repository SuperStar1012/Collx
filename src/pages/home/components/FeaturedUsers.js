import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {Text, FlatList, View} from 'react-native';

import {Button} from 'components';
import FeaturedUsersItem from './FeaturedUsersItem';

import {Fonts, createUseStyle} from 'theme';
import {useActions} from 'actions';

const chevronRightIcon = require('assets/icons/chevron_forward.png');

const FeaturedUsers = ({
  style,
  viewer,
  recommendations,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const recommendationsData = useFragment(graphql`
    fragment FeaturedUsers_recommendations on Recommendations {
      profilesToFollow(first: 10) {
        edges {
          node {
            id
            ...FeaturedUsersItem_profile
          }
        }
      }
    }`,
    recommendations
  );

  if (!recommendationsData?.profilesToFollow?.edges?.length) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.topContainer}>
        <Text style={styles.textTitle}>People to Follow</Text>
        <Button
          style={styles.seeAllButton}
          labelStyle={styles.textSeeAll}
          label="See All"
          iconStyle={styles.iconChevronRight}
          icon={chevronRightIcon}
          scale={Button.scaleSize.Two}
          onPress={actions.navigatePeopleToFollow}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={recommendationsData.profilesToFollow.edges || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item: edge}) =>
          <FeaturedUsersItem profile={edge.node} viewer={viewer} />
        }
      />
    </View>
  );
};

export default FeaturedUsers;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  contentContainer: {
    paddingHorizontal: 11,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.004,
    color: colors.primaryText,
  },
  seeAllButton: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  textSeeAll: {
    fontWeight: Fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primary,
  },
  iconChevronRight: {
    width: 16,
    height: 16,
    tintColor: colors.primary,
    resizeMode: 'contain',
  },
}));
