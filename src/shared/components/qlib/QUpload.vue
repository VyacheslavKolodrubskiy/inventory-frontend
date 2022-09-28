<template>
  <Component
    :is="dragAndDrop ? 'AUploadDragger' : 'AUpload'"
    :accept="getAccept"
    :before-upload="beforeUpload"
    :file-list="getValue"
    :max-count="getMaxCount"
    :multiple="multiple"
    @remove="onRemove"
    @update:file-list="onUpdate"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="{ ...slotData }" />
    </template>
  </Component>
</template>

<script lang="ts">
import type { UploadFile } from 'ant-design-vue/es/upload/interface';
import { isArray, isFile } from '@qlt2020/frutils';
import { Upload } from 'ant-design-vue';
import { AcceptList } from '@/shared/config/constants';

export default defineComponent({
  props: {
    value: {
      type: [Array, Object],
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    maxCount: {
      type: Number,
    },
    maxFileSizeKilobytes: {
      type: Number,
      default: (30 * 1000), // 30 MB
    },
    accept: {
      type: String,
      default: null,
    },
    acceptBase: {
      type: Boolean,
      default: false,
    },
    acceptImg: {
      type: Boolean,
      default: false,
    },
    acceptSpreadsheet: {
      type: Boolean,
      default: false,
    },
    dragAndDrop: {
      type: Boolean,
      default: false,
    },
    asyncRemove: {
      type: Function,
      default: () => Promise.resolve(),
    },
  },
  emits: ['update:value'],
  computed: {
    getValue() {
      if (!this.value)
        return [];

      return (isArray(this.value) ? this.value : [this.value]) as UploadFile[];
    },
    getMaxCount() {
      if (this.maxCount)
        return this.maxCount;
      else if (!this.multiple)
        return 1;
      else
        return this.maxCount;
    },
    getAccept() {
      if (this.acceptBase)
        return AcceptList.File;

      if (this.acceptImg)
        return AcceptList.Image;

      if (this.acceptSpreadsheet)
        return AcceptList.Spreadsheet;

      return this.accept;
    },
  },
  methods: {
    isValidFile(file: UploadFile) {
      let invalidFeedback = '';

      if (file.name.lastIndexOf('.') <= 0)
        invalidFeedback = this.$t('validation.incorrectFileFormat');
      else if (file.size && (file.size / 1000 > this.maxFileSizeKilobytes))
        invalidFeedback = `${this.$t('validation.fileSizeLimitExceeded')} (${this.maxFileSizeKilobytes}kb)`;

      if (invalidFeedback) {
        message.error(invalidFeedback);
        return false;
      }

      return true;
    },

    // Uploading will be stopped with false or a rejected Promise returned.
    beforeUpload(info: UploadFile) {
      const isValid = this.isValidFile(info);

      // prevent updating file-list when file is not valid
      if (!isValid)
        return Upload.LIST_IGNORE;

      // if we don't have custom request function prevent antd component default or custom upload
      return !!this.$attrs['custom-request'];
    },

    onUpdate(info: UploadFile[]) {
      this.$emit('update:value', this.getMaxCount === 1 ? info[0].originFileObj : info);
    },

    removeFile(file: UploadFile) {
      const index = this.getValue.indexOf(file);

      const newFileList = this.getValue.slice();
      newFileList.splice(index, 1);

      this.$emit('update:value', newFileList);
    },

    onRemove(file: UploadFile) {
      if (isFile(file.originFileObj || file)) {
        this.removeFile(file);
      } else {
        return this.asyncRemove(file).then(() => {
          this.removeFile(file);
        });
      }
    },
  },
});
</script>
