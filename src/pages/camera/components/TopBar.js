import React, {useEffect, useState, useMemo} from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {Button, BlurView, SegmentedControl} from 'components';
import CameraSportTypeList, {
  sportTypeListWidth,
  sportTypeListVerticalPadding,
} from './SportTypeList';
import {sportTypeListItemHeight} from './SportTypeListItem';

import {Constants} from 'globals';
import {Colors, Fonts} from 'theme';

const closeIcon = require('assets/icons/close.png');
const triangleIcon = require('assets/icons/arrow_triangle_down.png');

const viewFinders = [
  {
    icon: require('assets/icons/camera/capture_normal.png'),
    value: Constants.cardCaptureViewFinder.normal,
  },
  {
    icon: require('assets/icons/camera/capture_grade.png'),
    value: Constants.cardCaptureViewFinder.grade,
  },
];

export const extraTopBarHeight = 5;

const CameraTopBar = props => {
  const {
    style,
    initialOpen,
    navBarHeight,
    userCardTypes,
    currentSportType,
    cardCaptureView,
    onChangeViewFinder,
    onClose,
    onChangeSportType,
  } = props;

  const [animatedContentValue] = useState(new Animated.Value(0));
  const [isExpandedList, setIsExpandedList] = useState(false);
  const [sportTypeListOffsetX, setSportTypeListOffsetX] = useState(0);

  const currentType = useMemo(() => (
    userCardTypes.find(type => type.value === currentSportType)
  ), [currentSportType, userCardTypes]);

  const contentHeight = useMemo(() => (
    (userCardTypes.length || 0) * sportTypeListItemHeight + sportTypeListVerticalPadding * 2
  ), [userCardTypes]);

  useEffect(() => {
    if (initialOpen) {
      animateContent();
    }
  }, [initialOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleChangeSportType = value => {
    handleSportType();
    onChangeSportType(value);
  };

  const handleSportType = () => {
    animateContent();
  };

  const handleChangeViewFinder = (index) => {
    onChangeViewFinder(viewFinders[index].value)
  }

  const handleLayout = ({nativeEvent: {layout}}) => {
    setSportTypeListOffsetX(layout.x);
  };

  const animateContent = () => {
    const newIsExpandedList = !isExpandedList;

    Animated.timing(animatedContentValue, {
      toValue: newIsExpandedList ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();

    setIsExpandedList(newIsExpandedList);
  };

  const renderNavBar = () => {
    return (
      <View style={[styles.navBarContainer, {height: navBarHeight}]}>
        {renderClose()}
        {renderSportType()}
        {renderCaptureMode()}
      </View>
    );
  };

  const renderClose = () => {
    return (
      <View style={styles.closeButtonContainer}>
        <BlurView />
        <Button
          style={styles.closeButton}
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      </View>
    );
  };

  const renderCaptureMode = () => (
    <View style={styles.captureModeContainer}>
      <BlurView />
      <SegmentedControl
        tileStyle={styles.segmentedControlTile}
        segmentIcons={viewFinders.map(item => item.icon)}
        selectedIndex={viewFinders.findIndex(item => item.value === cardCaptureView)}
        onChange={handleChangeViewFinder}
      />
    </View>
  );

  const renderSportType = () => {
    const animationRotateValue = animatedContentValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-180deg'],
    });

    return (
      <View
        style={styles.sportTypeContainer}
        onLayout={handleLayout}
      >
        <BlurView />
        <TouchableOpacity
          style={styles.sportTypeButton}
          activeOpacity={0.9}
          onPress={handleSportType}>
          <Image style={styles.iconSportType} source={currentType?.icon} />
          <Text
            style={styles.textTitle}
            numberOfLines={1}
          >
            {currentType?.shortLabel || currentType?.label}
          </Text>
          <Animated.Image
            style={[
              styles.iconTriangle,
              {transform: [{rotate: animationRotateValue}]},
            ]}
            source={triangleIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSportTypeList = () => {
    const animationHeightValue = animatedContentValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, contentHeight],
    });

    return (
      <CameraSportTypeList
        style={{top: navBarHeight + 5 + extraTopBarHeight, left: sportTypeListOffsetX - 30}}
        types={userCardTypes}
        value={currentSportType}
        animatedValue={animationHeightValue}
        onChangedValue={handleChangeSportType}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        isExpandedList && styles.expandedContainer,
        style,
      ]}
    >
      {renderNavBar()}
      {renderSportTypeList()}
      <TouchableOpacity
        style={styles.backdropContainer}
        activeOpacity={1}
        onPress={handleSportType}
      />
    </View>
  );
};

CameraTopBar.defaultProps = {
  initialOpen: false,
  userCardTypes: [],
  onChangeViewFinder: () => {},
  onClose: () => {},
  onChangeSportType: () => {},
};

CameraTopBar.propTypes = {
  initialOpen: PropTypes.bool,
  navBarHeight: PropTypes.number,
  userCardTypes: PropTypes.array,
  currentSportType: PropTypes.number.isRequired,
  cardCaptureView: PropTypes.string,
  onChangeViewFinder: PropTypes.func,
  onClose: PropTypes.func,
  onChangeSportType: PropTypes.func,
};

export default CameraTopBar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 3,
    paddingTop: extraTopBarHeight,
    backgroundColor: Colors.blackAlpha5,
  },
  expandedContainer: {
    bottom: 0,
  },
  navBarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    zIndex: 1,
    elevation: 1,
  },
  closeButtonContainer: {
    width: 60,
    height: 45,
    borderRadius: 15,
    overflow: 'hidden',
  },
  closeButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconClose: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  sportTypeContainer: {
    width: sportTypeListWidth - 60,
    height: 45,
    borderRadius: 15,
    overflow: 'hidden',
  },
  sportTypeButton: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconSportType: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  textTitle: {
    flex: 1,
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 17,
    color: Colors.white,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  iconTriangle: {
    width: 12,
    height: 12,
    tintColor: Colors.white,
  },
  captureModeContainer: {
    width: 90,
    height: 45,
    borderRadius: 15,
    overflow: 'hidden',
  },
  segmentedControlTile: {
    borderRadius: 14,
  },
  backdropContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
