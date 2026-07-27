export interface AppMetadata {
  name: string;
  version: string;
  environment: string;
}

export class ConfigurationService {
  private config: Record<string, string | undefined>;

  constructor(envOverride?: Record<string, string>) {
    this.config = envOverride || (typeof process !== 'undefined' ? process.env : {});
  }

  get(key: string, defaultValue?: string): string {
    const val = this.config[key];
    if (val === undefined && defaultValue !== undefined) {
      return defaultValue;
    }
    if (val === undefined) {
      throw new Error(`Missing mandatory configuration key: ${key}`);
    }
    return val;
  }

  getOptional(key: string): string | undefined {
    return this.config[key];
  }
}

export class SecretsManager {
  private secrets = new Map<string, string>();

  loadSecrets(payload: Record<string, string>): void {
    for (const [key, value] of Object.entries(payload)) {
      this.secrets.set(key, value);
    }
  }

  getSecret(key: string): string {
    const sec = this.secrets.get(key);
    if (!sec) {
      throw new Error(`Secret key "${key}" not loaded in secure vault.`);
    }
    return sec;
  }
}

export class FeatureFlagsSdk {
  private flags = new Map<string, boolean>();

  setFlag(key: string, enabled: boolean): void {
    this.flags.set(key, enabled);
  }

  isEnabled(key: string): boolean {
    return this.flags.get(key) === true;
  }
}

export class VersionService {
  static getVersion(): string {
    return '1.0.0';
  }

  static getMetadata(): AppMetadata {
    return {
      name: 'Business OS X',
      version: '1.0.0',
      environment: 'production',
    };
  }
}
