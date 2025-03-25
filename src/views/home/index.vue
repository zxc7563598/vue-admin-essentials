<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:28:22
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <AppPage show-footer>
    <div class="flex">
      <n-card class="min-w-200 w-30%">
        <div class="flex items-center">
          <n-avatar round :size="60" :src="userStore.avatar" class="flex-shrink-0" />
          <div class="ml-20 flex-col">
            <span class="text-20 opacity-80">
              {{ $t('page.home.user.greeting', { name: userStore.nickName ?? userStore.username }) }}
            </span>
            <span class="mt-4 opacity-50">{{ $t('page.home.user.currentRole', { role: userStore.currentRole?.name })
            }}</span>
          </div>
        </div>

        <p class="mt-28 text-14 opacity-60">
          {{ $t('page.home.user.inspiration') }}
        </p>
        <p class="mt-12 text-right text-12 opacity-40">
          —— {{ $t('page.home.user.quoteAuthor') }}
        </p>
      </n-card>
      <n-card class="ml-12 w-70%" :title="$t('page.home.welcome.title')">
        <template #header-extra>
          <a
            class="text-14 text-primary text-highlight hover:underline hover:opacity-80" href="https://isme.top"
            target="_blank" @click.prevent="message?.info($t('page.home.welcome.websiteInDevelopment'))"
          >
            isme.top
          </a>
        </template>

        <p class="opacity-60">
          {{ $t('page.home.welcome.description') }}
        </p>
        <footer class="mt-12 flex items-center justify-end">
          <n-button type="primary" ghost tag="a" href="https://isme.top" target="__blank">
            {{ $t('page.home.welcome.developmentDocs') }}
          </n-button>
          <n-button
            type="primary" class="ml-12" tag="a" href="https://github.com/zclzone/vue-naive-admin/tree/2.x"
            target="__blank"
          >
            {{ $t('page.home.welcome.codeRepository') }}
          </n-button>
        </footer>
      </n-card>
    </div>

    <div class="mt-12 flex">
      <n-card class="w-50%" :title="$t('page.home.features.title')" segmented>
        <template #header-extra>
          <span class="opacity-90 text-highlight">{{ $t('page.home.features.headerExtra') }}</span>
        </template>

        <ul class="opacity-90">
          <li class="py-4">
            🆒 {{ $t('page.home.features.usingVue3') }}
            <b>{{ $t('page.home.features.vue3TechStack') }}</b>
            {{ $t('page.home.features.usingVite') }}
          </li>
          <li class="py-4">
            🍇 {{ $t('page.home.features.usingAtomicCSS') }}
            <b>{{ $t('page.home.features.atomicCSSFramework') }}</b>
            ,{{ $t('page.home.features.lightweightAndElegant') }}
          </li>
          <li class="py-4">
            🤹 {{ $t('page.home.features.iconifyUnocss') }}
            {{ $t('page.home.features.customIconsSupport') }}
          </li>
          <li class="py-4">
            🎨 {{ $t('page.home.features.usingNaiveUI') }},
            <span class="text-highlight">{{ $t('page.home.features.naiveUIFeatures') }}</span>
            ,{{ $t('page.home.features.themeCustomization') }}
          </li>
          <li class="py-4">
            👏 {{ $t('page.home.features.advancedFileStructure') }}
            <b>{{ $t('page.home.features.zeroCoupling') }}</b>
            ,{{ $t('page.home.features.deleteModulesNoImpact') }}
          </li>
          <li class="py-4">
            🚀
            <span class="text-highlight">{{ $t('page.home.features.flatRouteDesign') }}</span>
            {{ $t('page.home.features.componentsAsPages') }}
          </li>

          <li class="py-4">
            🍒
            <span class="text-highlight">{{ $t('page.home.features.dynamicPermissionRoutes') }}</span>
            ,{{ $t('page.home.features.noExtraRouting') }},
            <span class="text-highlight">{{ $t('page.home.features.distinguish403And404') }}</span>
          </li>
          <li class="py-4">
            🔐 {{ $t('page.home.features.redisIntegration') }}
            <span class="text-highlight">{{ $t('page.home.features.smoothLogin') }}</span>
            {{ $t('page.home.features.securityAndExperience') }}
          </li>
          <li class="py-4">
            ✨ {{ $t('page.home.features.naiveUIMessage') }}
            <span class="text-highlight">{{ $t('page.home.features.globalToolMethod') }}</span>
          </li>
          <li class="py-4">
            ⚡️ {{ $t('page.home.features.naiveUIComponents') }}
            <span class="text-highlight">{{ $t('page.home.features.pageComponent') }}</span>,
            <span class="text-highlight">{{ $t('page.home.features.crudComponent') }}</span>
            {{ $t('page.home.features.modalComponent') }}
          </li>
        </ul>

        <n-divider class="mb-0! mt-12!">
          <p class="text-14 opacity-60">
            👉 {{ $t('page.home.features.click') }}
            <b class="mx-2 transition hover:text-primary">
              <a href="https://isme.top" target="_blank">{{ $t('page.home.features.moreLink') }}</a>
            </b>
            {{ $t('page.home.features.viewMore') }}
          </p>
        </n-divider>
      </n-card>

      <n-card class="ml-12 w-50%" :title="$t('page.home.techStack.title')" segmented>
        <VChart :option="skillOption" autoresize />
      </n-card>
    </div>

    <n-card class="mt-12" :title="$t('page.home.tendencies.title')" segmented>
      <div class="h-400">
        <VChart :option="trendOption" autoresize />
      </div>
    </n-card>
  </AppPage>
</template>

<script setup>
import { useUserStore } from '@/store'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { inject } from 'vue'
import VChart from 'vue-echarts'

const t = inject('t') // 注入 t 函数

const userStore = useUserStore()

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  PieChart,
])

const trendOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  legend: {
    top: '5%',
    data: ['star', 'fork'],
  },
  xAxis: [
    {
      type: 'category',
      data: [t('months.Jan'), t('months.Feb'), t('months.Mar'), t('months.Apr'), t('months.May'), t('months.Jun'), t('months.Jul'), t('months.Aug'), t('months.Sep'), t('months.Oct'), t('months.Nov'), t('months.Dec')],
      axisPointer: {
        type: 'shadow',
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      min: 0,
      max: 3000,
      interval: 500,
      axisLabel: {
        formatter: '{value}',
      },
    },
    {
      type: 'value',
      min: 0,
      max: 500,
      interval: 100,
      axisLabel: {
        formatter: '{value}',
      },
    },
  ],
  series: [
    {
      name: 'star',
      type: 'line',
      data: [200, 320, 520, 550, 600, 805, 888, 950, 1300, 2503, 2702, 2712],
    },
    {
      name: 'fork',
      yAxisIndex: 1,
      type: 'bar',
      data: [40, 72, 110, 115, 121, 175, 180, 201, 260, 398, 423, 455],
    },
  ],
}

const skillOption = {
  tooltip: {
    trigger: 'item',
    formatter({ name, value }) {
      return `${name} ${value}%`
    },
  },
  legend: {
    left: 'center',
  },
  series: [
    {
      top: '12%',
      type: 'pie',
      radius: ['35%', '90%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 36,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 38.5, name: 'Vue' },
        { value: 37.0, name: 'JavaScript' },
        { value: 6.5, name: 'CSS' },
        { value: 6.2, name: 'HTML' },
        { value: 1.8, name: 'Other' },
      ],
    },
  ],
}

const message = $message
</script>
