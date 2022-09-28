<!--
<template>
  <ATabs
    v-model:activeKey="activeKey"
    size="small"
    type="editable-card"
    @edit="onEdit"
  >
    <ATabPane
      v-for="pane in panes"
      :key="pane.key"
      :closable="pane.closable"
      :tab="pane.title"
    >
      {{ pane.content }}
    </ATabPane>
  </ATabs>
</template>

<script lang="ts" setup>
const panes = ref<{ title: string; content: string; key: string; closable?: boolean }[]>([
  { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
  { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
  { title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable: false },
]);
const activeKey = ref(panes.value[0].key);

const newTabIndex = ref(0);

const add = () => {
  activeKey.value = `newTab${++newTabIndex.value}`;
  panes.value.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey.value });
};

const remove = (targetKey: string) => {
  let lastIndex = 0;
  panes.value.forEach((pane, i) => {
    if (pane.key === targetKey)
      lastIndex = i - 1;
  });
  panes.value = panes.value.filter(pane => pane.key !== targetKey);
  if (panes.value.length && activeKey.value === targetKey) {
    if (lastIndex >= 0)
      activeKey.value = panes.value[lastIndex].key;
    else
      activeKey.value = panes.value[0].key;
  }
};

const onEdit = (targetKey: string | MouseEvent, action: string) => {
  if (action === 'add')
    add();
  else
    remove(targetKey as string);
};
</script>
-->
