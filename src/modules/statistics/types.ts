import type { PieOptions } from '@antv/g2plot';

export type DetailedStatisticsData = Record<string, any>[];

export interface ConvertedDetailedStatistics {
  totalProducts: number
  totalMarkableProducts: number
  tidBarcodeData: DetailedStatisticsData
  markableData: DetailedStatisticsData
  unitData: DetailedStatisticsData
  unitConfig: PieOptions
  markableConfig: PieOptions
  tidBarcodeConfig: PieOptions
}
