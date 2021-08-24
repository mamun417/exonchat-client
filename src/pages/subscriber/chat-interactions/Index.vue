<template>
    <div class="tw-flex tw-flex-col">
        <!--<div class="tw-shadow-lg tw-p-4 tw-py-3 tw-flex tw-justify-between tw-mb-3">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-flex tw-items-center">
                <q-icon name="chat_bubble" class="tw-mr-2" />
                <div>Chat</div>
            </div>
        </div>-->

        <div class="tw-py-3 tw-flex tw-justify-between">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-flex tw-items-center">
                <div>CHATS IN QUEUE: {{ chatsInQueue.length }}</div>
            </div>
        </div>

        <div class="tw-mb-5">
            <div class="tw-shadow tw-bg-white">
                <ec-table
                    :columns="typeOneColumns"
                    :rows="filteredChats('chatsInQueue')"
                    @rowClick="rowClickHandle"
                    hide-search
                >
                    <!--<template v-slot:filter>
                        <q-select
                            v-model="departmentFilters.chatsInQueue"
                            label="Choose Department"
                            :options="departments"
                            style="width: 200px"
                            :color="globalColor"
                            dense
                        >
                            <template v-slot:prepend>
                                <q-icon name="groups" :color="globalColor" />
                            </template>
                        </q-select>
                    </template>-->

                    <template v-slot:cell-client="slotProps">
                        <div class="">
                            {{ slotProps.row.client_info.socket_session.init_name }}
                        </div>
                    </template>

                    <template v-slot:cell-currently_on="slotProps">
                        <div class="text-xss">
                            {{
                                $_.last(
                                    $_.find(visitors, ["session_id", slotProps.row.client_info.socket_session_id])
                                        ?.visits
                                )?.url
                            }}
                        </div>
                    </template>

                    <template v-slot:cell-department="slotProps">
                        <div class="text-xss">
                            {{ slotProps.row.chat_department.tag }}
                        </div>
                    </template>

                    <template v-slot:cell-elapsed_time="slotProps">
                        <div class="text-xss">
                            {{ $helpers.fromNowTime(slotProps.row.created_at, true) }}
                        </div>
                    </template>
                </ec-table>
            </div>
        </div>

        <div class="tw-py-3 tw-flex tw-justify-between">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-flex tw-items-center">
                <div>MY CHATS: {{ myRunningChats.length }}</div>
            </div>
        </div>

        <div class="tw-mb-5">
            <div class="tw-shadow tw-bg-white">
                <ec-table
                    :columns="typeTwoColumns"
                    :rows="filteredChats('myRunningChats')"
                    @rowClick="rowClickHandle"
                    hide-search
                >
                    <!--<template v-slot:filter>
                        <q-select
                            v-model="departmentFilters.myRunningChats"
                            label="Choose Department"
                            :options="departments"
                            style="width: 200px"
                            :color="globalColor"
                            dense
                        >
                            <template v-slot:prepend>
                                <q-icon name="groups" :color="globalColor" />
                            </template>
                        </q-select>
                    </template>-->

                    <template v-slot:cell-client="slotProps">
                        <div class="">
                            {{ slotProps.row.client_info.socket_session.init_name }}
                        </div>
                    </template>

                    <template v-slot:cell-currently_on="slotProps">
                        <div class="text-xss">
                            {{
                                $_.last(
                                    $_.find(visitors, ["session_id", slotProps.row.client_info.socket_session_id])
                                        ?.visits
                                )?.url
                            }}
                        </div>
                    </template>

                    <template v-slot:cell-department="slotProps">
                        <div class="text-xss">
                            {{ slotProps.row.chat_department.tag }}
                        </div>
                    </template>

                    <template v-slot:cell-chat_time="slotProps">
                        <div class="text-xss">
                            {{ $helpers.fromNowTime(slotProps.row.created_at, true) }}
                        </div>
                    </template>
                </ec-table>
            </div>
        </div>

        <div class="tw-py-3 tw-flex tw-justify-between">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-flex tw-items-center">
                <div>ACTIVE OTHER CHATS: {{ ongoingOtherChats.length }}</div>
            </div>
        </div>

        <div class="">
            <div class="tw-shadow tw-bg-white">
                <ec-table
                    :columns="typeThreeColumns"
                    :rows="filteredChats('ongoingOtherChats')"
                    @rowClick="rowClickHandle"
                    hide-search
                >
                    <!--<template v-slot:filter>
                        <q-select
                            v-model="departmentFilters.ongoingOtherChats"
                            label="Choose Department"
                            :options="departments"
                            style="width: 200px"
                            :color="globalColor"
                            dense
                        >
                            <template v-slot:prepend>
                                <q-icon name="groups" :color="globalColor" />
                            </template>
                        </q-select>
                    </template>-->

                    <template v-slot:cell-client="slotProps">
                        <div class="">
                            {{ slotProps.row.connected_client.socket_session.init_name }}
                        </div>
                    </template>

                    <template v-slot:cell-connected_agents="slotProps">
                        <connected-users-faces :users_conv_ses="slotProps.row.connected_agents" />
                    </template>

                    <template v-slot:cell-currently_on="slotProps">
                        <div class="text-xss">
                            {{
                                $_.last(
                                    $_.find(visitors, ["session_id", slotProps.row.connected_client.socket_session_id])
                                        ?.visits
                                )?.url
                            }}
                        </div>
                    </template>

                    <template v-slot:cell-department="slotProps">
                        <div class="text-xss">
                            {{ slotProps.row.chat_department.tag }}
                        </div>
                    </template>

                    <template v-slot:cell-elapsed_time="slotProps">
                        <div class="text-xss">
                            {{ $helpers.fromNowTime(slotProps.row.created_at, true) }}
                        </div>
                    </template>
                </ec-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapMutations, mapGetters } from "vuex";
import EcTable from "components/common/table/EcTable.vue";
import ConnectedUsersFaces from "src/components/subscriber/chat/ConnectedUsersFaces.vue";
// import TrackingConversationBtn from 'components/common/table/utilities/TrackingConversationBtn.vue';
// import DirectMessageBtn from 'components/common/table/utilities/DirectMessageBtn.vue';
// import CloseConversationBtn from 'components/common/table/utilities/CloseConversationBtn.vue';
// import ViewConversationBtn from 'components/common/table/utilities/ViewConversationBtn.vue';
// import ConversationStateConfirmModal from 'components/common/modal/ConversationStateConfirmModal.vue';
//
// import * as _l from 'lodash';
// import moment from 'moment';
// import Pagination from 'components/common/Pagination.vue';

const columns = [
    {
        name: "client",
        align: "left",
        label: "Client",
        field: "client",
    },
    {
        name: "currently_on",
        align: "center",
        label: "Currently On",
        field: "currently_on",
    },
    {
        name: "department",
        align: "left",
        label: "Department",
        field: "department",
    },
];

export default defineComponent({
    components: {
        // Pagination,
        // ConversationStateConfirmModal,
        // ViewConversationBtn,
        // CloseConversationBtn,
        // DirectMessageBtn,
        // TrackingConversationBtn,
        EcTable,
        ConnectedUsersFaces,
    },
    data(): any {
        return {
            currentPage: 1,
            conversationId: "",
            confirm: false,
            departmentFilters: {
                chatsInQueue: "",
                myRunningChats: "",
                ongoingOtherChats: "",
            },
            departments: [],
        };
    },

    setup() {
        return {
            // type columns are not serial maintained
            typeOneColumns: [
                ...columns,

                {
                    name: "elapsed_time",
                    align: "center",
                    label: "Elapsed Time",
                    field: "elapsed_time",
                },
            ],
            typeTwoColumns: [
                ...columns,

                {
                    name: "chat_time",
                    align: "center",
                    label: "Chat Time",
                    field: "chat_time",
                },
            ],
            typeThreeColumns: [
                {
                    name: "client",
                    align: "left",
                    label: "Client",
                    field: "client",
                },

                {
                    name: "connected_agents",
                    align: "center",
                    label: "Agents",
                    field: "connected_agents",
                },
                {
                    name: "currently_on",
                    align: "center",
                    label: "Currently On",
                    field: "currently_on",
                },
                {
                    name: "department",
                    align: "left",
                    label: "Department",
                    field: "department",
                },

                {
                    name: "elapsed_time",
                    align: "center",
                    label: "Elapsed Time",
                    field: "elapsed_time",
                },
            ],
        };
    },

    computed: {
        ...mapGetters({
            chatsInQueue: "chat/incomingChatRequestsForMe",
            myRunningChats: "chat/myOngoingChats",
            ongoingOtherChats: "chat/ongoingOtherChats",
            visitors: "visitor/visitors",
            globalColor: "setting_ui/globalColor",
        }),

        filteredChats: (app) => (chatType: any) => {
            if (app[chatType].length) {
                return app[chatType].filter(
                    (chat: any) =>
                        app.departmentFilters[chatType].label === "All" ||
                        chat.chat_department.tag === app.departmentFilters[chatType].label
                );
            }

            return [];
        },
    },

    mounted() {
        this.loadDepartment();
    },

    methods: {
        ...mapMutations({ updateRightDrawerState: "setting_ui/updateRightDrawerState" }),

        rowClickHandle(row: any) {
            this.$router.push({ name: "chats", params: { conv_id: row.id } });

            // this.updateRightDrawerState({
            //     mode: 'conversation',
            //     visible: true,
            //     conv_id: row.id,
            // });
        },

        loadDepartment() {
            this.$store.dispatch("department/getDepartments").then((res: any) => {
                this.departments = [];

                const defaultDep = {
                    label: "All",
                    value: "all",
                };

                this.departments.push(defaultDep);

                for (const department of res.data) {
                    this.departments.push({
                        label: department.tag,
                        value: department.id,
                    });
                }

                // query department keep selected in dropdown
                // Note: later manage with store
                const queryDep = this.$route.query.department;

                Object.keys(this.departmentFilters).forEach((departmentFilter: any) => {
                    this.departmentFilters[departmentFilter] =
                        this.departments.find((department: any) => department.label === queryDep) || defaultDep;
                });
            });
        },
    },
});
</script>
