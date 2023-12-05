import React, {Suspense} from 'react';
import {useFragment, graphql} from 'react-relay';
import {View, Text} from 'react-native';

import {
  CollectionGuide,
  Activity,
} from 'components';

import {useActions} from 'actions';
import {Fonts, createUseStyle} from 'theme';
import {SchemaTypes} from 'globals';

const RecentActivity = ({
  style,
  title,
  profile,
  viewer,
  onLeaveComment,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const profileData = useFragment(graphql`
    fragment RecentActivity_profile on Profile {
      name
      recentActivity(limit: 50) {
        ...Activity_activity
      }
      allTradingCards: tradingCards {
        totalCount
      }
      viewer {
        isMe
      }
    }`,
    profile
  );

  const viewerData = useFragment(graphql`
    fragment RecentActivity_viewer on Viewer {
      ...Activity_viewer
    }`,
    viewer
  );

  const handleScanCard = () => {
    actions.navigateScanCard();
  };

  const handleAddManualCard = () => {
    actions.navigateSearchDatabaseCardsModal({
      isCloseBack: true,
      savedSearchSource: SchemaTypes.savedSearchSource.COLLECTION,
    });
  };

  if (profileData.allTradingCards.totalCount === 0) {
    if (profileData.viewer.isMe) {
      return (
        <CollectionGuide
          style={styles.collectionGuideContainer}
          title={'You haven’t added \nany cards yet.'}
          description={'Your recently added cards will \nshow up here.'}
          isSmall
          onStartScan={handleScanCard}
          onAddManualCard={handleAddManualCard}
        />
      );
    } else {
      return (
        <CollectionGuide
          style={styles.collectionGuideContainer}
          disabledActions
          isSmall
          title={`${profileData.name} hasn’t added \nany cards yet.`}
          description={`Recently added cards will \nshow up here.`}
        />
      );
    }
  } else if (profileData.recentActivity.length === 0) {
    if (profileData.viewer.isMe) {
      return (
        <CollectionGuide
          style={styles.collectionGuideContainer}
          title={'You haven\'t added \nany cards recently.'}
          description={'Recently added cards, listings, \netc. will show up here.'}
          isSmall
          onStartScan={handleScanCard}
          onAddManualCard={handleAddManualCard}
        />
      );
    } else {
      return (
        <CollectionGuide
          style={styles.collectionGuideContainer}
          disabledActions
          isSmall
          title={`${profileData.name} hasn’t had any recent activity.`}
          description={`Recently added cards, listings, \netc. will show up here.`}
        />
      );
    }
  } else {
    return (
      <View style={[styles.container, style]}>
        {title && <Text style={styles.textTitle}>{title}</Text>}
        {profileData.recentActivity.map((activity, index) =>
          <Suspense key={index} fallback={<View />}>
            <Activity
              viewer={viewerData}
              activity={activity}
              onLeaveComment={onLeaveComment}
            />
          </Suspense>
        )}
      </View>
    );
  }
};

export default RecentActivity;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 12,
    // marginTop: 24,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginHorizontal: 16,
  },
}));
