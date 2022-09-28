import { breakpointsAntDesign, useBreakpoints as useBreakpointsBase } from '@vueuse/core';

const breakpoints = useBreakpointsBase(breakpointsAntDesign);

export function useBreakpoints() {
  return {
    // sm: breakpoints.smaller('sm'),
    // md: breakpoints.between('sm', 'md'),
    // lg: breakpoints.between('md', 'lg'),
    // xl: breakpoints.between('lg', 'xl'),
    // xxl: breakpoints.between('xl', '2xl'),
    // xxxl: breakpoints.greater('2xl'),
    // xl: breakpoints.smaller('xl'),
    isMobile: breakpoints.smaller('lg'),
  };
}
