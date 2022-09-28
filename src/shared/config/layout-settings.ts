import { DEFAULT_HEADER_THEME, DEFAULT_SIDEBAR_THEME } from '@/shared/config/constants';

export type NavigationTheme = 'light' | 'dark';
export type ColorMode = 'none' | 'gray' | 'weak';

export interface LayoutSettings {
  colorMode: ColorMode
  navigationTop: boolean
  navigationAccordion: boolean
  fixedHeader: boolean
  fixedSidebar: boolean
  headerTheme: NavigationTheme
  sidebarTheme: NavigationTheme
}

export const layoutSettings: LayoutSettings = Object.freeze({
  colorMode: 'none',
  navigationTop: false,
  navigationAccordion: false,
  fixedHeader: false,
  fixedSidebar: false,
  headerTheme: DEFAULT_HEADER_THEME,
  sidebarTheme: DEFAULT_SIDEBAR_THEME,
});
