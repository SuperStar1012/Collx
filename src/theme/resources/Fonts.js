import {Platform} from 'react-native';

export default {
  // 200
  nunitoExtraLight: 'Nunito-ExtraLight',
  nunitoExtraLightItalic: 'Nunito-ExtraLightItalic',
  // 300
  nunitoLight: 'Nunito-Light',
  nunitoLightItalic: 'Nunito-LightItalic',
  // 400
  nunitoRegular: 'Nunito-Regular',
  nunitoItalic: 'Nunito-Italic',
  // 600
  nunitoSemiBold: 'Nunito-SemiBold',
  nunitoSemiBoldItalic: 'Nunito-SemiBoldItalic',
  // 700
  nunitoBold: 'Nunito-Bold',
  nunitoBoldItalic: 'Nunito-BoldItalic',
  // 800
  nunitoExtraBold: 'Nunito-ExtraBold',
  nunitoExtraBoldItalic: 'Nunito-ExtraBoldItalic',
  // 900
  nunitoBlack: 'Nunito-Black',
  nunitoBlackItalic: 'Nunito-BlackItalic',

  extraLight: '200',
  light: '300',
  regular: '400',
  semiBold: Platform.select({
    ios: '600',
    android: 'bold',
  }),
  bold: '700',
  extraBold: '800',
  heavy: '900',
};
