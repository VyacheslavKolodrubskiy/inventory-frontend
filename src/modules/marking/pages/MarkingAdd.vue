<template>
  <ACard>
    <ASteps :current="currentStep" @update:current="onChangeStep">
      <AStep :title="$t('common.documentInfo')" />
      <AStep :title="$t('common.productRegistry')" />
    </ASteps>

    <div class="py-8">
      <KeepAlive>
        <template v-if="currentStep === 0">
          <ARow>
            <ACol
              :lg="16"
              :xs="24"
              :xxl="10"
            >
              <AAlert
                class="mb-5"
                :message="$t('message.typeInDocumentInfo')"
                show-icon
                type="info"
              >
                <template #description>
                  <ATypographyText>
                    <ul class="mb-0">
                      <i18n-t
                        keypath="message.specifyDocumentTitle"
                        scope="global"
                        tag="li"
                      >
                        <template #content>
                          <abbr :title="$t('common.abbr.tsdDescription')">{{ $t('common.abbr.tsd') }}</abbr>
                        </template>
                      </i18n-t>

                      <i18n-t
                        keypath="message.specifyResponsibleEmployee"
                        scope="global"
                        tag="li"
                      />
                    </ul>
                  </ATypographyText>
                </template>
              </AAlert>

              <AForm
                :label-col="{ span: 10 }"
                :model="form"
                :rules="formRules"
                :wrapper-col="{ span: 14 }"
                @finish="nextStep"
              >
                <AFormItem :label="$t('common.documentName')" name="title">
                  <AInput
                    v-model:value="form.title"
                    :placeholder="$t('common.documentName')"
                  />
                </AFormItem>

                <AFormItem :label="$t('common.warehouse')" name="warehouseSelected">
                  <SelectWarehouse
                    label-in-value
                    :placeholder="$t('common.warehouse')"
                    :value="form.warehouseSelected"
                    @update:value="onUpdateWarehouse"
                  />
                </AFormItem>

                <AFormItem :label="$t('common.responsibleEmployee')" name="responsibleEmployee">
                  <SearchManager
                    :key="form.warehouseSelected && form.warehouseSelected.value"
                    v-model:value="form.responsibleEmployee"
                    :disabled="!form.warehouseSelected"
                    :filters="{ warehouseId: form.warehouseSelected && form.warehouseSelected.value }"
                    label-in-value
                    :placeholder="$t('common.responsibleEmployee')"
                  />
                </AFormItem>
                <AFormItem :wrapper-col="{ offset: 10, span: 14 }">
                  <AButton
                    html-type="submit"
                    type="primary"
                  >
                    {{ $t('common.next') }}
                  </AButton>
                </AFormItem>
              </AForm>
            </ACol>
          </ARow>
        </template>
      </KeepAlive>

      <div v-if="currentStep === 1" class="m-b5 text-right">
        <ATypographyText>
          <DownloadOutlined class="text-gray-400" />
          {{ form.title }}
          <ADivider type="vertical" />
          <HomeOutlined class="text-gray-400" />
          {{ form.warehouseSelected?.label }}
          <ADivider type="vertical" />
          <UserOutlined class="text-gray-400" />
          {{ form.responsibleEmployee?.label }}
          <ADivider type="vertical" />
          <ATypographyLink @click.prevent="goToFirstStep">
            <EditOutlined /> {{ $t('action.change') }}
          </ATypographyLink>
        </ATypographyText>
      </div>

      <KeepAlive :key="transferRenderKey">
        <MarkingAddTransfer
          v-if="currentStep === 1"
          :warehouse-id="form.warehouseSelected && form.warehouseSelected.value"
          @submit="onSubmitManual"
          @update-records="onUpdateRecords"
        />
      </KeepAlive>
    </div>
  </ACard>
</template>

<script lang="ts" setup>
import type { UrlParam } from '@qlt2020/frutils';
import type { LabelInValueType } from 'ant-design-vue/lib/vc-select/Select';
import type { CreateMarkingProductDto } from '../marking.dto';
import { MarkingRepository } from '../marking.repository';
import MarkingAddTransfer from './component/MarkingAddTransfer/MarkingAddTransfer.vue';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import SelectWarehouse from '@/shared/components/form/SelectWarehouse.vue';
import { vvRequired } from '@/shared/config/validation-rules';

import type { TransferProduct } from '@/shared/composables/useProductTransfer';
import { getLabelInValueId } from '@/shared/utils/utils';

const { t } = useI18n();
const router = useRouter();
const currentStep = ref(0);
const transferRenderKey = ref(0);
const targetRecords = ref<TransferProduct[]>([]);
const formRules = {
  title: vvRequired,
  warehouseSelected: vvRequired,
  responsibleEmployee: vvRequired,
  author: vvRequired,
};

interface Form {
  title: string
  warehouseSelected: null | LabelInValueType
  responsibleEmployee: null | LabelInValueType
}

const form: Form = reactive({
  title: '',
  warehouseSelected: null,
  responsibleEmployee: null,
});

watch(
  () => form.warehouseSelected,
  () => {
    form.responsibleEmployee = null;
  },
);

function nextStep() {
  currentStep.value += 1;
}

function onChangeStep(nextStep: number) {
  const step = currentStep.value;

  // с первого шага нельзя перейти ни на один из следующих
  if (step === 0)
    return;

  // со второго шага можно перейти только на первый шаг
  if (step === 1) {
    if (nextStep === 0)
      currentStep.value = nextStep;
  }
}

function onUpdateRecords(records: TransferProduct[]) {
  targetRecords.value = records;
}

function updateWarehouse(warehouse: Form['warehouseSelected']) {
  form.warehouseSelected = warehouse;
  transferRenderKey.value += 1;
}

function onUpdateWarehouse(warehouse: LabelInValueType) {
  if (targetRecords.value.length) {
    Modal.confirm({
      title: t('common.confirmation'),
      content: t('message.warehouseEditConfirm[1]'),
      okText: t('action.change'),
      cancelText: t('common.cancel'),
      onOk() {
        updateWarehouse(warehouse);
        targetRecords.value = [];
      },
    });
  } else {
    updateWarehouse(warehouse);
  }
}

function createMarkingProducts(id: UrlParam, products: CreateMarkingProductDto[]) {
  Executor.run({
    request: MarkingRepository.createProducts(id, products),
    loadingType: LoadingType.Global,
    onResult() {
      router.push({ name: 'Marking.Main' });
    },
  });
}

function onSubmitManual(products: CreateMarkingProductDto[]) {
  Executor.run({
    request: MarkingRepository.create({
      title: form.title,
      warehouseId: getLabelInValueId(form.warehouseSelected),
      responsibleUserId: getLabelInValueId(form.responsibleEmployee),
    }),
    loadingType: LoadingType.Global,
    messageType: MessageType.Created,
    onResult(data) {
      createMarkingProducts(data.id, products);
    },
  });
}

function goToFirstStep() {
  currentStep.value = 0;
}
</script>
