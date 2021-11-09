<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Offline Chat Requests</div>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow tw-bg-white">
                <ec-table
                    @handlePipeline="handlePipeline({ s: $event })"
                    @rowClick="openDetails"
                    :search-value="offlineChatReqPipeline.s"
                    :rows="offlineChatRequest"
                    :columns="columns"
                    :bodyCelTemplate="bodyCelTemplate"
                    searchPlaceholder="Search ( Name, Email, Subject )"
                >
                    <template v-slot:filter>
                        <div class="q-pa-md">
                            <div class="tw-flex tw-gap-2 tw-items-center">
                                <div class="q-gutter-lg">
                                    <q-radio
                                        @update:model-value="handlePipeline({ status: $event })"
                                        v-model="offlineChatReqPipeline.status"
                                        v-for="filter in filters"
                                        :key="filter"
                                        :val="filter.value"
                                        dense
                                    >
                                        <template v-slot:default>
                                            <div>
                                                {{ filter.label }}
                                                <span
                                                    v-if="statusWiseCount[filter.value === '' ? 'all' : filter.value]"
                                                >
                                                    -
                                                    {{ statusWiseCount[filter.value === "" ? "all" : filter.value] }}
                                                </span>
                                            </div>
                                        </template>
                                    </q-radio>
                                </div>

                                <!--<q-option-group
                                    @update:model-value="handlePipeline({ status: $event })"
                                    v-model="offlineChatReqPipeline.status"
                                    :options="filters"
                                    inline
                                />-->
                            </div>
                        </div>
                    </template>

                    <template v-slot:cell-name="slotProps">
                        <div class="tw-flex tw-items-center tw-gap-2">
                            <div>
                                <ec-avatar
                                    :key="slotProps.row.id"
                                    :name="slotProps.row.name"
                                    :email="slotProps.row.email"
                                />
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

                    <template v-slot:cell-subject="slotProps">
                        <div class="tw-whitespace-normal">
                            {{ slotProps.row.subject }}
                        </div>
                    </template>

                    <template v-slot:cell-assignee="slotProps">
                        <div>
                            {{ slotProps.row.assign_user ? slotProps.row.assign_user : "Unassigned" }}
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
                            <div v-if="slotProps.row.offline_chat_req_replies.length">
                                {{
                                    $helpers.myDate(
                                        getLastReply(slotProps.row.offline_chat_req_replies).created_at,
                                        "MMM Do YYYY, h:mm a"
                                    )
                                }}
                            </div>
                            <div v-else></div>
                        </div>
                    </template>
                </ec-table>

                <div v-if="offlineChatReqPaginationMeta?.total_page > 1" class="tw-mt-10 flex flex-center">
                    <pagination
                        :current_page="offlineChatReqPaginationMeta.current_page"
                        :last_page="offlineChatReqPaginationMeta.total_page"
                        @handlePagination="offlineChatReqPaginationHandle"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EcTable from "components/common/table/EcTable.vue";
import Pagination from "components/common/Pagination.vue";
import { mapGetters } from "vuex";
import OfflineChatRequest from "src/store/models/offline-chat-req/OfflineChatRequest";
import EcAvatar from "components/common/EcAvatar.vue";
import * as _l from "lodash";
import moment from "moment";

export default defineComponent({
    components: { EcAvatar, Pagination, EcTable },
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
                /*{
                    name: "assignee",
                    align: "left",
                    label: "Assignee",
                    field: "assignee",
                },*/

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
            filters: [
                { label: "All", value: "" },
                { label: "Open", value: "open" },
                { label: "Pending", value: "pending" },
                { label: "Solved", value: "solved" },
                { label: "Spam", value: "spam" },
            ],
        };
    },

    mounted() {
        this.getChatRequests();
    },

    computed: {
        ...mapGetters({
            offlineChatReqPaginationMeta: "offline_chat_req/paginationMeta",
            offlineChatReqPipeline: "offline_chat_req/pipeline",
            statusWiseCount: "offline_chat_req/getStatusWiseCount",
        }),

        offlineChatRequest() {
            return OfflineChatRequest.query().with("offline_chat_req_replies").orderBy("created_at", "desc").get();
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

        // get offline chat requests last reply
        getLastReply(replies: any) {
            return _l.findLast(replies, (reply: any) => moment(reply.created_at).format("x"));
        },
    },
});
</script>
