import {
  initThemeProvider,
  useStyle,
} from '@pavelgric/react-native-theme-provider';

import LightTheme from './variants/LightTheme';
import DarkTheme from './variants/DarkTheme';

export const themes = {
  light: LightTheme,
  dark: DarkTheme,
};

export const {
  createUseStyle,
  createStyle,
  useTheme,
  useThemeDispatch,
  ThemeProvider,
} = initThemeProvider({themes, initialTheme: 'light'});

export {useStyle};
