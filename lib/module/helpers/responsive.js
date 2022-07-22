export const deviceSizes = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
};
export const getSize = screen => {
  const {
    width
  } = screen;
  let size = 'xs';

  if (width < (deviceSizes === null || deviceSizes === void 0 ? void 0 : deviceSizes.sm)) {
    size = 'xs';
  } else if (width < deviceSizes.md) {
    size = 'sm';
  } else if (width < deviceSizes.lg) {
    size = 'md';
  } else if (width < deviceSizes.xl) {
    size = 'lg';
  } else if (width >= deviceSizes.xl) {
    size = 'xl';
  }

  return size;
};
//# sourceMappingURL=responsive.js.map