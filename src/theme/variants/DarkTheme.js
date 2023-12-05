import Colors from '../resources/Colors';
import Icons from './IconsDark';
import Images from './ImagesDark';

const DarkTheme = {
  colors: {
    background: 'transparent',
    white: Colors.white,
    black: Colors.white,

    primary: Colors.lightBlue,
    primaryAlpha5: Colors.lightBlueAlpha5,

    // header & bottom bar
    primaryHeaderBackground: Colors.black,
    secondaryHeaderBackground: Colors.dark,
    headerTitleColor: Colors.white,
    headerHandlerColor: Colors.whiteAlpha2,
    bottomBarBackground: Colors.blackAlphaHalf8,
    bottomBarBorder: Colors.darkAlphaHalf8,

    // background
    primaryBackground: Colors.black,
    secondaryBackground: Colors.black,

    // card background
    primaryCardBackground: Colors.dark,
    secondaryCardBackground: Colors.darkLess,
    tertiaryCardBackground: Colors.dark,

    rawConditionBackground: Colors.moreGray,

    warningBackground: Colors.blackAlphaHalf1,

    appleButtonBackground: Colors.white,
    appleButtonText: Colors.black,

    cardTypeListBackground: Colors.blackAlpha8,

    // condition
    conditionBackground: Colors.darkMoreBlue,

    // Coming
    comingBackground: Colors.blackAlpha8,
    comingText: Colors.whiteAlpha4,

    // Scroll to Top
    scrollTopBackground: Colors.whiteAlpha4,
    scrollTopText: Colors.dark,

    // text
    primaryText: Colors.softGray,
    secondaryText: Colors.primary,
    darkGrayText: Colors.darkGray,
    grayText: Colors.gray,
    lightGrayText: Colors.lightGray,
    onboardingText: Colors.white,
    onboardingFlowText: Colors.lightGray,
    marketplaceText: Colors.white,

    placeholderText: Colors.darkGray,

    // border line
    primaryBorder: Colors.moreGray,
    secondaryBorder: Colors.black,
    tertiaryBorder: Colors.black,
    quaternaryBorder: Colors.dark,
    grayBorder: Colors.darkGray,

    // status
    warning: Colors.softYellow,
    updated: Colors.lightGreen,

    // placeholder
    shimmerColors: [Colors.whiteAlpha1, Colors.whiteAlpha1, Colors.whiteAlpha1],

    // discount & shipping
    shippingInfoColor: Colors.white,

    // alert
    alertBlueColor: Colors.white,
    alertBlueBackground: Colors.darkLess,
    alertYellowColor: Colors.brown,
    alertYellowBackground: Colors.darkBrown,
    alertGreenColor: Colors.darkGreen,
    alertGreenBackground: Colors.moreLightGreen,
    alertRedColor: Colors.moreRed,
    alertRedBackground: Colors.moreDarkRed,
  },
  icons: Icons,
  images: Images,
};

export default DarkTheme;
