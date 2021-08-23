<template>
    <q-card class="tw-shadow-sm">
        <q-card-section class="row no-wrap items-center tw-p-2" :class="{ 'tw-px-0': mini_mode }">
            <q-item class="tw-w-full">
                <q-item-section v-if="conversationWithUsersInfo.length === 1" avatar>
                    <ec-avatar
                        :size="mini_mode ? 'lg' : 'xl'"
                        :image_src="
                            conversationWithUsersInfo[0].socket_session.user
                                ? conversationWithUsersInfo[0].socket_session.user.user_meta.src || null
                                : null
                        "
                        :name="
                            conversationWithUsersInfo[0].socket_session.user
                                ? conversationWithUsersInfo[0].socket_session.user.user_meta.display_name
                                : conversationWithUsersInfo[0].socket_session.init_name
                        "
                        :email="
                            conversationWithUsersInfo[0].socket_session.user
                                ? conversationWithUsersInfo[0].socket_session.user.email
                                : conversationWithUsersInfo[0].socket_session.init_email
                        "
                    ></ec-avatar>
                </q-item-section>

                <q-item-section class="tw-w-full">
                    <q-item-label
                        class="text-weight-bold"
                        :class="[mini_mode ? 'tw-text-sm' : 'tw-text-lg', $helpers.colors().defaultText]"
                    >
                        <div v-for="{ socket_session } in conversationWithUsersInfo" :key="socket_session.id">
                            <span class="text-capitalize tw-mr-1">{{
                                socket_session.user
                                    ? socket_session.user.user_meta.display_name
                                    : socket_session.init_name
                            }}</span>
                            <!--<span class="text-caption">({{ socket_session.user ? 'agent' : 'client' }})</span>-->
                        </div>
                    </q-item-label>
                    <q-item-label caption>
                        <q-badge
                            v-if="conversationWithUsersInfo[0]?.socket_session.user"
                            :color="
                                agentOnlineStatus === 'online'
                                    ? 'green'
                                    : agentOnlineStatus === 'offline'
                                    ? 'red-6'
                                    : 'grey'
                            "
                            :class="{ 'tw-px-2 tw-pb-1': !mini_mode }"
                        >
                            {{ agentOnlineStatus }}
                        </q-badge>

                        <!--<q-badge
                            v-else
                            :color="clientActiveStatus ? 'green' : 'grey'"
                            :class="{ 'tw-px-2 tw-py-1': !mini_mode }"
                        >
                            {{ clientActiveStatus ? 'Online' : 'Offline' }}
                        </q-badge>-->

                        <!--<q-badge
                            v-if="conversationInfo.closed_at"
                            color="orange"
                            :class="{ 'tw-px-2 tw-py-1': !mini_mode }"
                            >Chat Closed
                        </q-badge>-->

                        <div v-if="!conversationInfo.users_only && !conversationInfo.closed_at">
                            <!--                            q-card used for the ref instance-->
                            <q-card class="shadow-0" ref="chatDuration">
                                Chat is Ongoing for <b>{{ $helpers.preciseDiff(conversationInfo.created_at) }}</b>
                            </q-card>
                        </div>
                    </q-item-label>
                </q-item-section>

                <!--                <q-item-section v-if="!mini_mode" side>-->
                <!--                    <q-item-label>-->
                <!--                        <connected-users-faces :users_conv_ses="conversationConnectedUsers" />-->
                <!--                    </q-item-label>-->
                <!--                </q-item-section>-->

                <q-item-section side>
                    <q-item-label>
                        <template
                            v-if="
                                mini_mode &&
                                rightBarState.mode === 'conversation' &&
                                (conversationInfo.users_only || conversationInfo.closed_at)
                            "
                        >
                            <q-btn
                                icon="fullscreen"
                                class="tw-px-1"
                                unelevated
                                @click="
                                    updateRightDrawerState({
                                        mode: 'client_info',
                                    });
                                    $router.push({ name: 'chats', params: { conv_id: conversationInfo.id } });
                                "
                            >
                                <q-tooltip>Maximize Conversation</q-tooltip>
                            </q-btn>

                            <q-btn
                                icon="arrow_forward"
                                class="tw-px-1"
                                unelevated
                                @click="
                                    updateRightDrawerState({
                                        mode: 'client_info',
                                    })
                                "
                            >
                                <q-tooltip>Close tracking</q-tooltip>
                            </q-btn>
                        </template>

                        <q-btn
                            v-if="!conversationInfo.users_only && !conversationInfo.closed_at"
                            icon="flash_on"
                            class=""
                            :color="globalColor"
                            label="Actions"
                            no-caps
                            unelevated
                        >
                            <q-menu anchor="bottom right" self="top end">
                                <q-list style="min-width: 200px">
                                    <q-item
                                        @click="convStateHandle('join')"
                                        v-if="!conversationStatusForMe || conversationStatusForMe !== 'joined'"
                                        clickable
                                        v-close-popup
                                    >
                                        <!--                                        <q-item-section class="tw-w-8 tw-min-w-0" avatar>-->
                                        <!--                                            <q-icon name="add" />-->
                                        <!--                                        </q-item-section>-->
                                        <q-item-section :class="$helpers.colors().defaultText">
                                            Join Chat
                                        </q-item-section>
                                    </q-item>

                                    <q-item v-if="['joined'].includes(conversationStatusForMe)" clickable v-close-popup>
                                        <!--                                        <q-item-section class="tw-w-8 tw-min-w-0" avatar>-->
                                        <!--                                            <q-icon name="shortcut" />-->
                                        <!--                                        </q-item-section>-->
                                        <q-item-section
                                            @click="showChatTransferModal = true"
                                            :class="$helpers.colors().defaultText"
                                        >
                                            Transfer Chat
                                        </q-item-section>
                                    </q-item>

                                    <q-item
                                        v-if="
                                            ['technical', 'Technical'].includes(conversationInfo.chat_department.tag) &&
                                            conversationStatusForMe === 'joined'
                                        "
                                        clickable
                                        v-close-popup
                                    >
                                        <!--                                        <q-item-section class="tw-w-8 tw-min-w-0" avatar>-->
                                        <!--                                            <q-icon name="confirmation_number" />-->
                                        <!--                                        </q-item-section>-->
                                        <q-item-section
                                            @click="openTicketModal = true"
                                            :class="$helpers.colors().defaultText"
                                            >Open Ticket
                                        </q-item-section>
                                    </q-item>

                                    <q-item v-if="conversationStatusForMe === 'joined'" clickable v-close-popup>
                                        <!--                                        <q-item-section class="tw-w-8 tw-min-w-0" avatar>-->
                                        <!--                                            <q-icon name="exit_to_app" />-->
                                        <!--                                        </q-item-section>-->
                                        <q-item-section
                                            @click="
                                                modalForState = 'leave';
                                                confirmModal = !confirmModal;
                                            "
                                            :class="$helpers.colors().defaultText"
                                            >Leave Chat
                                        </q-item-section>
                                    </q-item>

                                    <q-item v-if="mini_mode" clickable v-close-popup>
                                        <!--                                        <q-item-section class="tw-w-8 tw-min-w-0" avatar>-->
                                        <!--                                            <q-icon name="fullscreen" />-->
                                        <!--                                        </q-item-section>-->
                                        <q-item-section
                                            @click="
                                                updateRightDrawerState({
                                                    mode: 'client_info',
                                                });
                                                $router.push({
                                                    name: 'chats',
                                                    params: { conv_id: conversationInfo.id },
                                                });
                                            "
                                            :class="$helpers.colors().defaultText"
                                            >Maximize Conversation
                                        </q-item-section>
                                    </q-item>

                                    <q-item
                                        v-if="mini_mode && rightBarState.mode === 'conversation'"
                                        clickable
                                        v-close-popup
                                    >
                                        <!--                                        <q-item-section class="tw-w-8 tw-min-w-0" avatar>-->
                                        <!--                                            <q-icon name="close_fullscreen" />-->
                                        <!--                                        </q-item-section>-->
                                        <q-item-section
                                            @click="
                                                updateRightDrawerState({
                                                    mode: 'client_info',
                                                })
                                            "
                                            :class="$helpers.colors().defaultText"
                                            >Minimize Conversation
                                        </q-item-section>
                                    </q-item>

                                    <q-item
                                        v-if="['joined', 'left'].includes(conversationStatusForMe)"
                                        clickable
                                        v-close-popup
                                    >
                                        <!--                                        <q-item-section class="tw-w-8 tw-min-w-0" avatar>-->
                                        <!--                                            <q-icon name="close" />-->
                                        <!--                                        </q-item-section>-->
                                        <q-item-section
                                            @click="
                                                modalForState = 'close';
                                                confirmModal = !confirmModal;
                                            "
                                            :class="$helpers.colors().defaultText"
                                            >Close Chat
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-menu>
                        </q-btn>
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-card-section>

        <q-dialog v-model="openTicketModal">
            <q-card style="min-width: 350px">
                <q-card-section class="tw-border-b-2 tw-py-3 tw-px-2">
                    <span class="q-ml-sm">You are going to open a support ticket</span>
                </q-card-section>

                <q-card-section>
                    <div class="tw-text-xs">Write ticket subject</div>
                    <q-input v-model="ticketSubject" placeholder="Subject" dense></q-input>
                </q-card-section>

                <q-card-section class="tw-py-3 text-center">
                    <q-btn label="Submit" color="green" class="full-width" @click="openTicket" unelevated />
                </q-card-section>

                <q-inner-loading :showing="ticketSubmitLoader" color="green" />
            </q-card>
        </q-dialog>

        <conversation-state-confirm-modal
            v-if="confirmModal"
            :conv-state-button-info="{ name: modalForState }"
            @convStateHandle="convStateHandle($event)"
            @hide="confirmModal = false"
        />

        <chat-transfer-modal
            v-if="showChatTransferModal"
            @transferChat="showChatTransferModal = false"
            :conv_id="conv_id"
        />
    </q-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";

import EcAvatar from "src/components/common/EcAvatar.vue";

import ChatTransferModal from "components/common/modal/ChatTransferModal.vue";
import ConversationStateConfirmModal from "components/common/modal/ConversationStateConfirmModal.vue";

export default defineComponent({
    name: "MessagesTopSection",
    components: { ChatTransferModal, ConversationStateConfirmModal, EcAvatar },
    props: {
        conv_id: {
            type: String,
        },
        mini_mode: {
            type: Boolean,
            default: false,
        },
    },

    setup() {
        // const messageInputAutoFocus = ref(false);
        // provide('messageInputAutoFocus', messageInputAutoFocus);
        // return {
        //     messageInputAutoFocus,
        // };
    },

    data(): any {
        return {
            clientActiveStatus: false,
            confirmModal: false,
            modalForState: "",

            openTicketModal: false,
            ticketSubmitLoader: false,
            ticketSubject: "",

            showChatTransferModal: false,
            transferChatToExpand: false,
            transferChatToFilter: "",
        };
    },

    mounted() {
        this.$emitter.on("ec_get_client_ses_id_status_res", (res: any) => {
            this.clientActiveStatus = res.status === "active";
        });

        setInterval(() => {
            if (
                this.$route.name === "chats" &&
                this.conversationWithUsersInfo?.length &&
                !this.conversationInfo.users_only &&
                !this.conversationInfo.closed_at
            ) {
                this.$refs.chatDuration?.$forceUpdate();
            }
        }, 1000);

        console.log("msg top section initiated");
    },

    computed: {
        ...mapGetters({
            profile: "auth/profile",
            rightBarState: "setting_ui/rightBarState",
            chatUsers: "chat/chatUsers",
            globalColor: "setting_ui/globalColor",
        }),

        onlineUsers(): any {
            const users = this.$store.getters["chat/chatUsers"];

            return this.transferChatToFilter ? users : users;
        },

        conversationInfo(): any {
            return this.$store.getters["chat/conversationInfo"](this.conv_id);
        },

        conversationStatusForMe(): any {
            return this.$store.getters["chat/conversationStatusForMe"](this.conv_id, this.profile?.socket_session?.id);
        },

        conversationWithUsersInfo(): any {
            return this.$store.getters["chat/conversationWithUsersInfo"](
                this.conv_id,
                this.profile?.socket_session?.id
            );
        },

        conversationConnectedUsers(): any {
            return this.$store.getters["chat/conversationConnectedUsers"](this.conv_id);
        },

        // get teammate online status
        agentOnlineStatus(): any {
            if (this.chatUsers.length && this.conversationWithUsersInfo) {
                return this.chatUsers.find(
                    (chatUser: any) => chatUser.id === this.conversationWithUsersInfo[0].socket_session.user.id
                ).online_status;
            }

            return "offline";
        },
    },

    methods: {
        ...mapMutations({ updateRightDrawerState: "setting_ui/updateRightDrawerState" }),

        convStateHandle(state: any = "") {
            if (state) {
                this.modalForState = state;
            }

            if (!this.modalForState) return;
            this[`${this.modalForState}Conversation`](this.conv_id);
        },

        openTicket() {
            this.ticketSubmitLoader = true;

            window.socketSessionApi
                .post(`/apps/whmcs/tickets/open/${this.conv_id}`, { subject: this.ticketSubject })
                .then(() => {
                    this.$helpers.showSuccessNotification(this, "Ticket submitted successfully");
                    this.ticketSubject = "";
                })
                .catch((e: any) => {
                    console.log(e);
                    this.$helpers.showErrorNotification(this, e.response.data.message);
                })
                .finally(() => {
                    this.openTicketModal = false;
                    this.ticketSubmitLoader = false;
                });
        },

        transferChat(agent: any) {
            if (agent.online_status !== "online") {
                this.$helpers.showErrorNotification(
                    this,
                    "Transfer chat not possible. Agent is not online",
                    "warning",
                    "black"
                );
                return;
            }

            console.log("transferchat => ", agent);

            this.$socket.emit("ec_chat_transfer", {
                conv_id: this.conv_id,
                notify_to: agent.socket_session.id,
                agent_info: agent,
            });
        },

        joinConversation(conv_id: any) {
            console.log(conv_id);

            this.$socket.emit("ec_join_conversation", {
                conv_id: conv_id,
            });
        },

        leaveConversation(conv_id: any) {
            this.$socket.emit("ec_leave_conversation", {
                conv_id: conv_id,
            });
        },

        closeConversation(conv_id: any) {
            console.log("from close");

            this.$socket.emit("ec_close_conversation", {
                conv_id: conv_id,
            });
        },
    },
});
</script>
