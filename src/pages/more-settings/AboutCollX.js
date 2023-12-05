import React, {useMemo} from 'react';
import {FlatList} from 'react-native';

import SettingsItem from './components/SettingsItem';

import {createUseStyle} from 'theme';
import {withSettings} from 'store/containers';
import {Urls} from 'globals';
import {openUrl} from 'utils';

const settingsNormalData = [
  {
    label: 'Suggest a Missing Set',
    externalUrl: Urls.missingSetFormUrl,
    icon: require('assets/icons/bubble.png'),
  },
  {
    label: 'About CollX',
    internalUrl: Urls.aboutUrl,
    icon: require('assets/icons/exclamation_circle.png'),
  },
  {
    label: 'CollX Shop',
    externalUrl: Urls.collxShopUrl,
    icon: require('assets/icons/store.png'),
  },
  {
    label: 'FAQ',
    internalUrl: Urls.faqUrl,
    icon: require('assets/icons/question_circle.png'),
  },
  {
    label: 'Community Guidelines',
    internalUrl: Urls.communityGuidelinesUrl,
    icon: require('assets/icons/doc.png'),
  },
  {
    label: 'Selling on CollX',
    internalUrl: Urls.marketplaceFaqUrl,
    icon: require('assets/icons/doc.png'),
  },
  {
    label: 'Terms of Service',
    internalUrl: Urls.termsUrl,
    icon: require('assets/icons/doc.png'),
  },
  {
    label: 'Privacy Policy',
    internalUrl: Urls.privacyUrl,
    icon: require('assets/icons/doc.png'),
  },
  {
    label: 'Recently Added Sets',
    internalUrl: Urls.setsUrl,
    icon: require('assets/icons/doc.png'),
  },
];

const settingsAnonymousData = [
  {
    label: 'FAQ',
    internalUrl: Urls.faqUrl,
    icon: require('assets/icons/question_circle.png'),
  },
  {
    label: 'Terms of Service',
    internalUrl: Urls.termsUrl,
    icon: require('assets/icons/doc.png'),
  },
  {
    label: 'About CollX',
    internalUrl: Urls.aboutUrl,
    icon: require('assets/icons/exclamation_circle.png'),
  },
];

const AboutCollX = ({
  navigation,
  user,
}) => {
  const styles = useStyle();

  const settingsData = useMemo(() => {
    if (user.anonymous) {
      return settingsAnonymousData;
    }

    return settingsNormalData;
  }, [user.anonymous]);

  const handleSelect = item => {
    if (item.internalUrl) {
      navigation.navigate('CommonStackModal', {
        screen: 'WebViewer',
        params: {
          title: item.label,
          url: item.internalUrl,
        },
      });
    } else if (item.externalUrl) {
      openUrl(item.externalUrl);
    }
  };

  const renderItem = ({item}) => (
    <SettingsItem
      {...item}
      onPress={() => handleSelect(item)}
    />
  );

  return (
    <FlatList
      style={styles.container}
      data={settingsData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));

export default withSettings(AboutCollX);
