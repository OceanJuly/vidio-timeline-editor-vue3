interface MenuItem {
    title: string,
    key: string,
    active?: boolean,
    icon: string
}
const menuData: MenuItem[] = [
    {
        title: 'video',
        key: 'video',
        icon: 'VideoIcon'
    }
]

export { menuData }
export type { MenuItem }