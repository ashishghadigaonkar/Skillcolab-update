import { colors } from "./colors";

export interface ThemeTokens {
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceSecondary: string;
  surfaceElevated: string;
  card: string;
  cardHover: string;
  border: string;
  divider: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  inputBackground: string;
  inputBorder: string;
  shadow: string;
}

export const theme = {
  light: colors.light,
  dark: colors.dark,
};
