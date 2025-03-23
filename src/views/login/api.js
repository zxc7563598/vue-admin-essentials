/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:28:30
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  login: data => request.post('/auth/login', data, { needToken: false }), // 登陆
  getUser: () => request.post('/users/detail'), // 获取用户详细信息
}
