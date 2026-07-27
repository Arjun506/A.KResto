"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsEngine = void 0;
class ChartsEngine {
    formatDatasetForRecharts(datasets, labels) {
        return labels.map((label, index) => {
            const row = { name: label };
            datasets.forEach((dataset) => {
                row[dataset.label] = dataset.data[index] ?? 0;
            });
            return row;
        });
    }
    getBrandColorsPalette() {
        return [
            '#4F46E5', // Indigo
            '#10B981', // Emerald
            '#F59E0B', // Amber
            '#EF4444', // Red
            '#3B82F6', // Blue
        ];
    }
}
exports.ChartsEngine = ChartsEngine;
