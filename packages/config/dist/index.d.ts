export interface AppMetadata {
    name: string;
    version: string;
    environment: string;
}
export declare class ConfigurationService {
    private config;
    constructor(envOverride?: Record<string, string>);
    get(key: string, defaultValue?: string): string;
    getOptional(key: string): string | undefined;
}
export declare class SecretsManager {
    private secrets;
    loadSecrets(payload: Record<string, string>): void;
    getSecret(key: string): string;
}
export declare class FeatureFlagsSdk {
    private flags;
    setFlag(key: string, enabled: boolean): void;
    isEnabled(key: string): boolean;
}
export declare class VersionService {
    static getVersion(): string;
    static getMetadata(): AppMetadata;
}
