<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:29:56
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage>
    <template #action>
      <NButton v-permission="'AddUser'" type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        {{ $t('page.pms.user.title') }}
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem :label="$t('page.pms.user.userName')" :label-width="50">
        <n-input
          v-model:value="queryItems.username"
          type="text"
          :placeholder="$t('page.pms.user.userNamePlaceholder')"
          clearable
        />
      </MeQueryItem>

      <MeQueryItem :label="$t('page.pms.user.gender')" :label-width="50">
        <n-select v-model:value="queryItems.gender" clearable :options="genders" :placeholder="$t('common.PleaseSelect')" />
      </MeQueryItem>

      <MeQueryItem :label="$t('page.pms.user.status')" :label-width="50">
        <n-select
          v-model:value="queryItems.enable" :placeholder="$t('common.PleaseSelect')" clearable :options="[
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
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          :label="$t('page.pms.user.userName')"
          path="username"
          :rule="{
            required: true,
            message: $t('page.pms.user.userNamePlaceholder'),
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.username" :disabled="modalAction !== 'add'" :placeholder="$t('common.PleaseEnter')" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'reset'].includes(modalAction)"
          :label="modalAction === 'reset' ? $t('page.pms.user.resetPassword') : $t('page.pms.user.initPassword')"
          path="password"
          :rule="{
            required: true,
            message: $t('page.pms.user.passwordPlaceholder'),
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.password" :placeholder="$t('common.PleaseEnter')" />
        </n-form-item>

        <n-form-item v-if="['add', 'setRole'].includes(modalAction)" :label="$t('page.pms.user.role')" path="roleIds">
          <n-select
            v-model:value="modalForm.roleIds"
            :placeholder="$t('common.PleaseSelect')"
            :options="roles"
            label-field="name"
            value-field="id"
            clearable
            filterable
            multiple
          />
        </n-form-item>
        <n-form-item v-if="modalAction === 'add'" :label="$t('page.pms.user.status')" path="enable">
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
      <n-alert v-if="modalAction === 'add'" type="warning" closable>
        {{ $t('page.pms.user.warning') }}
      </n-alert>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import { formatDateTime } from '@/utils'
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import { inject } from 'vue'
import api from './api'

// 注入 t 函数

defineOptions({ name: 'UserMgt' })

const t = inject('t')

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const genders = [
  { label: t('common.Male'), value: 1 },
  { label: t('common.Female'), value: 2 },
]
const roles = ref([])
api.getAllRoles().then(({ data = [] }) => (roles.value = data))

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleOpen,
  handleSave,
} = useCrud({
  name: t('page.pms.user.user'),
  initForm: { enable: true },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

const columns = [
  {
    title: t('page.pms.user.avatar'),
    key: 'avatar',
    width: 80,
    render: ({ avatar }) =>
      h(NAvatar, {
        size: 'medium',
        src: avatar,
      }),
  },
  { title: t('page.pms.user.userName'), key: 'username', width: 150, ellipsis: { tooltip: true } },
  {
    title: t('page.pms.user.role'),
    key: 'roles',
    width: 200,
    ellipsis: { tooltip: true },
    render: ({ roles }) => {
      if (roles?.length) {
        return roles.map((item, index) =>
          h(
            NTag,
            { type: 'success', style: index > 0 ? 'margin-left: 8px;' : '' },
            { default: () => item.name },
          ),
        )
      }
      return t('page.pms.user.noRole')
    },
  },
  {
    title: t('page.pms.user.gender'),
    key: 'gender',
    width: 80,
    render: ({ gender }) => genders.find(item => gender === item.value)?.label ?? '',
  },
  { title: t('page.pms.user.email'), key: 'email', width: 150, ellipsis: { tooltip: true } },
  {
    title: t('page.pms.user.createDate'),
    key: 'createDate',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row.createTime))
    },
  },
  {
    title: t('page.pms.user.status'),
    key: 'enable',
    width: 120,
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
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            secondary: true,
            onClick: () => handleOpenRolesSet(row),
          },
          {
            default: () => t('page.pms.user.setRole'),
            icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () => handleOpen({ action: 'reset', title: t('page.pms.user.resetPassword'), row, onOk: onSave }),
          },
          {
            default: () => t('page.pms.user.resetPassword'),
            icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
          },
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
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

function handleOpenRolesSet(row) {
  const roleIds = row.roles.map(item => item.id)
  handleOpen({
    action: 'setRole',
    title: t('page.pms.user.setRole'),
    row: { id: row.id, username: row.username, roleIds },
    onOk: onSave,
  })
}

function onSave() {
  if (modalAction.value === 'setRole') {
    return handleSave({
      api: () => api.update(modalForm.value),
      cb: () => $message.success(t('page.pms.user.setRoleSuccess')),
    })
  }
  else if (modalAction.value === 'reset') {
    return handleSave({
      api: () => api.resetPwd({ id: modalForm.value.id, password: modalForm.value.password }),
      cb: () => $message.success(t('page.pms.user.resetPasswordSuccess')),
    })
  }
  handleSave()
}
</script>
