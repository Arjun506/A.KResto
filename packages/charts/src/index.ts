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

export class ChartsEngine {
  formatDatasetForRecharts(datasets: ChartDataset[], labels: string[]): Record<string, any>[] {
    return labels.map((label, index) => {
      const row: Record<string, any> = { name: label };
      datasets.forEach((dataset) => {
        row[dataset.label] = dataset.data[index] ?? 0;
      });
      return row;
    });
  }

  getBrandColorsPalette(): string[] {
    return [
      '#4F46E5', // Indigo
      '#10B981', // Emerald
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#3B82F6', // Blue
    ];
  }
}
