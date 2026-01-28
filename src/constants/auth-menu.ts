import type { IDropDownItem } from '@/types/main'

// Pure menu data (no side effects). Actions are handled by the caller.
export const authMenus: IDropDownItem[] = [
  {
    key: 1,
    label: '我的创作',
    route: '/',
  },
  {
    key: 2,
    label: '个人中心',
    route: '/center',
  },
  {
    key: 3,
    label: '退出',
    route: '/',
    before_need_driver: true,
    action: 'logout',
  },
]

