<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:28:15
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage :show-header="false">
    <div class="wh-full flex">
      <n-result
        m-auto
        status="404"
        :title="$t('page.404.title')"
        :description="$t('page.404.tips')"
        size="large"
      >
        <template #footer>
          <n-button type="primary" ghost @click="replace('/')">
            {{ $t('page.404.goHome') }}
          </n-button>
        </template>
      </n-result>
    </div>
  </CommonPage>
</template>

<script setup>
const { replace } = useRouter()
</script>
