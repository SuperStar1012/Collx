import Colors from '../resources/Colors';
import Icons from './IconsLight';
import Images from './ImageLight';

const LightTheme = {
  colors: {
    background: 'transparent',
    white: Colors.white,
    black: Colors.white,

    primary: Colors.lightBlue,
    primaryAlpha5: Colors.lightBlueAlpha5,

    // header & bottom bar
    primaryHeaderBackground: Colors.white,
    secondaryHeaderBackground: Colors.white,
    headerTitleColor: Colors.black,
    headerHandlerColor: Colors.blackAlpha2,
    bottomBarBackground: Colors.whiteAlphaHalf8,
    bottomBarBorder: Colors.softGrayAlphaHalf8,

    // background
    primaryBackground: Colors.white,
    secondaryBackground: Colors.softGray,

    // card background
    primaryCardBackground: Colors.white,
    secondaryCardBackground: Colors.softGray,
    tertiaryCardBackground: Colors.moreLightGray,

    rawConditionBackground: Colors.lightGray,

    warningBackground: Colors.whiteAlphaHalf1,

    appleButtonBackground: Colors.black,
    appleButtonText: Colors.white,

    cardTypeListBackground: Colors.whiteAlpha8,

    // condition
    conditionBackground: Colors.lightBlueAlpha1,

    // Coming
    comingBackground: Colors.whiteAlpha8,
    comingText: Colors.blackAlpha4,

    // Scroll to Top
    scrollTopBackground: Colors.blackAlpha4,
    scrollTopText: Colors.softGray,

    // text
    primaryText: Colors.dark,
    secondaryText: Colors.dark,
    darkGrayText: Colors.darkGray,
    grayText: Colors.gray,
    lightGrayText: Colors.lightGray,
    onboardingText: Colors.gray,
    onboardingFlowText: Colors.gray,
    marketplaceText: Colors.lightBlue,

    placeholderText: Colors.darkGray,

    // border line
    primaryBorder: Colors.soft,
    secondaryBorder: Colors.softGray,
    tertiaryBorder: Colors.moreLightGray,
    quaternaryBorder: Colors.softGray,
    grayBorder: Colors.lightGray,

    // status
    warning: Colors.softYellow,
    updated: Colors.lightGreen,

    // placeholder
    shimmerColors: [],

    // discount & shipping
    shippingInfoColor: Colors.primary,

    // alert
    alertBlueColor: Colors.gray,
    alertBlueBackground: Colors.grayAlpha1,
    alertYellowColor: Colors.yellow,
    alertYellowBackground: Colors.lightYellow,
    alertGreenColor: Colors.softDarkGreen,
    alertGreenBackground: Colors.greenAlpha1,
    alertRedColor: Colors.red,
    alertRedBackground: Colors.redAlpha1,
  },
  icons: Icons,
  images: Images,
};

export default LightTheme;
