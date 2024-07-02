import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

export const _routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/videoTimelineEditor',
        name: 'videoTimelineEditor',
        component: () => import('@/pages/video-timeline-editor/index.vue'),
        meta: { title: '视频编辑器' },
        children: [
            {
                path: 'videoTimelineEditor',
                name: 'videoTimelineEditor',
                component: () => import('@/pages/video-timeline-editor/index.vue'),
                meta: { title: 'component.route.videoTimelineEditor' }

            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [..._routes]
})

export default router