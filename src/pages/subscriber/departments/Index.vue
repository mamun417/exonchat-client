<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Department List</div>
            <q-btn color="green" icon="add" label="Add New" @click="newDepartmentModal = true"></q-btn>
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

                    <template v-slot:body-cell-dep_name="props">
                        <q-td :props="props">
                            <div class="tw-font-medium">
                                {{ props.row.dep_name }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-assigned_agents="props">
                        <q-td :props="props">
                            <q-avatar
                                v-for="(agent, key) in props.row.assigned_agents"
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

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge>{{ props.row.status }}</q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                            <q-btn icon="create" text-color="green" size="sm" dense flat></q-btn>
                            <q-btn icon="settings" text-color="green" size="sm" dense flat></q-btn>
                            <q-btn icon="delete" text-color="red" size="sm" dense flat></q-btn>
                        </q-td>
                    </template>

                    <template v-slot:no-data="{ message }">
                        <div class="full-width row flex-center text-red q-gutter-sm">
                            <q-icon size="2em" name="sentiment_dissatisfied" />
                            <span> Well this is sad... {{ message }} </span>
                        </div>
                    </template>
                </q-table>

                <div class="tw-text-xxs tw-mt-5 text-grey-8 tw-p-2 tw-font-medium">
                    Note: If a agent is assigned to a department then agent will be prioritized to this department. Else
                    all the department.
                </div>
            </div>
        </div>

        <q-dialog v-model="newDepartmentModal" @update:modelValue="(value) => (newDepartmentModal = value)" persistent>
            <q-card style="max-width: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Add New Department</div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input label="Department Name" color="green" class="tw-my-2" dense
                        ><template v-slot:prepend> <q-icon name="label" color="green" /> </template
                    ></q-input>

                    <q-select
                        label="Select Agents"
                        :options="[
                            {
                                name: 'hasan',
                                avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
                                id: 'Get the hosting price',
                            },
                            {
                                name: 'mamun',
                                avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
                                id: 'Get user info',
                            },
                        ]"
                        class="tw-my-2"
                        color="green"
                        use-input
                        hide-selected
                        dense
                        ><template v-slot:prepend> <q-icon name="ballot" color="green" /> </template
                        ><template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" class="tw-py-2" dense>
                                <q-item-section avatar>
                                    <q-avatar><img :src="scope.opt.avatar" /></q-avatar>
                                </q-item-section>
                                <q-item-section>
                                    {{ scope.opt.name }}
                                </q-item-section>
                            </q-item>
                        </template></q-select
                    >

                    <q-checkbox class="tw-mt-2" label="Activate This Department" color="green" dense />

                    <div class="tw-text-xxs tw-mt-5 bg-orange tw-p-2 tw-text-gray-700">
                        <div>Note: If you don't select agents then all agents will be assigned to this department</div>
                    </div>
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-my-4">
                    <q-btn color="green" label="submit" class="full-width" @click="saveDepartment" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="editModal" @update:modelValue="(value) => (editModal = value)" persistent>
            <!-- load parent intents all content -->
            <q-card style="max-width: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Edit Department Sales</div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input label="Department Name" color="green" class="tw-my-2" readonly dense
                        ><template v-slot:prepend> <q-icon name="label" color="green" /> </template
                    ></q-input>

                    <q-select
                        label="Select Agents"
                        :options="[
                            {
                                name: 'hasan',
                                avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
                                id: 'Get the hosting price',
                            },
                            {
                                name: 'mamun',
                                avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
                                id: 'Get user info',
                            },
                        ]"
                        class="tw-my-2"
                        color="green"
                        use-input
                        hide-selected
                        dense
                        ><template v-slot:prepend> <q-icon name="ballot" color="green" /> </template
                        ><template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" class="tw-py-2" dense>
                                <q-item-section avatar>
                                    <q-avatar><img :src="scope.opt.avatar" /></q-avatar>
                                </q-item-section>
                                <q-item-section>
                                    {{ scope.opt.name }}
                                </q-item-section>
                            </q-item>
                        </template></q-select
                    >

                    <q-checkbox class="tw-mt-2" label="Activate This Department" color="green" dense />

                    <div class="tw-text-xxs tw-mt-5 bg-orange tw-p-2 tw-text-gray-700">
                        <div>Note: If you don't select agents then all agents will be assigned to this department</div>
                    </div>
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-my-4">
                    <q-btn color="green" label="submit" class="full-width" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
const columns = [
    {
        name: 'dep_name',
        align: 'left',
        label: 'Department Name',
        field: 'dep_name',
    },
    {
        name: 'assigned_agents',
        align: 'center',
        label: 'Assigned Agents',
        field: 'assigned_agents',
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
    {
        dep_name: 'Sales',
        assigned_agents: [{ name: 'hasan', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' }],
        status: 'active',
    },
    {
        dep_name: 'Technical',
        assigned_agents: [
            { name: 'hasan', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' },
            {
                name: 'susmita',
                avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
            },
        ],
        status: 'active',
    },
];

const dynamicVariables = [
    { name: 'user_name', des: 'will print assigned name else guest' },
    { name: 'user_id', des: 'will print logged users id' },
];
export default {
    data() {
        return {
            newDepartmentModal: false,
            editModal: false,
            newIntentType: 'action',
            variableListModal: false,
            intentChoosed: '',
        };
    },
    setup() {
        return {
            columns,
            rows,
            dynamicVariables,
        };
    },
    methods: {
        saveDepartment() {
            //     this.$api
            //         .post('departments', {
            //             tag: 'aaa',
            //             description: 'b',
            //             active: true,
            //         })
            //         .then((res: any) => {
            //             console.log(res);
            //         })
            //         .catch((e: any) => console.log(e));
            // this.$api
            //     .get('departments')
            //     .then((res: any) => {
            //         console.log(res);
            //     })
            //     .catch((e: any) => console.log(e));
        },
    },
};
</script>
