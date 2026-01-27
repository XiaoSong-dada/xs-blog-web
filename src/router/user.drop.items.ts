import type { IDropDownItem } from '@/types/main'
import { AuthService } from '@/service/auth.service'
export const menus: IDropDownItem[] = [
    {
        key: 1,
        label: '我的创作',
        route: '/'
    },
    {
        key: 2,
        label: '个人中心',
        route: '/'
    },
    {
        key: 3,
        label: '退出',
        route: '/',
        before_need_driver: true,
        click : ()=>{
            AuthService.clearToken()
        }
        
    }
]