import React, {forwardRef} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import BottomSheet from '@gorhom/bottom-sheet';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  ProBadge,
  ProColorVariant
} from 'components';

import {Constants, Styles} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';

const BottomView = forwardRef(({
  profileId,
  onExportChecklist,
}, ref) => {
  const styles = useStyle();

  let profileData = null;

  if (profileId) {
    const otherProfileData = useLazyLoadQuery(graphql`
      query BottomViewOtherQuery($profileId: ID!) {
        profile(with: {id: $profileId}) {
          viewer {
            isMe
          }
          type
        }
      }`,
      {
        profileId: profileId,
      },
      {},
    );
    profileData = otherProfileData.profile;
  } else {
    const viewerData = useLazyLoadQuery(graphql`
      query BottomViewMyQuery {
        viewer {
          profile {
            viewer {
              isMe
            }
            type
          }
        }
      }`,
      {},
      {},
    );
    profileData = viewerData.viewer?.profile;
  }

  if (!profileData?.viewer?.isMe) {
    return null;
  }

  const handleExportChecklist = () => {
    if (onExportChecklist) {
      onExportChecklist(profileData?.type === Constants.userType.pro);
    }
  };

  return (
    <BottomSheet
      ref={ref}
      style={styles.container}
      backgroundStyle={styles.backgroundContainer}
      index={0}
      enableOverDrag={false}
      handleComponent={null}
      snapPoints={[Styles.collectionActionBarHeight + Styles.collectionActionBarMarginBottom]}>
      <TouchableOpacity
        style={styles.contentContainer}
        activeOpacity={0.9}
        onPress={handleExportChecklist}
      >
        <Text style={styles.textExport}>Print Checklist</Text>
        <ProBadge
          isForceVisible={true}
          colorVariant={ProColorVariant.white}
        />
      </TouchableOpacity>
    </BottomSheet>
  );
});

BottomView.defaultProps = {
  onExportChecklist: () => {},
};

BottomView.propTypes = {
  onExportChecklist: PropTypes.func,
};

BottomView.displayName = 'BottomView';

export default BottomView;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
  },
  backgroundContainer: {
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    marginBottom: Styles.collectionActionBarMarginBottom,
    shadowColor: Colors.gray,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 4,
    borderRadius: 16,
  },
  textExport: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    textTransform: 'capitalize',
    color: colors.white,
  },
}));
