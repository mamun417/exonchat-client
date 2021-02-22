import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', component: () => import('pages/Index.vue') },
            {
                path: 'chats',
                component: () => import('pages/subscriber/Chat.vue'),
            },
            {
                path: 'agents',
                component: () => import('pages/subscriber/agent/Index.vue'),
            },
            {
                path: 'tags',
                component: () => import('pages/subscriber/tag/Index.vue'),
            },
            {
                path: 'site-variables',
                component: () =>
                    import('pages/subscriber/site-variables/Index.vue'),
            },
        ],
    },

    {
        path: '/web-chat',
        component: () => import('layouts/WebChatLayout.vue'),
        children: [{ path: '', component: () => import('pages/WebChat.vue') }],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/Error404.vue'),
    },
];

export default routes;
