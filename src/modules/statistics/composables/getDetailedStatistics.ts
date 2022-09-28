import type { PieOptions } from '@antv/g2plot';
import type { DetailedStatistics } from '../statistics.model';
import type { ConvertedDetailedStatistics, DetailedStatisticsData } from '../types';
import { convertPercentLabel } from '../utils';
import { i18n } from '@/i18n';

export function getDetailedStatistics(data: DetailedStatistics) {
  const PRIMARY_COLOR = '#9254de';
  const SECONDARY_COLOR = '#e0e0e0';

  const tidBarcodeData = computed((): DetailedStatisticsData => [
    { type: i18n.t('statistics.withTidBarcode'), value: data.totalWithBarcode, percent: data.totalWithBarcodePercentage },
    { type: i18n.t('statistics.withoutTidBarcode'), value: data.totalWithoutBarcode, percent: data.totalWithoutBarcodePercentage },
  ]);

  const markableData = computed((): DetailedStatisticsData => [
    { type: i18n.t('common.marked'), value: data.totalMarkedProducts, percent: data.totalMarkedProductsPercentage },
    { type: i18n.t('common.unmarked'), value: data.totalUnmarkedProducts, percent: data.totalUnmarkedProductsPercentage },
  ]);

  const unitData = computed((): DetailedStatisticsData => [
    { type: i18n.t('statistics.countableProducts'), value: data.totalCountableProducts, percent: data.totalCountableProductsPercentage },
    { type: i18n.t('statistics.uncountableProducts'), value: data.totalUncountableProducts, percent: data.totalUncountableProductsPercentage },
  ]);

  function getPieConfig(data: DetailedStatisticsData): PieOptions {
    return {
      data,
      height: 180,
      angleField: 'value',
      colorField: 'type',
      radius: 0.9,
      innerRadius: 0.5,
      color: [PRIMARY_COLOR, SECONDARY_COLOR],
      tooltip: {
        customContent: (title, item) => {
          if (item[0]) {
            return `<div class="py-2 px-1 flex items-center">
            <div class="w-2 h-2 mr-2 rounded-full" style="background: ${item[0].color}"></div>
            ${title}: ${convertPercentLabel(item[0].data.percent)} ${item[0].value}
            </div>`;
          }

          return title;
        },
      },
      label: {
        type: 'inner',
        offset: '-50%',
        content: ({ percent }) => {
          return convertPercentLabel(percent * 100);
        },
        style: {
          textAlign: 'center',
          fontSize: 11,
        },
      },
      legend: {
        itemHeight: 14,
        offsetX: -50,
        maxWidth: 0,
        maxItemWidth: 0,
        itemValue: {
          alignRight: true,
          formatter: (value) => {
            const items = data.filter((d: any) => d.type === value);
            const val = `${convertPercentLabel(items[0].percent)}  ${items[0].value}`;
            return val;
          },
          style: {
            opacity: 0.65,
          },
        },
        itemName: {
          spacing: 20,
          style: {
            fontSize: 15,
          },
        },
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
      statistic: undefined,
    };
  }

  const tidBarcodeConfig = getPieConfig(tidBarcodeData.value);
  const markableConfig = getPieConfig(markableData.value);
  const unitConfig = getPieConfig(unitData.value);

  return {
    tidBarcodeData: tidBarcodeData.value,
    markableData: markableData.value,
    unitData: unitData.value,
    totalMarkableProducts: data.totalMarkableProducts,
    totalProducts: data.totalProducts,
    tidBarcodeConfig,
    markableConfig,
    unitConfig,
  } as ConvertedDetailedStatistics;
}
