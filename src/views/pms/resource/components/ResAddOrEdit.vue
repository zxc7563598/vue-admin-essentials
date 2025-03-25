<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2024/04/01 15:52:31
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <MeModal ref="modalRef">
    <n-form
      ref="modalFormRef"
      label-placement="left"
      require-mark-placement="left"
      :label-width="100"
      :model="modalForm"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" :label="$t('page.pms.resource.belonging')" path="parentId">
          <n-tree-select
            v-model:value="modalForm.parentId"
            :options="menuOptions"
            :disabled="parentIdDisabled"
            label-field="name"
            key-field="id"
            :placeholder="$t('page.pms.resource.rootMenu')"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="name" :rule="required">
          <template #label>
            <QuestionLabel :label="$t('page.pms.resource.name')" :content="$t('page.pms.resource.title')" />
          </template>
          <n-input v-model:value="modalForm.name" :placeholder="$t('common.PleaseEnter')" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="code" :rule="required">
          <template #label>
            <QuestionLabel :label="$t('page.pms.resource.code')" :content="$t('page.pms.resource.codeContent')" />
          </template>
          <n-input v-model:value="modalForm.code" :placeholder="$t('common.PleaseEnter')" />
        </n-form-item-gi>
        <n-form-item-gi
          v-if="modalForm.type === 'MENU'"
          :span="12"
          path="path"
          :rule="{
            trigger: ['blur', 'change'],
            type: 'string',
            message: $t('page.pms.resource.limitation'),
            validator(rule, value) {
              if (value) {
                return /\/|http|https/.test(value)
              }
              return true
            },
          }"
        >
          <template #label>
            <QuestionLabel :label="$t('page.pms.resource.path')" :content="$t('page.pms.resource.pathContent')" />
          </template>
          <n-input v-model:value="modalForm.path" :placeholder="$t('common.PleaseEnter')" />
        </n-form-item-gi>
        <n-form-item-gi v-if="modalForm.type === 'MENU'" :span="12" path="icon">
          <template #label>
            <QuestionLabel
              :label="$t('page.pms.resource.icon')"
              :content="$t('page.pms.resource.iconContent')"
            />
          </template>
          <n-select v-model:value="modalForm.icon" :options="iconOptions" clearable filterable :placeholder="$t('common.PleaseSelect')" />
        </n-form-item-gi>
        <n-form-item-gi v-if="modalForm.type === 'MENU'" :span="12" path="layout">
          <template #label>
            <QuestionLabel
              label="layout"
              :content="$t('page.pms.resource.layoutsContent')"
            />
          </template>
          <n-select v-model:value="modalForm.layout" :options="layoutOptions" clearable :placeholder="$t('common.PleaseSelect')" />
        </n-form-item-gi>
        <n-form-item-gi v-if="modalForm.type === 'MENU'" :span="24" path="component">
          <template #label>
            <QuestionLabel
              :label="$t('page.pms.resource.component')"
              :content="$t('page.pms.resource.componentContent')"
            />
          </template>
          <n-select
            v-model:value="modalForm.component"
            :options="componentOptions"
            :placeholder="$t('common.PleaseSelect')"
            clearable
            filterable
            tag
          />
        </n-form-item-gi>

        <n-form-item-gi v-if="modalForm.type === 'MENU'" :span="12" path="show">
          <template #label>
            <QuestionLabel :label="$t('page.pms.resource.show')" :content="$t('page.pms.resource.showContent')" />
          </template>
          <n-switch v-model:value="modalForm.show">
            <template #checked>
              {{ $t('common.Show') }}
            </template>
            <template #unchecked>
              {{ $t('common.Hiddel') }}
            </template>
          </n-switch>
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="enable">
          <template #label>
            <QuestionLabel
              :label="$t('page.pms.resource.enable')"
              :content="$t('page.pms.resource.enableContent')"
            />
          </template>
          <n-switch v-model:value="modalForm.enable">
            <template #checked>
              {{ $t('common.Enable') }}
            </template>
            <template #unchecked>
              {{ $t('common.Disable') }}
            </template>
          </n-switch>
        </n-form-item-gi>
        <n-form-item-gi v-if="modalForm.type === 'MENU'" :span="12" path="keepAlive">
          <template #label>
            <QuestionLabel
              label="KeepAlive"
              :content="$t('page.pms.resource.keepAliveContent')"
            />
          </template>
          <n-switch v-model:value="modalForm.keepAlive">
            <template #checked>
              {{ $t('common.Yes') }}
            </template>
            <template #unchecked>
              {{ $t('common.No') }}
            </template>
          </n-switch>
        </n-form-item-gi>
        <n-form-item-gi
          v-if="modalForm.type === 'MENU'"
          :span="12"
          :label="$t('page.pms.resource.order')"
          path="order"
          :rule="{
            type: 'number',
            required: true,
            message: $t('common.RequiredField'),
            trigger: ['blur', 'change'],
          }"
        >
          <n-input-number v-model:value="modalForm.order" :placeholder="$t('common.PleaseEnter')" />
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </MeModal>
</template>

<script setup>
import { MeModal } from '@/components'
import { useForm, useModal } from '@/composables'
import icons from 'isme:icons'
import pagePathes from 'isme:page-pathes'
import { inject } from 'vue'
import api from '../api'
import QuestionLabel from './QuestionLabel.vue'

const props = defineProps({
  menus: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['refresh'])

const t = inject('t')

const menuOptions = computed(() => {
  return [{ name: t('page.pms.resource.rootMenu'), id: '', children: props.menus || [] }]
})

const componentOptions = pagePathes.map(path => ({ label: path, value: path }))
const iconOptions = icons.map(item => ({
  label: () =>
    h('span', { class: 'flex items-center' }, [h('i', { class: `${item} text-18 mr-8` }), item]),
  value: item,
}))
const layoutOptions = [
  { label: t('components.common.LayoutSetting.followSystem'), value: '' },
  { label: t('components.common.LayoutSetting.simple'), value: 'simple' },
  { label: t('components.common.LayoutSetting.normal'), value: 'normal' },
  { label: t('components.common.LayoutSetting.full'), value: 'full' },
  { label: t('components.common.LayoutSetting.empty'), value: 'empty' },
]
const required = {
  required: true,
  message: t('common.RequiredField'),
  trigger: ['blur', 'change'],
}

const defaultForm = { enable: true, show: true, layout: '' }
const [modalFormRef, modalForm, validation] = useForm()
const [modalRef, okLoading] = useModal()

const modalAction = ref('')
const parentIdDisabled = ref(false)
function handleOpen(options = {}) {
  const { action, row = {}, ...rest } = options
  modalAction.value = action
  modalForm.value = { ...defaultForm, ...row }
  parentIdDisabled.value = !!row.parentId && row.type === 'BUTTON'
  modalRef.value.open({ ...rest, onOk: onSave })
}

async function onSave() {
  await validation()
  okLoading.value = true
  try {
    let newFormData
    if (!modalForm.value.parentId)
      modalForm.value.parentId = null
    if (modalAction.value === 'add') {
      const res = await api.addPermission(modalForm.value)
      newFormData = res.data
    }
    else if (modalAction.value === 'edit') {
      await api.savePermission(modalForm.value)
    }
    okLoading.value = false
    $message.success(t('common.SavedSuccessfully'))
    emit('refresh', modalAction.value === 'add' ? newFormData : modalForm.value)
  }
  catch (error) {
    console.error(error)
    okLoading.value = false
    return false
  }
}

defineExpose({
  handleOpen,
})
</script>
