import type { PluralizationRule } from 'vue-i18n';
import { toNumber } from '@qlt2020/frutils';

export const cyrillicRule: PluralizationRule = (choice, choicesLength, _orgRule) => {
  // choice = n
  // '{n} товаров | {n} товар | {n} товара | {n} товаров'
  // '0 | <заканчиваются на 1> | <заканчиваются на 2,3,4> | <все остальные>'
  choice = toNumber(choice);

  if (choice === 0)
    return 0; // 0 товаров

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;

  if (!teen && endsWithOne)
    return 1; // 1 товар, 21 товар

  if (!teen && choice % 10 >= 2 && choice % 10 <= 4)
    return 2; // 2,3,4 товара, 22,23,24 товара

  return choicesLength < 4 ? 2 : 3; // 5-20 товаров, 25-30 товаров
};
