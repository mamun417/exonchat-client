<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Client Conversation List</div>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <ec-table
                    @handlePipeline="handlePipeline({ s: $event })"
                    :search-value="clientConvPipeline.s"
                    :rows="clientConversations"
                    :columns="columns"
                >
                    <template v-slot:cell-client_name="slotProps">
                        <div class="">
                            {{ slotProps.row.client_info.socket_session.init_name }}
                        </div>
                    </template>

                    <template v-slot:cell-client_email="slotProps">
                        <div class="">
                            {{ slotProps.row.client_info.socket_session.init_email }}
                        </div>
                    </template>

                    <template v-slot:cell-msg="slotProps">
                        <div class="tw-text-xxs">
                            {{ slotProps.row.message.msg }}
                        </div>
                    </template>

                    <template v-slot:cell-chat_department="slotProps">
                        <div class="">
                            {{ slotProps.row.chat_department.tag }}
                        </div>
                    </template>

                    <template v-slot:cell-connected_agents="slotProps">
                        <connected-users-faces :users_conv_ses="slotProps.row.connected_agents" />
                    </template>

                    <template v-slot:cell-last_sent="slotProps">
                        <div class="tw-text-xss">
                            {{ $helpers.myDate(slotProps.row.messages.created_at, "MMMM Do YYYY, h:mm:ss a") }}
                        </div>
                    </template>

                    <template v-slot:cell-self_status="slotProps">
                        <!-- {{ slotProps.row.self_status }} -->
                        <q-badge
                            v-if="slotProps.row.self_status"
                            :color="
                                slotProps.row.self_status === 'closed'
                                    ? 'red'
                                    : slotProps.row.self_status === 'left'
                                    ? 'orange'
                                    : 'green'
                            "
                        >
                            {{ slotProps.row.self_status }}
                        </q-badge>
                        <div v-else></div>
                    </template>

                    <template v-slot:cell-action="slotProps">
                        <view-conversation-btn :to="{ name: 'chats', params: { conv_id: slotProps.row.id } }" />
                        <tracking-conversation-btn
                            :disable="
                                rightBarState.mode === 'conversation' && rightBarState.conv_id === slotProps.row.id
                            "
                            @click="
                                updateRightDrawerState({
                                    conv_id: slotProps.row.id,
                                    mode: 'conversation',
                                    visible: true,
                                })
                            "
                        />
                        <direct-message-btn
                            :to="{ name: 'chats', params: { conv_id: slotProps.row.id } }"
                            :disable="slotProps.row.self_status !== 'joined'"
                        />
                        <close-conversation-btn
                            @click="showCloseConversationConfirmModal(slotProps.row.id)"
                            :disable="slotProps.row.closed_at"
                        />
                    </template>
                </ec-table>

                <div v-if="clientConvPaginationMeta.total_page > 1" class="tw-mt-10 flex flex-center">
                    <pagination
                        :current_page="clientConvPaginationMeta.current_page"
                        :last_page="clientConvPaginationMeta.total_page"
                        @handlePagination="clientConvPaginationHandle"
                    />
                </div>
            </div>
        </div>

        <conversation-state-confirm-modal
            v-if="confirm"
            :conv-state-button-info="{ name: 'close' }"
            @convStateHandle="closeConversation()"
            @hide="confirm = false"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapMutations, mapGetters } from "vuex";
import EcTable from "components/common/table/EcTable.vue";
import TrackingConversationBtn from "components/common/table/utilities/TrackingConversationBtn.vue";
import DirectMessageBtn from "components/common/table/utilities/DirectMessageBtn.vue";
import CloseConversationBtn from "components/common/table/utilities/CloseConversationBtn.vue";
import ViewConversationBtn from "components/common/table/utilities/ViewConversationBtn.vue";
import ConversationStateConfirmModal from "components/common/modal/ConversationStateConfirmModal.vue";
import ConnectedUsersFaces from "src/components/subscriber/chat/ConnectedUsersFaces.vue";

import * as _l from "lodash";
import moment from "moment";
import Pagination from "components/common/Pagination.vue";

const columns = [
    {
        name: "client_name",
        align: "left",
        label: "Client Name",
        field: "client_name",
    },
    {
        name: "client_email",
        align: "left",
        label: "Client Email",
        field: "client_email",
    },
    {
        name: "msg",
        align: "left",
        label: "Message",
        field: "msg",
    },
    {
        name: "chat_department",
        align: "left",
        label: "Chat Department",
        field: "chat_department",
    },
    {
        name: "connected_agents",
        align: "center",
        label: "Connected Agents",
        field: "connected_agents",
    },
    {
        name: "last_sent",
        align: "center",
        label: "Last Sent", // last msg sent time {1 mnt ago}
        field: "last_sent",
    },
    {
        name: "self_status", // conversation status {closed, pending, ongoing}
        label: "Status",
        field: "self_status",
        align: "center",
    },
    {
        name: "action", // only view, close if needed, join if um not joined, leave if um joined
        label: "Actions",
        field: "action",
        align: "center",
    },
];

export default defineComponent({
    components: {
        Pagination,
        ConversationStateConfirmModal,
        ViewConversationBtn,
        CloseConversationBtn,
        DirectMessageBtn,
        TrackingConversationBtn,
        EcTable,
        ConnectedUsersFaces,
    },
    data(): any {
        return {
            currentPage: 1,
            conversationId: "",
            confirm: false,
        };
    },

    setup() {
        return {
            columns,
        };
    },

    computed: {
        ...mapGetters({
            rightBarState: "setting_ui/rightBarState",
            clientConvPaginationMeta: "client_conversation/paginationMeta",
            clientConvPipeline: "client_conversation/pipeline",
            newLoadedConversationIds: "client_conversation/newLoadedConversationIds",
        }),

        clientConversations(): any {
            const clientConversations = this.$_.cloneDeep(
                this.$store.getters["chat/clientsConversation"].filter((clientConv: any) =>
                    this.newLoadedConversationIds.includes(clientConv.id)
                )
            );

            const mySocketSessionId = this.$helpers.getMySocketSessionId();

            if (clientConversations.length) {
                return clientConversations.map((conv: any) => {
                    conv.client_info = this.$store.getters["chat/conversationWithUsersInfo"](
                        conv.id,
                        mySocketSessionId
                    )[0];

                    conv.message = msgMaker(conv.messages);

                    conv.self_status = this.$store.getters["chat/conversationStatusForMe"](conv.id, mySocketSessionId);

                    conv.connected_agents = this.$store.getters["chat/conversationConnectedUsers"](conv.id);

                    return conv;
                });
                // .filter((conv: any) => {
                //     conv.message;
                // });
            }

            function msgMaker(messagesObj: any) {
                if (messagesObj && Object.keys(messagesObj).length) {
                    const messages = _l.cloneDeep(Object.values(messagesObj));

                    const tempMsgObj: any = _l
                        .sortBy(
                            Object.values(messages).filter(
                                (msg: any) =>
                                    msg.sender_type !== "ai" || msg.msg || (msg.attachments && msg.attachments.length)
                            ),
                            [(msg: any) => moment(msg.created_at).format("x")]
                        )
                        .reverse()[0];

                    if (!tempMsgObj.msg) {
                        tempMsgObj.msg = "Uploaded Attachments";
                    }

                    return tempMsgObj;
                }

                return null;
            }

            return [];
        },
    },

    mounted() {
        this.getClientConversations();
    },

    methods: {
        ...mapMutations({ updateRightDrawerState: "setting_ui/updateRightDrawerState" }),

        getClientConversations() {
            this.$store.dispatch("client_conversation/getClientConversations");
        },

        showCloseConversationConfirmModal(conversationId: any) {
            this.confirm = true;
            this.conversationId = conversationId;
        },

        closeConversation() {
            const convId = this.conversationId;

            if (!convId) return;

            this.$socket.emit("ec_close_conversation", {
                conv_id: convId,
            });
        },

        clientConvPaginationHandle(page: any) {
            this.$store.dispatch("client_conversation/updateCurrentPage", page).then(() => {
                this.getClientConversations();
            });
        },

        handlePipeline(pipeline: any) {
            this.$store
                .dispatch("client_conversation/updatePipeline", {
                    pipeline: pipeline,
                })
                .then(() => {
                    this.getClientConversations();
                });
        },
    },
});
</script>
