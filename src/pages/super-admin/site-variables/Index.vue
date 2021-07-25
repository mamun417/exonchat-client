<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Site Variables</div>
            <q-btn color="green" icon="add" label="Assign" @click="assignVariablesModal = true"></q-btn>
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

                    <template v-slot:body-cell-name="props">
                        <q-td :props="props">
                            <q-badge color="green" class="">
                                <span>$${</span>{{ props.row.name }}<span>}</span>
                            </q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge>{{ props.row.status }}</q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
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
            </div>
        </div>

        <q-dialog
            v-model="assignVariablesModal"
            @update:modelValue="(value) => (assignVariablesModal = value)"
            persistent
        >
            <q-card style="max-width: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Add New Variable</div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input label="Variable Name" color="green" prefix="$${" suffix="}" class="tw-my-2" dense
                        ><template v-slot:prepend> <q-icon name="label" color="green" /> </template
                    ></q-input>

                    <q-input label="Description" color="green" class="tw-my-2" dense
                        ><template v-slot:prepend> <q-icon name="description" color="green" /> </template
                    ></q-input>
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-my-4">
                    <q-btn color="green" label="submit" class="full-width" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
const columns = [
    {
        name: 'name',
        align: 'center',
        label: 'Name',
        field: 'name',
    },
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
    {
        name: 'user_name',
        description: 'show user name',
        status: 'active',
    },
    {
        name: 'ip',
        description: 'show user ip',
        status: 'inactive',
    },
    {
        name: 'package',
        description: "show user' current package",
        status: 'pending',
    },
];
export default {
    data() {
        return {
            assignVariablesModal: true,
        };
    },
    setup() {
        return {
            columns,
            rows,
        };
    },
};
</script>
