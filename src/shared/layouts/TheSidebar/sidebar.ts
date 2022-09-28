import type { Component } from 'vue';

export interface MenuItem {
  routeName?: string
  title: string
  icon?: Component
  children?: MenuItem[]
}
