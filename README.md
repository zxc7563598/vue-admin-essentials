# 🚀 Vue-Naive-Admin 极速精简版

**💼 开发动机**

> 作为常接外包的PHP开发者，我发现：**配置前端环境的时间 > 写业务逻辑的时间**！

原版虽好但包含过多示例，现深度改造为：

- 🗑️ 移除所有示例页面/冗余组件
- 🔒 预置接口加密拦截器（接口信息 AES 加密）
- 🤝 完美对接我的[PHP后端 基于Webman](https://github.com/zxc7563598/php-webman-essentials)
- 🕒 从 `git clone` 到看到登录页 ≤5分钟
- 📦 配合[PHP后端 基于Webman](https://github.com/zxc7563598/php-webman-essentials)，省去所有配置，上手直接开始写业务代码

---

## 预览地址

👉 [点击查看基于此仓库速成页面](https://tools.hejunjie.life)

## 安装说明

1. 克隆项目
   ```bash
   git clone https://github.com/zxc7563598/vue-admin-essentials.git
   ```
2. 前往目录
   ```bash
   cd vue-admin-essentials
   ```
3. 克隆env配置
   ```bash
   cp .env.example .env
   cp .env.example .env.development
   cp .env.example .env.production
   ```
4. 安装依赖
   ```bash
   npm install
   ```
5. 运行命令
   ```bash
   本地运行：npm run dev
   打包：npm run build
   ```

> 后端接口部分需要自己搭建后端服务，参考：[PHP后端 基于Webman](https://github.com/zxc7563598/php-webman-essentials)

## 📂 关键目录速览

```text
.
├── src
│   ├── App.vue # 页面入口
│   ├── api  # 框架层接口API
│   │   └── index.js # 框架层接口API
│   ├── assets # 资源
│   │   ├── icons # 图标信息
│   │   │   ├── dynamic-icons.js # 需要动态渲染的 iconify 图标，参考https://icones.js.org/collection/simple-icons
│   │   │   ├── feather # 可自行添加 svg 图标 `i-fe:文件名` 相关代码于 `/build/index.js` 中
│   │   │   └── isme # 可自行添加 svg 图标 `i-me:文件名` 相关代码于 `/build/index.js` 中
│   │   └── images # 图片资源
│   ├── components # 自定义组件
│   │   ├── common
│   │   │   ├── AppCard.vue # 通用卡片容器
│   │   │   ├── AppPage.vue # 页面布局容器（主页面）
│   │   │   ├── CommonPage.vue # 页面布局容器（菜单内子页面）
│   │   │   ├── LayoutSetting.vue # 布局设置的入口和界面
│   │   │   ├── TheFooter.vue # 底部版权信息
│   │   │   ├── TheLogo.vue # 顶部左侧的logo
│   │   │   ├── ThemeSetting.vue # 顶部主题色设置
│   │   │   ├── ToggleTheme.vue # 切换夜间模式
│   │   │   └── index.js # 组件的入口
│   │   ├── index.js
│   │   └── me
│   │       ├── crud # 页面crud组件模板（列表+翻页+按钮）
│   │       │   ├── QueryItem.vue # 查询条件模板
│   │       │   └── index.vue # 页面crud组件模板（列表+翻页+按钮）
│   │       ├── index.js # 组件的入口
│   │       └── modal # 弹窗组件模板
│   │           ├── index.vue # 弹窗组件模板
│   │           └── utils.js # 弹窗组件模板的辅助方法
│   ├── composables # 自定义组合式函数
│   │   ├── index.js # 自定义组合式函数的入口
│   │   ├── useAliveData.js # 页面缓存的组合式函数
│   │   ├── useCrud.js # crud组件的组合式函数
│   │   ├── useForm.js # 表单组合式函数
│   │   └── useModal.js # 弹窗组合式函数
│   ├── directives # 自定义指令
│   │   └── index.js # 自定义指令的入口
│   ├── layouts # 布局模板
│   │   ├── components # 组件信息
│   │   │   ├── BeginnerGuide.vue # 新手引导
│   │   │   ├── BreadCrumb.vue # 面包屑
│   │   │   ├── Fullscreen.vue # 全屏切换
│   │   │   ├── MenuCollapse.vue # 侧边栏折叠
│   │   │   ├── RoleSelect.vue # 变更权限
│   │   │   ├── SideLogo.vue # 侧边栏logo
│   │   │   ├── SideMenu.vue # 侧边栏菜单
│   │   │   ├── UserAvatar.vue # 用户头像
│   │   │   ├── index.js # 组件信息
│   │   │   └── tab # tab页签
│   │   │       ├── ContextMenu.vue # 右键菜单
│   │   │       └── index.vue # tab页签
│   │   ├── empty # 空白布局模板
│   │   │   └── index.vue # 空白布局模板
│   │   ├── full # 全面布局模板
│   │   │   ├── header # 头部信息
│   │   │   │   └── index.vue # 头部信息
│   │   │   ├── index.vue # 全面布局模板
│   │   │   └── sidebar # 侧边栏信息
│   │   │       └── index.vue # 侧边栏信息
│   │   ├── normal # 通用布局模板
│   │   │   ├── header # 头部信息
│   │   │   │   └── index.vue # 头部信息
│   │   │   ├── index.vue # 通用布局模板
│   │   │   └── sidebar # 侧边栏信息
│   │   │       └── index.vue # 侧边栏信息
│   │   └── simple # 简约布局模板
│   │       ├── index.vue # 简约布局模板
│   │       └── sidebar # 侧边栏信息
│   │           └── index.vue # 侧边栏信息
│   ├── main.js # 入口文件
│   ├── router # 路由信息
│   │   ├── basic-routes.js # 基础路由信息
│   │   ├── guards # 路由守卫
│   │   │   ├── index.js # 路由守卫的入口
│   │   │   ├── page-loading-guard.js # 页面加载的守卫
│   │   │   ├── page-title-guard.js # 页面标题的守卫
│   │   │   ├── permission-guard.js # 权限的守卫
│   │   │   └── tab-guard.js # tab页签的守卫
│   │   └── index.js # 路由信息
│   ├── settings.js # 全局配置信息
│   ├── store # 全局状态管理
│   │   ├── helper.js # 辅助方法
│   │   ├── index.js # 全局状态管理的入口
│   │   └── modules # 模块信息
│   │       ├── app.js # app模块信息
│   │       ├── auth.js # auth模块信息
│   │       ├── index.js # 全局状态管理的模块
│   │       ├── permission.js # 权限模块信息
│   │       ├── router.js # router模块信息
│   │       ├── tab.js # tab页签模块信息
│   │       └── user.js # user模块信息
│   ├── styles # 样式信息
│   │   ├── global.css # 全局样式
│   │   └── reset.css # 重置样式
│   ├── utils # 辅助方法
│   │   ├── common.js # 辅助方法
│   │   ├── http # http请求相关
│   │   │   ├── helpers.js # http请求相关
│   │   │   ├── index.js # http请求相关
│   │   │   └── interceptors.js # http请求相关
│   │   ├── index.js # 辅助方法的入口
│   │   ├── is.js # 辅助验证方法
│   │   ├── naiveTools.js # naive工具方法
│   │   └── storage # 存储辅助方法
│   │       ├── index.js # 存储辅助方法的入口
│   │       └── storage.js # 存储辅助方法
│   └── views # 页面信息
│       ├── error-page # 错误页面
│       │   ├── 403.vue # 403页面
│       │   └── 404.vue # 404页面
│       ├── home # 首页
│       │   └── index.vue # 首页
│       ├── iframe # iframe页面
│       │   └── index.vue # iframe页面
│       ├── login # 登录页面
│       │   ├── api.js # 登录页面的api
│       │   └── index.vue # 登录页面
│       ├── pms # 系统管理
│       │   ├── resource # 菜单管理
│       │   │   ├── api.js # 菜单管理页面的api
│       │   │   ├── components # 组件信息
│       │   │   │   ├── MenuTree.vue # 菜单树组件
│       │   │   │   ├── QuestionLabel.vue # 说明标签组件
│       │   │   │   └── ResAddOrEdit.vue # 菜单管理页面的添加或编辑页面
│       │   │   └── index.vue # 菜单管理页面
│       │   ├── role # 角色管理
│       │   │   ├── api.js # 角色管理页面的api
│       │   │   ├── index.vue # 角色管理页面
│       │   │   └── role-user.vue # 授权用户页面
│       │   └── user # 用户管理
│       │       ├── api.js # 用户管理页面的api
│       │       └── index.vue # 用户管理页面
│       └── profile # 个人中心
│           ├── api.js # 个人中心页面的api
│           └── index.vue # 个人中心页面
```

## 版权说明

[原项目地址](https://github.com/zclzone/vue-naive-admin)

本项目使用 `MIT协议`，默认授权给任何人，被授权人可免费地无限制的使用、复制、修改、合并、发布、发行、再许可、售卖本软件拷贝、并有权向被供应人授予同等的权利，但必须满足以下条件:

- 复制、修改和发行本项目代码需包含原作者的版权及许可信息，包括但不限于文件头注释、协议等

简单来说，作者只想保留版权，没有任何其他限制。
