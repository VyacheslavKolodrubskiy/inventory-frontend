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
                        keypath="message.molCanDiffer"
                        scope="global"
                        tag="li"
                      >
                        <template #content>
                          <abbr :title="$t('common.abbr.molDescription')">{{ $t('common.abbr.mol') }}</abbr>
                        </template>
                      </i18n-t>
                      <i18n-t
                        keypath="message.molMustBeAttachedToWarehouse"
                        scope="global"
                        tag="li"
                      >
                        <template #content>
                          <abbr :title="$t('common.abbr.molDescription')">{{ $t('common.abbr.mol') }}</abbr>
                        </template>
                      </i18n-t>
                    </ul>
                  </ATypographyText>
                </template>
              </AAlert>

              <AForm
                :label-col="{ span: 10 }"
                :model="form"
                :rules="formRules"
                :wrapper-col="{ span: 14 }"
                @finish="onFinishFirstStep"
              >
                <AFormItem :label="$t('common.documentName')" name="title">
                  <AInput
                    v-model:value="form.title"
                    :placeholder="$t('common.documentName')"
                  />
                </AFormItem>

                <AFormItem
                  :label="$t('common.fromWarehouse')"
                  name="fromWarehouseSelected"
                >
                  <SelectWarehouse
                    label-in-value
                    :value="form.fromWarehouseSelected"
                    @update:value="onUpdateFromWarehouse"
                  />
                </AFormItem>

                <AFormItem
                  :label="$t('common.toWarehouse')"
                  name="toWarehouseSelected"
                >
                  <SelectWarehouse
                    :filters="{ counterparty: $canUse('Manager') ? 1 : 0 }"
                    label-in-value
                    :value="form.toWarehouseSelected"
                    @update:value="onUpdateToWarehouse"
                  />
                </AFormItem>

                <AFormItem :label="$t('common.responsibleEmployee')" name="responsibleUser">
                  <SearchManager
                    :key="form.fromWarehouseSelected && form.fromWarehouseSelected.value"
                    v-model:value="form.responsibleUser"
                    :disabled="!form.fromWarehouseSelected"
                    :filters="{ warehouseId: form.fromWarehouseSelected && form.fromWarehouseSelected.value }"
                    label-in-value
                    :placeholder="$t('common.responsibleEmployee')"
                  />
                </AFormItem>

                <AFormItem :label="$t('common.abbr.mol')" name="liabilityUserId">
                  <SearchManager
                    :key="form.toWarehouseSelected && form.toWarehouseSelected.value"
                    v-model:value="form.liabilityUserId"
                    :disabled="!form.toWarehouseSelected"
                    :filters="{ warehouseId: form.toWarehouseSelected && form.toWarehouseSelected.value }"
                    :placeholder="$t('common.abbr.mol')"
                  />
                </AFormItem>

                <AFormItem :label="$t('common.comment')">
                  <AInput
                    v-model:value="form.comment"
                    :placeholder="$t('common.comment')"
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
          {{ form.fromWarehouseSelected?.label }} <ArrowRightOutlined />
          <ADivider type="vertical" />
          <HomeOutlined class="text-gray-400" />
          {{ form.toWarehouseSelected?.label }}
          <ADivider type="vertical" />
          <UserOutlined class="text-gray-400" />
          {{ form.responsibleUser?.label }}
          <ADivider type="vertical" />
          <ATypographyLink @click.prevent="goToFirstStep">
            <EditOutlined /> {{ $t('action.change') }}
          </ATypographyLink>
        </ATypographyText>
      </div>

      <KeepAlive :key="transferRenderKey">
        <RelocationAddTransfer
          v-if="currentStep === 1"
          :from-warehouse-id="form.fromWarehouseSelected && form.fromWarehouseSelected.value"
          :to-warehouse-id="form.toWarehouseSelected && form.toWarehouseSelected.value"
          @submit="onSubmitManual"
          @update-records="onUpdateRecords"
        />
      </KeepAlive>
    </div>
  </ACard>
</template>

<script lang="ts" setup>
import type { Fn, Nullable } from '@qlt2020/frutils';
import type { LabelInValueType } from 'ant-design-vue/lib/vc-select/Select.js';
import RelocationAddTransfer from '@/modules/movement/pages/component/RelocationAddTransfer/RelocationAddTransfer.vue';
import { RelocationRepository } from '@/modules/movement/relocation.repository';
import type { CreateRelocationDto } from '@/modules/movement/relocation.dto';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import SelectWarehouse from '@/shared/components/form/SelectWarehouse.vue';
import { vvRequired } from '@/shared/config/validation-rules';
import type { TransferProduct } from '@/shared/composables/useProductTransfer';
import { getLabelInValueId } from '@/shared/utils/utils';

type SelectId = Nullable<number>;

interface Form {
  title: string
  comment: string
  toWarehouseSelected: null | LabelInValueType
  fromWarehouseSelected: null | LabelInValueType
  responsibleUser: null | LabelInValueType
  liabilityUserId: SelectId
}

const { t } = useI18n();
const router = useRouter();
const currentStep = ref(0);
const transferRenderKey = ref(0);
const targetRecords = ref<TransferProduct[]>([]);
const formRules = {
  title: vvRequired,
  responsibleUser: vvRequired,
  liabilityUserId: vvRequired,
  fromWarehouseSelected: [
    vvRequired,
    {
      validator: validateWarehouse,
    }],
  toWarehouseSelected: [
    vvRequired,
    {
      validator: validateWarehouse,
    },
  ],
};

const form: Form = reactive({
  title: '',
  toWarehouseSelected: null,
  fromWarehouseSelected: null,
  comment: '',
  responsibleUser: null,
  liabilityUserId: null,
});

async function validateWarehouse() {
  return form.fromWarehouseSelected?.value === form.toWarehouseSelected?.value ? Promise.reject(t('validation.nonRecurringWarehouse')) : Promise.resolve();
}

watch(
  () => form.fromWarehouseSelected,
  () => {
    form.responsibleUser = null;
  },
);

watch(
  () => form.toWarehouseSelected,
  () => {
    form.liabilityUserId = null;
  },
);

function onFinishFirstStep() {
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

function updateFromWarehouse(warehouse: Form['fromWarehouseSelected']) {
  form.fromWarehouseSelected = warehouse;
  transferRenderKey.value += 1;
}

function updateToWarehouse(warehouse: Form['toWarehouseSelected']) {
  form.toWarehouseSelected = warehouse;
  transferRenderKey.value += 1;
}

function onUpdateFromWarehouse(warehouse: LabelInValueType) {
  if (targetRecords.value.length) {
    confirmUpdateWarehouse(() => {
      updateFromWarehouse(warehouse);
      targetRecords.value = [];
    }, warehouse.value);
  } else {
    updateFromWarehouse(warehouse);
  }
}

function onUpdateToWarehouse(warehouse: LabelInValueType) {
  if (targetRecords.value.length) {
    confirmUpdateWarehouse(() => {
      updateToWarehouse(warehouse);
      targetRecords.value = [];
    }, warehouse.value);
  } else {
    updateToWarehouse(warehouse);
  }
}

function confirmUpdateWarehouse(onOk: Fn, id?: LabelInValueType['value']) {
  Modal.confirm({
    title: t('common.confirmation'),
    content: t('message.warehouseEditConfirm[1]'),
    okText: t('action.change'),
    cancelText: t('common.cancel'),
    onOk,
  });
}

function onSubmitManual(products: CreateRelocationDto['products']) {
  Executor.run({
    request: RelocationRepository.create({
      title: form.title,
      toWarehouseId: getLabelInValueId(form.toWarehouseSelected),
      fromWarehouseId: getLabelInValueId(form.fromWarehouseSelected),
      comment: form.comment,
      responsibleUserId: getLabelInValueId(form.responsibleUser),
      liabilityUserId: form.liabilityUserId,
      products,
    }),
    loadingType: LoadingType.Global,
    messageType: MessageType.Created,
    onResult() {
      router.push({ name: 'Movement.Main' });
    },
  });
}

function goToFirstStep() {
  currentStep.value = 0;
}
</script>
