<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:49:53
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <div>
    <n-tooltip trigger="hover" placement="left">
      <template #trigger>
        <div id="layout-setting" class="f-c-c rounded-4 bg-primary p-8" @click="modalRef.open()">
          <i class="i-fe:settings cursor-pointer bg-white text-20" />
        </div>
      </template>
      {{ $t('components.common.LayoutSetting.title') }}
    </n-tooltip>

    <MeModal ref="modalRef" :title="$t('components.common.LayoutSetting.title')" :show-footer="false" width="600px">
      <n-space justify="space-between">
        <div class="flex-col cursor-pointer justify-center" @click="appStore.setLayout('simple')">
          <div class="flex">
            <n-skeleton :width="20" :height="60" />
            <div class="ml-4">
              <n-skeleton :width="80" :height="60" />
            </div>
          </div>
          <n-button
            class="mt-12"
            size="small"
            :type="appStore.layout === 'simple' ? 'primary' : ''"
            ghost
          >
            {{ $t('components.common.LayoutSetting.simple') }}
          </n-button>
        </div>
        <div class="flex-col cursor-pointer justify-center" @click="appStore.setLayout('normal')">
          <div class="flex">
            <n-skeleton :width="20" :height="60" />
            <div class="ml-4">
              <n-skeleton :width="80" :height="10" />
              <n-skeleton class="mt-4" :width="80" :height="46" />
            </div>
          </div>
          <n-button
            class="mt-12"
            size="small"
            :type="appStore.layout === 'normal' ? 'primary' : ''"
            ghost
          >
            {{ $t('components.common.LayoutSetting.normal') }}
          </n-button>
        </div>

        <div class="flex-col cursor-pointer justify-center" @click="appStore.setLayout('full')">
          <div class="flex">
            <n-skeleton :width="20" :height="60" />
            <div class="ml-4">
              <n-skeleton :width="80" :height="6" />
              <n-skeleton class="mt-4" :width="80" :height="4" />
              <n-skeleton class="mt-4" :width="80" :height="42" />
            </div>
          </div>
          <n-button
            class="mt-12"
            size="small"
            :type="appStore.layout === 'full' ? 'primary' : ''"
            ghost
          >
            {{ $t('components.common.LayoutSetting.full') }}
          </n-button>
        </div>
        <div class="flex-col cursor-pointer justify-center" @click="appStore.setLayout('empty')">
          <div class="flex">
            <n-skeleton :width="104" :height="60" />
          </div>
          <n-button
            class="mt-12"
            size="small"
            :type="appStore.layout === 'empty' ? 'primary' : ''"
            ghost
          >
            {{ $t('components.common.LayoutSetting.empty') }}
          </n-button>
        </div>
      </n-space>
      <p class="mt-16 opacity-50">
        {{ $t('components.common.LayoutSetting.note') }}
      </p>
    </MeModal>
  </div>
</template>

<script setup>
import { MeModal } from '@/components'
import { useModal } from '@/composables'
import { useAppStore } from '@/store'

const appStore = useAppStore()
const [modalRef] = useModal()
</script>
