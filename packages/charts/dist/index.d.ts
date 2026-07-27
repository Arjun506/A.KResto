export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
}
export interface ChartOptions {
    responsive?: boolean;
    title?: string;
    legendPosition?: 'top' | 'bottom' | 'left' | 'right';
}
export declare class ChartsEngine {
    formatDatasetForRecharts(datasets: ChartDataset[], labels: string[]): Record<string, any>[];
    getBrandColorsPalette(): string[];
}
