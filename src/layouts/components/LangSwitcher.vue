<!--------------------------------
 - @Author: Junjie He
 - @LastEditor: Junjie He
 - @LastEditTime: 2025/03/24 16:14:39
 - @Email: junjie.he.925@gmail.com
 - Copyright © 2025 Junjie He | https://hejunjie.life
 --------------------------------->

<template>
  <n-dropdown :options="options" @select="handleSelect">
    <i
      id="langSwitcher"
      class="i-fe:academia mr-16 cursor-pointer"
    />
  </n-dropdown>
</template>

<script setup>
import { lStorage } from '@/utils'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const options = reactive([
  {
    label: '中文',
    key: 'zh',
    icon: () => h('i', { class: 'i-fe:cn text-14' }),
  },
  {
    label: 'English',
    key: 'en',
    icon: () => h('i', { class: 'i-fe:us text-14' }),
  },
])
function handleSelect(key) {
  locale.value = key
  lStorage.set('locale', key)
  location.reload()
}
</script>
