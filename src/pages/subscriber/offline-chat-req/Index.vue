<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Offline Chat Requests</div>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow tw-bg-white tw-p-4">
                <ec-table
                    @handlePipeline="handlePipeline({ s: $event })"
                    :search-value="offlineChatReqPipeline.s"
                    :rows="chatRequests.data"
                    :columns="columns"
                    :bodyCelTemplate="bodyCelTemplate"
                >
                    <template v-slot:cell-message="slotProps">
                        <div class="tw-whitespace-normal">
                            {{ slotProps.row.message }}
                        </div>
                    </template>

                    <template v-slot:cell-chat_department="slotProps">
                        <div>
                            {{ $_.upperFirst(slotProps.row.chat_department.tag) }}
                        </div>
                    </template>

                    <template v-slot:cell-created_at="slotProps">
                        <div class="tw-text-xss">
                            {{ $helpers.myDate(slotProps.row.created_at, "MMM Do YYYY, h:mm a") }}
                        </div>
                    </template>

                    <template v-slot:cell-action="slotProps">
                        <div><q-icon @click="openReplyModal" name="reply" size="sm" title="Reply" /></div>
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

        <reply-offline-chat-req-modal v-if="replyModal" @hide="replyModal = false" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EcTable from "components/common/table/EcTable.vue";
import Pagination from "components/common/Pagination.vue";
import { mapGetters } from "vuex";
import ReplyOfflineChatReqModal from "pages/subscriber/offline-chat-req/ReplyOfflineChatReqModal.vue";

export default defineComponent({
    components: { ReplyOfflineChatReqModal, Pagination, EcTable },
    data(): any {
        return {
            columns: [
                {
                    name: "name",
                    align: "left",
                    label: "Name",
                    field: "name",
                },
                {
                    name: "email",
                    align: "left",
                    label: "Email",
                    field: "email",
                },
                {
                    name: "subject",
                    align: "left",
                    label: "Subject",
                    field: "subject",
                },

                {
                    name: "message",
                    align: "left",
                    label: "Message",
                    field: "message",
                },

                {
                    name: "chat_department",
                    align: "left",
                    label: "Department",
                    field: "chat_department",
                },

                {
                    name: "created_at",
                    align: "left",
                    label: "Date",
                    field: "created_at",
                },

                {
                    name: "action",
                    label: "Actions",
                    field: "action",
                    align: "center",
                },
            ],
            chatRequests: [],
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
    },

    methods: {
        getChatRequests() {
            this.$store
                .dispatch("offline_chat_req/getChatRequests")
                .then((res: any) => {
                    this.chatRequests = res.data.chat_requests;
                })
                .catch((err: any) => {
                    console.log(err);
                });
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

        openReplyModal() {
            this.replyModal = true;
        },
    },
});
</script>

<!--// koita reply korte parbe ? // reply gular list dekha jabe ? // reply delete korar option thkbe kina ? //-->
