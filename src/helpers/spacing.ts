import type { TDevice } from '../ScreenProvider/context';

export type ThemeSpacing = Record<TDevice, number>;

export const defaultSpacing = { xs: 2, sm: 4, md: 8, lg: 12, xl: 24 };
