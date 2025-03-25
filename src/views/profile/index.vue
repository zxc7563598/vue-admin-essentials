<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:30:11
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <AppPage show-footer>
    <n-card>
      <n-space align="center">
        <n-avatar round :size="100" :src="userStore.avatar" />
        <div class="ml-20">
          <div class="flex items-center text-16">
            <span>{{ $t('page.profile.username') }}:</span>
            <span class="ml-12 opacity-80">{{ userStore.username }}</span>
            <n-button class="ml-32" type="primary" text @click="pwdModalRef.open()">
              <i class="i-fe:edit mr-4" />
              {{ $t('page.profile.changePassword') }}
            </n-button>
          </div>
        </div>
      </n-space>
    </n-card>

    <n-card class="mt-20" :title="$t('page.profile.profileInformation')">
      <template #header-extra>
        <n-button type="primary" text @click="profileModalRef.open()">
          <i class="i-fe:edit mr-4" />
          {{ $t('page.profile.editProfile') }}
        </n-button>
      </template>

      <n-descriptions
        label-placement="left"
        :label-style="{ width: '200px', textAlign: 'center' }"
        :column="1"
        bordered
      >
        <n-descriptions-item :label="$t('page.profile.nickname')">
          {{ userStore.nickName }}
        </n-descriptions-item>
        <n-descriptions-item :label="$t('page.profile.gender')">
          {{ genders.find((item) => item.value === userStore.userInfo?.gender)?.label ?? $t('page.profile.unknown') }}
        </n-descriptions-item>
        <n-descriptions-item :label="$t('page.profile.address')">
          {{ userStore.userInfo?.address }}
        </n-descriptions-item>
        <n-descriptions-item :label="$t('page.profile.email')">
          {{ userStore.userInfo?.email }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>

    <MeModal ref="pwdModalRef" :title="$t('page.profile.changePassword')" width="420px" @ok="handlePwdSave()">
      <n-form
        ref="pwdFormRef"
        :model="pwdForm"
        label-placement="left"
        require-mark-placement="left"
      >
        <n-form-item :label="$t('page.profile.currentPassword')" path="oldPassword" :rule="required">
          <n-input v-model:value="pwdForm.oldPassword" type="password" :placeholder="$t('page.profile.currentPasswordPlaceholder')" />
        </n-form-item>
        <n-form-item :label="$t('page.profile.newPassword')" path="newPassword" :rule="required">
          <n-input v-model:value="pwdForm.newPassword" type="password" :placeholder="$t('page.profile.newPasswordPlaceholder')" />
        </n-form-item>
      </n-form>
    </MeModal>

    <MeModal ref="profileModalRef" :title="$t('page.profile.editProfile')" width="420px" @ok="handleProfileSave()">
      <n-form ref="profileFormRef" :model="profileForm" label-placement="left">
        <n-form-item :label="$t('page.profile.nickname')" path="nickName">
          <n-input v-model:value="profileForm.nickName" :placeholder="$t('page.profile.nicknamePlaceholder')" />
        </n-form-item>
        <n-form-item :label="$t('page.profile.gender')" path="gender">
          <n-select
            v-model:value="profileForm.gender"
            :options="genders"
            :placeholder="$t('common.PleaseSelect')"
          />
        </n-form-item>
        <n-form-item :label="$t('page.profile.address')" path="address">
          <n-input v-model:value="profileForm.address" :placeholder="$t('page.profile.addressPlaceholder')" />
        </n-form-item>
        <n-form-item :label="$t('page.profile.email')" path="email">
          <n-input v-model:value="profileForm.email" :placeholder="$t('page.profile.emailPlaceholder')" />
        </n-form-item>
      </n-form>
    </MeModal>
  </AppPage>
</template>

<script setup>
import { MeModal } from '@/components'
import { useForm, useModal } from '@/composables'
import { useUserStore } from '@/store'
import { getUserInfo } from '@/store/helper'
import { inject } from 'vue'
import api from './api'

const t = inject('t') // 注入 t 函数

const userStore = useUserStore()
const required = {
  required: true,
  message: t('common.RequiredField'),
  trigger: ['blur', 'change'],
}

const [pwdModalRef] = useModal()
const [pwdFormRef, pwdForm, pwdValidation] = useForm()

async function handlePwdSave() {
  await pwdValidation()
  await api.changePassword(pwdForm.value)
  $message.success(t('page.profile.changePasswordSuccess'))
  refreshUserInfo()
}

const genders = [
  { label: t('page.profile.private'), value: 0 },
  { label: t('common.Male'), value: 1 },
  { label: t('common.Female'), value: 2 },
]
const [profileModalRef] = useModal()
const [profileFormRef, profileForm, profileValidation] = useForm({
  id: userStore.userId,
  nickName: userStore.nickName,
  gender: userStore.userInfo?.gender ?? 0,
  address: userStore.userInfo?.address,
  email: userStore.userInfo?.email,
})
async function handleProfileSave() {
  await profileValidation()
  await api.updateProfile(profileForm.value)
  $message.success(t('page.profile.updateSuccess'))
  refreshUserInfo()
}

async function refreshUserInfo() {
  const user = await getUserInfo()
  userStore.setUser(user)
}
</script>
