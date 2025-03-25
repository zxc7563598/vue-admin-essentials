<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:28:36
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <div class="wh-full flex-col bg-[url(@/assets/images/login_bg.webp)] bg-cover">
    <div class="m-auto max-w-700 min-w-345 f-c-c rounded-8 bg-opacity-20 bg-cover p-12 card-shadow auto-bg">
      <div class="hidden w-380 px-20 py-35 md:block">
        <img src="@/assets/images/login_banner.webp" class="w-full" alt="login_banner">
      </div>

      <div class="w-320 flex-col px-20 py-32">
        <h2 class="f-c-c text-24 text-#6a6a6a font-normal">
          <img src="@/assets/images/logo.png" class="mr-12 h-50">
          {{ title }}
        </h2>
        <n-input
          v-model:value="loginInfo.username" autofocus class="mt-32 h-40 items-center"
          :placeholder="$t('page.login.userPalceholder')" :maxlength="20"
        >
          <template #prefix>
            <i class="i-fe:user mr-12 opacity-20" />
          </template>
        </n-input>
        <n-input
          v-model:value="loginInfo.password" class="mt-20 h-40 items-center" type="password"
          show-password-on="mousedown" :placeholder="$t('page.login.passwordPalceholder')" :maxlength="20"
          @keydown.enter="handleLogin()"
        >
          <template #prefix>
            <i class="i-fe:lock mr-12 opacity-20" />
          </template>
        </n-input>

        <div class="mt-20 flex items-center">
          <n-input
            v-model:value="loginInfo.captcha" class="h-40 items-center"
            :placeholder="$t('page.login.captchaPalceholder')" :maxlength="6" @keydown.enter="handleLogin()"
          >
            <template #prefix>
              <i class="i-fe:key mr-12 opacity-20" />
            </template>
          </n-input>
        </div>

        <n-checkbox
          class="mt-20" :checked="isRemember" :label="$t('page.login.remember')"
          :on-update:checked="(val) => (isRemember = val)"
        />

        <div class="mt-20 flex items-center">
          <n-button class="h-40 flex-1 rounded-5 text-16" type="primary" :loading="loading" @click="handleLogin()">
            {{ $t('page.login.submit') }}
          </n-button>
        </div>
      </div>
    </div>

    <TheFooter class="py-12" />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store'
import { lStorage } from '@/utils'
import { useStorage } from '@vueuse/core'
import { inject } from 'vue'
import api from './api'

const t = inject('t') // 注入 t 函数

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const title = import.meta.env.VITE_TITLE

const loginInfo = ref({
  username: 'admin',
  password: '123456',
  captcha: '',
})

const localLoginInfo = lStorage.get('loginInfo')
if (localLoginInfo) {
  loginInfo.value.username = localLoginInfo.username || ''
  loginInfo.value.password = localLoginInfo.password || ''
}

const isRemember = useStorage('isRemember', true)
const loading = ref(false)
async function handleLogin() {
  const { username, password, captcha } = loginInfo.value
  if (!username || !password)
    return $message.warning(t('page.login.submitWarning'))
  try {
    loading.value = true
    $message.loading(t('page.login.verifying'), { key: 'login' })
    const { data } = await api.login({ username, password: password.toString(), captcha })
    if (isRemember.value) {
      lStorage.set('loginInfo', { username, password })
    }
    else {
      lStorage.remove('loginInfo')
    }
    onLoginSuccess(data)
  }
  catch (error) {
    // 登陆失败的错误处理

    $message.destroy('login')
    console.error(error)
  }
  loading.value = false
}

async function onLoginSuccess(data = {}) {
  authStore.setToken(data)
  $message.loading(t('page.login.loading'), { key: 'login' })
  try {
    $message.success(t('page.login.loginSuccess'), { key: 'login' })
    if (route.query.redirect) {
      const path = route.query.redirect
      delete route.query.redirect
      router.push({ path, query: route.query })
    }
    else {
      router.push('/')
    }
  }
  catch (error) {
    console.error(error)
    $message.destroy('login')
  }
}
</script>
