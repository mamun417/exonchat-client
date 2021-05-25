<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Invitations</div>
            <q-btn color="green" icon="add" label="Add New" @click="assignAgentModal = true"></q-btn>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <q-table
                    :rows="mappedInvitations"
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

                    <template v-slot:body-cell-sent_at="props">
                        <q-td :props="props">
                            {{ $helpers.myDate(props.row.created_at, 'MMMM Do YYYY, h:mm:ss a') }}
                        </q-td>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge :color="props.row.status === 'success' ? 'green' : 'orange'">
                                {{ props.row.status }}
                            </q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-is_agent="props">
                        <q-td :props="props">
                            <q-badge :color="props.row.is_agent ? 'green' : 'orange'">{{ props.row.is_agent }}</q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-active="props">
                        <q-td :props="props">
                            <q-badge :color="props.row.active ? 'green' : 'orange'">{{ props.row.active }}</q-badge>
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
                                    <!--<q-item class="text-green" clickable dense>
                                        <q-item-section>Resend Code</q-item-section>
                                    </q-item>
                                    <q-separator />-->
                                    <!-- bottom two will show until user registers. & will be handled by one api -->
                                    <q-item class="text-green" clickable dense>
                                        <q-item-section @click="handleConvertType(props.row)"
                                            >Convert To
                                            {{ props.row.type === 'agent' ? 'User' : 'Agent' }}
                                        </q-item-section>
                                    </q-item>
                                    <q-item class="text-green" clickable dense>
                                        <q-item-section @click="handleActivateDeactivate">
                                            <q-checkbox
                                                size="sm"
                                                color="green"
                                                label="Deactivate"
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
                            <q-btn
                                @click="showConfirmDeleteModal(props.row)"
                                icon="delete"
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

        <q-dialog
            @hide="resetForm"
            v-model="assignAgentModal"
            @update:modelValue="(value) => (assignAgentModal = value)"
            persistent
        >
            <q-card style="max-width: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Add New User/Agent</div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input
                        :error-message="sendInvitationFormDataErrors.email"
                        :error="!!sendInvitationFormDataErrors.email"
                        @update:model-value="sendInvitationFormDataErrors.email = ''"
                        v-model="sendInvitationFormData.email"
                        label="Email"
                        color="green"
                    >
                        <template v-slot:prepend> <q-icon name="mail" color="green" /> </template>
                    </q-input>

                    <q-select
                        v-model="sendInvitationFormData.type"
                        :options="['user', 'agent']"
                        label="Choose user role"
                        :error-message="sendInvitationFormDataErrors.type"
                        :error="!!sendInvitationFormDataErrors.type"
                        @update:model-value="sendInvitationFormDataErrors.type = ''"
                    >
                        <template v-slot:prepend><q-icon name="groups" color="green" /></template>
                    </q-select>

                    <q-checkbox
                        v-model="sendInvitationFormData.active"
                        label="Active when verified"
                        color="green"
                        class="tw-mt-3"
                        dense
                    />

                    <div class="tw-text-xs tw-mt-4 text-white bg-orange tw-p-2 tw-font-bold">
                        <div>A verification email will be sended with a random generated password to this email</div>
                    </div>

                    <div class="tw-text-xs tw-mt-2 text-white bg-orange tw-p-2 tw-font-bold">
                        <div>Uncheck 'activate when verified' if you want to change role or permissions</div>
                    </div>
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-mb-4">
                    <q-btn color="green" label="submit" class="full-width" @click="sendInvitation" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <confirm-modal v-if="showDeleteModal" @confirmed="deleteInvitation" @hide="showDeleteModal = false" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConfirmModal from 'components/common/modal/ConfirmModal.vue';

const columns = [
    {
        name: 'email',
        align: 'left',
        label: 'Email',
        field: 'email',
    },
    {
        name: 'sent_at',
        label: 'Sent At',
        field: 'created_at',
        align: 'left',
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
        name: 'active',
        label: 'Active',
        field: 'active',
        align: 'center',
    },
    {
        name: 'action',
        label: 'Actions',
        field: 'action',
        align: 'left',
    },
];

const rows = [
    {
        email: 'm@m.com',
        status: 'active',
        is_agent: true,
        sent_at: '1.1.1',
    },
    {
        email: 'n@n.com',
        status: 'inactive',
        is_agent: false,
        sent_at: '1.1.1',
    },
    {
        email: 'o@o.com',
        status: 'pending',
        is_agent: true,
        sent_at: '1.1.1',
    },
];

export default defineComponent({
    components: { ConfirmModal },
    data(): any {
        return {
            assignAgentModal: false,
            invitations: [],
            sendInvitationFormData: {
                email: '',
                type: 'agent',
                active: true,
            },
            sendInvitationFormDataErrors: {},
            deleteInvitationId: '',
            showDeleteModal: false,
        };
    },

    setup() {
        return {
            columns,
            rows,
        };
    },

    computed: {
        mappedInvitations(): any {
            return this.invitations.map((inv: any) => {
                inv.is_agent = inv.type === 'agent';
                inv.sent_at = inv.created_at;

                return inv;
            });
        },
    },

    mounted() {
        this.getInvitations();
    },

    methods: {
        getInvitations() {
            this.$store
                .dispatch('user_invitation/getInvitations')
                .then((res: any) => {
                    this.invitations = res.data;
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        sendInvitation() {
            this.$store
                .dispatch('user_invitation/sendInvitation', {
                    inputs: this.sendInvitationFormData,
                })
                .then((res: any) => {
                    this.$helpers.showSuccessNotification(this, res.data.msg);
                    this.assignAgentModal = false;
                    this.getInvitations();
                })
                .catch((err: any) => this.sendInvitationErrorHandle(err));
        },

        sendInvitationErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.sendInvitationFormDataErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },

        resetForm() {
            this.sendInvitationFormData = {};
            this.sendInvitationFormData.active = true;
            this.sendInvitationFormDataErrors = {};
        },

        showConfirmDeleteModal(invitation: any) {
            this.showDeleteModal = !this.showDeleteModal;
            this.deleteInvitationId = invitation.id;
        },

        deleteInvitation() {
            this.$store
                .dispatch('user_invitation/deleteInvitation', {
                    id: this.deleteInvitationId,
                })
                .then(() => {
                    this.showDeleteModal = false;
                    this.getInvitations();

                    this.$helpers.showSuccessNotification(this, 'Invitation deleted successful');
                })
                .catch((err: any) => {
                    this.$helpers.showErrorNotification(this, err.response.data.message);
                });
        },

        handleConvertType(invitation: any) {
            const data = this.$_.cloneDeep(invitation);
            data.type = data.type === 'agent' ? 'user' : 'agent';

            this.$store
                .dispatch('user_invitation/convertType', {
                    inputs: data,
                })
                .then((res: any) => {
                    const index = this.invitations.findIndex((invitation: any) => invitation.id === res.data.id);

                    this.invitations[index] = res.data;

                    this.$helpers.showSuccessNotification(this, `User role convert to ${res.data.type} successful`);
                })
                .catch((err: any) => {
                    this.sendInvitationErrorHandle(err);
                });
        },

        handleActivateDeactivate(invitation: any) {
            this.$store
                .dispatch('user_invitation/convertType', {
                    inputs: invitation,
                })
                .then((res: any) => {
                    const index = this.invitations.findIndex((invitation: any) => invitation.id === res.data.id);

                    this.invitations[index] = res.data;

                    this.$helpers.showSuccessNotification(this, 'Invitation status change successful');
                })
                .catch((err: any) => {
                    this.sendInvitationErrorHandle(err);
                });
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
