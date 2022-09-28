module.exports = {
  '*.{vue,ts,js,json,yml,yaml,md}': ['eslint --fix'],
  // Don't remove arrow function
  '*.{vue,ts}': () => 'vue-tsc --noEmit',
};
