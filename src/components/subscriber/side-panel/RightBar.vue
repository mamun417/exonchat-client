<template>
    <div class="tw-h-full tw-flex tw-flex-col tw-relative">
        <slot name="extra"></slot>

        <template v-if="rightBarState.mode === 'conversation'">
            <messages-top-section
                :conv_id="rightBarState.conv_id"
                :mini_mode="true"
                :class="{ 'tw-mb-3': conversationInfo.users_only }"
            />

            <q-card
                v-if="!conversationInfo.users_only && conversationWithUsersInfo.length"
                class="tw-shadow-md tw-mb-3"
            >
                <q-separator />
                <q-card-section class="tw-px-0 tw-py-2">
                    <q-list>
                        <q-item dense>
                            <q-item-section class="tw-min-w-0 tw-w-6 tw-pr-0" avatar>
                                <q-icon name="flag" size="xs"></q-icon>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>Country</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label class="text-grey-10 tw-font-medium">Not Available</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item dense>
                            <q-item-section class="tw-min-w-0 tw-w-6 tw-pr-0" avatar>
                                <q-icon name="language" size="xs"></q-icon>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>Browser</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label class="text-grey-10 tw-font-medium"
                                    >{{ parsedUaString.browser.name }}
                                    {{ parsedUaString.browser.version }}</q-item-label
                                >
                            </q-item-section>
                        </q-item>
                        <q-item dense
                            ><q-item-section class="tw-min-w-0 tw-w-6 tw-pr-0" avatar>
                                <q-icon name="devices" size="xs"></q-icon>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>OS</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label class="text-grey-10 tw-font-medium"
                                    >{{ parsedUaString.os.name }} {{ parsedUaString.os.version }}</q-item-label
                                >
                            </q-item-section>
                        </q-item>
                        <q-item dense>
                            <q-item-section class="tw-min-w-0 tw-w-6 tw-pr-0" avatar>
                                <q-icon name="dns" size="xs"></q-icon>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>IP</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-item-label class="text-grey-10 tw-font-medium">{{
                                    conversationWithUsersInfo[0].socket_session.init_ip
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>

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
            <q-list v-if="conversationWithUsersInfo.length" class="tw-pl-1 tw-pr-2 tw-py-3">
                <q-expansion-item
                    label="CUSTOMER INFORMATION"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-2 tw-text-xs tw-rounded-t`"
                    class="tw-shadow-lg"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-2">
                            <q-list>
                                <q-item dense>
                                    <q-item-section class="tw-w-full">
                                        <div class="tw-flex tw-justify-between tw-w-full tw-my-1">
                                            <ec-avatar
                                                :size="mini_mode ? 'md' : 'xl'"
                                                :image_src="null"
                                                :name="conversationWithUsersInfo[0].socket_session.init_name"
                                            ></ec-avatar>
                                            <div class="tw-flex tw-flex-col tw-justify-center">
                                                <q-item-label class="text-weight-bold text-right tw-text-lg">
                                                    {{
                                                        $_.upperFirst(
                                                            conversationWithUsersInfo[0].socket_session.init_name
                                                        )
                                                    }}
                                                </q-item-label>
                                                <q-item-label class="text-grey-10 text-right" caption
                                                    >{{ conversationWithUsersInfo[0].socket_session.init_email }}
                                                </q-item-label>
                                            </div>
                                        </div>
                                    </q-item-section>
                                </q-item>
                                <q-item dense>
                                    <q-item-section class="tw-min-w-0 tw-w-6 tw-pr-0" avatar>
                                        <q-icon name="flag" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>Country</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label class="text-grey-10 tw-font-medium">Not Available</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item dense>
                                    <q-item-section class="tw-min-w-0 tw-w-6 tw-pr-0" avatar>
                                        <q-icon name="language" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>Browser</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label class="text-grey-10 tw-font-medium"
                                            >{{ parsedUaString.browser.name }}
                                            {{ parsedUaString.browser.version }}</q-item-label
                                        >
                                    </q-item-section>
                                </q-item>
                                <q-item dense
                                    ><q-item-section class="tw-min-w-0 tw-w-6 tw-pr-0" avatar>
                                        <q-icon name="devices" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>OS</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label class="text-grey-10 tw-font-medium"
                                            >{{ parsedUaString.os.name }} {{ parsedUaString.os.version }}</q-item-label
                                        >
                                    </q-item-section>
                                </q-item>
                                <q-item dense>
                                    <q-item-section class="tw-min-w-0 tw-w-6 tw-pr-0" avatar>
                                        <q-icon name="dns" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>IP</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label class="text-grey-10 tw-font-medium">{{
                                            conversationWithUsersInfo[0].socket_session.init_ip
                                        }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    label="CHAT INFORMATION"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-2 tw-text-xs tw-rounded-t`"
                    class="tw-shadow-lg"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-2">
                            <q-list>
                                <q-item dense>
                                    <q-item-section>
                                        <q-item-label>Department</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label class="text-grey-10 tw-font-medium text-capitalize">{{
                                            conversationInfo.chat_department.tag
                                        }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item dense>
                                    <q-item-section>
                                        <q-item-label>Chat Start</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label class="text-grey-10 tw-font-medium">{{
                                            $helpers.myDate(conversationInfo.created_at, 'MMMM Do YYYY, h:mm a')
                                        }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item dense>
                                    <q-item-section>
                                        <q-item-label>Chat Duration</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label ref="chat_duration" class="text-grey-10 tw-font-medium">
                                            <template v-if="!conversationInfo.closed_at">{{
                                                $helpers.preciseDiff(conversationInfo.created_at)
                                            }}</template>
                                            <template v-else>
                                                {{
                                                    $helpers.preciseDiff(
                                                        conversationInfo.created_at,
                                                        conversationInfo.closed_at
                                                    )
                                                }}
                                            </template>
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item dense>
                                    <q-item-section>
                                        <q-item-label>Chat Rating</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label class="text-grey-10 tw-font-medium">
                                            <template v-if="conversationInfo.rating">
                                                <span
                                                    :class="conversationInfo.rating.rating === 5 ? 'green' : 'orange'"
                                                    >{{ conversationInfo.rating.rating === 5 ? 'Good' : 'Bad' }}</span
                                                >
                                            </template>
                                            <template v-else>Not Rated</template>
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    label="AGENTS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-2 tw-text-xs tw-rounded-t`"
                    class="tw-shadow-lg"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-2">
                            <q-list>
                                <q-item v-for="agent of conversationConnectedUsers" :key="agent.id" dense>
                                    <q-item-section class="tw-w-full">
                                        <div class="tw-flex tw-w-full tw-my-1 tw-gap-4">
                                            <ec-avatar
                                                :size="mini_mode ? 'md' : 'xl'"
                                                :image_src="null"
                                                :name="agent.socket_session.user.user_meta.display_name"
                                            ></ec-avatar>
                                            <div class="tw-flex tw-flex-col tw-justify-center">
                                                <q-item-label class="text-weight-bold tw-text-lg">
                                                    {{
                                                        $_.upperFirst(agent.socket_session.user.user_meta.display_name)
                                                    }}
                                                </q-item-label>
                                                <q-item-label class="text-grey-10" caption
                                                    >{{ agent.socket_session.user.email }}
                                                </q-item-label>
                                            </div>
                                        </div>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    label="CUSTOMER PAGE VISITS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-2 tw-text-xs tw-rounded-t`"
                    class="tw-shadow-lg"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-2">
                            <q-list v-if="visits.length" ref="page_visit_list" class="tw-break-all tw-mb-3">
                                <q-item v-for="(visit, key) of visits" :key="key" dense class="tw-text-xs">
                                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
                                        <q-icon :name="visit.visiting ? 'visibility' : 'wysiwyg'" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ visit.url }} </q-item-label>
                                        <q-item-label caption
                                            >{{
                                                visit.visiting
                                                    ? $helpers.diffAsMinute(visit.first_visit_time)
                                                    : $helpers.fromNowTime(visit.last_stay_time)
                                            }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                            <div v-else class="text-center tw-py-2">No visit info</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    label="PREVIOUS CHATS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-2 tw-text-xs tw-rounded-t`"
                    class="tw-shadow-lg"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-2">
                            <q-list v-if="clientPreviousChats.length" class="tw-break-all">
                                <q-item
                                    v-for="(conv, key) of clientPreviousChats"
                                    :key="key"
                                    clickable
                                    dense
                                    class="tw-text-xs"
                                >
                                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
                                        <q-icon name="chat_bubble_outline" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ conv.messages[0].msg }} </q-item-label>
                                        <q-item-label caption>{{ $helpers.myDate(conv.created_at) }} </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="text-center tw-py-2">No previous chats</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    label="TICKETS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-2 tw-text-xs tw-rounded-t`"
                    class="tw-shadow-lg"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-2">
                            <q-list v-if="clientTickets.length" class="tw-break-all">
                                <q-item
                                    v-for="(ticket, key) of clientTickets"
                                    :key="key"
                                    class="tw-text-xs"
                                    @click="
                                        ticketSelected = ticket;
                                        ticketDetailModal = true;
                                    "
                                    dense
                                    clickable
                                >
                                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
                                        <q-icon name="confirmation_number" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ ticket.subject }} </q-item-label>
                                        <q-item-label caption>
                                            <div class="tw-flex tw-justify-between tw-items-center">
                                                <div class="tw-mr-2">{{ $helpers.myDate(ticket.date) }}</div>
                                                <q-badge
                                                    :color="ticket.status === 'Answered' ? 'green' : 'orange'"
                                                    class="tw-text-xxs"
                                                >
                                                    {{ ticket.status }}
                                                </q-badge>
                                            </div>
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="text-center tw-py-2">No tickets found</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <!--its a modal-->
                <ticket-detail
                    :ticket="ticketSelected"
                    :modal_show="ticketDetailModal"
                    @modalUpdate="ticketDetailModal = $event"
                />
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
import TicketDetail from 'components/apps/whmcs/TicketDetail.vue';

export default defineComponent({
    name: 'RightBar',
    components: { TicketDetail, MessagesTopSection, Message, EcAvatar },
    setup() {
        return {};
    },
    data(): any {
        return {
            sesId: '',
            confirm: false,

            clientPreviousChats: [],
            clientTickets: [],

            ticketSelected: null,
            ticketDetailModal: false,

            chatDuration: '',
        };
    },

    computed: {
        ...mapGetters({
            rightBarState: 'setting_ui/rightBarState',
            profile: 'auth/profile',
            globalBgColor: 'setting_ui/globalBgColor',
            globalColor: 'setting_ui/globalColor',
        }),

        conversationInfo(): any {
            return this.$store.getters['chat/conversationInfo'](this.fullChatConvId);
        },

        conversationConnectedUsers(): any {
            return this.$store.getters['chat/conversationConnectedUsers'](this.fullChatConvId);
        },

        fullChatConvId(): any {
            if (this.$route.name === 'chats' && this.rightBarState.mode === 'client_info') {
                return this.$route.params['conv_id'];
            }

            return this.rightBarState?.conv_id || null;
        },

        conversationWithUsersInfo(): any {
            // if (!(this.$route.name === 'chats' && this.rightBarState.mode === 'client_info')) return [];

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
                this.$refs.chat_duration?.$forceUpdate();
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
