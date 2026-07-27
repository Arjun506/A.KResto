"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionService = exports.FeatureFlagsSdk = exports.SecretsManager = exports.ConfigurationService = void 0;
class ConfigurationService {
    config;
    constructor(envOverride) {
        this.config = envOverride || (typeof process !== 'undefined' ? process.env : {});
    }
    get(key, defaultValue) {
        const val = this.config[key];
        if (val === undefined && defaultValue !== undefined) {
            return defaultValue;
        }
        if (val === undefined) {
            throw new Error(`Missing mandatory configuration key: ${key}`);
        }
        return val;
    }
    getOptional(key) {
        return this.config[key];
    }
}
exports.ConfigurationService = ConfigurationService;
class SecretsManager {
    secrets = new Map();
    loadSecrets(payload) {
        for (const [key, value] of Object.entries(payload)) {
            this.secrets.set(key, value);
        }
    }
    getSecret(key) {
        const sec = this.secrets.get(key);
        if (!sec) {
            throw new Error(`Secret key "${key}" not loaded in secure vault.`);
        }
        return sec;
    }
}
exports.SecretsManager = SecretsManager;
class FeatureFlagsSdk {
    flags = new Map();
    setFlag(key, enabled) {
        this.flags.set(key, enabled);
    }
    isEnabled(key) {
        return this.flags.get(key) === true;
    }
}
exports.FeatureFlagsSdk = FeatureFlagsSdk;
class VersionService {
    static getVersion() {
        return '1.0.0';
    }
    static getMetadata() {
        return {
            name: 'Business OS X',
            version: '1.0.0',
            environment: 'production',
        };
    }
}
exports.VersionService = VersionService;
