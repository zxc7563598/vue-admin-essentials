<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:28:53
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage>
    <div class="flex">
      <n-spin size="small" :show="treeLoading">
        <MenuTree v-model:current-menu="currentMenu" class="w-320 shrink-0" :tree-data="treeData" @refresh="initData" />
      </n-spin>

      <div class="ml-40 w-0 flex-1">
        <template v-if="currentMenu">
          <div class="flex justify-between">
            <h3 class="mb-12">
              {{ currentMenu.name }}
            </h3>
            <NButton size="small" type="primary" @click="handleEdit(currentMenu)">
              <i class="i-material-symbols:edit-outline mr-4 text-14" />
              {{ $t('common.Edit') }}
            </NButton>
          </div>
          <n-descriptions label-placement="left" bordered :column="2">
            <n-descriptions-item :label="$t('page.pms.resource.code')">
              {{ currentMenu.code }}
            </n-descriptions-item>
            <n-descriptions-item :label="$t('page.pms.resource.name')">
              {{ currentMenu.name }}
            </n-descriptions-item>
            <n-descriptions-item :label="$t('page.pms.resource.path')">
              {{ currentMenu.path ?? '--' }}
            </n-descriptions-item>
            <n-descriptions-item :label="$t('page.pms.resource.component')">
              {{ currentMenu.component ?? '--' }}
            </n-descriptions-item>
            <n-descriptions-item :label="$t('page.pms.resource.icon')">
              <span v-if="currentMenu.icon" class="flex items-center">
                <i :class="`${currentMenu.icon}?mask text-22 mr-8`" />
                <span class="opacity-50">{{ currentMenu.icon }}</span>
              </span>
              <span v-else>{{ $t('common.None') }}</span>
            </n-descriptions-item>
            <n-descriptions-item label="layout">
              {{ currentMenu.layout || $t('components.common.LayoutSetting.followSystem') }}
            </n-descriptions-item>
            <n-descriptions-item :label="$t('page.pms.resource.isShow')">
              {{ currentMenu.show ? $t('common.Yes') : $t('common.No') }}
            </n-descriptions-item>
            <n-descriptions-item :label="$t('page.pms.resource.isEnable')">
              {{ currentMenu.enable ? $t('common.Yes') : $t('common.No') }}
            </n-descriptions-item>
            <n-descriptions-item label="KeepAlive">
              {{ currentMenu.keepAlive ? $t('common.Yes') : $t('common.No') }}
            </n-descriptions-item>
            <n-descriptions-item :label="$t('page.pms.resource.order')">
              {{ currentMenu.order ?? '--' }}
            </n-descriptions-item>
          </n-descriptions>

          <div class="mt-32 flex justify-between">
            <h3 class="mb-12">
              {{ $t('common.Button') }}
            </h3>
            <NButton size="small" type="primary" @click="handleAddBtn">
              <i class="i-fe:plus mr-4 text-14" />
              {{ $t('common.AddNew') }}
            </NButton>
          </div>

          <MeCrud
            ref="$table" :columns="btnsColumns" :scroll-x="-1" :get-data="api.getButtons"
            :query-items="{ parentId: currentMenu.id }"
          />
        </template>
        <n-empty v-else class="h-450 f-c-c" size="large" :description="$t('page.pms.resource.noCurrentMenu')" />
      </div>
    </div>
    <ResAddOrEdit ref="modalRef" :menus="treeData" @refresh="initData" />
  </CommonPage>
</template>

<script setup>
import { MeCrud } from '@/components'
import { NButton, NSwitch } from 'naive-ui'
import { inject } from 'vue'
import api from './api'
import MenuTree from './components/MenuTree.vue'
import ResAddOrEdit from './components/ResAddOrEdit.vue'

const t = inject('t') // 注入 t 函数

const treeData = ref([])
const treeLoading = ref(false)
const $table = ref(null)
const currentMenu = ref(null)
async function initData(data) {
  if (data?.type === 'BUTTON') {
    $table.value.handleSearch()
    return
  }
  treeLoading.value = true
  const res = await api.getMenuTree()
  treeData.value = res?.data || []
  treeLoading.value = false

  if (data)
    currentMenu.value = data
}
initData()

const modalRef = ref(null)
function handleEdit(item = {}) {
  modalRef.value?.handleOpen({
    action: 'edit',
    title: t('page.pms.resource.editMenu', { name: item.name }),
    row: item,
    okText: t('common.Save'),
  })
}

const btnsColumns = [
  { title: t('page.pms.resource.name'), key: 'name' },
  { title: t('page.pms.resource.code'), key: 'code' },
  {
    title: '状态',
    key: 'enable',
    render: row =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.enable,
          loading: !!row.enableLoading,
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => t('common.Enable'),
          unchecked: () => t('common.Disable'),
        },
      ),
  },
  {
    title: t('common.Operation'),
    key: 'actions',
    width: 320,
    align: 'right',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () => handleEditBtn(row),
          },
          {
            default: () => t('common.Edit'),
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          },
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDeleteBtn(row.id),
          },
          {
            default: () => t('common.Delete'),
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          },
        ),
      ]
    },
  },
]

watch(
  () => currentMenu.value,
  async (v) => {
    await nextTick()
    if (v)
      $table.value.handleSearch()
  },
)

function handleAddBtn() {
  modalRef.value?.handleOpen({
    action: 'add',
    title: t('page.pms.resource.addButton'),
    row: { type: 'BUTTON', parentId: currentMenu.value.id },
    okText: t('common.Save'),
  })
}

function handleEditBtn(row) {
  modalRef.value?.handleOpen({
    action: 'edit',
    title: t('page.pms.resource.editButton', { name: row.name }),
    row,
    okText: t('common.Save'),
  })
}

function handleDeleteBtn(id) {
  const d = $dialog.warning({
    content: t('common.ConfirmDeletion'),
    title: t('common.Notice'),
    positiveText: t('common.OK'),
    negativeText: t('common.Cancel'),
    async onPositiveClick() {
      try {
        d.loading = true
        await api.deletePermission({ id })
        $message.success(t('common.DeletionSuccessful'))
        $table.value.handleSearch()
        d.loading = false
      }
      catch (error) {
        console.error(error)
        d.loading = false
      }
    },
  })
}

async function handleEnable(item) {
  try {
    item.enableLoading = true
    await api.changeMenuEnable({
      id: item.id,
      enable: !item.enable,
    })
    $message.success(t('common.OperationSuccessfully'))
    $table.value?.handleSearch()
    item.enableLoading = false
  }
  catch (error) {
    console.error(error)
    item.enableLoading = false
  }
}
</script>
