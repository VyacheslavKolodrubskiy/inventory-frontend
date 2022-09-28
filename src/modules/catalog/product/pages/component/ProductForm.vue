<template>
  <AForm
    id="product_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="onFinish"
  >
    <AFormItem name="markable">
      <ACheckbox v-model:checked="form.markable">
        {{ $t('common.markable') }}
      </ACheckbox>
    </AFormItem>
    <AFormItem :label="$t('common.name')" name="title">
      <AInput v-model:value="form.title" />
    </AFormItem>
    <ARow :gutter="16">
      <ACol :md="12">
        <AFormItem :label="$t('common.description')" name="description">
          <AInput v-model:value="form.description" />
        </AFormItem>
      </ACol>
      <ACol :md="12">
        <AFormItem :label="$t('common.vendorCode')" name="articular">
          <AInput v-model:value="form.articular" />
        </AFormItem>
      </ACol>
    </ARow>
    <ARow :gutter="16">
      <ACol :md="12">
        <AFormItem :label="$t('common.productCategory')" name="categoryId">
          <SearchProductCategory v-model:value="form.categoryId" :disabled="isEditing" />
        </AFormItem>
      </ACol>
      <ACol :md="12">
        <AFormItem :label="$t('common.unit')" name="unitId">
          <SelectUnit v-model:value="form.unitId" :disabled="isEditing" />
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script setup lang="ts">
import type { Product } from '../../product.model';
import { useResettableState } from '@/shared/composables/useResettableState';
import { vvArticular, vvRequired } from '@/shared/config/validation-rules';
import type { UpdateProductDto } from '@/modules/catalog/product/product.dto';
import { createLabelInValue, getLabelInValueId } from '@/shared/utils/utils';

const props = defineProps<{
  product?: Product
}>();

const emit = defineEmits(['submit']);

const formRules = {
  title: vvRequired,
  description: vvRequired,
  articular: [vvArticular, vvRequired],
  categoryId: vvRequired,
  unitId: vvRequired,
  markable: vvRequired,
};

const { form } = useResettableState<UpdateProductDto>(() => ({
  title: '',
  description: '',
  categoryId: null,
  unitId: null,
  markable: true,
  articular: '',
}));

const isEditing = computed(() => !!props.product);

onMounted(() => {
  if (isEditing.value && props.product) {
    form.title = props.product.title;
    form.description = props.product.description;
    form.articular = props.product.articular;
    form.markable = props.product.markable;
    form.categoryId = createLabelInValue(props.product.category.title, props.product.category.id);
    form.unitId = createLabelInValue(props.product.unit.title, props.product.unit.id);
  }
});

function onFinish(values: UpdateProductDto) {
  values.categoryId = getLabelInValueId(values.categoryId);
  values.unitId = getLabelInValueId(values.unitId);

  emit('submit', values);
}
</script>
