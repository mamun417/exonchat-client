import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        meta: { requiresAuth: true },
        component: () => import("layouts/MainLayout.vue"),
        children: [
            { path: "", component: () => import("pages/Index.vue") },
            {
                path: "chats/:conv_id",
                name: "chats",
                component: () => import("pages/subscriber/Chat.vue"),
            },
            {
                path: "staffs",
                name: "staffs",
                component: () => import("pages/subscriber/staffs/Staff.vue"),
            },
            {
                path: "staffs/:staff_id",
                name: "staff_id",
                component: () => import("pages/subscriber/staffs/Staff.vue"),
            },
            {
                meta: { requiresRoleAdmin: true },
                path: "users",
                name: "users",
                component: () => import("pages/subscriber/agent/Index.vue"),
            },

            {
                path: "departments",
                name: "departments",
                component: () => import("pages/subscriber/departments/Index.vue"),
            },
            {
                path: "chat-templates",
                name: "chat-templates",
                component: () => import("pages/subscriber/chat-templates/Index.vue"),
            },
            {
                path: "speech-recognition",
                name: "speech-recognition",
                component: () => import("pages/subscriber/speech-recognition/Index.vue"),
            },
            {
                path: "intents",
                name: "intents",
                component: () => import("pages/subscriber/intents/Index.vue"),
            },
            {
                path: "uploads",
                name: "uploads",
                component: () => import("pages/subscriber/uploads/Index.vue"),
            },

            {
                path: "interaction",
                name: "chat-interaction",
                component: () => import("pages/subscriber/chat-interactions/Index.vue"),
            },

            {
                path: "chat-history",
                name: "chat-history",
                component: () => import("pages/subscriber/chat-history/Index.vue"),
            },

            {
                path: "offline-chat-request",
                name: "offline-chat-req",
                component: () => import("pages/subscriber/offline-chat-req/Index.vue"),
            },

            {
                path: "offline-chat-request/:id",
                name: "offline-chat-req.view",
                component: () => import("pages/subscriber/offline-chat-req/DetailsOfflineChatReq.vue"),
            },

            {
                path: "clients-conversations",
                name: "clients-conversations",
                component: () => import("pages/subscriber/client/clients-conversations/Index.vue"),
            },
            {
                path: "visitors",
                name: "visitors",
                component: () => import("pages/subscriber/client/visitors/Index.vue"),
            },

            {
                path: "apps/whmcs/tickets",
                name: "whmcs_tickets",
                component: () => import("pages/subscriber/apps/third-party/whmcs/Ticket.vue"),
            },

            {
                path: "settings",
                name: "settings",
                component: () => import("pages/subscriber/settings/Index.vue"),
                children: [
                    {
                        path: "ui",
                        name: "settings_ui",
                        component: () => import("pages/subscriber/settings/ui/Index.vue"),
                    },
                    {
                        path: "testing",
                        name: "settings_testing",
                        component: () => import("pages/subscriber/settings/testing/Index.vue"),
                    },
                ],
            },
            {
                path: "settings/profile",
                name: "settings_profile",
                component: () => import("pages/subscriber/settings/profile/Index.vue"),
            },
            {
                path: "settings/profile/new",
                name: "settings_profile.new",
                component: () => import("pages/subscriber/settings/profile/New.vue"),
            },
            {
                path: "settings/chat-routing",
                name: "settings_chat_routing",
                component: () => import("pages/subscriber/settings/chat-routing/Index.vue"),
            },
            {
                path: "settings/apps",
                name: "settings_apps",
                component: () => import("pages/subscriber/settings/apps/Index.vue"),
            },

            {
                path: "/access-denied",
                name: "access-denied",
                component: () => import("pages/Error403.vue"),
            },
        ],
    },

    {
        path: "/admin",
        component: () => import("layouts/AdminLayout.vue"),
        children: [
            {
                path: "",
                name: "admin.index",
                component: () => import("pages/super-admin/Index.vue"),
            },
            {
                path: "intents",
                name: "admin.intents",
                component: () => import("pages/super-admin/intents/Index.vue"),
            },
            {
                path: "speech-recognition",
                name: "admin.speech-recognition",
                component: () => import("pages/super-admin/speech-recognition/Index.vue"),
            },
            {
                path: "site-variables",
                name: "admin.site-variables",
                component: () => import("pages/super-admin/site-variables/Index.vue"),
            },
            {
                path: "subscribers",
                name: "admin.subscribers",
                component: () => import("pages/super-admin/subscribers/Index.vue"),
            },
            {
                path: "roles",
                name: "admin.roles",
                component: () => import("pages/super-admin/role-permission/Roles.vue"),
            },
            {
                path: "permissions",
                name: "admin.permissions",
                component: () => import("pages/super-admin/role-permission/Permissions.vue"),
            },
            {
                path: "packages",
                name: "admin.packages",
                component: () => import("pages/super-admin/packages/Index.vue"),
            },
            {
                path: "validity-periods",
                name: "admin.validity-periods",
                component: () => import("pages/super-admin/validity-periods/Index.vue"),
            },
        ],
    },

    {
        path: "/auth",
        meta: { requiresAuth: false, redirectAfterLoginPage: true },
        component: () => import("layouts/AuthLayout.vue"),
        children: [
            {
                path: "login",
                name: "login",
                component: () => import("pages/subscriber/auth/Login.vue"),
            },
            {
                path: "register",
                name: "register",
                component: () => import("pages/subscriber/auth/Register.vue"),
            },
            {
                path: "user-activate/:id?",
                name: "user-activate",
                component: () => import("pages/subscriber/auth/UserActivate.vue"),
            },
            {
                path: "password/reset",
                name: "password-email",
                component: () => import("pages/subscriber/auth/EmailPassword.vue"),
            },
            {
                path: "password/reset/:token",
                name: "password-reset",
                component: () => import("pages/subscriber/auth/ResetPassword.vue"),
            },
        ],
    },

    {
        path: "/web-chat",
        component: () => import("layouts/WebChatLayout.vue"),
        children: [{ path: "", name: "client-web-chat", component: () => import("pages/WebChat.vue") }],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        component: () => import("pages/Error404.vue"),
    },
];

export default routes;
