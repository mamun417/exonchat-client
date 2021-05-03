<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Client Conversation List</div>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <q-table
                    :rows="rows"
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
                                {{ props.row.client_name }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-connected_agents="props">
                        <q-td :props="props">
                            <q-avatar
                                v-for="(agent, key) in props.row.connected_agents"
                                :key="agent.name"
                                size="35px"
                                :style="key !== 0 ? { marginLeft: '-8px' } : ''"
                            >
                                <img :src="agent.avatar" />
                                <q-tooltip class="">
                                    {{ agent.name }}
                                </q-tooltip>
                            </q-avatar>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-last_sent="props">
                        <q-td :props="props">
                            <div class="tw-text-xxs">{{ props.row.last_sent }}</div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge>{{ props.row.status }}</q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                            <q-btn icon="visibility" text-color="green" size="sm" dense flat></q-btn>
                            <q-btn icon="forward_to_inbox" text-color="green" size="sm" dense flat></q-btn>
                            <q-btn icon="close" text-color="red" size="sm" dense flat></q-btn>
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
    data() {
        return {};
    },

    setup() {
        return {
            columns,
            rows,
        };
    },
    methods: {},
});
</script>
