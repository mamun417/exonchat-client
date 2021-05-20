<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Client Conversation List</div>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <q-table
                    :rows="clientConversations"
                    :columns="columns"
                    row-key="name"
                    :pagination="{ rowsPerPage: 0 }"
                    hide-pagination
                    flat
                >
                    <template v-slot:top-right>
                        <q-input borderless dense debounce="300" placeholder="Search" color="green">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>

                    <template v-slot:header="props">
                        <q-tr :props="props">
                            <q-th
                                v-for="col in props.cols"
                                :key="col.name"
                                :props="props"
                                class="text-italic text-green tw-font-bold tw-text-lg"
                            >
                                {{ col.label }}
                            </q-th>
                        </q-tr>
                    </template>

                    <template v-slot:body-cell-client_name="props">
                        <q-td :props="props">
                            <div class="tw-font-medium tw-italic">
                                {{ props.row.client.init_name }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-chat_department="props">
                        <q-td :props="props">
                            <div class="tw-font-medium tw-italic">
                                {{ props.row.chat_department.tag }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-msg="props">
                        <q-td :props="props">
                            <div class="tw-font-medium tw-italic">
                                {{ props.row.messages[0]['msg'] }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-connected_agents="props">
                        <q-td :props="props">
                            <q-avatar
                                v-for="(agent, key) in props.row.connected_agents"
                                :key="key"
                                size="35px"
                                :style="key !== 0 ? { marginLeft: '-8px' } : ''"
                            >
                                <img :src="agent.avatar || 'https://cdn.quasar.dev/img/avatar1.jpg'" alt="image" />
                                <q-tooltip class="">
                                    {{ agent.email }}
                                </q-tooltip>
                            </q-avatar>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-last_sent="props">
                        <q-td :props="props">
                            <div class="tw-text-xxs">
                                {{ $helpers.myDate(props.row.messages[0]['created_at'], 'MMMM Do YYYY, h:mm:ss a') }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge
                                v-if="props.row.self_status"
                                :color="
                                    props.row.self_status === 'closed'
                                        ? 'red'
                                        : props.row.self_status === 'left'
                                        ? 'orange'
                                        : ''
                                "
                                >{{ props.row.self_status }}</q-badge
                            >
                        </q-td>
                    </template>

                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                            <q-btn
                                @click="rightDrawer = !rightDrawer"
                                icon="visibility"
                                text-color="green"
                                size="sm"
                                dense
                                flat
                            ></q-btn>
                            <q-btn
                                :to="{ name: 'chats', params: { conv_id: props.row.id } }"
                                :disable="props.row.self_status === 'closed' || props.row.self_status !== 'joined'"
                                icon="forward_to_inbox"
                                text-color="green"
                                size="sm"
                                dense
                                flat
                            ></q-btn>
                            <q-btn
                                :disable="props.row.self_status === 'closed'"
                                icon="close"
                                text-color="red"
                                size="sm"
                                dense
                                flat
                            ></q-btn>
                        </q-td>
                    </template>

                    <template v-slot:no-data="{ message }">
                        <div class="full-width row flex-center text-red q-gutter-sm">
                            <q-icon size="2em" name="sentiment_dissatisfied" />
                            <span> Well this is sad... {{ message }} </span>
                        </div>
                    </template>
                </q-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const columns = [
    {
        name: 'client_name',
        align: 'left',
        label: 'Client Name',
        field: 'client_name',
    },
    {
        name: 'msg',
        align: 'left',
        label: 'Message',
        field: 'msg',
    },
    {
        name: 'chat_department',
        align: 'left',
        label: 'Chat Department',
        field: 'chat_department',
    },
    {
        name: 'connected_agents',
        align: 'center',
        label: 'Connected Agents',
        field: 'connected_agents',
    },
    {
        name: 'last_sent',
        align: 'center',
        label: 'Last Sent', // last msg sent time {1 mnt ago}
        field: 'last_sent',
    },
    {
        name: 'status', // conversation status {closed, pending, ongoing}
        label: 'Status',
        field: 'status',
        align: 'center',
    },
    {
        name: 'action', // only view, close if needed, join if um not joined, leave if um joined
        label: 'Actions',
        field: 'action',
        align: 'center',
    },
];

const rows = [
    {
        client_name: 'habijabi',
        msg: 'heelo',
        chat_department: 'Sales',
        connected_agents: [{ name: 'hasan', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' }],
        last_sent: '5mnt ago',
        status: 'joined',
    },
    {
        client_name: 'jabihabi',
        msg: 'hi',
        chat_department: 'Technical',
        connected_agents: [
            { name: 'hasan', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' },
            {
                name: 'susmita',
                avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
            },
        ],
        last_sent: '1mnt ago',
        status: 'closed',
    },
];

export default defineComponent({
    data(): any {
        return {};
    },

    setup() {
        return {
            columns,
            rows,
        };
    },

    computed: {
        clientConversations(): any {
            const clientConversations = this.$_.cloneDeep(
                this.$store.getters['client_conversation/getClientConversations']
            );

            const mySocketSessionId = this.$helpers.getMySocketSessionId();

            if (clientConversations) {
                return Object.values(clientConversations).map((clientConv: any) => {
                    clientConv.connected_agents = [];

                    // set connected agents and client information
                    clientConv.conversation_sessions.forEach((convSession: any) => {
                        if (convSession.socket_session.user_id) {
                            clientConv.connected_agents.push(convSession.socket_session.user);
                        } else {
                            clientConv.client = convSession.socket_session;
                        }
                    });

                    clientConv.self_status = this.getSelfStatus(mySocketSessionId, clientConv);

                    return clientConv;
                });
            }

            return [];
        },
    },

    mounted() {
        this.getClientConversations();
    },

    methods: {
        getClientConversations() {
            this.$store.dispatch('client_conversation/getClientConversations');
        },

        // set self status (join/left/closed)
        getSelfStatus(mySocketSessionId: any, clientConv: any) {
            if (clientConv.closed_by_id === mySocketSessionId) {
                return 'closed';
            } else {
                const mySocketSession = clientConv.conversation_sessions.find(
                    (convSession: any) => convSession.socket_session_id === mySocketSessionId
                );

                if (mySocketSession) {
                    return mySocketSession.left_at ? 'left' : 'joined';
                }
            }
        },
    },
});
</script>
