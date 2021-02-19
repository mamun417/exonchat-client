<template>
    <div class="tw-flex tw-flex-col">
        <div
            class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7"
        >
            <div class="tw-font-bold tw-text-lg tw-py-1">My Agents</div>
            <q-btn color="green" icon="add" label="Assign"></q-btn>
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
                                class="text-italic text-green tw-font-bold tw-text-lg"
                            >
                                {{ col.label }}
                            </q-th>
                        </q-tr>
                    </template>

                    <template v-slot:body-cell-info="props">
                        <q-td :props="props">
                            <div class="tw-flex tw-items-center">
                                <q-avatar size="sm"
                                    ><img :src="props.row.img"
                                /></q-avatar>
                                <div class="tw-ml-2">
                                    {{ props.row.info.name }}
                                </div>
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge>{{ props.row.status }}</q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                            <q-btn
                                icon="create"
                                text-color="green"
                                dense
                                flat
                            ></q-btn>
                            <q-btn
                                icon="settings"
                                text-color="green"
                                dense
                                flat
                            ></q-btn>
                        </q-td>
                    </template>

                    <template v-slot:no-data="{ message }">
                        <div
                            class="full-width row flex-center text-red q-gutter-sm"
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
    {
        name: 'info',
        required: true,
        label: 'Name',
        align: 'left',
        field: (row) => row.info,
    },
    {
        name: 'email',
        align: 'center',
        label: 'Email',
        field: 'email',
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
        info: { name: 'hasan', img: '' },
        email: 'm@m.com',
        status: 'active',
    },
    {
        info: { name: 'noman', img: '' },
        email: 'n@n.com',
        status: 'inactive',
    },
    {
        info: { name: 'mamun', img: '' },
        email: 'o@o.com',
        status: 'pending',
    },
];
export default {
    setup() {
        return {
            columns,
            rows,
        };
    },
};
</script>
