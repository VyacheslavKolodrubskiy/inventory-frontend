import type { Rule } from 'ant-design-vue/es/form';
// import Schema from 'async-validator';
import { i18n } from '@/i18n';

export const vvRequired: Rule = {
  required: true,
  message: i18n.t('validation.requiredField'),
};

export const vvArticular: Rule = {
  min: 3,
  max: 100,
  message: i18n.t('validation.articularLength'),
};

export const vvPhone: Rule = {
  len: 18,
  message: i18n.t('validation.phoneLengthMessage'),
};

export const vvBinIin: Rule = {
  len: 12,
  message: i18n.t('validation.iinLengthMessage'),
};

export const vvEmail: Rule = {
  type: 'email',
  message: i18n.t('validation.incorrectEmailFormat'),
};

export const vvLatin: Rule = {
  pattern: /[a-zA-Z]+/,
  message: i18n.t('validation.latinLetters'),
};

