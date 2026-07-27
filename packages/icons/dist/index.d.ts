export interface IconMetadata {
    name: string;
    category: string;
    tags: string[];
}
export declare class IconsLibrary {
    private static registry;
    static registerIcon(name: string, meta: IconMetadata): void;
    static getIcon(name: string): IconMetadata | undefined;
    static searchIcons(query: string): IconMetadata[];
}
