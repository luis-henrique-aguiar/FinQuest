import "styled-components";
import { lightTheme } from "./theme";

type ThemeType = typeof lightTheme;

declare module "styled-components" {
  export interface DefaultTheme extends Omit<ThemeType, "name"> {
    name: string;
  }
}
