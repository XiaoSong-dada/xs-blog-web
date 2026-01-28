import { h } from 'vue'
import type { ItemType } from 'ant-design-vue'
import { FileTextOutlined, UserOutlined } from '@ant-design/icons-vue'
import type { CenterMenuItem } from '@/types/main'

const iconMap = {
  user: () => h(UserOutlined),
  article: () => h(FileTextOutlined),
} as const

export const buildMenuItem = (
  item: CenterMenuItem,
  children?: ItemType[],
  type?: 'group',
): ItemType => {
  return {
    key: item.key,
    icon: iconMap[item.icon],
    children,
    label: item.label,
    type,
  } 
}
