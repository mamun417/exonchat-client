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
                path: 'departments',
                component: () =>
                    import('pages/subscriber/departments/Index.vue'),
            },
            {
                path: 'chat-templates',
                component: () =>
                    import('pages/subscriber/chat-templates/Index.vue'),
            },
            {
                path: 'intents',
                component: () => import('pages/subscriber/intents/Index.vue'),
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
            {
                path: 'speech-recognition',
                component: () =>
                    import('pages/super-admin/speech-recognition/Index.vue'),
            },
            {
                path: 'site-variables',
                component: () =>
                    import('pages/super-admin/site-variables/Index.vue'),
            },
            {
                path: 'subscribers',
                component: () =>
                    import('pages/super-admin/subscribers/Index.vue'),
            },
            {
                path: 'packages',
                component: () => import('pages/super-admin/packages/Index.vue'),
            },
            {
                path: 'validity-periods',
                component: () =>
                    import('pages/super-admin/validity-periods/Index.vue'),
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
