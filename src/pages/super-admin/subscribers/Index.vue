<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Subscriber List</div>
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

        <q-dialog v-model="viewModal" @update:modelValue="(value) => (viewModal = value)">
            <q-card style="max-width: 500px; min-width: 300px; max-height: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Subscriber - aaa</div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section></q-card-section>

                <q-card-section class="tw-pt-0"></q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
const columns = [
    { name: "name", align: "center", label: "Name", field: "name" },
    { name: "email", align: "center", label: "Email", field: "email" },
    {
        name: "package",
        align: "center",
        label: "Package",
        field: "package",
    },
    {
        name: "valid_till",
        align: "center",
        label: "Validity Left",
        field: "valid_till",
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
        name: "aaaa",
        email: "mail@mail.com",
        package: "free",
        valid_till: "lifetime",
        status: "active",
    },
    {
        name: "bbbb",
        email: "mail@mail.com",
        package: "lite",
        valid_till: "10 days left",
        status: "active",
    },
    {
        name: "cccc",
        email: "mail@mail.com",
        package: "advance",
        valid_till: "1 month",
        status: "active",
    },
];

const dynamicVariables = [
    { name: "user_name", des: "will print assigned name else guest" },
    { name: "user_id", des: "will print logged users id" },
];
export default {
    // add department feature
    data() {
        return {
            viewModal: false,
        };
    },
    setup() {
        return {
            columns,
            rows,
            dynamicVariables,
        };
    },
    methods: {},
};
</script>
