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
                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
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
                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
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
                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
                        <q-icon name="dns" size="xs"> </q-icon>
                    </q-item-section>
                    <q-item-section no-wrap>
                        <q-item-label class="text-weight-bold">User IP</q-item-label
                        ><q-item-label caption>{{ conversationWithUsersInfo[0].socket_session.init_ip }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item class="tw-text-xs tw-w-full" dense>
                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
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
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-xs`"
                    class="tw-pt-2"
                >
                    <q-card
                        ><q-card-section class="tw-p-0">
                            <q-list v-if="visits.length" ref="page_visit_list" class="tw-break-all">
                                <q-item v-for="(visit, key) of visits" :key="key" dense class="tw-text-xs">
                                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
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
                            >
                            <div v-else class="text-center tw-text-xs tw-py-2">No visit info</div></q-card-section
                        ></q-card
                    >
                </q-expansion-item>

                <q-expansion-item
                    icon="question_answer"
                    label="Previous Chats"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-xs`"
                >
                    <q-card
                        ><q-card-section class="tw-p-0">
                            <q-list v-if="clientPreviousChats.length" class="tw-break-all">
                                <q-item v-for="(conv, key) of clientPreviousChats" :key="key" dense class="tw-text-xs">
                                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
                                        <q-icon name="chat_bubble_outline" size="xs"> </q-icon>
                                    </q-item-section>
                                    <q-item-section
                                        ><q-item-label>{{ conv.messages[0].msg }}</q-item-label
                                        ><q-item-label caption>{{
                                            $helpers.myDate(conv.created_at)
                                        }}</q-item-label></q-item-section
                                    ></q-item
                                >
                            </q-list>

                            <div v-else class="text-center">No previous chats</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    icon="confirmation_number"
                    label="Tickets"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-xs`"
                >
                    <q-card
                        ><q-card-section class="tw-p-0">
                            <q-list v-if="clientTickets.length" class="tw-break-all">
                                <q-item v-for="(ticket, key) of clientTickets" :key="key" dense class="tw-text-xs">
                                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
                                        <q-icon name="confirmation_number" size="xs"> </q-icon>
                                    </q-item-section>
                                    <q-item-section
                                        ><q-item-label>{{ ticket.subject }}</q-item-label
                                        ><q-item-label caption
                                            ><div class="tw-flex tw-justify-between tw-items-center">
                                                <div class="tw-mr-2">{{ $helpers.myDate(ticket.date) }}</div>
                                                <q-badge :color="ticket.status === 'Answered' ? 'green' : 'orange'">
                                                    {{ ticket.status }}
                                                </q-badge>
                                            </div></q-item-label
                                        ></q-item-section
                                    ></q-item
                                >
                            </q-list>

                            <div v-else class="text-center">No tickets found</div>
                        </q-card-section>
                    </q-card>
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

            clientPreviousChats: [],
            clientTickets: [],
        };
    },

    computed: {
        ...mapGetters({
            rightBarState: 'setting_ui/rightBarState',
            conversationInfo: 'chat/conversationInfo',
            profile: 'auth/profile',
            globalBgColor: 'setting_ui/globalBgColor',
            globalColor: 'setting_ui/globalColor',
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
                this.profile?.socket_session?.id
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

            // console.log(uaString, UAParser(uaString));

            return UAParser(uaString);
        },
    },

    mounted() {
        console.log('right bar initiated');

        setInterval(() => {
            if (
                this.$route.name === 'chats' &&
                this.rightBarState.mode === 'client_info' &&
                this.conversationWithUsersInfo?.length
            ) {
                this.$refs.page_visit_list?.$forceUpdate();
            }
        }, 10000);

        if (
            this.$route.name === 'chats' &&
            this.rightBarState.mode === 'client_info' &&
            this.conversationWithUsersInfo?.length
        ) {
        }
    },

    methods: {},

    watch: {
        conversationWithUsersInfo: {
            handler: function (newVal, oldVal) {
                console.log(newVal, oldVal);

                if (newVal?.length && (!oldVal?.length || newVal[0].conversation_id !== oldVal[0].conversation_id)) {
                    window.api
                        .get(
                            `/conversations/client-previous-conversations?email=${this.conversationWithUsersInfo[0].socket_session.init_email}`
                        )
                        .then((res: any) => {
                            // console.log(res.data);
                            this.clientPreviousChats = res.data.filter((conv: any) => {
                                return conv.id !== newVal[0].conversation_id;
                            });
                        })
                        .catch((e: any) => {
                            e;
                        });

                    window.api
                        .get(`/apps/whmcs/tickets?email=${this.conversationWithUsersInfo[0].socket_session.init_email}`)
                        .then((res: any) => {
                            // console.log(res.data);
                            this.clientTickets = res.data.tickets?.ticket || [];
                        })
                        .catch((e: any) => {
                            e;
                        });
                }
            },
            immediate: true,
        },
    },
});
</script>
