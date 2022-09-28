import { i18n } from '@/i18n';

export const defaultOptions = [
  {
    id: 0,
    value: i18n.t('common.veryWeak'),
    minDiversity: 0,
    minLength: 0,
  },
  {
    id: 1,
    value: i18n.t('common.weak'),
    minDiversity: 2,
    minLength: 6,
  },
  {
    id: 2,
    value: i18n.t('common.medium'),
    minDiversity: 4,
    minLength: 8,
  },
  {
    id: 3,
    value: i18n.t('common.secure'),
    minDiversity: 4,
    minLength: 10,
  },
];

interface Strength {
  contains: string[]
  length: number
  id: number
  percent: number
  value: string
}

export function getPasswordStrength(password = '', options = defaultOptions, allowedSymbols = '!"#\$%&\'\(\)\*\+,-\./:;<=>\?@\[\\\\\\]\^_`\{|\}~') {
  const passwordCopy = password;

  options[0].minDiversity = 0;
  options[0].minLength = 0;

  const rules = [
    {
      regex: '[a-z]',
      message: 'lowercase',
    },
    {
      regex: '[A-Z]',
      message: 'uppercase',
    },
    {
      regex: '[0-9]',
      message: 'number',
    },
  ];

  if (allowedSymbols) {
    rules.push({
      regex: `[${allowedSymbols}]`,
      message: 'symbol',
    });
  }

  const strength: Strength = {
    contains: [],
    length: 0,
    id: 0,
    value: '',
    percent: 0,
  };

  strength.contains = rules
    .filter(rule => new RegExp(`${rule.regex}`).test(passwordCopy))
    .map(rule => rule.message);

  strength.length = passwordCopy.length;

  const fulfilledOptions = options
    .filter(option => strength.contains.length >= option.minDiversity)
    .filter(option => strength.length >= option.minLength)
    .sort((o1, o2) => o2.id - o1.id)
    .map(option => ({ id: option.id, value: option.value }));

  Object.assign(strength, fulfilledOptions[0]);

  strength.percent = (100 / options.length) * (strength.id + 1);
  return strength;
}
