/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/12 09:03:00
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { cloneDeep } from 'lodash-es'
import { inject } from 'vue'
import { useForm, useModal } from '.'

export function useCrud({ name, initForm = {}, doCreate, doDelete, doUpdate, refresh }) {
  const modalAction = ref('')
  const [modalRef, okLoading] = useModal()
  const [modalFormRef, modalForm, validation] = useForm(initForm)
  const t = inject('t') // 注入 t 函数

  /** 新增 */
  function handleAdd(row = {}, title) {
    handleOpen({ action: 'add', title, row: Object.assign({}, cloneDeep(initForm), cloneDeep(row)) })
  }

  /** 修改 */
  function handleEdit(row, title) {
    handleOpen({ action: 'edit', title, row })
  }

  /** 查看 */
  function handleView(row, title) {
    handleOpen({ action: 'view', title, row })
  }

  /** 打开modal */
  function handleOpen(options = {}) {
    const ACTIONS = {
      view: t('common.View'),
      edit: t('common.Edit'),
      add: t('common.AddNew'),
    }
    const { action, row, title, onOk } = options
    modalAction.value = action
    modalForm.value = { ...row }
    modalRef.value?.open({
      ...options,
      async onOk() {
        if (typeof onOk === 'function') {
          return await onOk()
        }
        else {
          return await handleSave()
        }
      },
      title: title ?? (ACTIONS[modalAction.value] || '') + name,
    })
  }

  /** 保存 */
  async function handleSave(action) {
    if (!action && !['edit', 'add'].includes(modalAction.value)) {
      return false
    }
    await validation()
    const actions = {
      add: {
        api: () => doCreate(modalForm.value),
        cb: () => $message.success(t('common.AddedSuccessfully')),
      },
      edit: {
        api: () => doUpdate(modalForm.value),
        cb: () => $message.success(t('common.SavedSuccessfully')),
      },
    }

    action = action || actions[modalAction.value]

    try {
      okLoading.value = true
      const data = await action.api()
      action.cb()
      okLoading.value = false
      data && refresh(data)
    }
    catch (error) {
      console.error(error)
      okLoading.value = false
      return false
    }
  }

  /** 删除 */
  function handleDelete(id, confirmOptions) {
    if (!id && id !== 0)
      return
    const d = $dialog.warning({
      content: t('common.ConfirmDeletion'),
      title: t('common.Notice'),
      positiveText: t('common.OK'),
      negativeText: t('common.Cancel'),
      async onPositiveClick() {
        try {
          d.loading = true
          const data = await doDelete({ id })
          $message.success(t('common.DeletionSuccessful'))
          d.loading = false
          refresh(data, true)
        }
        catch (error) {
          console.error(error)
          d.loading = false
        }
      },
      ...confirmOptions,
    })
  }
  return {
    modalRef,
    modalFormRef,
    modalAction,
    modalForm,
    okLoading,
    validation,
    handleAdd,
    handleDelete,
    handleEdit,
    handleView,
    handleOpen,
    handleSave,
  }
}
