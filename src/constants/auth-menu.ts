import type { IDropDownItem } from '@/types/main'

// Pure menu data (no side effects). Actions are handled by the caller.
export const adminMenus: IDropDownItem[] = [
  {
     key: 1,
    label: '个人中心',
    route: '/me',
  },
  {
    before_need_driver: true,
    key: 2,
    label: '我的创作',
    route: '/admin/article/new',
  },
  {
    key: 3,
    label: '后台管理',
    route: '/admin',
  },
  {
    key: 4,
    label: '退出',
    route: '/',
    before_need_driver: true,
    action: 'logout',
  },
]

export const userMenus: IDropDownItem[] = [
  {
     key: 1,
    label: '个人中心',
    route: '/me',
  },
  {
    key: 4,
    label: '退出',
    route: '/',
    before_need_driver: true,
    action: 'logout',
  },
]