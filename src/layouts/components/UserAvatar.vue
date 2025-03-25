<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:50:42
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div id="user-dropdown" class="flex cursor-pointer items-center">
      <n-avatar round :size="36" :src="userStore.avatar" />
      <div v-if="userStore.userInfo" class="ml-12 flex-col flex-shrink-0 items-center">
        <span class="text-14">{{ userStore.nickName ?? userStore.username }}</span>
        <span class="text-12 opacity-50">[{{ userStore.currentRole?.name }}]</span>
      </div>
    </div>
  </n-dropdown>

  <RoleSelect ref="roleSelectRef" />
</template>

<script setup>
import api from '@/api'
import { RoleSelect } from '@/layouts/components'
import { useAuthStore, usePermissionStore, useUserStore } from '@/store'
import { inject } from 'vue'

const t = inject('t') // 注入 t 函数

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const permissionStore = usePermissionStore()

const options = reactive([
  {
    label: t('layouts.components.UserAvatar.profile'),
    key: 'profile',
    icon: () => h('i', { class: 'i-material-symbols:person-outline text-14' }),
    show: computed(() => permissionStore.accessRoutes?.some(item => item.path === '/profile')),
  },
  {
    label: t('layouts.components.UserAvatar.switchRole'),
    key: 'toggleRole',
    icon: () => h('i', { class: 'i-basil:exchange-solid text-14' }),
    show: computed(() => userStore.roles.length > 1),
  },
  {
    label: t('layouts.components.UserAvatar.logOut'),
    key: 'logout',
    icon: () => h('i', { class: 'i-mdi:exit-to-app text-14' }),
  },
])

const roleSelectRef = ref(null)
function handleSelect(key) {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'toggleRole':
      roleSelectRef.value?.open({
        onOk() {
          location.reload()
        },
      })
      break
    case 'logout':
      $dialog.confirm({
        title: t('layouts.components.UserAvatar.notice'),
        type: 'info',
        content: t('layouts.components.UserAvatar.confirmLogOut'),
        async confirm() {
          try {
            await api.logout()
          }
          catch (error) {
            console.error(error)
          }
          authStore.logout()
          $message.success(t('layouts.components.UserAvatar.loggedOutSuccessfully'))
        },
      })
      break
  }
}
</script>
