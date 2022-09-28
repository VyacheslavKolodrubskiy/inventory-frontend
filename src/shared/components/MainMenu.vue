<template>
  <AMenu
    :open-keys="appStore.isSidebarCollapsed ? menuState.collapsedOpenKeys : menuState.openKeys"
    :selected-keys="menuState.selectedKeys"
    @open-change="onOpenChange"
  >
    <SidebarMenu
      v-for="menuItem in menuItems"
      :key="menuItem.routeName"
      :menu-item="menuItem"
    />
  </AMenu>
</template>

<script lang="ts" setup>
import PieChartOutlined from '@ant-design/icons-vue/lib/icons/PieChartOutlined';
import TeamOutlined from '@ant-design/icons-vue/lib/icons/TeamOutlined';
import SwapOutlined from '@ant-design/icons-vue/lib/icons/SwapOutlined';
import BuildOutlined from '@ant-design/icons-vue/lib/icons/BuildOutlined';
import BankOutlined from '@ant-design/icons-vue/lib/icons/BankOutlined';
import { BarcodeOutlined, DatabaseOutlined, ReadOutlined } from '@ant-design/icons-vue';
import type { Nullable } from '@qlt2020/frutils';
import { filterTree, findNode, findNodePath, uniq } from '@qlt2020/frutils';
import type { Key } from 'ant-design-vue/es/_util/type';
import type { RouteLocationNormalized } from 'vue-router';
import { useAppStore } from '@/shared/store/app.store';
import { createRouteChangeListener } from '@/shared/utils/route-listener';
import SidebarMenu from '@/shared/layouts/TheSidebar/SidebarMenu.vue';
import { canUse } from '@/shared/utils/permissions';
import type { MenuItem } from '@/shared/layouts/TheSidebar/sidebar';

const router = useRouter();
const appStore = useAppStore();
const menuItemKey = 'title';

const menuItems = filterByPermissions([
  {
    routeName: 'Statistics.Main',
    title: 'common.main',
    icon: PieChartOutlined,
  },
  {
    routeName: 'Movement.Main',
    title: 'common.productMovement',
    icon: SwapOutlined,
  },
  {
    routeName: 'Inventory.Main',
    title: 'common.inventory',
    icon: BuildOutlined,
  },
  {
    routeName: 'Marking.Main',
    title: 'common.marking',
    icon: BarcodeOutlined,
  },
  {
    routeName: 'RegistryProduct.Main',
    title: 'common.productRegistry',
    icon: DatabaseOutlined,
  },
  {
    title: 'common.counterparty',
    icon: BankOutlined,
    children: [
      {
        routeName: 'Counterparty.Main',
        title: 'counterparty-info.counterpartyList',
      },
      {
        routeName: 'Counterparty.Info',
        title: 'counterparty-info.data',
      },
      {
        routeName: 'Warehouse.Main',
        title: 'warehouse.title',
      },
    ],
  },

  // {
  //   routeName: 'Reports',
  //   title: 'Отчеты',
  // },
  {
    title: 'common.catalog',
    icon: ReadOutlined,
    children: [
      {
        title: 'common.countries',
        routeName: 'CatalogCountry.Main',
      },
      {
        title: 'region.menuTitle',
        routeName: 'CatalogRegion.Main',
      },
      {
        title: 'city.menuTitle',
        routeName: 'CatalogCity.Main',
      },
      {
        routeName: 'Product.Main',
        title: 'common.inventoryRegistry',
      },
      {
        title: 'common.productCategories',
        routeName: 'CatalogProductCategory.Main',
      },
      {
        title: 'common.units',
        routeName: 'CatalogUnit.Main',
      },
    ],
  },

  {
    title: 'common.users',
    icon: TeamOutlined,
    children: [
      {
        title: 'common.manager',
        routeName: 'UserManager.Main',
      },
    ],
  },

]);

function filterByPermissions(list: MenuItem[]) {
  return filterTree(list, (menuItem) => {
    const { meta } = router.resolve({ name: menuItem.routeName });

    return canUse(meta.permissions);
  });
}

const menuState = reactive({
  selectedKeys: [] as Key[],
  openKeys: [] as Key[],
  collapsedOpenKeys: [] as Key[],
  rootSubmenuKeys: computed(() => {
    return menuItems.reduce((acc, item) => item.children ? [...acc, item[menuItemKey]] : acc, [] as Key[]);
  }),
});

function setOpenKeys(key: Nullable<Key>) {
  if (appStore.settings.navigationTop)
    return;

  if (appStore.settings.navigationAccordion)
    menuState.openKeys = getAllParentKeys(menuItems, key);
  else
    menuState.openKeys = uniq([...menuState.openKeys, ...getAllParentKeys(menuItems, key)]);
}

function onOpenChange(openKeys: Key[]) {
  if (appStore.settings.navigationAccordion) {
    if (appStore.isSidebarCollapsed) {
      menuState.collapsedOpenKeys = openKeys;
    } else {
      const latestOpenKey = openKeys.find(key => !menuState.openKeys.includes(key));
      if (!menuState.rootSubmenuKeys.includes(latestOpenKey!))
        menuState.openKeys = openKeys;
      else
        menuState.openKeys = latestOpenKey ? [latestOpenKey] : [];
    }
  } else {
    menuState.openKeys = openKeys;
  }
}

function getActiveMenuItem(route: RouteLocationNormalized) {
  return findNode(menuItems, n => n.routeName === route.name);
}

createRouteChangeListener((route) => {
  const activeMenuItem = getActiveMenuItem(route);

  if (activeMenuItem)
    setOpenKeys(activeMenuItem[menuItemKey]);

  if (appStore.settings.navigationTop)
    menuState.selectedKeys = activeMenuItem ? [getCurrentParentKey(activeMenuItem[menuItemKey])] : [];
  else
    menuState.selectedKeys = activeMenuItem ? getAllParentKeys(menuItems, activeMenuItem[menuItemKey]) : [];
});

function getCurrentParentKey(currentKey: Nullable<Key>) {
  const allParentPath = getAllParentKeys(menuItems, currentKey);
  return allParentPath[allParentPath.length - 1];
}

function getAllParentKeys(treeData: MenuItem[], key: Nullable<Key>) {
  const menuList = findNodePath(treeData, n => n[menuItemKey] === key);
  return (menuList || []).map(item => item[menuItemKey]);
}
</script>
