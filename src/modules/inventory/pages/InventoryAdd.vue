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
                        keypath="message.specifyDocumentTitleAndDescription"
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
                      <i18n-t
                        keypath="message.selectFieldWarehousePlace"
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
                @finish="onFinishFirstStep"
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

                <AFormItem :label="$t('common.warehousePlace')" name="warehousePlaceId">
                  <SelectWarehousePlace
                    :key="form.warehouseSelected && form.warehouseSelected.value"
                    v-model:value="form.warehousePlaceId"
                    :disabled="!form.warehouseSelected"
                    :filters="{ warehouseId: form.warehouseSelected && form.warehouseSelected.value }"
                    :placeholder="$t('common.warehousePlace')"
                  />
                </AFormItem>

                <AFormItem
                  :label="$t('common.comment')"
                  name="description"
                >
                  <AInput
                    v-model:value="form.description"
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
        <InventoryAddTransfer
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
import type { Nullable } from '@qlt2020/frutils';
import type { LabelInValueType } from 'ant-design-vue/lib/vc-select/Select';
import { InventoryRepository } from '../inventory.repository';
import type { CreateInventoryDto } from '../inventory.dto';
import InventoryAddTransfer from './component/InventoryAddTransfer/InventoryAddTransfer.vue';
import { getLabelInValueId } from '@/shared/utils/utils';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import SelectWarehouse from '@/shared/components/form/SelectWarehouse.vue';
import { vvRequired } from '@/shared/config/validation-rules';
import type { TransferProduct } from '@/shared/composables/useProductTransfer';

type SelectId = Nullable<number>;
interface Form {
  title: string
  description: string
  warehouseSelected: null | LabelInValueType
  warehousePlaceId: SelectId
  responsibleEmployee: null | LabelInValueType
}

const { t } = useI18n();
const router = useRouter();
const currentStep = ref(0);
const transferRenderKey = ref(0);
const targetRecords = ref<TransferProduct[]>([]);
const formRules = {
  title: vvRequired,
  responsibleEmployee: vvRequired,
  warehouseSelected: vvRequired,
};

const form: Form = reactive({
  title: '',
  description: '',
  warehouseSelected: null,
  warehousePlaceId: null,
  responsibleEmployee: null,
});

watch(
  () => form.warehouseSelected,
  () => {
    form.responsibleEmployee = null;
    form.warehousePlaceId = null;
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

function onSubmitManual(products: CreateInventoryDto['products']) {
  Executor.run({
    request: InventoryRepository.create({
      title: form.title,
      description: form.description,
      warehouseId: getLabelInValueId(form.warehouseSelected),
      warehousePlaceId: form.warehousePlaceId,
      responsibleUserId: getLabelInValueId(form.responsibleEmployee),
      products,
    }),
    loadingType: LoadingType.Global,
    messageType: MessageType.Created,
    onResult() {
      router.push({ name: 'Inventory.Main' });
    },
  })
  ;
}

function goToFirstStep() {
  currentStep.value = 0;
}
</script>
