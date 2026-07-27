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

export const lightTheme: ThemeTokens = {
  colors: {
    primary: '#4F46E5',
    secondary: '#64748B',
    background: '#FFFFFF',
    text: '#0F172A',
    border: '#E2E8F0',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSizeSm: '12px',
    fontSizeMd: '14px',
    fontSizeLg: '16px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
  elevation: {
    none: 'none',
    low: '0 1px 3px rgba(0,0,0,0.1)',
    medium: '0 4px 6px rgba(0,0,0,0.15)',
    high: '0 10px 15px rgba(0,0,0,0.2)',
  },
};

export const darkTheme: ThemeTokens = {
  ...lightTheme,
  colors: {
    primary: '#6366F1',
    secondary: '#94A3B8',
    background: '#0F172A',
    text: '#F8FAFC',
    border: '#334155',
  },
};

export const highContrastTheme: ThemeTokens = {
  ...lightTheme,
  colors: {
    primary: '#0000FF',
    secondary: '#000000',
    background: '#FFFFFF',
    text: '#000000',
    border: '#000000',
  },
};

export class ThemeEngine {
  private currentTheme: ThemeTokens = lightTheme;

  setTheme(theme: 'light' | 'dark' | 'high-contrast'): void {
    if (theme === 'dark') {
      this.currentTheme = darkTheme;
    } else if (theme === 'high-contrast') {
      this.currentTheme = highContrastTheme;
    } else {
      this.currentTheme = lightTheme;
    }
  }

  getCurrentTheme(): ThemeTokens {
    return this.currentTheme;
  }

  applyTenantBranding(colors: Partial<ThemeTokens['colors']>): ThemeTokens {
    this.currentTheme = {
      ...this.currentTheme,
      colors: {
        ...this.currentTheme.colors,
        ...colors,
      },
    };
    return this.currentTheme;
  }
}
