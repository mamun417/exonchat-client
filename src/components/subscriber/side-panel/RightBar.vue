<template>
    <div class="tw-h-full tw-flex tw-flex-col tw-relative">
        <slot name="extra"></slot>

        <!--right bar mini mode-->
        <template v-if="rightBarState.mode === 'conversation'">
            <message :ses_id="profile.socket_session.id" :conv_id="rightBarState.conv_id" :mini_mode="true">
                <template v-slot:scroll-area-top-section>
                    <div class="tw-mb-3">
                        <messages-top-section
                            v-if="conversationInfo.users_only"
                            :conv_id="rightBarState.conv_id"
                            :mini_mode="true"
                            :class="{ 'tw-mb-3': conversationInfo.users_only }"
                        />

                        <template v-if="!conversationInfo.users_only && conversationWithUsersInfo.length">
                            <q-list
                                v-if="conversationWithUsersInfo.length && !conversationInfo.users_only"
                                class="tw-px-1 tw-py-3 tw-pt-0"
                                :class="$helpers.colors().defaultText"
                            >
                                <q-card class="tw-shadow-none tw-mb-3 no-border-radius">
                                    <q-card-section
                                        class="tw-flex tw-items-center tw-justify-between tw-py-2 tw-font-bold text-white"
                                        :class="[`${globalBgColor}-8`]"
                                    >
                                        <div>Chat Preview</div>
                                        <div>
                                            <q-btn
                                                @click="
                                                    updateRightDrawerState({
                                                        mode: 'client_info',
                                                    })
                                                "
                                                label="Close"
                                                size="sm"
                                                color="grey-3"
                                                text-color="black"
                                                no-caps
                                                no-wrap
                                                unelevated
                                            />
                                        </div>
                                    </q-card-section>

                                    <q-card-section :class="`tw-px-0 tw-py-2 tw-px-2 ${globalBgColor}-1`">
                                        <div class="tw-flex tw-gap-2">
                                            <q-btn
                                                @click="
                                                    $router.push({
                                                        name: 'chats',
                                                        params: { conv_id: conversationInfo.id },
                                                    })
                                                "
                                                icon="fullscreen"
                                                label="Full View"
                                                size="md"
                                                color="white"
                                                :text-color="$helpers.colors().defaultText"
                                                no-caps
                                                no-wrap
                                                unelevated
                                            />
                                            <q-btn
                                                icon="mail_outline"
                                                label="Send Transcript"
                                                size="md"
                                                color="white"
                                                :text-color="$helpers.colors().defaultText"
                                                no-caps
                                                no-wrap
                                                unelevated
                                            />
                                        </div>
                                    </q-card-section>
                                </q-card>

                                <customer-details-card
                                    :conversation-with-users-info="conversationWithUsersInfo[0]"
                                    :conversation-info="conversationInfo"
                                    :parsed-ua-string="parsedUaString"
                                >
                                    <template v-slot:bottom-section>
                                        <div v-if="!conversationShowDetail">
                                            <q-separator />
                                            <q-btn
                                                @click="conversationShowDetail = !conversationShowDetail"
                                                class="tw-w-full tw-py-2"
                                                size="sm"
                                                no-caps
                                                flat
                                            >
                                                <q-icon name="far fa-address-card tw-mr-2"> </q-icon>
                                                <span class="tw-text-sm">
                                                    {{ `${conversationShowDetail ? "Hide" : "Show"} Chat Details` }}
                                                </span>
                                            </q-btn>
                                        </div>
                                    </template>
                                </customer-details-card>

                                <div v-show="conversationShowDetail" class="tw-mb-4"></div>

                                <q-expansion-item
                                    v-show="conversationShowDetail"
                                    label="CHAT DETAILS"
                                    dense
                                    default-opened
                                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                                    class="tw-shadow"
                                    expand-icon-class="hidden"
                                >
                                    <q-card class="tw-shadow tw-mb-3">
                                        <q-card-section class="tw-px-0 tw-py-2">
                                            <q-list :class="$helpers.colors().defaultText" class="tw-text-xs">
                                                <q-item dense>
                                                    <q-item-section>
                                                        <q-item-label>Connected Agents</q-item-label>
                                                    </q-item-section>
                                                    <q-item-section side>
                                                        <connected-users-faces
                                                            :users_conv_ses="conversationConnectedUsers"
                                                            size="md"
                                                        />
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
                                                            {{
                                                                $helpers.myDate(
                                                                    conversationInfo.created_at,
                                                                    "MMMM Do YYYY, h:mm a"
                                                                )
                                                            }}
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
                                                                    :class="
                                                                        conversationInfo.rating.rating === 5
                                                                            ? 'green'
                                                                            : 'orange'
                                                                    "
                                                                    >{{
                                                                        conversationInfo.rating.rating === 5
                                                                            ? "Good"
                                                                            : "Bad"
                                                                    }}</span
                                                                >
                                                            </template>
                                                            <template v-else>Not Rated</template>
                                                        </q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                            </q-list>
                                        </q-card-section>
                                        <div v-if="conversationShowDetail">
                                            <q-separator />
                                            <q-btn
                                                @click="conversationShowDetail = !conversationShowDetail"
                                                class="tw-w-full tw-py-2"
                                                size="sm"
                                                no-caps
                                                flat
                                            >
                                                <q-icon name="far fa-address-card tw-mr-2"> </q-icon>
                                                <span class="tw-text-sm">
                                                    {{ `${conversationShowDetail ? "Hide" : "Show"} Chat Details` }}
                                                </span>
                                            </q-btn>
                                        </div>
                                    </q-card>
                                </q-expansion-item>
                            </q-list>
                        </template>
                    </div>
                </template>
            </message>
        </template>

        <!--client info / full view-->
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
                class="tw-px-1 tw-py-3"
                :class="$helpers.colors().defaultText"
            >
                <customer-details-card
                    :conversation-with-users-info="conversationWithUsersInfo[0]"
                    :conversation-info="conversationInfo"
                    :parsed-ua-string="parsedUaString"
                />

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    v-if="conversationInfo.closed_at"
                    label="AGENTS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow"
                    expand-icon-class="hidden"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-2">
                            <q-list v-if="conversationConnectedUsers.length">
                                <q-item v-for="agent of conversationConnectedUsers" :key="agent.id" dense>
                                    <q-item-section class="tw-w-full">
                                        <div class="tw-flex tw-w-full tw-my-1 tw-gap-4">
                                            <ec-avatar
                                                :size="mini_mode ? 'md' : 'xl'"
                                                :image_src="null"
                                                :name="agent.socket_session.user.user_meta.display_name"
                                                :email="agent.socket_session.user.email"
                                            ></ec-avatar>
                                            <div class="tw-flex tw-flex-col tw-justify-center">
                                                <q-item-label class="text-weight-bold tw-text-sm">
                                                    {{
                                                        $_.upperFirst(agent.socket_session.user.user_meta.display_name)
                                                    }}
                                                </q-item-label>
                                                <q-item-label :class="$helpers.colors().defaultText" caption
                                                    >{{ agent.socket_session.user.email }}
                                                </q-item-label>
                                            </div>
                                        </div>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                            <div v-else class="text-center tw-py-2 text-grey-7">No agent found</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    v-if="!conversationInfo.closed_at"
                    label="CUSTOMER PAGE VISITS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow"
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
                    v-if="!conversationInfo.closed_at"
                    label="PREVIOUS CHATS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow"
                    expand-icon-class="hidden"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-2">
                            <q-list
                                v-if="
                                    clientPreviousChats[conversationInfo.id] &&
                                    Object.keys(clientPreviousChats[conversationInfo.id]).length
                                "
                                class="tw-break-all"
                            >
                                <q-item
                                    v-for="(conv, key) of clientPreviousChats[conversationInfo.id]"
                                    :to="{ name: 'chats', params: { conv_id: conv.id } }"
                                    :key="key"
                                    clickable
                                    dense
                                    class="tw-text-xs tw-py-2"
                                >
                                    <q-item-section class="tw-min-w-0 tw-w-8 tw-pr-0" avatar>
                                        <q-icon name="chat_bubble_outline" size="xs"></q-icon>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ conv.messages[0].msg }}</q-item-label>
                                        <q-item-label caption>{{
                                            $helpers.myDate(conv.created_at, "MMM DD, Y, h:mm a")
                                        }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="text-center tw-py-2 text-grey-7">No previous chats</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <div class="tw-mb-4"></div>

                <q-expansion-item
                    v-if="!conversationInfo.closed_at"
                    label="TICKETS"
                    dense
                    default-opened
                    :header-class="`text-weight-bold ${globalBgColor}-5 tw-text-xs tw-rounded-t tw-text-white`"
                    class="tw-shadow"
                    expand-icon-class="hidden"
                >
                    <q-card>
                        <q-card-section class="tw-px-0 tw-py-2">
                            <q-list v-if="Object.keys(clientTickets).length" class="tw-break-all">
                                <q-item
                                    v-for="(ticket, key) of clientTickets"
                                    :key="key"
                                    class="tw-text-xs tw-py-2"
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
import { mapGetters, mapMutations } from "vuex";

import Message from "components/common/Message.vue";
import MessagesTopSection from "components/subscriber/chat/MessagesTopSection.vue";
import EcAvatar from "src/components/common/EcAvatar.vue";

import UAParser from "ua-parser-js";
import TicketDetail from "components/apps/whmcs/TicketDetail.vue";
import ConnectedUsersFaces from "components/subscriber/chat/ConnectedUsersFaces.vue";
import CustomerDetailsCard from "components/common/RightbarCards/CustomerDetailsCard.vue";

export default defineComponent({
    name: "RightBar",
    components: {
        CustomerDetailsCard,
        ConnectedUsersFaces,
        TicketDetail,
        MessagesTopSection,
        Message,
        EcAvatar,
    },
    setup() {
        return {};
    },
    data(): any {
        return {
            sesId: "",
            confirm: false,
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
            clientTickets: "ticket/tickets",
            clientPreviousChats: "chat/previousConversations",
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

    methods: {
        ...mapMutations({ updateRightDrawerState: "setting_ui/updateRightDrawerState" }),
    },

    mounted() {
        // console.log("right bar initiated");

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
        }, 1000);

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
                // console.log(newVal, oldVal);

                if (
                    !this.conversationInfo.users_only &&
                    newVal?.length &&
                    (!oldVal?.length || newVal[0].conversation_id !== oldVal[0].conversation_id)
                ) {
                    // this.$store.dispatch("chat/getPreviousConversations", {
                    //     before_conversation: newVal[0].conversation_id,
                    // });

                    if (!this.conversationInfo.closed_at) {
                        // load client tickets
                        this.$store.dispatch("ticket/getTickets", {
                            email: this.conversationWithUsersInfo[0].socket_session.init_email,
                        });
                    }
                }
            },
            immediate: true,
        },
    },
});
</script>
