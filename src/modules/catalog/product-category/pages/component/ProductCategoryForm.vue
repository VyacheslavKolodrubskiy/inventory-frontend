<template>
  <ASkeleton v-if="loadingState.isLoading.value" active />
  <AForm
    v-else
    id="product_category_form"
    layout="vertical"
    :model="form"
    :rules="formRules"
    @finish="onFinish"
  >
    <AFormItem :label="$t('common.productCategory')" name="title">
      <AInput v-model:value="form.title" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import type { UrlParam } from '@qlt2020/frutils';
import { useResettableState } from '@/shared/composables/useResettableState';
import { vvRequired } from '@/shared/config/validation-rules';
import { Executor } from '@/shared/network/executor';
import { ProductCategoryRepository } from '@/modules/catalog/product-category/product-category.repository';
import type { UpdateProductCategoryDto } from '@/modules/catalog/product-category/product-category.dto';
import { useLoading } from '@/shared/composables/useLoading';

const props = defineProps<{
  dataId?: string
}>();

const emit = defineEmits(['submit']);
const loadingState = useLoading();

const formRules = {
  title: vvRequired,
};

const { form } = useResettableState<UpdateProductCategoryDto>(() => ({
  title: '',
}));

const isEditing = computed(() => !!props.dataId);

onMounted(() => {
  if (isEditing.value)
    readProductCategory(props.dataId!);
});

function readProductCategory(id: UrlParam) {
  return Executor.run({
    request: ProductCategoryRepository.read(id),
    loadingState,
    onResult(data) {
      form.title = data.title;
    },
  });
}

function onFinish(values: UpdateProductCategoryDto) {
  emit('submit', values);
}
</script>
