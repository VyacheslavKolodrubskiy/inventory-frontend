<template>
  <ACard>
    <ASteps :current="currentStep" @update:current="onChangeStep">
      <AStep :title="$t('common.documentInfo')" />
      <AStep :title="$t('common.importMethod')" />
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

                <AFormItem :label="$t('common.abbr.mol')" name="liabilityEmployee">
                  <SearchManager
                    :key="form.warehouseSelected && form.warehouseSelected.value"
                    v-model:value="form.liabilityEmployee"
                    :disabled="!form.warehouseSelected"
                    :filters="{ warehouseId: form.warehouseSelected && form.warehouseSelected.value }"
                    :placeholder="$t('common.abbr.mol')"
                  />
                </AFormItem>

                <AFormItem :wrapper-col="{ offset: 10, span: 14 }">
                  <AButton html-type="submit" type="primary">
                    {{ $t('common.next') }}
                  </AButton>
                </AFormItem>
              </AForm>
            </ACol>
          </ARow>
        </template>
      </KeepAlive>

      <template v-if="currentStep === 1">
        <ARow>
          <ACol
            :lg="16"
            :xs="24"
            :xxl="8"
          >
            <AButton
              block
              class="flex items-center h-25 text-left px-6 mb-4"
              size="large"
              @click="selectImport"
            >
              <DownloadOutlined class="text-2xl mr-4" />
              <div>
                <div class="text-lg">
                  {{ $t('common.import') }}
                </div>
                <ATypographyText class="block text-sm whitespace-normal leading-tight" type="secondary">
                  {{ $t('message.uploadFileWithProductList') }} (.xlsx)
                </ATypographyText>
              </div>
            </AButton>
            <AButton
              block
              class="flex items-center h-25 text-left px-6"
              size="large"
              @click="selectManual"
            >
              <EditOutlined class="text-2xl mr-4" />
              <div>
                <div class="text-lg">
                  {{ $t('common.manual') }}
                </div>
                <ATypographyText class="block text-sm whitespace-normal leading-tight" type="secondary">
                  {{ $t('message.selectProductsProductList') }}
                </ATypographyText>
              </div>
            </AButton>
          </ACol>
        </ARow>
      </template>

      <template v-if="currentStep === 2 && importType === 'import'">
        <ARow class="justify-center">
          <ACol
            :lg="16"
            :xs="24"
            :xxl="10"
          >
            <AAlert
              class="mb-5"
              :message="$t('movement.message.forImportFromProductList')"
              show-icon
              type="info"
            >
              <template #description>
                <ATypographyText>
                  <ol>
                    <li>
                      <ATypographyLink
                        href="https://docs.google.com/spreadsheets/d/1mj-m567E2NTOIVgessNbf1Sx07PLovpbCm5rj8O1NNk/edit#gid=0"
                        target="_blank"
                        underline
                      >
                        {{ $t('movement.message.downloadTableTemplate') }}
                      </ATypographyLink>
                    </li>
                    <li> {{ $t('movement.message.fillInTactWithColumnName') }}</li>
                    <li> {{ $t('movement.message.selectFileBelow') }}</li>
                  </ol>
                </ATypographyText>
              </template>
            </AAlert>
            <div class="h-60 pb-8 mb-2">
              <QUpload
                v-model:value="fileSelected"
                accept-spreadsheet
                drag-and-drop
                :max-file-size-kilobytes="MaxFileSize.ReceiveImport"
              >
                <div class="flex flex-col justify-center h-full px-4">
                  <p class="ant-upload-drag-icon">
                    <FileExcelOutlined />
                  </p>
                  <p class="ant-upload-text">
                    {{ $t('message.selectFileWithFormat') }} XLSX
                  </p>
                  <p class="ant-upload-hint">
                    {{ $t('message.dragOrSelectFile') }}<br>
                    <i18n-t
                      keypath="common.maxFileSize"
                      scope="global"
                    >
                      <template #content>
                        <strong>{{ Math.floor(MaxFileSize.ReceiveImport / 1000) }}Mb</strong>
                      </template>
                    </i18n-t>
                  </p>
                </div>
              </QUpload>
            </div>

            <ARow class="items-center justify-end" :gutter="16">
              <ACol v-if="fileSelected">
                <ATypographyText type="success">
                  {{ $t('message.fileIsUploaded') }}
                </ATypographyText>
              </ACol>
              <ACol>
                <AButton
                  :disabled="!fileSelected"
                  type="primary"
                  @click="onSubmitImport"
                >
                  {{ $t('action.import') }}
                </AButton>
              </ACol>
            </ARow>
          </ACol>
        </ARow>
      </template>

      <div v-if="currentStep === 2 && importType === 'manual'" class="m-b5 text-right">
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

      <KeepAlive>
        <ReceiveAddTransfer
          v-if="currentStep === 2 && importType === 'manual'"
          :warehouse-id="form.warehouseSelected && form.warehouseSelected.value"
          @submit="onSubmitManual"
          @update-records="onUpdateRecords"
        />
      </KeepAlive>
    </div>
  </ACard>
</template>

<script lang="ts" setup>
import type { Nullable, Recordable } from '@qlt2020/frutils';
import { onBeforeRouteLeave } from 'vue-router';
import type { LabelInValueType } from 'ant-design-vue/es/vc-select/Select.js';
import type { TransferProduct } from '@/modules/movement/pages/component/ReceiveAddTransfer/receive-transfer-table';
import { Executor, LoadingType, MessageType } from '@/shared/network/executor';
import { ReceiveRepository } from '@/modules/movement/receive.repository';
import type { CreateReceiveManualyDto } from '@/modules/movement/receive.dto';
import ReceiveAddTransfer from '@/modules/movement/pages/component/ReceiveAddTransfer/ReceiveAddTransfer.vue';
import SelectWarehouse from '@/shared/components/form/SelectWarehouse.vue';
import { vvRequired } from '@/shared/config/validation-rules';
import { getLabelInValueId } from '@/shared/utils/utils';
import { MaxFileSize } from '@/shared/config/constants';

type ImportType = 'import' | 'manual';

type SelectId = null | number;

interface Form {
  title: string
  warehouseSelected: null | LabelInValueType
  responsibleEmployee: null | LabelInValueType
  liabilityEmployee: SelectId
}

const { t } = useI18n();

const router = useRouter();
const currentStep = ref(0);
const importType = ref<ImportType | null>(null);
const formRules = {
  title: vvRequired,
  responsibleEmployee: vvRequired,
  liabilityEmployee: vvRequired,
  warehouseSelected: vvRequired,
};

const DestinationWhiteList = ['Movement.Main', 'Movement.Product.Add', 'Movement.Receive.Add'];

const form: Form = reactive({
  title: '',
  warehouseSelected: null,
  responsibleEmployee: null,
  liabilityEmployee: null,
});

const targetRecords = ref<TransferProduct[]>([]);

let confirmedWarehouse: Form['warehouseSelected'] = null;

onBeforeRouteLeave((to, _from, next) => {
  // Don't show confirm if we add new product
  if (
    currentStep.value !== 0
    && !DestinationWhiteList.includes(to.name as string)
    && targetRecords.value.length
  ) {
    Modal.confirm({
      title: t('common.confirmation'),
      content: t('message.pageLeaveConfirm'),
      okText: t('action.leavePage'),
      cancelText: t('action.stay'),
      onOk() {
        next();
      },
    });
  } else {
    next();
  }
});

function onUpdateRecords(records: TransferProduct[]) {
  targetRecords.value = records;
}

function updateWarehouse(warehouse: Form['warehouseSelected']) {
  form.warehouseSelected = warehouse;
}

function onUpdateWarehouse(warehouse: LabelInValueType) {
  if (targetRecords.value.some(record => !!record.warehousePlaceSelected) && !confirmedWarehouse) {
    Modal.confirm({
      title: t('common.confirmation'),
      content: t('message.warehouseEditConfirm[0]'),
      okText: t('action.change'),
      cancelText: t('common.cancel'),
      onOk() {
        updateWarehouse(warehouse);
        confirmedWarehouse = warehouse;
      },
    });
  } else {
    updateWarehouse(warehouse);
  }
}

watch(
  () => form.warehouseSelected,
  () => {
    form.responsibleEmployee = null;
    form.liabilityEmployee = null;
  },
);
function onChangeStep(nextStep: number) {
  const step = currentStep.value;

  // с первого шага нельзя перейти ни на один из следующих
  if (step === 0)
    return;

  // со второго шага можно перейти только на первый шаг
  if (step === 1) {
    if (nextStep === 0)
      currentStep.value = nextStep;

    return;
  }

  // при переходе с 3 шага на изменение способа импорта
  if (step === 2) {
    if (nextStep === 1) {
      Modal.confirm({
        title: t('common.confirmation'),
        content: t('message.importMethodChangeConfirm'),
        okText: t('action.changeImportMethod'),
        cancelText: t('action.stay'),
        onOk() {
          importType.value = null;
          currentStep.value = nextStep;
        },
      });
    } else {
      currentStep.value = nextStep;
    }
  }
}

function selectImport() {
  importType.value = 'import';
  currentStep.value += 1;
}
function selectManual() {
  importType.value = 'manual';
  currentStep.value += 1;
}
function onFinishFirstStep(values: Recordable) {
  // если способ импорта не был сброшен, пропустить шаг "Выбор способа"
  currentStep.value = importType.value ? 2 : 1;
  confirmedWarehouse = null;
}

function onSubmitManual(products: CreateReceiveManualyDto['products']) {
  Executor.run({
    request: ReceiveRepository.create({
      title: form.title,
      toWarehouseId: getLabelInValueId(form.warehouseSelected),
      responsibleUserId: getLabelInValueId(form.responsibleEmployee),
      liabilityUserId: form.liabilityEmployee,
      products,
    }),
    loadingType: LoadingType.Global,
    messageType: MessageType.Created,
    onResult() {
      router.push({ name: 'Movement.Main' });
    },
  });
}

const fileSelected = ref<Nullable<File>>(null);

function onSubmitImport() {
  if (!fileSelected.value)
    return;

  Executor.run({
    request: ReceiveRepository.import({
      title: form.title,
      toWarehouseId: getLabelInValueId(form.warehouseSelected),
      responsibleUserId: getLabelInValueId(form.responsibleEmployee),
      liabilityUserId: form.liabilityEmployee,
      file: fileSelected.value,
    }),
    loadingType: LoadingType.Global,
    messageType: MessageType.Saved,
    onResult() {
      message.success(t('common.fileNameIsUploaded', { fileName: fileSelected?.value?.name }));
      router.push({ name: 'Movement.Main' });
    },
  });
}

function goToFirstStep() {
  currentStep.value = 0;
}
</script>
