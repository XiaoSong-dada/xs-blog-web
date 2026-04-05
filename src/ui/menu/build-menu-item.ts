import { h } from 'vue'
import type { ItemType } from 'ant-design-vue'
import { FileTextOutlined, UserOutlined, LinkOutlined, TagOutlined } from '@ant-design/icons-vue'
import type { CenterMenuItem } from '@/types/main'

const iconMap = {
  user: () => h(UserOutlined),
  article: () => h(FileTextOutlined),
  link: () => h(LinkOutlined),
  tag: () => h(TagOutlined),
} as const

export const buildMenuItem = (
  item: CenterMenuItem,
): ItemType => {
  return {
    key: item.key,
    icon: item.icon ? iconMap[item.icon] : undefined,
    label: item.label,
  }
}
