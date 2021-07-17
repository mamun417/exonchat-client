<template>
    <div>
        <q-card class="tw-mt-4 tw-mb-10 tw-p-6 tw-shadow-lg">
            <div class="tw-font-bold tw-text-lg">ORGANIZATIONS & ACCOUNT</div>
            <div class="tw-my-4 text-grey-7">
                <q-btn @click="$router.push({ name: 'users' })" flat stack no-caps>
                    <q-icon name="people_outline" size="80px"></q-icon>
                    <div>Users</div>
                </q-btn>
                <q-btn @click="$router.push({ name: 'settings_apps' })" flat stack no-caps>
                    <q-icon name="integration_instructions" size="80px"></q-icon>
                    <div>App Integrations</div>
                </q-btn>
                <q-btn flat stack no-caps :to="{ name: 'settings_profile' }">
                    <q-icon name="contact_mail" size="80px"></q-icon>
                    <div>Profile</div>
                </q-btn>
            </div>
        </q-card>

        <q-card class="tw-mt-4 tw-mb-8 tw-p-6 tw-shadow-lg">
            <div class="tw-font-bold tw-text-lg">CHAT SETTINGS</div>
            <div class="tw-my-4 text-grey-7">
                <q-btn flat stack no-caps>
                    <q-icon name="widgets" size="80px"></q-icon>
                    <div>Widget</div>
                </q-btn>
                <q-btn @click="$router.push({ name: 'departments' })" flat stack no-caps>
                    <q-icon name="schema" size="80px"></q-icon>
                    <div>Chat Department</div>
                </q-btn>
                <q-btn @click="$router.push({ name: 'chat-templates' })" flat stack no-caps>
                    <q-icon name="settings_input_component" size="80px"></q-icon>
                    <div>Predefined Chat Replies</div>
                </q-btn>
                <q-btn @click="$router.push({ name: 'settings_chat_routing' })" flat stack no-caps>
                    <q-icon name="alt_route" size="80px"></q-icon>
                    <div>Chat Routing</div>
                </q-btn>
            </div>
        </q-card>

        <!--            <q-separator />-->
        <!--            <q-tabs align="left" class="shadow-2 tw-font-medium" :indicator-color="globalColor" no-caps>-->
        <!--                <q-icon name="settings" class="tw-px-6" size="20px" :color="globalColor" />-->
        <!--                <q-route-tab to="/settings/profile" exact>Profile</q-route-tab>-->
        <!--                <q-route-tab to="/settings/change-password" exact>Change Password</q-route-tab>-->
        <!--                <q-route-tab to="/settings/ui" exact>UI</q-route-tab>-->
        <!--                <q-route-tab to="/settings/chat" exact>Chat</q-route-tab>-->
        <!--                <q-route-tab to="/settings/apps" exact>Apps</q-route-tab>-->
        <!--                <q-route-tab to="/settings/testing" exact>Testing</q-route-tab>-->
        <!--                <q-route-tab>Others</q-route-tab>-->
        <!--            </q-tabs>-->
        <div class="tw-mt-6">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
    data(): any {
        return {
            existingAvatarUrl: '',
            updateAvatarModal: false,
            previewAvatar: '',
            avatar: '',
        };
    },

    computed: {
        ...mapGetters({
            profile: 'auth/profile',
            globalTextColor: 'setting_ui/globalTextColor',
            globalColor: 'setting_ui/globalColor',
        }),
    },

    mounted() {
        //
    },

    methods: {},
});
</script>
