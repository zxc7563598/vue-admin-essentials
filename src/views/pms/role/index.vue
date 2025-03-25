<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2024/04/01 15:52:40
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage>
    <template #action>
      <NButton v-permission="'AddRole'" type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        {{ $t('page.pms.role.title') }}
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem :label="$t('page.pms.role.roleName')" :label-width="50">
        <n-input v-model:value="queryItems.name" type="text" :placeholder="$t('page.pms.role.roleNamePlaceholder')" clearable />
      </MeQueryItem>
      <MeQueryItem :label="$t('page.pms.role.status')" :label-width="50">
        <n-select
          v-model:value="queryItems.enable"
          clearable
          :placeholder="$t('common.PleaseSelect')"
          :options="[
            { label: $t('common.Enable'), value: 1 },
            { label: $t('common.Disable'), value: 0 },
          ]"
        />
      </MeQueryItem>
    </MeCrud>
    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
      >
        <n-form-item
          :label="$t('page.pms.role.roleName')"
          path="name"
          :rule="{
            required: true,
            message: $t('page.pms.role.roleNamePlaceholder'),
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" :placeholder="$t('common.PleaseEnter')" />
        </n-form-item>
        <n-form-item
          :label="$t('page.pms.role.roleCode')"
          path="code"
          :rule="{
            required: true,
            message: $t('page.pms.role.roleCodePlaceholder'),
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.code" :disabled="modalAction !== 'add'" :placeholder="$t('common.PleaseEnter')" />
        </n-form-item>
        <n-form-item :label="$t('page.pms.role.permission')" path="permissionIds">
          <n-tree
            key-field="id"
            label-field="name"
            :selectable="false"
            :data="permissionTree"
            :checked-keys="modalForm.permissionIds"
            :on-update:checked-keys="(keys) => (modalForm.permissionIds = keys)"
            default-expand-all checkable check-on-click
            class="cus-scroll max-h-200 w-full"
          />
        </n-form-item>
        <n-form-item :label="$t('page.pms.role.status')" path="enable">
          <NSwitch v-model:value="modalForm.enable">
            <template #checked>
              {{ $t('common.Enable') }}
            </template>
            <template #unchecked>
              {{ $t('common.Disable') }}
            </template>
          </NSwitch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import { NButton, NSwitch } from 'naive-ui'
import { inject } from 'vue'
import api from './api'

// 注入 t 函数

defineOptions({ name: 'RoleMgt' })

const t = inject('t')

const router = useRouter()

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const { modalRef, modalFormRef, modalAction, modalForm, handleAdd, handleDelete, handleEdit }
  = useCrud({
    name: t('page.pms.role.role'),
    doCreate: api.create,
    doDelete: api.delete,
    doUpdate: api.update,
    initForm: { enable: true },
    refresh: (_, keepCurrentPage) => $table.value?.handleSearch(keepCurrentPage),
  })

const columns = [
  { title: t('page.pms.role.roleName'), key: 'name' },
  { title: t('page.pms.role.roleCode'), key: 'code' },
  {
    title: t('page.pms.role.status'),
    key: 'enable',
    render: row =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.enable,
          loading: !!row.enableLoading,
          disabled: row.code === 'SUPER_ADMIN',
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
            secondary: true,
            onClick: () =>
              router.push({ path: `/pms/role/user/${row.id}`, query: { roleName: row.name } }),
          },
          {
            default: () => t('page.pms.role.roleUser'),
            icon: () => h('i', { class: 'i-fe:user-plus text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN',
            onClick: () => handleEdit(row),
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
            disabled: row.code === 'SUPER_ADMIN',
            onClick: () => handleDelete(row.id),
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

async function handleEnable(row) {
  row.enableLoading = true
  try {
    await api.update({ id: row.id, enable: !row.enable })
    row.enableLoading = false
    $message.success(t('common.OperationSuccessfully'))
    $table.value?.handleSearch()
  }
  catch (error) {
    console.error(error)
    row.enableLoading = false
  }
}

const permissionTree = ref([])
api.getAllPermissionTree().then(({ data = [] }) => (permissionTree.value = data))
</script>
