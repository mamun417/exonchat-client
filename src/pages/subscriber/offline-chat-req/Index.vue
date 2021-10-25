<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Offline Chat Requests</div>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow tw-bg-white tw-p-4">
                <ec-table
                    @handlePipeline="handlePipeline({ s: $event })"
                    @rowClick="openDetails"
                    :search-value="offlineChatReqPipeline.s"
                    :rows="offlineChatRequest"
                    :columns="columns"
                    :bodyCelTemplate="bodyCelTemplate"
                >
                    <template v-slot:cell-name="slotProps">
                        <div class="tw-flex tw-items-center tw-gap-2">
                            <div>
                                <ec-avatar :name="slotProps.row.name" :email="slotProps.row.email" />
                            </div>
                            <div>
                                <div>
                                    {{ slotProps.row.name }}
                                </div>
                                <div>
                                    {{ slotProps.row.email }}
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-slot:cell-assignee="slotProps">
                        <div>
                            {{ slotProps.row.assign_user ? slotProps.row.assign_user : "Unassigned" }}
                            <pre>{{ slotProps.row }}</pre>
                        </div>
                    </template>

                    <template v-slot:cell-status="slotProps">
                        <div>
                            <q-badge :style="{ backgroundColor: getOfflineChatReqStatusBgColor(slotProps.row) }">
                                {{ slotProps.row.status }}
                            </q-badge>
                        </div>
                    </template>

                    <template v-slot:cell-created_at="slotProps">
                        <div class="tw-text-xss">
                            {{ $helpers.myDate(slotProps.row.created_at, "MMM Do YYYY, h:mm a") }}
                        </div>
                    </template>
                </ec-table>

                <div v-if="chatRequests?.pagination?.total_page > 1" class="tw-mt-10 flex flex-center">
                    <pagination
                        :current_page="offlineChatReqPaginationMeta.current_page"
                        :last_page="offlineChatReqPaginationMeta.total_page"
                        @handlePagination="offlineChatReqPaginationHandle"
                    />
                </div>
            </div>
        </div>

        <pre>{{ offlineChatRequest }}</pre>

        <reply-offline-chat-req-modal v-if="replyModal" @hide="replyModal = false" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EcTable from "components/common/table/EcTable.vue";
import Pagination from "components/common/Pagination.vue";
import { mapGetters } from "vuex";
import ReplyOfflineChatReqModal from "pages/subscriber/offline-chat-req/ReplyOfflineChatReqModal.vue";
import Conversation from "src/store/models/Conversation";
import OfflineChatRequest from "src/store/models/offline-chat-req/OfflineChatRequest";
import EcAvatar from "components/common/EcAvatar.vue";

export default defineComponent({
    components: { EcAvatar, ReplyOfflineChatReqModal, Pagination, EcTable },
    data(): any {
        return {
            columns: [
                {
                    name: "name",
                    align: "left",
                    label: "Requester",
                    field: "name",
                },
                {
                    name: "subject",
                    align: "left",
                    label: "Subject",
                    field: "subject",
                },
                {
                    name: "assignee",
                    align: "left",
                    label: "Assignee",
                    field: "assignee",
                },

                {
                    name: "status",
                    align: "left",
                    label: "Status",
                    field: "status",
                },

                {
                    name: "created_at",
                    align: "left",
                    label: "Last Message",
                    field: "created_at",
                },
            ],
            bodyCelTemplate: {},
            replyModal: false,
        };
    },

    mounted() {
        this.getChatRequests();
    },

    computed: {
        ...mapGetters({
            offlineChatReqPaginationMeta: "offline_chat_req/paginationMeta",
            offlineChatReqPipeline: "offline_chat_req/pipeline",
        }),

        offlineChatRequest() {
            return OfflineChatRequest.all();
        },
    },

    methods: {
        getChatRequests() {
            this.$store.dispatch("offline_chat_req/getChatRequests");
        },

        handlePipeline(pipeline: any) {
            this.$store
                .dispatch("offline_chat_req/updatePipeline", {
                    pipeline: pipeline,
                })
                .then(() => {
                    this.getChatRequests();
                });
        },

        offlineChatReqPaginationHandle(page: any) {
            this.$store.dispatch("offline_chat_req/updateCurrentPage", page).then(() => {
                this.getChatRequests();
            });
        },

        openDetails(offlineChatReq: any) {
            console.log(offlineChatReq);

            this.$router.push({ name: "offline-chat-req.view", params: { id: offlineChatReq.id } });
        },

        getOfflineChatReqStatusBgColor(offlineChatReq: any) {
            return offlineChatReq.status === "open"
                ? "rgb(67, 132, 245)"
                : offlineChatReq.status === "pending"
                ? "rgb(66, 77, 87)"
                : offlineChatReq.status === "solved"
                ? "rgb(44, 176, 106)"
                : "rgb(221, 226, 230)"; // spam
        },
    },
});
</script>
