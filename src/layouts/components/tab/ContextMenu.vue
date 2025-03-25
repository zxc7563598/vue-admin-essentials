<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:50:48
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <n-dropdown
    :show="show"
    :options="options"
    :x="x"
    :y="y"
    placement="bottom-start"
    @clickoutside="handleHideDropdown"
    @select="handleSelect"
  />
</template>

<script setup>
import { useTabStore } from '@/store'
import { inject } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  currentPath: {
    type: String,
    default: '',
  },
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:show'])

const t = inject('t') // 注入 t 函数

const tabStore = useTabStore()

const options = computed(() => [
  {
    label: t('layouts.components.tab.reload'),
    key: 'reload',
    disabled: props.currentPath !== tabStore.activeTab,
    icon: () => h('i', { class: 'i-mdi:refresh text-14' }),
  },
  {
    label: t('layouts.components.tab.close'),
    key: 'close',
    disabled: tabStore.tabs.length <= 1,
    icon: () => h('i', { class: 'i-mdi:close text-14' }),
  },
  {
    label: t('layouts.components.tab.closeOther'),
    key: 'close-other',
    disabled: tabStore.tabs.length <= 1,
    icon: () => h('i', { class: 'i-mdi:arrow-expand-horizontal text-14' }),
  },
  {
    label: t('layouts.components.tab.closeLeft'),
    key: 'close-left',
    disabled: tabStore.tabs.length <= 1 || props.currentPath === tabStore.tabs[0].path,
    icon: () => h('i', { class: 'i-mdi:arrow-expand-left text-14' }),
  },
  {
    label: t('layouts.components.tab.closeRight'),
    key: 'close-right',
    disabled:
      tabStore.tabs.length <= 1
      || props.currentPath === tabStore.tabs[tabStore.tabs.length - 1].path,
    icon: () => h('i', { class: 'i-mdi:arrow-expand-right text-14' }),
  },
])

const route = useRoute()
const actionMap = new Map([
  [
    'reload',
    () => {
      tabStore.reloadTab(route.fullPath, route.meta?.keepAlive)
    },
  ],
  [
    'close',
    () => {
      tabStore.removeTab(props.currentPath)
    },
  ],
  [
    'close-other',
    () => {
      tabStore.removeOther(props.currentPath)
    },
  ],
  [
    'close-left',
    () => {
      tabStore.removeLeft(props.currentPath)
    },
  ],
  [
    'close-right',
    () => {
      tabStore.removeRight(props.currentPath)
    },
  ],
])

function handleHideDropdown() {
  emit('update:show', false)
}

function handleSelect(key) {
  const actionFn = actionMap.get(key)
  if (typeof actionFn === 'function')
    actionFn()
  handleHideDropdown()
}
</script>
