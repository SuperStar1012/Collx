import React, {useMemo, useRef} from 'react';
import {View, Alert, Animated} from 'react-native';
import {useFragment, graphql} from 'react-relay';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
  ChannelPreviewMessenger,
  ChannelPreviewTitle,
  Delete,
} from 'stream-chat-react-native';
import Config from 'react-native-config';

import {ProBadge} from 'components';

import {hideChannel} from 'services';
import {Colors, createUseStyle} from 'theme';
import {Constants} from 'globals';
import {decodeId, getPeerUser} from 'utils';

const ChannelPreview = ({
  profile,
  aiChannelId,
  onSelectPro,
  ...otherProps
}) => {
  const styles = useStyle();

  const swipeableRef = useRef(null);

  const profileData = useFragment(graphql`
    fragment ChannelPreview_profile on Profile {
      id
      type
      flags
      ...ProBadge_profile
    }`,
    profile,
  );

  const peerUser = useMemo(() => {
    const [, currentUserId] = decodeId(profileData.id);
    const {members} = otherProps.channel.state || {};
    const user = getPeerUser(members, currentUserId);
    return user;
  }, [otherProps.channel, profileData.id]);

  const handleSelect = () => {
    if (onSelectPro) {
      onSelectPro()
    }
  };

  const moreProps = useMemo(() => {
    if (peerUser?.id !== Config.COLLX_SUPPORT_USER_ID || profileData?.type === Constants.userType.pro) {
      return otherProps;
    }

    return ({
      ...otherProps,
      onSelect: handleSelect,
    });
  }, [otherProps, profileData, peerUser]);

  const handleClose = () => {
    swipeableRef.current?.close();
  };

  const handleDeleteChannel = async () => {
    handleClose();
    const {channel} = moreProps;
    hideChannel(channel);
  };

  const handleConfirmDeleteChannel = () => {
    Alert.alert(
      'CollX',
      `Are you sure you want to delete this conversation?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: handleClose,
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: handleDeleteChannel,
        },
      ],
    );
  };

  const renderRightActions = (progress) => {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [60, 0],
    });

    return (
      <View style={styles.swipeableContainer}>
        <Animated.View style={[styles.swipeableContentContainer, {transform: [{translateX}]}]}>
          <RectButton
            style={styles.swipeableButton}
            onPress={handleConfirmDeleteChannel}
          >
            <Delete pathFill={Colors.red} />
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  const renderChannelPreviewTitle = (titleProps) => (
    <View style={styles.titleContainer}>
      <ChannelPreviewTitle
        {...titleProps}
      />
      {(peerUser?.type === Constants.userType.pro) ? (
        <ProBadge profile={profileData} isForceVisible />
      ) : null}
    </View>
  );

  if (aiChannelId === moreProps.channel?.cid) {
    return null;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      containerStyle={styles.previewMessengerContainer}
      overshootLeft={false}
      overshootRight={false}
      renderRightActions={renderRightActions}
    >
      <ChannelPreviewMessenger
        {...moreProps}
        PreviewTitle={renderChannelPreviewTitle}
      />
    </Swipeable>
  );
};

export default ChannelPreview;

const useStyle = createUseStyle(() => ({
  swipeableContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  swipeableContentContainer: {},
  swipeableButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
