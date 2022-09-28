<template>
  <div>
    <QPageHeader :title="$t('common.countries')" />

    <CardTable :columns="columns" @reload="submitFilter">
      <template #title>
        <ASpace>
          <AppFilter
            v-model:value="filters.title"
            :filters="filters"
            :placeholder="$t('common.searchBy.name')"
            @reset="resetFilter"
            @submit="submitFilter"
          />
          <!--
          <ADropdown :trigger="['click']">
            <AButton>
              <CheckSquareFilled class="text-primary-500" />
              Выделено 2
              <DownOutlined />
            </AButton>
            <template #overlay>
              <AMenu>
                <AMenuItem>Этот дропдаун для демо</AMenuItem>
                <AMenuDivider />
                <AMenuItem>Оприходование</AMenuItem>
                <AMenuItem>Списание</AMenuItem>
                <AMenuItem>Перемещение</AMenuItem>
                <AMenuItem>Инвентаризация</AMenuItem>
                <AMenuDivider />
                <AMenuItem danger>
                  <DeleteFilled />
                  Удалить
                </AMenuItem>
              </AMenu>
            </template>
          </ADropdown> -->
        </ASpace>
      </template>

      <template #extra>
        <AddLink v-if="$canUse(['Admin', 'Manager'])" :to="{ name: 'CatalogCountry.Add' }" />
      </template>

      <QTable
        :columns="columns"
        :data-source="state.countries"
        :loading="loadingState.isLoading.value"
        :pagination="pagination"
        @change="onChangeTable"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <TableActions :actions="actions" :record="record" />
          </template>
        </template>
      </QTable>
    </CardTable>
  </div>
</template>

<script setup lang="ts">
import type { TableProps } from 'ant-design-vue/es/table/Table';
import type { TableAction } from '@/types';
import { useResettableState } from '@/shared/composables/useResettableState';
import { Executor } from '@/shared/network/executor';
import { getPaginationParams, usePagination } from '@/shared/composables/usePagination';
import { useLoading } from '@/shared/composables/useLoading';
import { CountryRepository } from '@/modules/catalog/country/country.repository';
import type { Country } from '@/shared/models/country.model';
import type { CountryFilters } from '@/modules/catalog/country/country.dto';
import TableActions from '@/shared/components/table/TableActions.vue';
import { canUse } from '@/shared/utils/permissions';
import { onRouteChangeSubmit } from '@/shared/composables/onRouteChangeSubmit';

const { t } = useI18n();

const { form: filters, resetForm: resetFilters } = useResettableState(() => ({
  title: '',
}));

const columns = [
  {
    title: t('common.name'),
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: t('country.slug'),
    dataIndex: 'slug',
    ellipsis: true,
  },
  {
    dataIndex: 'action',
    width: 50,
  },
];

const actions = ref<TableAction[]>([
  {
    to: record => (
      {
        name: 'CatalogCountry.Edit',
        params: { countryId: record.id },
      }),
    title: t('action.edit'),
    condition: () => canUse(['Admin', 'Manager']),
  },
]);

const state = reactive({
  countries: [] as Country[],
});
const pagination = usePagination();
const loadingState = useLoading();

onRouteChangeSubmit(submitFilter);

function resetFilter() {
  resetFilters();
  submitFilter();
}

function submitFilter() {
  fetchCountries({ ...getPaginationParams(pagination), ...filters });
}

const onChangeTable: TableProps['onChange'] = (tablePagination, _tableFilters) => {
  if (tablePagination.current)
    pagination.page = tablePagination.current;

  submitFilter();
};

function fetchCountries(params?: CountryFilters) {
  Executor.run({
    request: CountryRepository.fetch(params),
    pagination,
    loadingState,
    onResult(data) {
      state.countries = data.list;
    },
  });
}
</script>
