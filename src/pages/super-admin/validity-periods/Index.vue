<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Validity Periods</div>
            <q-btn color="green" icon="add" label="Add New" @click="newModal = true"></q-btn>
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
                                class="text-green tw-font-bold tw-text-lg"
                            >
                                {{ col.label }}
                            </q-th>
                        </q-tr>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge>{{ props.row.status }}</q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                            <q-btn icon="visibility" text-color="green" size="sm" dense flat></q-btn>
                            <q-btn icon="edit" text-color="green" size="sm" dense flat></q-btn>
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

        <q-dialog v-model="newModal" @update:modelValue="(value) => (newModal = value)" persistent>
            <q-card style="max-width: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Add New Period</div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input label="Period Name" color="green" prefix="/" class="tw-my-3" dense>
                        <template v-slot:prepend>
                            <q-icon name="label" color="green" />
                        </template>
                    </q-input>

                    <q-input label="Period In Days" color="green" prefix="/" class="tw-my-3" dense>
                        <template v-slot:prepend>
                            <q-icon name="label" color="green" />
                        </template>
                    </q-input>

                    <q-checkbox class="tw-mt-2" label="Active This After Create" color="green" dense />
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-my-4">
                    <q-btn color="green" label="submit" class="full-width" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="editModal" @update:modelValue="(value) => (editModal = value)">
            <q-card style="max-width: 500px; min-width: 300px; max-height: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Edit Period - Monthly</div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section></q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
const columns = [
    { name: "name", align: "center", label: "Name", field: "name" },
    {
        name: "days",
        align: "center",
        label: "In Days",
        field: "days",
    },
    {
        name: "status",
        label: "Status",
        field: "status",
        align: "center",
    },
    {
        name: "action",
        label: "Actions",
        field: "action",
        align: "center",
    },
];

const rows = [
    {
        name: "monthly",
        days: 30,
        status: "active",
    },
];

export default {
    // add department feature
    data() {
        return {
            newModal: false,
            editModal: false,
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
