export interface ThemeTokens {
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        border: string;
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    typography: {
        fontFamily: string;
        fontSizeSm: string;
        fontSizeMd: string;
        fontSizeLg: string;
    };
    radius: {
        sm: string;
        md: string;
        lg: string;
    };
    elevation: {
        none: string;
        low: string;
        medium: string;
        high: string;
    };
}
export declare const lightTheme: ThemeTokens;
export declare const darkTheme: ThemeTokens;
export declare const highContrastTheme: ThemeTokens;
export declare class ThemeEngine {
    private currentTheme;
    setTheme(theme: 'light' | 'dark' | 'high-contrast'): void;
    getCurrentTheme(): ThemeTokens;
    applyTenantBranding(colors: Partial<ThemeTokens['colors']>): ThemeTokens;
}
