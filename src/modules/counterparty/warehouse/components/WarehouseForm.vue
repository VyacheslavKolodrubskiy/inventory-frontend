<template>
  <ASkeleton v-if="loadingState.isLoading.value" active />
  <AForm
    v-else
    id="warehouse_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="onFinish"
  >
    <ARow :gutter="24">
      <ACol
        :xs="24"
        :xxl="12"
      >
        <AFormItem :label="$t('common.name')" name="title">
          <AInput v-model:value="form.title" />
        </AFormItem>
      </ACol>

      <ACol
        :xs="24"
        :xxl="12"
      >
        <AFormItem :label="$t('common.city')" name="cityId">
          <SearchCity
            v-model:value="form.cityId"
            @select="onCitySelect"
          />
        </AFormItem>
      </ACol>

      <ACol
        :xs="24"
        :xxl="12"
      >
        <AFormItem :label="$t('common.counterparty')" name="counterpartyId">
          <SelectCounterparty v-model:value="form.counterpartyId" />
        </AFormItem>
      </ACol>

      <ACol
        :xs="24"
        :xxl="12"
      >
        <AFormItem :label="$t('common.logo')" name="image">
          <AInput v-model:value="form.image" />
        </AFormItem>
      </ACol>

      <ACol
        :xs="24"
      >
        <AFormItem :label="$t('common.description')" name="description">
          <AInput v-model:value="form.description" />
        </AFormItem>
      </ACol>

      <ACol
        :xs="24"
      >
        <AFormItem
          v-if="form.location"
          :label="$t('common.location')"
          name="location"
        >
          <SelectMapPoint
            v-model:value="form.location"
            :default-city="cityTitle"
          />
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script setup lang="ts">
import type { UrlParam } from '@qlt2020/frutils';
import type { UpdateWarehouseDto } from '../warehouse.dto';
import { WarehouseRepository } from '../warehouse.repository';
import { vvRequired } from '@/shared/config/validation-rules';
import { Executor } from '@/shared/network/executor';
import SelectMapPoint from '@/shared/components/form/SelectMapPoint.vue';
import { useResettableState } from '@/shared/composables/useResettableState';
import { createLabelInValue, getLabelInValueId } from '@/shared/utils/utils';
import { useLoading } from '@/shared/composables/useLoading';

const props = defineProps<{
  dataId?: string
}>();

const emit = defineEmits(['submit']);
const loadingState = useLoading();

const formRules = {
  title: vvRequired,
  counterpartyId: vvRequired,
  location: vvRequired,
  cityId: vvRequired,
};

const isEditing = computed(() => !!props.dataId);

const { form } = useResettableState<UpdateWarehouseDto>(() => ({
  title: '',
  description: '',
  counterpartyId: null,
  cityId: null,
  image: '',
  location: [],
}));

const cityTitle = ref('');

function onCitySelect(_val: any, option: any) {
  cityTitle.value = option.title;
}

onMounted(() => {
  if (isEditing.value)
    readWarehouse(props.dataId as UrlParam);
});

function readWarehouse(id: UrlParam) {
  return Executor.run({
    request: WarehouseRepository.read(id),
    loadingState,
    onResult(data) {
      form.title = data.title;
      form.description = data.description;
      form.counterpartyId = createLabelInValue(data.counterparty.title, data.counterparty.id);
      form.cityId = createLabelInValue(data.city.title, data.city.id);
      form.image = data.image;
      form.location = data.location;
      cityTitle.value = data.city.title;
    },
  });
}

function onFinish(values: UpdateWarehouseDto) {
  // TODO remove this when location will be array
  values.latitude = values.location[0];
  values.longitude = values.location[1];

  values.cityId = getLabelInValueId(values.cityId);
  values.counterpartyId = getLabelInValueId(values.counterpartyId);
  emit('submit', values);
}
</script>
