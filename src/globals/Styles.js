import {Dimensions} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

const screenWidth = Math.round(screenDimensions.width);
const screenHeight = Math.round(screenDimensions.height);

const windowWidth = Math.round(windowDimensions.width);
const windowHeight = Math.round(windowDimensions.height);

let screenSafeTopHeight = initialWindowMetrics && initialWindowMetrics.insets.top;
let screenSafeBottomHeight = initialWindowMetrics && initialWindowMetrics.insets.bottom;
let headerStatusBarHeight = Math.max(Math.floor(screenSafeTopHeight / 2), 20);

let headerNavBarHeight = 0;
let bottomTabBarHeight = 0;

const gridCardHorizontalPadding = 7;
const gridCardHorizontalMargin = 3;

export default {
  screenWidth,
  screenHeight,
  windowWidth,
  windowHeight,
  screenSafeTopHeight,
  screenSafeBottomHeight,
  headerStatusBarHeight,
  cameraNavigationBarContentHeight: 44,
  cameraBottomBarCard: {
    width: 40,
    height: 56,
  },
  cameraBottomBarCardImage: {
    width: 35,
    height: 48,
  },
  cameraBottomBarSmallCard: {
    width: 34,
    height: 44,
  },
  cameraBottomBarSmallCardImage: {
    width: 28,
    height: 39,
  },
  collectionActionBarHeight: 50,
  collectionActionBarMarginBottom: 8,
  headerNavBarHeight,
  bottomTabBarHeight,
  gridCardHorizontalPadding,
  gridCardHorizontalMargin,
  gridCardWidth: Math.floor((windowWidth - gridCardHorizontalPadding * 2 - gridCardHorizontalMargin * 2 * 5) / 5),
};
