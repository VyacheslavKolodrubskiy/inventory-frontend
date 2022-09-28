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
                    @update:value="onUpdateWarehouse"
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

                <AFormItem :label="$t('common.reasonWriteOff')" name="comment">
                  <AInput
                    v-model:value="form.comment"
                    :placeholder="$t('common.reasonWriteOff')"
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
          {{ form.fromWarehouseSelected?.label }}
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
        <WriteOffAddTransfer
          v-if="currentStep === 1"
          :from-warehouse-id="form.fromWarehouseSelected && form.fromWarehouseSelected.value"
          @submit="onSubmitManual"
          @update-records="onUpdateRecords"
        />
      </KeepAlive>
    </div>
  </ACard>
</template>

<script lang="ts" setup>
import type { LabelInValueType } from 'ant-design-vue/lib/vc-select/Select.js';
import { getLabelInValueId } from '@/shared/utils/utils';
import WriteOffAddTransfer from '@/modules/movement/pages/component/WriteOffAddTransfer/WriteOffAddTransfer.vue';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import SelectWarehouse from '@/shared/components/form/SelectWarehouse.vue';
import { vvRequired } from '@/shared/config/validation-rules';
import type { CreateWriteOffDto } from '@/modules/movement/write-off.dto';
import { WriteOffRepository } from '@/modules/movement/write-off.repository';
import type { TransferProduct } from '@/shared/composables/useProductTransfer';
interface Form {
  title: string
  comment: string
  fromWarehouseSelected: null | LabelInValueType
  responsibleUser: null | LabelInValueType
}

const { t } = useI18n();
const router = useRouter();
const currentStep = ref(0);
const transferRenderKey = ref(0);
const targetRecords = ref<TransferProduct[]>([]);
const formRules = {
  title: vvRequired,
  responsibleUser: vvRequired,
  fromWarehouseSelected: vvRequired,
};

const form: Form = reactive({
  title: '',
  fromWarehouseSelected: null,
  comment: '',
  responsibleUser: null,
});

watch(
  () => form.fromWarehouseSelected,
  () => {
    form.responsibleUser = null;
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

function updateWarehouseId(warehouse: Form['fromWarehouseSelected']) {
  form.fromWarehouseSelected = warehouse;
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
        updateWarehouseId(warehouse);
        targetRecords.value = [];
      },
    });
  } else {
    updateWarehouseId(warehouse);
  }
}

function onSubmitManual(products: CreateWriteOffDto['products']) {
  Executor.run({
    request: WriteOffRepository.create({
      title: form.title,
      comment: form.comment,
      fromWarehouseId: getLabelInValueId(form.fromWarehouseSelected),
      responsibleUserId: getLabelInValueId(form.responsibleUser),
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
