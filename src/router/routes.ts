import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        meta: { requiresAuth: true },
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', component: () => import('pages/Index.vue') },
            {
                path: 'chats/:conv_id?',
                name: 'chats',
                component: () => import('pages/subscriber/Chat.vue'),
            },
            {
                meta: { requiresRoleAdmin: true },
                path: 'users',
                name: 'users',
                component: () => import('pages/subscriber/agent/Index.vue'),
            },
            {
                meta: { requiresRoleAdmin: true },
                path: 'users/invitations',
                name: 'users-invitations',
                component: () => import('pages/subscriber/agent/Invitations.vue'),
            },
            {
                path: 'departments',
                name: 'departments',
                component: () => import('pages/subscriber/departments/Index.vue'),
            },
            {
                path: 'chat-templates',
                name: 'chat-templates',
                component: () => import('pages/subscriber/chat-templates/Index.vue'),
            },
            {
                path: 'speech-recognition',
                name: 'speech-recognition',
                component: () => import('pages/subscriber/speech-recognition/Index.vue'),
            },
            {
                path: 'intents',
                name: 'intents',
                component: () => import('pages/subscriber/intents/Index.vue'),
            },
            {
                path: 'uploads',
                name: 'uploads',
                component: () => import('pages/subscriber/uploads/Index.vue'),
            },

            {
                path: 'clients-conversations',
                name: 'clients-conversations',
                component: () => import('pages/subscriber/client/clients-conversations/Index.vue'),
            },
            {
                path: 'visitors',
                name: 'visitors',
                component: () => import('pages/subscriber/client/visitors/Index.vue'),
            },

            {
                path: 'settings',
                name: 'settings',
                component: () => import('pages/subscriber/settings/Index.vue'),
                children: [
                    {
                        path: 'profile',
                        name: 'settings_profile',
                        component: () => import('pages/subscriber/settings/profile/Index.vue'),
                    },
                    {
                        path: 'ui',
                        name: 'settings_ui',
                        component: () => import('pages/subscriber/settings/ui/Index.vue'),
                    },
                    {
                        path: 'apps',
                        name: 'settings_apps',
                        component: () => import('pages/subscriber/settings/apps/Index.vue'),
                    },
                    {
                        path: 'testing',
                        name: 'settings_testing',
                        component: () => import('pages/subscriber/settings/testing/Index.vue'),
                    },
                ],
            },
            {
                path: '/access-denied',
                name: 'access-denied',
                component: () => import('pages/Error403.vue'),
            },
        ],
    },

    {
        path: '/admin',
        component: () => import('layouts/AdminLayout.vue'),
        children: [
            {
                path: '',
                name: 'admin.index',
                component: () => import('pages/super-admin/Index.vue'),
            },
            {
                path: 'intents',
                name: 'admin.intents',
                component: () => import('pages/super-admin/intents/Index.vue'),
            },
            {
                path: 'speech-recognition',
                name: 'admin.speech-recognition',
                component: () => import('pages/super-admin/speech-recognition/Index.vue'),
            },
            {
                path: 'site-variables',
                name: 'admin.site-variables',
                component: () => import('pages/super-admin/site-variables/Index.vue'),
            },
            {
                path: 'subscribers',
                name: 'admin.subscribers',
                component: () => import('pages/super-admin/subscribers/Index.vue'),
            },
            {
                path: 'roles',
                name: 'admin.roles',
                component: () => import('pages/super-admin/role-permission/Roles.vue'),
            },
            {
                path: 'permissions',
                name: 'admin.permissions',
                component: () => import('pages/super-admin/role-permission/Permissions.vue'),
            },
            {
                path: 'packages',
                name: 'admin.packages',
                component: () => import('pages/super-admin/packages/Index.vue'),
            },
            {
                path: 'validity-periods',
                name: 'admin.validity-periods',
                component: () => import('pages/super-admin/validity-periods/Index.vue'),
            },
        ],
    },

    {
        path: '/auth',
        component: () => import('layouts/AuthLayout.vue'),
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('pages/subscriber/auth/Login.vue'),
            },
            {
                path: 'register',
                name: 'register',
                component: () => import('pages/subscriber/auth/Register.vue'),
            },
            {
                path: 'user-activate/:id?',
                name: 'user-activate',
                component: () => import('pages/subscriber/auth/UserActivate.vue'),
            },
            {
                path: 'reset-pass',
                name: 'reset-pass',
                component: () => import('pages/subscriber/auth/ResetPass.vue'),
            },
            {
                path: 'change-pass',
                name: 'change-pass',
                component: () => import('pages/subscriber/auth/ChangePass.vue'),
            },
        ],
    },

    {
        path: '/web-chat',
        component: () => import('layouts/WebChatLayout.vue'),
        children: [{ path: '', name: 'client-web-chat', component: () => import('pages/WebChat.vue') }],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/Error404.vue'),
    },
];

export default routes;
