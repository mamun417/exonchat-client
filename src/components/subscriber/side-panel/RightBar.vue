<template>
    <div class="tw-h-full tw-flex tw-flex-col tw-relative">
        <slot name="extra"></slot>

        <template v-if="rightBarState.mode === 'conversation'">
            <div class="tw-mb-3">
                <messages-top-section
                    :conv_id="rightBarState.conv_id"
                    :mini_mode="true"
                    :class="{ 'tw-mb-3': conversationInfo.users_only }"
                />

                <template v-if="!conversationInfo.users_only && conversationWithUsersInfo.length">
                    <q-card class="tw-shadow-md">
                        <q-separator />
                        <q-card-section class="tw-px-0 tw-py-2">
                            <q-list :class="$helpers.colors().defaultText" class="tw-text-xs">
                                <q-item dense>
                                    <q-item-section class="tw-min-w-0 tw-w-6 tw-pr-0" avatar>
                                        <q-icon name="flag" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>Country</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label>Not Available</q-item-label>
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
                                        <q-item-label>
                                            {{ parsedUaString.browser.name }}
                                            {{ parsedUaString.browser.version }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item dense>
                                    <q-item-section class="tw-min-w-0 tw-w-6 tw-pr-0" avatar>
                                        <q-icon name="devices" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>OS</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label>
                                            {{ parsedUaString.os.name }} {{ parsedUaString.os.version }}
                                        </q-item-label>
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
                                        <q-item-label>
                                            {{ conversationWithUsersInfo[0].socket_session.init_ip }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-if="!conversationShowDetail" class="tw-px-2">
                                <q-btn
                                    @click="conversationShowDetail = !conversationShowDetail"
                                    :color="globalColor"
                                    :label="`${conversationShowDetail ? 'Hide' : 'Show'} Detail`"
                                    class="tw-w-full"
                                    size="sm"
                                    no-caps
                                    flat
                                />
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-separator v-show="conversationShowDetail" />

                    <q-card v-show="conversationShowDetail" class="tw-shadow-md tw-mb-3">
                        <q-card-section class="tw-px-0 tw-py-2">
                            <q-list :class="$helpers.colors().defaultText" class="tw-text-xs">
                                <q-item dense>
                                    <q-item-section>
                                        <q-item-label>Agents</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <connected-users-faces :users_conv_ses="conversationConnectedUsers" size="md" />
                                    </q-item-section>
                                </q-item>
                                <q-item dense>
                                    <q-item-section>
                                        <q-item-label>Department</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label class="text-capitalize"
                                            >{{ conversationInfo.chat_department.tag }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item dense>
                                    <q-item-section>
                                        <q-item-label>Chat Start</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label>
                                            {{ $helpers.myDate(conversationInfo.created_at, "MMMM Do YYYY, h:mm a") }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item dense>
                                    <q-item-section>
                                        <q-item-label>Chat Duration</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label ref="chat_duration">
                                            <template v-if="!conversationInfo.closed_at"
                                                >{{ $helpers.preciseDiff(conversationInfo.created_at) }}
                                            </template>
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
                                        <q-item-label>
                                            <template v-if="conversationInfo.rating">
                                                <span
                                                    :class="conversationInfo.rating.rating === 5 ? 'green' : 'orange'"
                                                    >{{ conversationInfo.rating.rating === 5 ? "Good" : "Bad" }}</span
                                                >
                                            </template>
                                            <template v-else>Not Rated</template>
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-if="conversationShowDetail" class="tw-px-2">
                                <q-btn
                                    @click="conversationShowDetail = !conversationShowDetail"
                                    :color="globalColor"
                                    :label="`${conversationShowDetail ? 'Hide' : 'Show'} Detail`"
                                    class="tw-w-full"
                                    size="sm"
                                    no-caps
                                    flat
                                />
                            </div>
                        </q-card-section>
                    </q-card>
                </template>
            </div>

            <message :ses_id="profile.socket_session.id" :conv_id="rightBarState.conv_id" :mini_mode="true"></message>
        </template>

        <q-scroll-area
            v-else-if="rightBarState.mode === 'client_info' && !conversationInfo.users_only"
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
            <q-list
                v-if="conversationWithUsersInfo.length && !conversationInfo.users_only"
                class="tw-pl-1 tw-pr-2 tw-py-3"
                :class="$helpers.colors().defaultText"
            >
                <q-expansion-item
                    label="CUSTOMER"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow-lg"
                    expand-icon-class="hidden"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-2">
                            <q-list :class="$helpers.colors().defaultText" class="tw-text-xs">
                                <q-item dense>
                                    <q-item-section class="tw-w-full">
                                        <div class="tw-flex tw-justify-between tw-items-center tw-w-full tw-my-1">
                                            <ec-avatar
                                                size="xl"
                                                :image_src="null"
                                                :name="conversationWithUsersInfo[0].socket_session.init_name"
                                            ></ec-avatar>
                                            <div class="tw-flex tw-flex-col tw-justify-center">
                                                <q-item-label class="text-weight-bold text-right tw-text-sm">
                                                    {{
                                                        $_.upperFirst(
                                                            conversationWithUsersInfo[0].socket_session.init_name
                                                        )
                                                    }}
                                                </q-item-label>
                                                <q-item-label class="text-right text-blue-7" caption
                                                    >{{ conversationWithUsersInfo[0].socket_session.init_email }}
                                                </q-item-label>
                                                <q-item-label class="text-right" ref="connectedForTimer" caption
                                                    >Connectd for
                                                    <b>{{
                                                        $helpers.preciseDiff(
                                                            conversationWithUsersInfo[0].socket_session.created_at,
                                                            conversationInfo.closed_at
                                                        )
                                                    }}</b>
                                                </q-item-label>
                                            </div>
                                        </div>
                                    </q-item-section>
                                </q-item>
                                <q-item class="tw-flex" dense>
                                    <div class="tw-flex tw-gap-1 tw-items-center">
                                        <q-icon name="flag" size="xs"></q-icon>
                                        <div>Not Available</div>
                                    </div>
                                    <q-space />
                                    <div class="tw-flex tw-gap-1 tw-items-center">
                                        <q-icon name="language" size="xs"></q-icon>
                                        <div>
                                            {{ parsedUaString.browser.name }} {{ parsedUaString.browser.version }}
                                        </div>
                                    </div>
                                </q-item>
                                <q-item class="tw-flex" dense>
                                    <div class="tw-flex tw-gap-1 tw-items-center">
                                        <q-icon name="devices" size="xs"></q-icon>
                                        <div>{{ parsedUaString.os.name }} {{ parsedUaString.os.version }}</div>
                                    </div>
                                    <q-space />
                                    <div class="tw-flex tw-gap-1 tw-items-center">
                                        <q-icon name="dns" size="xs"></q-icon>
                                        <div>
                                            {{ conversationWithUsersInfo[0].socket_session.init_ip }}
                                        </div>
                                    </div>
                                </q-item>

                                <q-item dense>
                                    <q-item-section>
                                        <q-item-label>Department</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label class="text-capitalize"
                                            >{{ conversationInfo.chat_department.tag }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item dense>
                                    <q-item-section>
                                        <q-item-label>Chat Start</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label>
                                            {{ $helpers.myDate(conversationInfo.created_at, "MMMM Do YYYY, h:mm a") }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    label="CUSTOMER PAGE VISITS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow-lg"
                    expand-icon-class="hidden"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-2">
                            <q-list v-if="visits.length" ref="page_visit_list" class="tw-break-all">
                                <q-item v-for="(visit, key) of visits" :key="key" dense class="tw-text-xs">
                                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
                                        <q-icon :name="visit.visiting ? 'visibility' : 'wysiwyg'" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ visit.url }}</q-item-label>
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
                            <div v-else class="text-center tw-py-2 text-grey-7">No visit info</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    label="PREVIOUS CHATS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow-lg"
                    expand-icon-class="hidden"
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
                                        <q-item-label>{{ conv.messages[0].msg }}</q-item-label>
                                        <q-item-label caption>{{ $helpers.myDate(conv.created_at) }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="text-center tw-py-2 text-grey-7">No previous chats</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    label="TICKETS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow-lg"
                    expand-icon-class="hidden"
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
                                        <q-item-label>{{ ticket.subject }}</q-item-label>
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

                            <div v-else class="text-center tw-py-2 text-grey-7">No tickets found</div>
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
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import Message from "components/common/Message.vue";
import MessagesTopSection from "components/subscriber/chat/MessagesTopSection.vue";
import EcAvatar from "src/components/common/EcAvatar.vue";

import UAParser from "ua-parser-js";
import TicketDetail from "components/apps/whmcs/TicketDetail.vue";
import ConnectedUsersFaces from "components/subscriber/chat/ConnectedUsersFaces.vue";

export default defineComponent({
    name: "RightBar",
    components: { ConnectedUsersFaces, TicketDetail, MessagesTopSection, Message, EcAvatar },
    setup() {
        return {};
    },
    data(): any {
        return {
            sesId: "",
            confirm: false,

            clientPreviousChats: [],
            clientTickets: [],

            ticketSelected: null,
            ticketDetailModal: false,

            chatDuration: "",

            conversationShowDetail: false,
        };
    },

    computed: {
        ...mapGetters({
            rightBarState: "setting_ui/rightBarState",
            profile: "auth/profile",
            globalBgColor: "setting_ui/globalBgColor",
            globalColor: "setting_ui/globalColor",
        }),

        conversationInfo(): any {
            return this.$store.getters["chat/conversationInfo"](this.fullChatConvId);
        },

        conversationConnectedUsers(): any {
            return this.$store.getters["chat/conversationConnectedUsers"](this.fullChatConvId);
        },

        fullChatConvId(): any {
            if (this.$route.name === "chats" && this.rightBarState.mode === "client_info") {
                return this.$route.params["conv_id"];
            }

            return this.rightBarState?.conv_id || null;
        },

        conversationWithUsersInfo(): any {
            // if (!(this.$route.name === 'chats' && this.rightBarState.mode === 'client_info')) return [];

            return this.$store.getters["chat/conversationWithUsersInfo"](
                this.fullChatConvId,
                this.profile?.socket_session?.id
            );
        },

        visits(): any {
            if (!(this.$route.name === "chats" && this.rightBarState.mode === "client_info")) return [];

            return this.$store.getters["visitor/visits"](this.conversationWithUsersInfo[0].socket_session.id);
        },

        parsedUaString(): any {
            const uaString: any = this.conversationWithUsersInfo.length
                ? this.conversationWithUsersInfo[0].socket_session.init_user_agent
                : "";

            // console.log(uaString, UAParser(uaString));

            return UAParser(uaString);
        },
    },

    mounted() {
        console.log("right bar initiated");

        setInterval(() => {
            if (
                this.$route.name === "chats" &&
                this.rightBarState.mode === "client_info" &&
                this.conversationWithUsersInfo?.length
            ) {
                this.$refs.page_visit_list?.$forceUpdate();
                this.$refs.chat_duration?.$forceUpdate();
                this.$refs.connectedForTimer?.$forceUpdate();
            }
        }, 10000);

        if (
            this.$route.name === "chats" &&
            this.rightBarState.mode === "client_info" &&
            this.conversationWithUsersInfo?.length
        ) {
        }
    },

    watch: {
        conversationWithUsersInfo: {
            handler: function (newVal, oldVal) {
                console.log(newVal, oldVal);

                if (
                    !this.conversationInfo.users_only &&
                    newVal?.length &&
                    (!oldVal?.length || newVal[0].conversation_id !== oldVal[0].conversation_id)
                ) {
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
