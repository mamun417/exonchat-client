<template>
    <q-card class="tw-shadow-sm">
        <q-card-section class="row no-wrap items-center tw-p-2" :class="{ 'tw-px-0': mini_mode }">
            <q-item class="tw-w-full">
                <!--assuming live chat-->
                <q-item-section
                    v-if="!conversationData.users_only && conversationData.clientConversationSession?.id"
                    avatar
                >
                    <ec-avatar
                        :size="mini_mode ? 'lg' : 'xl'"
                        :image_src="null"
                        :name="conversationData.clientConversationSession?.socket_session?.init_name"
                        :email="conversationData.clientConversationSession?.socket_session?.init_email"
                    ></ec-avatar>
                </q-item-section>

                <q-item-section
                    v-if="
                        conversationData.users_only &&
                        conversationData.type === 'user_to_user_chat' &&
                        conversationData.userToUserChatOtherPerson?.id
                    "
                    avatar
                >
                    <ec-avatar
                        :size="mini_mode ? 'lg' : 'xl'"
                        :image_src="
                            conversationData.userToUserChatOtherPerson?.socket_session?.user?.user_meta?.src || null
                        "
                        :name="
                            conversationData.userToUserChatOtherPerson?.socket_session?.user?.user_meta?.display_name
                        "
                        :email="conversationData.userToUserChatOtherPerson.socket_session.user.email"
                    ></ec-avatar>
                </q-item-section>

                <q-item-section
                    v-if="
                        !conversationData.users_only ||
                        (conversationData.users_only && conversationData.type === 'user_to_user_chat')
                    "
                    class="tw-w-full"
                >
                    <q-item-label :class="[mini_mode ? 'tw-text-sm' : 'tw-text-lg', $helpers.colors().defaultText]">
                        <div class="text-capitalize tw-mr-1 text-weight-bold">
                            {{
                                conversationData.clientConversationSession?.socket_session?.init_name ||
                                conversationData.userToUserChatOtherPerson?.socket_session?.user?.user_meta
                                    ?.display_name
                            }}
                        </div>
                    </q-item-label>
                    <q-item-label caption>
                        <div v-if="!conversationData.users_only && !conversationData.closed_at">
                            <!--                            q-card used for the ref instance-->
                            <q-card class="shadow-0" ref="chatDuration">
                                Chat is Ongoing for <b>{{ $helpers.preciseDiff(conversationData.created_at) }}</b>
                            </q-card>
                        </div>
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-item-label>
                        <template
                            v-if="
                                mini_mode &&
                                rightBarState.mode === 'conversation' &&
                                (conversationData.users_only || conversationData.closed_at)
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
                                    $router.push({ name: 'chats', params: { conv_id: conversationData.id } });
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
                            v-if="!conversationData.users_only && !conversationData.closed_at"
                            icon="flash_on"
                            class=""
                            :color="globalColor"
                            label="Actions"
                            no-caps
                            unelevated
                        >
                            <q-menu anchor="bottom right" self="top end" :class="$helpers.colors().defaultText">
                                <q-list separator style="min-width: 200px">
                                    <q-item
                                        @click="convStateHandle('join')"
                                        v-if="!conversationStatusForMe || conversationStatusForMe !== 'joined'"
                                        clickable
                                        v-close-popup
                                    >
                                        <!--                                        <q-item-section class="tw-w-8 tw-min-w-0" avatar>-->
                                        <!--                                            <q-icon name="add" />-->
                                        <!--                                        </q-item-section>-->
                                        <q-item-section>
                                            {{ conversationData.connectedUsers.length ? "Join Chat" : "Accept Chat" }}
                                        </q-item-section>
                                    </q-item>

                                    <q-item
                                        v-if="['joined'].includes(conversationStatusForMe) && canTransfer"
                                        clickable
                                        v-close-popup
                                    >
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
                                            ['support', 'Support'].includes(conversationData.chat_department.tag) &&
                                            conversationStatusForMe === 'joined'
                                        "
                                        clickable
                                        v-close-popup
                                    >
                                        <!--                                        <q-item-section class="tw-w-8 tw-min-w-0" avatar>-->
                                        <!--                                            <q-icon name="confirmation_number" />-->
                                        <!--                                        </q-item-section>-->
                                        <q-item-section
                                            @click="showOpenTicketModal"
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
                                                    params: { conv_id: conversationData.id },
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

                                    <q-item v-if="canSendTranscript" clickable>
                                        <send-transcript
                                            :conv_id="conversationData.id"
                                            @sendingTranscript="sendingTranscript = $event"
                                        >
                                            <template v-slot:custom-content>
                                                <template v-if="sendingTranscript">
                                                    <q-spinner-hourglass class="on-left" size="2em" /> Sending...
                                                </template>

                                                <template v-else>
                                                    <!--<q-item-section avatar class="tw-pr-2 tw-min-w-0">
                                                        <q-icon name="mail_outline" />
                                                    </q-item-section>-->
                                                    <q-item-section>Send Transcript</q-item-section>
                                                </template>
                                            </template>
                                        </send-transcript>
                                    </q-item>

                                    <q-item v-if="canSendTranscript" clickable>
                                        <div
                                            @click="reloadClientWidget(conversationData.id)"
                                            class="tw-flex tw-items-center"
                                        >
                                            <template v-if="reloadingClientWidget">
                                                <q-spinner-hourglass class="on-left" size="2em" /> Reloading...
                                            </template>

                                            <template v-else>
                                                <q-item-section>Reload Client Widget</q-item-section>
                                            </template>
                                        </div>
                                    </q-item>

                                    <q-item
                                        v-if="['joined', 'left'].includes(conversationStatusForMe) && canClose"
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
                <q-card-section class="row items-center tw-border-b tw-border-blue-grey-500 tw-px-6">
                    <div class="tw-text-lg" :class="`text-${globalColor}`">You are going to open a support ticket</div>

                    <q-space></q-space>

                    <q-btn icon="close" color="orange-3" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section class="tw-px-6">
                    <q-input
                        v-model="openTicketForm.subject"
                        :error-message="openTicketFormError.subject"
                        :error="!!openTicketFormError.subject"
                        @update:model-value="openTicketFormError.subject = ''"
                        :color="globalColor"
                        placeholder="Subject"
                        class="tw-mb-3"
                        no-error-icon
                        hide-bottom-space
                        dense
                    ></q-input>

                    <q-select
                        v-model="openTicketForm.department_id"
                        :error-message="openTicketFormError.department_id"
                        :error="!!openTicketFormError.department_id"
                        @update:model-value="openTicketFormError.department_id = ''"
                        :options="supportDepartments"
                        no-error-icon
                        hide-bottom-space
                        option-value="id"
                        option-label="name"
                        label="Select Department"
                        class="tw-mb-3"
                        :color="globalColor"
                        emit-value
                        map-options
                        dense
                    />

                    <q-select
                        v-model="openTicketForm.priority"
                        :error-message="openTicketFormError.priority"
                        :error="!!openTicketFormError.priority"
                        @update:model-value="openTicketFormError.priority = ''"
                        :options="['Low', 'Medium', 'High']"
                        no-error-icon
                        hide-bottom-space
                        label="Select Priority"
                        class="tw-mb-3"
                        :color="globalColor"
                        emit-value
                        map-options
                        dense
                    />
                </q-card-section>

                <q-card-section class="tw-py-3 text-center">
                    <q-btn label="Submit" :color="globalColor" class="full-width" @click="openTicket" unelevated />
                </q-card-section>

                <q-inner-loading :showing="ticketSubmitLoader" :color="globalColor" />
            </q-card>
        </q-dialog>

        <conversation-state-confirm-modal
            v-if="confirmModal"
            :conv-state-button-info="{ name: modalForState }"
            @convStateHandle="convStateHandle($event)"
            @hide="confirmModal = false"
        >
            <template v-if="needTransfer && modalForState !== 'close'" v-slot:content>
                <div>Only you are left in this chat</div>
            </template>

            <template v-if="needTransfer && modalForState !== 'close'" v-slot:action>
                <q-btn flat label="Transfer Chat" color="green-5" @click="showChatTransferModal = true" v-close-popup />
                <q-btn flat label="Leave" color="orange-5" @click="convStateHandle('leave')" v-close-popup />
                <q-btn flat label="Cancel" color="primary" v-close-popup />
            </template>
        </conversation-state-confirm-modal>

        <chat-transfer-modal
            v-if="showChatTransferModal"
            @transferChat="showChatTransferModal = false"
            :conv_id="conv_id"
            @hide="showChatTransferModal = false"
        />
    </q-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";

import EcAvatar from "src/components/common/EcAvatar.vue";

import ChatTransferModal from "components/common/modal/ChatTransferModal.vue";
import ConversationStateConfirmModal from "components/common/modal/ConversationStateConfirmModal.vue";
import * as _l from "lodash";
import moment from "moment";
import SendTranscript from "components/common/SendTranscript.vue";
import Conversation from "src/store/models/Conversation";

export default defineComponent({
    name: "MessagesTopSection",
    components: { SendTranscript, ChatTransferModal, ConversationStateConfirmModal, EcAvatar },
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

            supportDepartments: [],

            openTicketForm: {
                subject: "",
                department_id: "",
                priority: "",
            },
            openTicketFormError: {},

            showChatTransferModal: false,
            transferChatToExpand: false,
            transferChatToFilter: "",
            sendingTranscript: false,
            reloadingClientWidget: false,
            chatDurationInterval: "",
        };
    },

    mounted() {
        this.$emitter.on("ec_get_client_ses_id_status_res", (res: any) => {
            this.clientActiveStatus = res.status === "active";
        });

        this.chatDurationInterval = setInterval(() => {
            if (
                this.$route.name === "chats" &&
                !this.conversationData.users_only &&
                this.conversationData.clientConversationSession?.id &&
                !this.conversationData.closed_at
            ) {
                this.$refs.chatDuration?.$forceUpdate();
            }
        }, 1000);

        console.log("msg top section initiated");
    },

    beforeUnmount() {
        clearInterval(this.chatDurationInterval);
    },

    computed: {
        ...mapGetters({
            profile: "auth/profile",
            rightBarState: "setting_ui/rightBarState",
            chatUsers: "chat/chatUsers",
            globalColor: "setting_ui/globalColor",
        }),

        conversationModel(): any {
            return Conversation.query().where("id", this.$route.params?.conv_id);
        },

        conversationData(): any {
            // if || {} empty object raise error for accessing models getter then manage null
            return this.conversationModel.first() || {};
        },

        onlineUsers(): any {
            const users = this.$store.getters["chat/chatUsers"];

            return this.transferChatToFilter ? users : users;
        },

        conversationStatusForMe(): any {
            return this.$store.getters["chat/conversationStatusForMe"](this.conv_id);
        },

        needTransfer(): any {
            // not checking me. cz its before my leave
            return (
                this.conversationData.connectedUsers.filter(
                    (conversationConnectedUser: any) => conversationConnectedUser.left_at
                ).length ===
                this.conversationData.connectedUsers.length - 1
            );
        },

        canClose(): any {
            const sortedAgents = _l.sortBy(
                this.conversationData.connectedUsers.filter(
                    (conversationConnectedUser: any) => !conversationConnectedUser.left_at
                ),
                (convSes: any) => moment(convSes.joined_at).format("x")
            );

            return !!(sortedAgents.length && sortedAgents[0].socket_session_id === this.profile?.socket_session?.id);
        },

        canTransfer(): any {
            return this.canClose;
        },

        canSendTranscript(): any {
            return this.conversationStatusForMe === "joined";
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

        showOpenTicketModal() {
            this.resetOpenTicketForm();

            this.ticketSubmitLoader = true;
            this.openTicketModal = true;

            // get support departments from WHMCS
            window
                .api("apps/whmcs/support-departments")
                .then((res: any) => {
                    this.supportDepartments = res.data;
                })
                .catch((err: any) => {
                    console.log(err.response);
                })
                .finally(() => {
                    this.ticketSubmitLoader = false;
                });
        },

        openTicket() {
            this.ticketSubmitLoader = true;

            this.$store
                .dispatch("ticket/storeTicket", {
                    conv_id: this.conv_id,
                    inputs: this.openTicketForm,
                })
                .then(() => {
                    this.$helpers.showSuccessNotification(this, "Ticket submitted successfully");

                    this.resetOpenTicketForm();
                    this.openTicketModal = false;

                    // reload ticket list
                    this.$store.dispatch("ticket/getTickets", {
                        email: this.conversationData.clientConversationSession.socket_session.init_email,
                    });
                })
                .catch((e: any) => {
                    this.openTicketErrorHandle(e);
                })
                .finally(() => {
                    this.ticketSubmitLoader = false;
                });
        },

        openTicketErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.openTicketFormError = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },

        resetOpenTicketForm() {
            this.openTicketForm.subject = "";
            this.openTicketForm.department_id = "";
            this.openTicketForm.priority = "";

            this.openTicketFormError = {};
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

        reloadClientWidget(conv_id: any) {
            this.reloadingClientWidget = true;

            this.$socket.emit("ec_reload_client_widget_from_user", {
                conv_id: conv_id,
            });

            setTimeout(() => {
                this.reloadingClientWidget = false;
                this.$helpers.showSuccessNotification(this, "Client widget reload successfully");
            }, 3000);
        },
    },
});
</script>
