<template>
    <div class="tw-h-full tw-flex tw-flex-col">
        <template v-if="rightBarState.mode === 'conversation'">
            <messages-top-section :conv_id="rightBarState.conv_id" :mini_mode="true" />
            <message :ses_id="profile.socket_session.id" :conv_id="rightBarState.conv_id" :mini_mode="true"></message>
        </template>

        <q-scroll-area
            v-else-if="rightBarState.mode === 'client_info'"
            class="fit"
            :bar-style="{
                background: '#60A5FA',
                width: '4px',
                opacity: 0.2,
                borderRadius: '10px',
            }"
            :thumb-style="{
                borderRadius: '9px',
                backgroundColor: '#60A5FA',
                width: '4px',
                opacity: 0.5,
            }"
        >
            <!-- at first conversationWithUsersInfo can be empty. show loader -->
            <q-list v-if="conversationWithUsersInfo.length" class="tw-px-1 tw-my-3">
                <q-item class="">
                    <q-item-section avatar>
                        <ec-avatar
                            :size="mini_mode ? 'md' : 'xl'"
                            :image_src="null"
                            :name="conversationWithUsersInfo[0].socket_session.init_name"
                        ></ec-avatar>
                    </q-item-section>

                    <q-item-section class="tw-w-full">
                        <q-item-label class="text-weight-bold tw-text-lg">
                            {{ $_.upperFirst(conversationWithUsersInfo[0].socket_session.init_name) }}
                        </q-item-label>
                        <q-item-label caption>{{
                            conversationWithUsersInfo[0].socket_session.init_email
                        }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item class="tw-text-xs tw-w-full" dense>
                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                        <q-icon name="language" size="xs"> </q-icon>
                    </q-item-section>
                    <q-item-section no-wrap>
                        <q-item-label class="text-weight-bold">Browser</q-item-label
                        ><q-item-label caption
                            >{{ parsedUaString.browser.name }} {{ parsedUaString.browser.version }}</q-item-label
                        >
                    </q-item-section>
                </q-item>
                <q-item class="tw-text-xs tw-w-full" dense>
                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                        <q-icon name="devices" size="xs"> </q-icon>
                    </q-item-section>
                    <q-item-section no-wrap>
                        <q-item-label class="text-weight-bold">Operating System</q-item-label
                        ><q-item-label caption>
                            {{ parsedUaString.os.name }} {{ parsedUaString.os.version }}
                        </q-item-label>
                    </q-item-section>
                </q-item>
                <q-item class="tw-text-xs tw-w-full" dense>
                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                        <q-icon name="dns" size="xs"> </q-icon>
                    </q-item-section>
                    <q-item-section no-wrap>
                        <q-item-label class="text-weight-bold">User IP</q-item-label
                        ><q-item-label caption>{{ conversationWithUsersInfo[0].socket_session.init_ip }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item class="tw-text-xs tw-w-full" dense>
                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                        <q-icon name="schedule" size="xs"> </q-icon>
                    </q-item-section>
                    <q-item-section no-wrap>
                        <q-item-label class="text-weight-bold">Initiated At</q-item-label
                        ><q-item-label caption>{{
                            $helpers.myDate(conversationWithUsersInfo[0].created_at, 'MMMM Do YYYY HH:MM')
                        }}</q-item-label>
                    </q-item-section>
                </q-item>

                <q-expansion-item
                    icon="web"
                    label="User Visiting"
                    dense
                    default-opened
                    header-class="text-weight-bold bg-green-1"
                    class="tw-py-2"
                >
                    <q-card
                        ><q-card-section class="tw-p-0">
                            <q-list ref="page_visit_list" class="tw-break-all">
                                <q-item v-for="(visit, key) of visits" :key="key" dense class="tw-text-xs">
                                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                                        <q-icon :name="visit.visiting ? 'visibility' : 'wysiwyg'" size="xs"> </q-icon>
                                    </q-item-section>
                                    <q-item-section
                                        ><q-item-label>{{ visit.url }}</q-item-label
                                        ><q-item-label caption>{{
                                            visit.visiting
                                                ? $helpers.diffAsMinute(visit.first_visit_time)
                                                : $helpers.fromNowTime(visit.last_stay_time)
                                        }}</q-item-label></q-item-section
                                    ></q-item
                                ></q-list
                            ></q-card-section
                        ></q-card
                    >
                </q-expansion-item>
            </q-list>
        </q-scroll-area>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import Message from 'components/common/Message.vue';
import MessagesTopSection from 'components/subscriber/chat/MessagesTopSection.vue';
import EcAvatar from 'src/components/common/EcAvatar.vue';

import UAParser from 'ua-parser-js';

export default defineComponent({
    name: 'RightBar',
    components: { MessagesTopSection, Message, EcAvatar },
    setup() {
        return {};
    },
    data(): any {
        return {
            sesId: '',
            confirm: false,
        };
    },

    computed: {
        ...mapGetters({
            rightBarState: 'setting_ui/rightBarState',
            conversationInfo: 'chat/conversationInfo',
            profile: 'auth/profile',
        }),

        fullChatConvId(): any {
            if (this.$route.name === 'chats' && this.rightBarState.mode === 'client_info') {
                return this.$route.params['conv_id'];
            }

            return null;
        },

        conversationWithUsersInfo(): any {
            if (!(this.$route.name === 'chats' && this.rightBarState.mode === 'client_info')) return [];

            return this.$store.getters['chat/conversationWithUsersInfo'](
                this.fullChatConvId,
                this.profile.socket_session.id
            );
        },

        visits(): any {
            if (!(this.$route.name === 'chats' && this.rightBarState.mode === 'client_info')) return [];

            return this.$store.getters['visitor/visits'](this.conversationWithUsersInfo[0].socket_session.id);
        },

        parsedUaString(): any {
            const uaString: any = this.conversationWithUsersInfo.length
                ? this.conversationWithUsersInfo[0].socket_session.init_user_agent
                : '';

            console.log(uaString, UAParser(uaString));

            return UAParser(uaString);
        },
    },

    mounted() {
        console.log('right bar initiated');

        setInterval(() => {
            if (
                this.$route.name === 'chats' &&
                this.rightBarState.mode === 'client_info' &&
                this.conversationWithUsersInfo.length
            ) {
                this.$refs.page_visit_list.$forceUpdate();
            }
        }, 10000);
    },

    methods: {},
});
</script>
