<template>
    <div class="tw-flex tw-flex-col">
        <div
            class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7"
        >
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">
                Permissions List
            </div>
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
                        <q-input
                            borderless
                            dense
                            debounce="300"
                            placeholder="Search"
                            color="green"
                        >
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

                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td
                                v-for="col in props.cols"
                                :key="col.name"
                                :props="props"
                            >
                                <template v-if="col.name === 'action'">
                                    <q-btn
                                        icon="toggle_on"
                                        text-color="green"
                                        size="md"
                                        @click="editModal = true"
                                        dense
                                        flat
                                    ></q-btn>
                                </template>
                                <template v-else-if="col.name === 'resource'"
                                    ><div class="tw-italic">
                                        {{ col.value.name }}
                                    </div></template
                                >
                                <template v-else>{{ col.value }}</template>
                            </q-td>
                        </q-tr>
                        <q-tr :props="props">
                            <q-td colspan="100%">
                                <div class="tw-flex tw-justify-center">
                                    <div
                                        v-for="perm in props.row.resource
                                            .permissions"
                                        :key="perm.name"
                                        class="tw-mx-3"
                                    >
                                        <q-btn
                                            icon="toggle_on"
                                            size="sm"
                                            color="green"
                                            flat
                                        /><span class="tw-font-medium">{{
                                            perm.name
                                        }}</span>
                                    </div>
                                </div>
                            </q-td>
                        </q-tr>
                    </template>

                    <template v-slot:body-cell-name="props">
                        <q-td :props="props">
                            <div class="tw-font-medium tw-italic">
                                {{ props.row.name }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-description="props">
                        <q-td :props="props">
                            <div class="">
                                {{ props.row.description }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge>{{ props.row.status }}</q-badge>
                        </q-td>
                    </template>

                    <template v-slot:no-data="{ message }">
                        <div
                            class="full-width row flex-center text-red q-gutter-sm tw-mt-2"
                        >
                            <q-icon size="2em" name="sentiment_dissatisfied" />
                            <span> Well this is sad... {{ message }} </span>
                        </div>
                    </template>
                </q-table>
            </div>
        </div>
    </div>
</template>

<script>
const columns = [
    { name: 'resource', align: 'left', label: 'Resource', field: 'resource' },
    {
        name: 'description',
        align: 'center',
        label: 'Description',
        field: 'description',
    },
    {
        name: 'status',
        label: 'Status',
        field: 'status',
        align: 'center',
    },
    {
        name: 'action',
        label: 'Actions',
        field: 'action',
        align: 'center',
    },
];

const rows = [
    // {
    //     resource: {
    //         name: 'chat',
    //         des: 'Chat resource',
    //         status: 'active',
    //         permissions: [
    //             { name: 'join', des: 'Join Chat', status: 'active' },
    //             { name: 'close', des: 'Close Chat', status: 'active' },
    //         ],
    //     },
    //     description: 'Edit All',
    //     status: 'active',
    // },
    // {
    //     resource: {
    //         name: 'agent',
    //         des: 'Chat resource',
    //         status: 'active',
    //         permissions: [
    //             { name: 'create', des: 'Create Chat', status: 'active' },
    //         ],
    //     },
    //     description: 'Delete All',
    //     status: 'active',
    // },
];
export default {
    data() {
        return {
            newModal: false,
            editModal: true,
        };
    },
    setup() {
        return {
            columns,
            rows,
        };
    },
    methods: {},
};
</script>
