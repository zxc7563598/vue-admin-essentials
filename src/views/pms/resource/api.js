/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2024/04/01 15:52:04
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  getMenuTree: () => request.post('/permissions/menu'), // 获取菜单
  getButtons: parentId => request.post(`/permissions/menu/buttons`, { parent_id: parentId }), // 获取菜单按钮
  addPermission: data => request.post('/permissions/menu/create-or-update', data), // 新增菜单
  savePermission: data => request.post(`/permissions/menu/create-or-update`, data), // 保存菜单
  changeMenuEnable: data => request.post(`/permissions/menu/toggle`, data), // 变更按钮启用状态
  deletePermission: id => request.post(`/permissions/menu/delete`, id), // 删除菜单
}
