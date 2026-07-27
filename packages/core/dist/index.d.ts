export interface UserSession {
    sessionId: string;
    userId: string;
    tenantId: string;
    roles: string[];
    expiresAt: Date;
}
export declare class AuthenticationEngine {
    authenticateUser(credentials: any): Promise<UserSession | null>;
}
export interface PermissionRule {
    role: string;
    action: string;
    resource: string;
    effect: 'ALLOW' | 'DENY';
}
export declare class AuthorizationEngine {
    hasPermission(roles: string[], action: string): boolean;
}
export type OrganizationType = 'RESTAURANT' | 'RETAIL' | 'HOTEL' | 'CLINIC' | 'SALON' | 'WAREHOUSE' | 'DISTRIBUTOR' | 'MANUFACTURER' | 'SERVICE_COMPANY' | 'EDUCATION';
export interface Organization {
    id: string;
    businessName: string;
    businessType: OrganizationType;
    ownerId: string;
    planTier: string;
    timezone: string;
    currency: string;
    country: string;
    language: string;
    logoUrl?: string;
    brandColors?: {
        primary: string;
        secondary: string;
    };
    taxSettings?: Record<string, any>;
    settings?: Record<string, any>;
}
export declare class TenantEngine {
    isolateScope(tenantId: string): string;
}
export interface ModuleMetadata {
    name: string;
    description: string;
    version: string;
    dependencies: string[];
    permissions: string[];
    routes: Array<{
        path: string;
        method: string;
    }>;
    widgets: string[];
    settingsSchema: Record<string, any>;
    licenseStatus: 'OPEN_SOURCE' | 'COMMERCIAL' | 'PROPRIETARY';
}
export declare class ModuleRegistryEngine {
    private modules;
    register(moduleId: string, meta: ModuleMetadata): void;
    get(moduleId: string): ModuleMetadata | undefined;
}
export type FlagState = 'ENABLED' | 'DISABLED' | 'BETA' | 'EXPERIMENTAL' | 'ENTERPRISE' | 'HIDDEN' | 'INTERNAL';
export declare class FeatureFlagEngine {
    private flags;
    setFlag(key: string, state: FlagState): void;
    isEnabled(key: string): boolean;
}
export interface NavItem {
    id: string;
    label: string;
    route: string;
    icon?: string;
    requiredRole?: string;
}
export declare class NavigationEngine {
    buildMenu(industryPack: string, activeModules: string[]): NavItem[];
}
export interface DashboardWidget {
    widgetKey: string;
    name: string;
    category: string;
    requiredPermission?: string;
}
export declare class DashboardEngine {
    getWidgets(role: string): DashboardWidget[];
}
export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'SLACK' | 'WEBHOOK';
export declare class NotificationEngine {
    dispatch(recipient: string, message: string, channels: NotificationChannel[]): Promise<boolean>;
}
export interface AuditRecord {
    actorId: string;
    action: string;
    timestamp: Date;
    resource: string;
    oldValue?: string;
    newValue?: string;
    ipAddress?: string;
    userAgent?: string;
}
export declare class AuditEngine {
    log(record: AuditRecord): Promise<void>;
}
export interface ActivityEvent {
    id: string;
    moduleId: string;
    eventType: string;
    payload: Record<string, any>;
    createdAt: Date;
}
export declare class ActivityTimelineEngine {
    publish(event: ActivityEvent): Promise<void>;
}
export declare class AiEngine {
    generateCompletion(prompt: string): Promise<string>;
}
export type ReportExportFormat = 'PDF' | 'EXCEL' | 'CSV' | 'PRINT';
export declare class ReportEngine {
    exportReport(data: any[], format: ReportExportFormat): Promise<Buffer>;
}
export declare class FileStorageEngine {
    uploadFile(buffer: Buffer, key: string): Promise<string>;
}
export declare class WorkflowEngine {
    executeTransition(currentState: string, event: string): Promise<string>;
}
export declare class ApiGatewayEngine {
    routeRequest(path: string, payload: any): Promise<any>;
}
export declare class SettingsEngine {
    private settings;
    set(key: string, value: any): void;
    get(key: string): any;
}
