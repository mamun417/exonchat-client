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
                path: 'intents',
                component: () => import('pages/subscriber/intents/Index.vue'),
            },
            {
                path: 'site-variables',
                component: () =>
                    import('pages/subscriber/site-variables/Index.vue'),
            },
        ],
    },

    {
        path: '/admin',
        component: () => import('layouts/AdminLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('pages/super-admin/Index.vue'),
            },
            {
                path: 'intents',
                component: () => import('pages/super-admin/intents/Index.vue'),
            },
        ],
    },

    {
        path: '/auth',
        component: () => import('layouts/AuthLayout.vue'),
        children: [
            {
                path: 'login',
                component: () => import('pages/subscriber/auth/Login.vue'),
            },
            {
                path: 'register',
                component: () => import('pages/subscriber/auth/Register.vue'),
            },
            {
                path: 'agent-activate',
                component: () =>
                    import('pages/subscriber/auth/AgentActivate.vue'),
            },
            {
                path: 'reset-pass',
                component: () => import('pages/subscriber/auth/ResetPass.vue'),
            },
            {
                path: 'change-pass',
                component: () => import('pages/subscriber/auth/ChangePass.vue'),
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
