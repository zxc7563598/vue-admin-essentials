/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:22:43
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { cloneDeep } from 'lodash-es'
import { inject } from 'vue'

export function useForm(initFormData = {}) {
  const formRef = ref(null)
  const formModel = ref(cloneDeep(initFormData))
  const t = inject('t') // 注入 t 函数
  const rules = {
    required: {
      required: true,
      message: t('common.RequiredField'),
      trigger: ['blur', 'change'],
    },
  }
  const validation = () => {
    return formRef.value?.validate()
  }
  return [formRef, formModel, validation, rules]
}
