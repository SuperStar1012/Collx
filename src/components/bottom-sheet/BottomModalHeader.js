import React, {useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {AutoSizeText, ResizeTextMode} from 'react-native-auto-size-text';

import {createUseStyle, Fonts} from 'theme';

const closeIcon = require('assets/icons/close.png');

const headerHeight = 28;

const BottomModalHeader = ({
  style,
  textStyle,
  title,
  titleNumberOfLines,
  isHideClose,
  headerLeft,
  headerRight,
  onClose,
}) => {
  const styles = useStyle();

  const [leftWidth, setLeftWidth] = useState(0);
  const [rightWidth, setRightWidth] = useState(0);

  const handleLeftLayout = ({nativeEvent: {layout: {width}}}) => {
    setLeftWidth(width);
  };

  const handleRightLayout = ({nativeEvent: {layout: {width}}}) => {
    setRightWidth(width);
  };

  const renderLeft = () => {
    if (headerLeft) {
      return headerLeft();
    } else if (isHideClose) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.closeButton}
        activeOpacity={0.8}
        onPress={onClose}>
        <Image style={styles.iconClose} source={closeIcon} />
      </TouchableOpacity>
    );
  };

  const renderRight = () => {
    if (headerRight) {
      return headerRight();
    }

    return null;
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.mainContainer,
          title
            ? styles.contentWithTitleContainer
            : styles.contentWithNoTitleContainer,
          {height: headerHeight * titleNumberOfLines}
        ]}>
        <View
          style={[styles.sideContainer, styles.leftContainer]}
          onLayout={handleLeftLayout}
        >
          {renderLeft()}
        </View>
        <AutoSizeText
          style={[
            styles.textTitle,
            {marginHorizontal: Math.max(leftWidth, rightWidth) + 5},
            textStyle,
          ]}
          fontSize={textStyle.fontSize || styles.textTitle.fontSize}
          numberOfLines={titleNumberOfLines}
          mode={ResizeTextMode.max_lines}>
          {title}
        </AutoSizeText>
        <View
          style={[styles.sideContainer, styles.rightContainer]}
          onLayout={handleRightLayout}
        >
          {renderRight()}
        </View>
      </View>
    </View>
  );
};

BottomModalHeader.defaultProps = {
  title: '',
  isHideClose: false,
  titleNumberOfLines: 1,
  textStyle: {},
  onClose: () => {},
};

BottomModalHeader.propTypes = {
  title: PropTypes.string,
  titleNumberOfLines: PropTypes.number,
  isHideClose: PropTypes.bool,
  onClose: PropTypes.func,
};

export default BottomModalHeader;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    backgroundColor: colors.primaryCardBackground,
  },
  mainContainer: {
    height: headerHeight,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentWithNoTitleContainer: {
    marginVertical: 8,
  },
  contentWithTitleContainer: {
    marginVertical: 16,
  },
  textTitle: {
    flex: 1,
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
    textAlign: 'center',
    color: colors.primaryText,
  },
  sideContainer: {
    position: 'absolute',
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftContainer: {
    left: 0,
  },
  rightContainer: {
    right: 0,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconClose: {
    width: 28,
    height: 28,
    tintColor: colors.primary,
  },
}));
