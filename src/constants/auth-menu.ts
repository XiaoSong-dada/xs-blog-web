import type { IDropDownItem } from '@/types/main'

// Pure menu data (no side effects). Actions are handled by the caller.
export const authMenus: IDropDownItem[] = [
  {
    key: 1,
    label: '我的创作',
    route: '/admin/article/new',
  },
  {
    key: 2,
    label: '后台管理',
    route: '/admin',
  },
  {
    key: 3,
    label: '退出',
    route: '/',
    before_need_driver: true,
    action: 'logout',
  },
]

