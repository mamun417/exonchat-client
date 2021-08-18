<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">My Agents</div>
            <q-btn
                :color="globalColor"
                icon="add"
                label="Invite"
                @click="
                    assignAgentModal = true;
                    getChatDepartments();
                "
                unelevated
            ></q-btn>
        </div>

        <div>
            <div class="tw-shadow tw-bg-white tw-p-4">
                <ec-table :rows="mappedUsers" :columns="userColumns" :bodyCelTemplate="bodyCelTemplate">
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
                                <q-item clickable dense>
                                    <q-item-section>Role & permission</q-item-section>
                                </q-item>

                                <q-separator />

                                <q-item clickable dense>
                                    <q-item-section>
                                        <q-checkbox
                                            size="sm"
                                            color="green"
                                            label="Active"
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

        <div class="tw-mt-7 tw-shadow tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Invitations</div>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow tw-bg-white tw-p-4">
                <ec-table
                    :rows="mappedInvitations"
                    :columns="invitationColumns"
                    @handleDelete="showConfirmDeleteModal($event)"
                    :status-success-values="statusSuccessValues"
                    :bodyCelTemplate="bodyCelTemplate"
                >
                    <template v-slot:cell-sent_at="slotProps">
                        {{ $helpers.myDate(slotProps.row.created_at, "MMMM Do YYYY, h:mm:ss a") }}
                    </template>

                    <template v-slot:cell-is_agent="slotProps">
                        <q-badge :color="slotProps.row.is_agent ? 'green' : 'orange'">
                            {{ slotProps.row.is_agent }}
                        </q-badge>
                    </template>

                    <template v-slot:cell-active="slotProps">
                        <q-badge :color="slotProps.row.active ? 'green' : 'orange'">{{ slotProps.row.active }}</q-badge>
                    </template>

                    <template v-slot:cell-action="slotProps">
                        <q-btn icon="settings" text-color="green" size="sm" dense flat>
                            <q-menu anchor="bottom right" self="top end">
                                <!--<q-item class="text-green" clickable dense>
                                    <q-item-section>Resend Code</q-item-section>
                                </q-item>
                                <q-separator />-->
                                <!-- bottom two will show until user registers. & will be handled by one api -->

                                <q-item clickable dense>
                                    <q-item-section>
                                        <q-checkbox
                                            size="sm"
                                            color="green"
                                            label="Active After Verify"
                                            class="ec-list-setting-left-label-checkbox"
                                            v-model="slotProps.row.active"
                                            @update:model-value="handleActivateDeactivateInvitation(slotProps.row)"
                                            left-label
                                            :disable="slotProps.row.status !== 'pending'"
                                            dense
                                        />
                                    </q-item-section>
                                </q-item>
                            </q-menu>
                        </q-btn>

                        <q-btn
                            @click="showConfirmDeleteModal(slotProps.row)"
                            icon="delete"
                            text-color="red"
                            size="sm"
                            dense
                            flat
                        ></q-btn>
                    </template>
                </ec-table>
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
                    <div :class="`tw-text-lg text-${globalColor}`">Add New Agent</div>
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
                        :color="globalColor"
                    >
                        <template v-slot:prepend>
                            <q-icon name="mail" :color="globalColor" />
                        </template>
                    </q-input>

                    <q-select
                        v-model="sendInvitationFormData.chat_department_ids"
                        :options="chatDepartments"
                        :error-message="sendInvitationFormDataErrors.chat_department_ids"
                        :error="!!sendInvitationFormDataErrors.chat_department_ids"
                        @update:model-value="sendInvitationFormDataErrors.chat_department_ids = ''"
                        hide-bottom-space
                        option-value="id"
                        option-label="tag"
                        label="Chat Department"
                        class="tw-mb-3"
                        :color="globalColor"
                        use-chips
                        multiple
                        emit-value
                        map-options
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="person" size="xs" color="blue-grey" />
                        </template>
                    </q-select>

                    <q-checkbox
                        v-model="sendInvitationFormData.active"
                        label="Active when verified"
                        :color="globalColor"
                        class="tw-mt-3"
                        dense
                    />

                    <div class="tw-text-xs tw-mt-4 text-white bg-orange tw-p-2 tw-font-bold">
                        <div>A verification email will be send with a random generated password to this email</div>
                    </div>

                    <div class="tw-text-xs tw-mt-2 text-white bg-orange tw-p-2 tw-font-bold">
                        <div>
                            Uncheck 'activate when verified' if you want to change role or permissions after verify
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-mb-4">
                    <q-btn
                        :color="globalColor"
                        :loading="sendingInvitation"
                        label="submit"
                        class="full-width"
                        @click="sendInvitation"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <confirm-modal v-if="showDeleteModal" @confirmed="deleteInvitation" @hide="showDeleteModal = false" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EcTable from "components/common/table/EcTable.vue";
import ConfirmModal from "components/common/modal/ConfirmModal.vue";
import { mapGetters } from "vuex";

const userColumns = [
    {
        name: "info",
        required: true,
        label: "Name",
        align: "left",
        field: (row: any) => row.info,
    },
    {
        name: "email",
        align: "left",
        label: "Email",
        field: "email",
    },
    {
        name: "status",
        label: "Status",
        field: "status",
        align: "center",
    },
    {
        name: "is_agent",
        label: "Is Agent",
        field: "is_agent",
        align: "center",
    },
    {
        name: "action",
        label: "Actions",
        field: "action",
        align: "center",
    },
];

const invitationColumns = [
    {
        name: "email",
        align: "left",
        label: "Email",
        field: "email",
    },
    {
        name: "sent_at",
        label: "Sent At",
        field: "created_at",
        align: "center",
    },
    {
        name: "status",
        label: "Status",
        field: "status",
        align: "center",
    },
    {
        name: "is_agent",
        label: "Is Agent",
        field: "is_agent",
        align: "center",
    },
    {
        name: "active",
        label: "Active",
        field: "active",
        align: "center",
    },
    {
        name: "action",
        label: "Actions",
        field: "action",
        align: "left",
    },
];

export default defineComponent({
    name: "Users",
    components: { EcTable, ConfirmModal },
    data(): any {
        return {
            users: [],
            userAssignFormDataErrors: {},
            bodyCelTemplate: {},

            // invitation
            sendingInvitation: false,
            assignAgentModal: false,
            invitations: [],
            sendInvitationFormData: {
                email: "",
                type: "agent",
                chat_department_ids: [],
                active: true,
            },
            sendInvitationFormDataErrors: {},
            deleteInvitationId: "",
            showDeleteModal: false,
            statusSuccessValues: ["success"],

            loadingChatDepartments: false,
            chatDepartments: [],
        };
    },

    setup() {
        return {
            userColumns,
            invitationColumns,
        };
    },

    computed: {
        ...mapGetters({
            globalBgColor: "setting_ui/globalBgColor",
            globalColor: "setting_ui/globalColor",
            profile: "auth/profile",
        }),

        mappedUsers(): any {
            return this.users
                .map((user: any) => {
                    user.status = user.active ? "active" : "inactive";
                    user.is_agent = user.role.slug === "agent";

                    return user;
                })
                .filter((user: any) => {
                    return user.email !== this.profile.email;
                });
        },

        mappedInvitations(): any {
            return this.invitations.map((inv: any) => {
                inv.status = inv.status === "success" ? "success" : "pending";
                inv.is_agent = inv.type === "agent";
                inv.sent_at = inv.created_at;

                return inv;
            });
        },
    },

    mounted() {
        this.getUsers();
        this.getInvitations();
    },

    methods: {
        getUsers() {
            this.$store
                .dispatch("user/getUsers")
                .then((res: any) => {
                    this.users = res.data;
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        getChatDepartments() {
            this.loadingChatDepartments = true;

            window.socketSessionApi
                .get("/departments")
                .then((res: any) => {
                    // console.log('webchat departments', res);
                    this.chatDepartments = res.data;
                })
                .catch((e: any) => {
                    console.log(e);
                })
                .finally(() => {
                    this.loadingChatDepartments = false;
                });
        },

        // currently off
        // handleConvertType(user: any) {
        //     const data = this.$_.cloneDeep(user);
        //     data.convert_to = data.role.slug === 'agent' ? 'user' : 'agent';
        //
        //     this.$store
        //         .dispatch('user/convertType', {
        //             inputs: data,
        //         })
        //         .then((res: any) => {
        //             const index = this.users.findIndex((user: any) => user.id === res.data.id);
        //
        //             this.users[index] = res.data;
        //
        //             this.$helpers.showSuccessNotification(this, `User convert to ${res.data.role.slug} successful`);
        //         })
        //         .catch((err: any) => {
        //             this.assignUserErrorHandle(err);
        //         });
        // },

        handleActivateDeactivate(user: any) {
            this.$store
                .dispatch("user/updateStatus", {
                    inputs: user,
                })
                .then((res: any) => {
                    const index = this.users.findIndex((user: any) => user.id === res.data.id);

                    this.users[index] = res.data;

                    this.$helpers.showSuccessNotification(this, "User status change successful");
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

        getInvitations() {
            this.$store
                .dispatch("user_invitation/getInvitations")
                .then((res: any) => {
                    this.invitations = res.data;
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        sendInvitation() {
            this.sendingInvitation = true;

            this.$store
                .dispatch("user_invitation/sendInvitation", {
                    inputs: this.sendInvitationFormData,
                })
                .then((res: any) => {
                    this.$helpers.showSuccessNotification(this, res.data.msg);
                    this.assignAgentModal = false;
                    this.getInvitations();
                })
                .catch((err: any) => this.sendInvitationErrorHandle(err))
                .then(() => {
                    this.sendingInvitation = false;
                });
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
                .dispatch("user_invitation/deleteInvitation", {
                    id: this.deleteInvitationId,
                })
                .then(() => {
                    this.showDeleteModal = false;
                    this.getInvitations();

                    this.$helpers.showSuccessNotification(this, "Invitation deleted successful");
                })
                .catch((err: any) => {
                    this.$helpers.showErrorNotification(this, err.response.data.message);
                });
        },

        handleActivateDeactivateInvitation(invitation: any) {
            this.$store
                .dispatch("user_invitation/convertType", {
                    inputs: invitation,
                })
                .then((res: any) => {
                    const index = this.invitations.findIndex((invitation: any) => invitation.id === res.data.id);

                    this.invitations[index] = res.data;

                    this.$helpers.showSuccessNotification(this, "Invitation status change successful");
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
