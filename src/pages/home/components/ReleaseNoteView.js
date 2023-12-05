import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {Button} from 'components';

import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {
  openUrl,
  getStorageItem,
  setStorageItem,
} from 'utils';
import {useActions} from 'actions';

const closeIcon = require('assets/icons/close.png');
const checkIcon = require('assets/icons/check.png');

const ctaLinkBrowserType = {
  inApp: 'in-app',
  system: 'system',
};

const BulletItem= ({
  bullet
}) => {
  const styles = useStyle();

  return (
    <View style={styles.bulletContainer}>
      <Image style={styles.iconCheck} source={checkIcon} />
      <Text style={styles.textBullet}>{bullet}</Text>
    </View>
  );
};

const ReleaseNoteView = ({
  style,
  releaseNote,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const [isDismissed, setIsDismissed] = useState(true);

  const {
    intro,
    outro,
    callToAction,
    ctaLink,
    ctaLinkBrowser,
    ctaInAppBrowserTitle,
    bullets,
  } = releaseNote?.attributes || {};

  useEffect(() => {
    (async () => {
      // Checks Dismiss
      const isDismissed = await getStorageItem(
        Constants.dismissedReleaseNote + DeviceInfo.getVersion(),
      );

      setIsDismissed(isDismissed === 'true');
    })();
  }, []);

  const handleClose = () => {
    setStorageItem(Constants.dismissedReleaseNote + DeviceInfo.getVersion(), 'true');
    setIsDismissed(true);
  };

  const handleAction = () => {
    if (!ctaLink) {
      return;
    }

    if (ctaLinkBrowser === ctaLinkBrowserType.inApp) {
      // In App
      actions.navigateWebViewer({
        title: ctaInAppBrowserTitle,
        url: ctaLink,
      });
    } else if (ctaLinkBrowser === ctaLinkBrowserType.system) {
      // System
      openUrl(ctaLink);
    }
  };

  if (!releaseNote?.attributes || isDismissed) {
    return null;
  }

  const renderBullets = () => {
    if (!bullets) {
      return null;
    }

    return (
      <View style={styles.listContainer}>
        {
          bullets.map((item, index) => (
            <BulletItem key={index} bullet={item.bullet} />
          ))
        }
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Button
        style={styles.closeButton}
        iconStyle={styles.iconClose}
        icon={closeIcon}
        onPress={handleClose}
      />
      <Text style={styles.textTitle}>What’s New in CollX</Text>
      {intro ? <Text style={[styles.textDescription, styles.textIntro]}>{intro}</Text> : null}
      {renderBullets()}
      {outro ? <Text style={[styles.textDescription, styles.textOutro]}>{outro}</Text> : null}
      {callToAction ? (
        <Button
          style={styles.button}
          label={callToAction}
          labelStyle={styles.textButton}
          scale={Button.scaleSize.One}
          onPress={handleAction}
        />
      ) : null}
    </View>
  );
};

ReleaseNoteView.defaultProps = {};

ReleaseNoteView.propTypes = {};

export default ReleaseNoteView;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 10,
    backgroundColor: colors.primaryCardBackground,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  iconClose: {
    width: 24,
    height: 24,
    tintColor: colors.darkGrayText,
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 22,
    color: colors.primaryText,
    marginBottom: 4,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textIntro: {
    marginTop: 12,
  },
  textOutro: {
    marginTop: 12,
  },
  button: {
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginTop: 16,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.white,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: colors.secondaryCardBackground,
    marginTop: 12,
  },
  bulletContainer: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  iconCheck: {
    width: 20,
    height: 20,
    tintColor: Colors.softDarkGreen,
  },
  textBullet: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginLeft: 6,
  },
}));
