<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">My Agents</div>
            <q-btn color="green" icon="add" label="Assign" @click="assignAgentModal = true"></q-btn>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <ec-table :rows="mappedUsers" :columns="columns" :bodyCelTemplate="bodyCelTemplate">
                    <template v-slot:cell-info="slotProps">
                        <div class="tw-flex tw-items-center">
                            <q-avatar size="sm"><img :src="slotProps.row.img" alt="" /></q-avatar>
                            <div class="tw-ml-2">
                                {{ $_.upperFirst(slotProps.row.user_meta.display_name) }}
                            </div>
                        </div>
                    </template>

                    <template v-slot:cell-is_agent="slotProps">
                        <q-badge :color="slotProps.row.is_agent ? 'green' : 'orange'">
                            {{ slotProps.row.is_agent }}
                        </q-badge>
                    </template>

                    <template v-slot:cell-action="slotProps">
                        <q-btn icon="settings" text-color="green" size="sm" dense flat>
                            <q-menu anchor="bottom right" self="top end">
                                <q-item class="text-green" clickable dense>
                                    <q-item-section @click="handleConvertType(slotProps.row)">
                                        Convert To
                                        {{ slotProps.row.role.slug === 'agent' ? 'User' : 'Agent' }}
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
                                            v-model="slotProps.row.active"
                                            @update:model-value="handleActivateDeactivate(slotProps.row)"
                                            left-label
                                            dense
                                        />
                                    </q-item-section>
                                </q-item>
                            </q-menu>
                        </q-btn>

                        <!--<q-btn icon="delete" text-color="red" size="sm" dense flat></q-btn>-->
                    </template>
                </ec-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EcTable from 'components/common/table/EcTable.vue';
import { mapGetters } from 'vuex';

const columns = [
    {
        name: 'info',
        required: true,
        label: 'Name',
        align: 'left',
        field: (row: any) => row.info,
    },
    {
        name: 'email',
        align: 'left',
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

export default defineComponent({
    name: 'Users',
    components: { EcTable },
    data(): any {
        return {
            users: [],
            assignAgentModal: false,
            userAssignFormDataErrors: {},
            bodyCelTemplate: {},
        };
    },

    setup() {
        return {
            columns,
        };
    },

    computed: {
        ...mapGetters({
            profile: 'auth/profile',
        }),

        mappedUsers(): any {
            return this.users
                .map((user: any) => {
                    user.status = user.active ? 'active' : 'inactive';
                    user.is_agent = user.role.slug === 'agent';

                    return user;
                })
                .filter((user: any) => {
                    return user.email !== this.profile.email;
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

        handleConvertType(user: any) {
            const data = this.$_.cloneDeep(user);
            data.convert_to = data.role.slug === 'agent' ? 'user' : 'agent';

            this.$store
                .dispatch('user/convertType', {
                    inputs: data,
                })
                .then((res: any) => {
                    const index = this.users.findIndex((user: any) => user.id === res.data.id);

                    this.users[index] = res.data;

                    this.$helpers.showSuccessNotification(this, `User convert to ${res.data.role.slug} successful`);
                })
                .catch((err: any) => {
                    this.assignUserErrorHandle(err);
                });
        },

        handleActivateDeactivate(user: any) {
            this.$store
                .dispatch('user/updateStatus', {
                    inputs: user,
                })
                .then((res: any) => {
                    const index = this.users.findIndex((user: any) => user.id === res.data.id);

                    this.users[index] = res.data;

                    this.$helpers.showSuccessNotification(this, 'User status change successful');
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
