<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <i
        class="i-fe:beginner mr-16 cursor-pointer text-20"
        @click="show = true"
      />
    </template>
    {{ $t('layouts.components.BeginnerGuide.title') }}
  </n-tooltip>

  <Vue3IntroStep
    ref="myIntroStep"
    v-model:show="show"
    :config="config"
  >
    <template #prev="{ tipItem, index }">
      <NButton class="mr-12" type="primary" color="#fff" text-color="#fff" ghost round size="small" @click="prev(tipItem, index)">
        {{ $t('layouts.components.BeginnerGuide.previous') }}
      </NButton>
    </template>
    <template #next="{ tipItem }">
      <NButton class="mr-12" type="primary" color="#fff" text-color="#fff" ghost round size="small" @click="next(tipItem)">
        {{ $t('layouts.components.BeginnerGuide.next') }}
      </NButton>
    </template>

    <template #skip>
      <NButton type="primary" color="#fff" text-color="#fff" ghost round size="small" @click="skip">
        {{ $t('layouts.components.BeginnerGuide.skip') }}
      </NButton>
    </template>

    <template #done>
      <NButton type="primary" color="#fff" text-color="#fff" ghost round size="small" @click="done">
        {{ $t('layouts.components.BeginnerGuide.finish') }}
      </NButton>
    </template>
  </Vue3IntroStep>
</template>

<script setup>
import { inject } from 'vue'
import Vue3IntroStep from 'vue3-intro-step'

const t = inject('t') // 注入 t 函数

const myIntroStep = shallowRef(null)
const show = shallowRef(false)
const config = {
  backgroundOpacity: 0.8,
  titleStyle: {
    textAlign: 'left',
    fontSize: '18px',
  },
  contentStyle: {
    textAlign: 'left',
    fontSize: '14px',
  },
  tips: [
    {
      el: '#toggleTheme',
      tipPosition: 'bottom',
      title: t('layouts.components.BeginnerGuide.toggleThemeTitle'),
      content: t('layouts.components.BeginnerGuide.toggleThemeContent'),
    },
    {
      el: '#fullscreen',
      tipPosition: 'bottom',
      title: t('layouts.components.BeginnerGuide.fullscreenTitle'),
      content: t('layouts.components.BeginnerGuide.fullscreenContent'),
    },
    {
      el: '#langSwitcher',
      tipPosition: 'bottom',
      title: t('layouts.components.BeginnerGuide.langSwitcherTitle'),
      content: t('layouts.components.BeginnerGuide.langSwitcherContent'),
    },
    {
      el: '#theme-setting',
      tipPosition: 'bottom',
      title: t('layouts.components.BeginnerGuide.themeSettingTitle'),
      content: t('layouts.components.BeginnerGuide.themeSettingContent'),
    },
    {
      el: '#user-dropdown',
      tipPosition: 'bottom',
      title: t('layouts.components.BeginnerGuide.userDropdownTitle'),
      content: t('layouts.components.BeginnerGuide.userDropdownContent'),
    },
    {
      el: '#menu-collapse',
      tipPosition: 'bottom',
      title: t('layouts.components.BeginnerGuide.menuCollapseTitle'),
      content: t('layouts.components.BeginnerGuide.menuCollapseContent'),
    },
    {
      el: '#top-tab',
      tipPosition: 'bottom',
      title: t('layouts.components.BeginnerGuide.topTabTitle'),
      content: t('layouts.components.BeginnerGuide.topTabContent'),
    },
    {
      el: '#layout-setting',
      tipPosition: 'left',
      title: t('layouts.components.BeginnerGuide.layoutSettingTitle'),
      content: t('layouts.components.BeginnerGuide.layoutSettingContent'),
    },
  ],
}

function skip() {
  show.value = false
}

function done() {
  show.value = false
}

function next() {
  // tipItem当前的提示项信息
  // 调用vue3-intro-step的next方法 手动触发下一步
  myIntroStep.value.next()
}
function prev() {
  // 调用vue3-intro-step的prev方法 手动触发上一步
  myIntroStep.value.prev()
}
</script>
