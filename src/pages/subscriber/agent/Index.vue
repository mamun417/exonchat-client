<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">My Agents</div>
            <q-btn color="green" icon="add" label="Assign" @click="assignAgentModal = true"></q-btn>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <q-table
                    :rows="mappedUsers"
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
                                <q-avatar size="sm"><img :src="props.row.img" /></q-avatar>
                                <div class="tw-ml-2">
                                    <!--<pre>{{ props.row }}</pre>-->
                                    {{ $_.upperFirst(props.row.user_meta.display_name) }}
                                </div>
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge>{{ props.row.status }}</q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-is_agent="props">
                        <q-td :props="props">
                            <q-badge :color="props.row.is_agent ? 'green' : 'orange'">{{ props.row.is_agent }}</q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                            <q-btn
                                icon="settings"
                                class="ec-list-settings-menu"
                                text-color="green"
                                size="sm"
                                dense
                                flat
                            >
                                <q-menu anchor="bottom right" self="top end">
                                    <q-item class="text-green" clickable dense>
                                        <q-item-section>
                                            Convert To
                                            {{ props.row.role.slug === 'agent' ? 'User' : 'Agent' }}
                                        </q-item-section>
                                    </q-item>
                                    <q-item class="text-green" clickable dense>
                                        <q-item-section>Role & permission</q-item-section>
                                    </q-item>
                                    <q-separator />
                                    <q-item class="text-green" clickable dense>
                                        <q-item-section>
                                            <q-checkbox
                                                size="sm"
                                                color="green"
                                                label="Activate"
                                                class="ec-list-setting-left-label-checkbox"
                                                v-model="props.row.active"
                                                @update:model-value="handleActivateDeactivate(props.row)"
                                                left-label
                                                dense
                                            />
                                        </q-item-section>
                                    </q-item>
                                </q-menu>
                            </q-btn>
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
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
        name: 'is_agent',
        label: 'Is Agent',
        field: 'is_agent',
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
        is_agent: true,
    },
    {
        info: { name: 'noman', img: '' },
        email: 'n@n.com',
        status: 'inactive',
        is_agent: false,
    },
    {
        info: { name: 'mamun', img: '' },
        email: 'o@o.com',
        status: 'pending',
        is_agent: true,
    },
];
export default defineComponent({
    name: 'Users',
    data(): any {
        return {
            users: [],
            assignAgentModal: false,
            userAssignFormDataErrors: {},
        };
    },

    setup() {
        return {
            columns,
            rows,
        };
    },

    computed: {
        mappedUsers(): any {
            return this.users.map((user: any) => {
                user.status = user.active ? 'active' : 'inactive';
                user.is_agent = user.role.slug === 'agent';

                return user;
            });
        },
    },

    mounted() {
        this.getUsers();
    },

    methods: {
        getUsers() {
            this.$store
                .dispatch('user/getUsers')
                .then((res: any) => {
                    this.users = res.data;
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        handleActivateDeactivate(user: any) {
            this.$store
                .dispatch('user/convertType', {
                    inputs: user,
                })
                .then((res: any) => {
                    const index = this.users.findIndex((user: any) => user.id === res.data.id);

                    this.users[index] = res.data;

                    this.$helpers.showSuccessNotification(this, `User convert to ${res.data.type} successful`);
                })
                .catch((err: any) => {
                    this.assignUserErrorHandle(err);
                });
        },

        assignUserErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.userAssignFormDataErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },
    },
});
</script>

<style lang="scss">
.ec-list-setting-left-label-checkbox {
    .q-checkbox__label {
        width: 100%;
    }
}
</style>
