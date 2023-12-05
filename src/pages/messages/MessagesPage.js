/* eslint-disable no-constant-condition */
import React, {useCallback, useMemo, useEffect, useRef, useState, Suspense} from 'react';
import {Text, View, Image} from 'react-native';
import {ChannelList, useChatContext} from 'stream-chat-react-native';
import {useScrollToTop} from '@react-navigation/native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import Config from 'react-native-config';

import {
  // Button,
  Badge,
  LoadingIndicator,
  SearchBar,
  KeyboardAvoidingView,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import CreateAccount from './components/CreateAccount';
import ChannelPreview from './components/ChannelPreview';
import CollXAIItem from './components/CollXAIItem';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {withMessage} from 'store/containers';
import {
  chatClient,
  findMessageChannels,
  analyticsNavigationRoute,
  analyticsEvents,
  analyticsSendEvent,
} from 'services';
import {Constants, Styles} from 'globals';
import {createUseStyle} from 'theme';
import {wp, encodeId} from 'utils';

// const pencilIcon = require('assets/icons/pencil_square.png');
const messageIcon = require('assets/icons/message.png');

const Messages = props => {
  const {navigation} = props;

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
    refresh: handleRefresh,
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <MessagesContent
              {...props}
              queryOptions={refreshedQueryOptions ?? {}}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const MessagesContent = ({
  navigation,
  route,
  isFetching,
  user,
  unreadMessageCount,
  connectedChatClient,
  queryOptions,
  setEmailVerifiedAction,
}) => {
  const {userId} = route?.params || {};

  const {isOnline} = useChatContext();
  const styles = useStyle();
  const actions = useActions();

  const scrollViewRef = useRef(null);
  const searchBarRef = useRef(null);

  const [searchText, setSearchText] = useState(null);
  const [aiChannel, setAIChannel] = useState(null);

  useScrollToTop(scrollViewRef);

  const viewerData = useLazyLoadQuery(graphql`
    query MessagesPageQuery {
      viewer {
        profile {
          id
          type
          ...CollXAIItem_profile
          ...ChannelPreview_profile
        }
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  const {id: profileId, type: profileType} = viewerData.viewer?.profile || {};

  const memoizedFilters = useMemo(() => {
    const channelFilters = {
      members: {$in: [`${user.id}`]},
      member_count: {$gte: 2},
      type: 'messaging',
    };

    if (searchText) {
      channelFilters['member.user.name'] = {$autocomplete: `${searchText}`};
    }

    return channelFilters;
  }, [searchText]);

  useEffect(() => {
    if (!userId || !isOnline || !connectedChatClient) {
      return;
    }

    findChannel();
  }, [userId, isOnline, connectedChatClient]);

  useEffect(() => {
    setNavigationBar();
  }, [unreadMessageCount]);

  useEffect(() => {
    (async () => {
      if (!profileId) {
        return;
      }

      const channels = await findMessageChannels(
        profileId,
        encodeId(Constants.base64Prefix.profile, Config.COLLX_AI_BOT_USER_ID),
      );

      if (channels?.length) {
        setAIChannel(channels[0] || {});
      } else {
        setAIChannel({});
      }
    })();
  }, [profileId, profileType]);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerTitle: ({style}) => (
        <View style={styles.headerTitleContainer}>
          <Text style={style}>Messages</Text>
          {unreadMessageCount > 0 ? <Badge label={unreadMessageCount} /> : null}
        </View>
      ),
    });
  };

  const findChannel = async () => {
    if (!connectedChatClient) {
      navigation.setParams({
        userId: null,
      });

      return;
    }

    const filter = { type: 'messaging', members: { $eq: [`${user.id}`, `${userId}`] } };
    const sort = [{ last_message_at: -1 }];

    setTimeout(async () => {
      try {
        const channels = await chatClient.queryChannels(filter, sort, {
          watch: true,
          state: true,
        });

        if (channels?.length > 0) {
          handleSelectChannel(channels[0]);
        }
      } catch (error) {
        console.log(error);
      }
    }, 500);

    navigation.setParams({
      userId: null,
    });
  };

  const handleChangeSearch = value => {
    setSearchText(value);
  };

  // const handleEdit = () => {
  //   setEmailVerifiedAction(() => {
  //     actions.navigateMessageChannel({
  //       channel: null,
  //       cardId: null,
  //       peerUserId: null,
  //     });
  //   });
  // };

  const handleSelectChannel = async channel => {
    setEmailVerifiedAction(() => {
      actions.navigateMessageChannel({
        channel,
        cardId: null,
        peerUserId: null,
      });
    });
  };

  const handleDelete = () => {
    setSearchText('');
  };

  const handleCancel = () => {
    setSearchText('');
  };

  const handleBlur = () => {
    setSearchText('');
  };

  const handleCreateAccount = () => {
    actions.navigateCreateAccount();
  };

  const handleCollXAI = async () => {
    const isProUser = profileType === Constants.userType.pro;

    if (!isProUser) {
      handleSelectPro();
      return;
    }

    const navigateMessage = async () => {
      if (profileId) {
        const peerUserId = encodeId(Constants.base64Prefix.profile, Config.COLLX_AI_BOT_USER_ID);

        const channel = await actions.navigateMessage({
          currentProfileId: profileId,
          peerProfileId: peerUserId,
          channel: aiChannel,
        });

        setAIChannel(channel);

        analyticsSendEvent(
          analyticsEvents.promptedAI,
          {
            from: analyticsNavigationRoute.Message,
          },
        );
      }
    };

    setEmailVerifiedAction(navigateMessage);
  };

  const handleSelectPro = () => {
    actions.navigateCollXProModal({
      source: analyticsNavigationRoute.Messages,
    });
  };

  const renderSearchBar = () => (
    <View style={styles.searchBarContainer}>
      <SearchBar
        ref={searchBarRef}
        style={styles.searchBar}
        placeholder="Search"
        onChangeText={handleChangeSearch}
        onDelete={handleDelete}
        onCancel={handleCancel}
        onBlur={handleBlur}
      />
      {/* <Button
        style={styles.editButton}
        icon={pencilIcon}
        iconStyle={styles.iconEdit}
        onPress={handleEdit}
      /> */}
    </View>
  );

  const renderEmpty = () => {
    const title = searchText ? 'No message found' : "Let's start chatting!";
    const description = searchText ? "We couldn't find any results with the keyword you entered." : 'How about sending your first message to a friend?';

    return (
      <View style={styles.emptyContainer}>
        <Image style={styles.iconMessage} source={messageIcon} />
        <Text style={styles.textEmptyTitle}>{title}</Text>
        <Text style={styles.textEmptyDescription}>{description}</Text>
      </View>
    );
  };

  if (user.anonymous) {
    return <CreateAccount onCreateAccount={handleCreateAccount} />;
  }

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isFetching} />
      {renderSearchBar()}
      <CollXAIItem
        profile={viewerData.viewer.profile}
        aiChannel={aiChannel}
        onPress={handleCollXAI}
      />
      <KeyboardAvoidingView
        bottomOffset={Styles.bottomTabBarHeight}>
        {connectedChatClient ? (
          <ChannelList
            setFlatListRef={ref => (scrollViewRef.current = ref)}
            filters={memoizedFilters}
            options={{
              state: true,
              watch: true,
            }}
            sort={{
              last_message_at: -1,
            }}
            Preview={(previewProps) => (
              <ChannelPreview
                {...previewProps}
                profile={viewerData.viewer.profile}
                aiChannelId={aiChannel?.cid}
                onSelectPro={handleSelectPro}
              />
            )}
            EmptyStateIndicator={renderEmpty}
            onSelect={handleSelectChannel}
          />
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 9,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondaryCardBackground,
  },
  iconEdit: {
    width: 28,
    height: 28,
    tintColor: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  iconMessage: {
    width: wp(30),
    height: wp(30),
    tintColor: colors.grayText,
  },
  textEmptyTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.primaryText,
  },
  textEmptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.grayText,
  },
}));

export default withMessage(Messages);
