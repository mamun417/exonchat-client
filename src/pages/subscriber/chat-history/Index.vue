<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Chat History</div>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow tw-bg-white">
                <ec-table
                    @handlePipeline="handlePipeline({ s: $event })"
                    search-placeholder="Search ( Visitor name )"
                    :search-value="chatHistoryPipeline.s"
                    :rows="chatHistories"
                    :columns="columns"
                    @rowClick="rowClickHandle"
                >
                    <template v-slot:filter>
                        <chat-history-filter @handlePipeline="handlePipeline($event)" />
                    </template>

                    <template v-slot:cell-msg="slotProps">
                        <div class="tw-max-w-xxs tw-overflow-hidden tw-whitespace-nowrap tw-overflow-ellipsis">
                            <q-badge v-if="!slotProps.row.connected_agents.length" color="primary">MISSED</q-badge>
                            {{ slotProps.row.message?.msg }}
                        </div>
                    </template>

                    <template v-slot:cell-chat_rating="slotProps">
                        <div v-if="slotProps.row.conversation_rating">
                            <div v-if="slotProps.row.conversation_rating.rating === 5">
                                <span><q-icon name="thumb_up" color="green" size="15px" /></span> Good
                            </div>
                            <div v-else>
                                <span><q-icon name="thumb_down" color="red" size="15px" /></span> Bad
                            </div>
                        </div>
                        <div v-else>Not rated</div>
                    </template>

                    <template v-slot:cell-client_name="slotProps">
                        <div>
                            {{ slotProps.row.client_info.socket_session.init_name }}
                        </div>
                    </template>

                    <template v-slot:cell-connected_agents="slotProps">
                        <connected-users-faces :users_conv_ses="slotProps.row.connected_agents" size="sm" />
                    </template>

                    <template v-slot:cell-chat_department="slotProps">
                        <div>
                            {{ $_.upperFirst(slotProps.row.chat_department.tag) }}
                        </div>
                    </template>

                    <template v-slot:cell-last_sent="slotProps">
                        <div class="tw-text-xss">
                            {{ $helpers.myDate(slotProps.row.created_at, "MMM Do YYYY, h:mm a") }}
                        </div>
                    </template>
                </ec-table>

                <div v-if="chatHistoryPaginationMeta.total_page > 1" class="tw-py-5 flex flex-center">
                    <pagination
                        :current_page="chatHistoryPaginationMeta.current_page"
                        :last_page="chatHistoryPaginationMeta.total_page"
                        @handlePagination="chatHistoryPaginationHandle"
                    />
                </div>
            </div>
        </div>

        <!--<conversation-state-confirm-modal-->
        <!--    v-if="confirm"-->
        <!--    :conv-state-button-info="{ name: 'close' }"-->
        <!--    @convStateHandle="closeConversation()"-->
        <!--    @hide="confirm = false"-->
        <!--/>-->
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapMutations, mapGetters } from "vuex";
import EcTable from "components/common/table/EcTable.vue";
import ConnectedUsersFaces from "src/components/subscriber/chat/ConnectedUsersFaces.vue";
import Pagination from "components/common/Pagination.vue";
import ChatHistoryFilter from "pages/subscriber/chat-history/ChatHistoryFilter.vue";

const columns = [
    {
        name: "msg",
        align: "left",
        label: "Message / Problem",
        field: "msg",
    },
    {
        name: "chat_rating",
        align: "center",
        label: "Chat Rating",
        field: "chat_rating",
    },
    {
        name: "client_name",
        align: "left",
        label: "Visitor Name",
        field: "client_name",
    },
    {
        name: "connected_agents",
        align: "center",
        label: "Agents",
        field: "connected_agents",
    },

    {
        name: "chat_department",
        align: "left",
        label: "Department",
        field: "chat_department",
    },

    {
        name: "last_sent",
        align: "left",
        label: "Date", // last msg sent time {1 mnt ago}
        field: "last_sent",
    },
];

export default defineComponent({
    components: {
        ChatHistoryFilter,
        Pagination,
        EcTable,
        ConnectedUsersFaces,
    },
    data(): any {
        return {
            // chatHistories: [],
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
            chatHistoryPaginationMeta: "chat_history/paginationMeta",
            chatHistoryPipeline: "chat_history/pipeline",
            chatHistories: "chat_history/chatHistories",
        }),
    },

    mounted() {
        this.getChatHistories();
    },

    methods: {
        ...mapMutations({ updateRightDrawerState: "setting_ui/updateRightDrawerState" }),

        getChatHistories() {
            this.$store.dispatch("chat_history/getChatHistories");
        },

        // closeConversation() {
        //     const convId = this.conversationId;
        //
        //     if (!convId) return;
        //
        //     this.$socket.emit("ec_close_conversation", {
        //         conv_id: convId,
        //     });
        // },

        chatHistoryPaginationHandle(page: any) {
            this.$store.dispatch("chat_history/updateCurrentPage", page).then(() => {
                this.getChatHistories();
            });
        },

        handlePipeline(pipeline: any) {
            this.$store
                .dispatch("chat_history/updatePipeline", {
                    pipeline: pipeline,
                })
                .then(() => {
                    this.getChatHistories();
                });
        },

        rowClickHandle(row: any) {
            this.updateRightDrawerState({
                mode: "conversation",
                visible: true,
                conv_id: row.id,
            });
        },
    },
});
</script>
