import { BadRequestException } from '@nestjs/common';

export function normalizeUnit(unit: string): string {
  const u = (unit || '').trim().toUpperCase();
  if (u === 'G' || u === 'GRAMS') return 'GRAM';
  if (u === 'L' || u === 'LITERS' || u === 'LITER') return 'LITRE';
  if (u === 'KGS' || u === 'KILOGRAM' || u === 'KILOGRAMS') return 'KG';
  if (u === 'PIECES' || u === 'PCS') return 'PIECE';
  if (u === 'PACKS' || u === 'PKTS' || u === 'PACKET') return 'PACK';
  if (u === 'BOXES') return 'BOX';
  if (u === 'BOTTLES') return 'BOTTLE';
  return u;
}

export function convertUnit(
  quantity: number,
  fromUnit: string,
  toUnit: string,
): number {
  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);

  if (from === to) return quantity;

  // Mass conversions (base unit: GRAM)
  const massToGram: Record<string, number> = {
    KG: 1000,
    GRAM: 1,
    MG: 0.001,
  };

  // Volume conversions (base unit: ML)
  const volumeToMl: Record<string, number> = {
    LITRE: 1000,
    ML: 1,
  };

  if (massToGram[from] !== undefined && massToGram[to] !== undefined) {
    const totalGrams = quantity * massToGram[from];
    return totalGrams / massToGram[to];
  }

  if (volumeToMl[from] !== undefined && volumeToMl[to] !== undefined) {
    const totalMl = quantity * volumeToMl[from];
    return totalMl / volumeToMl[to];
  }

  throw new BadRequestException(
    `Incompatible unit conversion from '${fromUnit}' to '${toUnit}'`,
  );
}
