<template>
    <q-dialog @show="getUsers" @hide="resetForm" :model-value="showAddEditDepartmentModal" persistent>
        <q-card style="max-width: 500px; min-width: 300px">
            <q-card-section class="row items-center tw-border-b tw-border-blue-grey-500 tw-px-6">
                <div class="tw-text-lg" :class="`text-${globalColor}`">
                    <div v-if="updateModal">
                        Edit Department <span class="tw-font-medium">#{{ addEditDepartmentFormData.tag }}</span>
                    </div>
                    <div v-else>Add New Department</div>
                </div>

                <q-space></q-space>

                <q-btn icon="close" color="orange-3" flat round dense v-close-popup></q-btn>
            </q-card-section>

            <q-card-section class="tw-px-6">
                <form @submit.prevent="updateModal ? updateDepartment() : createDepartment()">
                    <q-input
                        v-model="addEditDepartmentFormData.tag"
                        :error-message="departmentFormDataErrors.tag"
                        :error="!!departmentFormDataErrors.tag"
                        @update:model-value="departmentFormDataErrors.tag = ''"
                        label="Department Tag"
                        :color="globalColor"
                        class="tw-mb-4"
                        :hint="`${updateModal ? 'Tag update can create issue for running chat' : ''}`"
                        dense
                        hide-bottom-space
                    >
                        <template v-slot:prepend>
                            <q-icon name="tag" :color="globalColor" />
                        </template>
                    </q-input>

                    <q-input
                        v-model="addEditDepartmentFormData.display_name"
                        :error-message="departmentFormDataErrors.display_name"
                        :error="!!departmentFormDataErrors.display_name"
                        @update:model-value="departmentFormDataErrors.display_name = ''"
                        label="Display Name"
                        :color="globalColor"
                        class="tw-mb-4"
                        dense
                        hide-bottom-space
                    >
                        <template v-slot:prepend>
                            <q-icon name="info" :color="globalColor" />
                        </template>
                    </q-input>

                    <q-select
                        label="Select Agents"
                        :options="filterAgentList"
                        v-model="addEditDepartmentFormData.assign_users"
                        :error-message="departmentFormDataErrors.user_ids"
                        :error="!!departmentFormDataErrors.user_ids"
                        @update:model-value="departmentFormDataErrors.user_ids = ''"
                        @filter="filterAgent"
                        class="tw-mb-4"
                        :color="globalColor"
                        use-chips
                        multiple
                        use-input
                        dense
                        hide-bottom-space
                    >
                        <template v-slot:prepend>
                            <q-icon name="group_add" :color="globalColor" />
                        </template>

                        <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" class="tw-py-2" dense>
                                <q-item-section avatar>
                                    <ec-avatar :email="scope.opt.label" size="sm" />
                                </q-item-section>
                                <q-item-section>
                                    {{ scope.opt.label }}
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>

                    <!--<q-checkbox
                        v-model="addEditDepartmentFormData.active"
                        class="tw-mt-2"
                        label="Activate This Department"
                        color="green"
                        dense
                    />-->

                    <!--<div class="tw-text-xxs tw-mt-6 text-white bg-orange tw-p-2 tw-font-bold">
                        <div>Note: If you don't select agents then all agents will be assigned to this department</div>
                    </div>-->
                    <q-btn
                        type="submit"
                        :color="globalColor"
                        :label="updateModal ? 'update' : 'submit'"
                        class="full-width tw-mt-4"
                        unelevated
                    />
                </form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import EcAvatar from "components/common/EcAvatar.vue";

export default defineComponent({
    name: "AddEditDepartmentForm",
    components: { EcAvatar },
    props: {
        showAddEditDepartmentModal: {
            type: Boolean,
            default: false,
        },
        updateModal: {
            type: Boolean,
            default: false,
        },
        selectedForEditData: {
            type: Object,
            default: () => ({}),
        },
    },

    data(): any {
        return {
            agentList: [],
            filterAgentList: [],
            addEditDepartmentFormData: {
                tag: "",
                display_name: "",
                user_ids: [],
                assign_users: [],
            },
            departmentFormDataErrors: {},
        };
    },

    computed: {
        ...mapGetters({
            globalColor: "setting_ui/globalColor",
        }),
    },

    methods: {
        filterAgent(val: any, update: any) {
            update(() => {
                if (val === "") {
                    this.filterAgentList = this.agentList;
                } else {
                    const needle = val.toLowerCase();
                    this.filterAgentList = this.agentList.filter(
                        (agentItem: any) => agentItem.label.toLowerCase().indexOf(needle) > -1
                    );
                }
            });
        },

        getUsers() {
            this.$store
                .dispatch("department/getUsers")
                .then((res: any) => {
                    this.agentList = res.data.map((user: any) => {
                        return {
                            label: user.email,
                            value: user.id,
                        };
                    });
                })
                .catch((err: any) => console.log(err));
        },

        createDepartment() {
            const assignUsers = this.$_.cloneDeep(this.addEditDepartmentFormData.assign_users);

            // get only id
            if (assignUsers) {
                this.addEditDepartmentFormData.user_ids = assignUsers.map((user: any) => user.value);
            }

            this.$store
                .dispatch("department/createDepartment", {
                    inputs: this.addEditDepartmentFormData,
                })
                .then(() => {
                    this.resetForm();

                    this.$emit("createdDepartment");

                    this.$helpers.showSuccessNotification(this, "Department created successful");
                })
                .catch((err: any) => this.addEditDepartmentErrorHandle(err));
        },

        updateDepartment() {
            const assignUsers = this.$_.cloneDeep(this.addEditDepartmentFormData.assign_users);

            // get only id
            if (assignUsers) {
                this.addEditDepartmentFormData.user_ids = assignUsers.map((user: any) => user.value);
            }

            this.$store
                .dispatch("department/updateDepartment", {
                    inputs: this.addEditDepartmentFormData,
                })
                .then((res: any) => {
                    this.resetForm();

                    this.$emit("updatedDepartment", res.data);

                    this.$helpers.showSuccessNotification(this, "Department updated successful");
                })
                .catch((err: any) => this.addEditDepartmentErrorHandle(err));
        },

        addEditDepartmentErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.departmentFormDataErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },

        resetForm() {
            this.$emit("hideModal");
            this.addEditDepartmentFormData = {};
            this.addEditDepartmentFormData.active = true;
            this.departmentFormDataErrors = {};
        },
    },

    watch: {
        selectedForEditData: {
            handler(selectedForEditData) {
                if (this.showAddEditDepartmentModal) {
                    this.addEditDepartmentFormData = this.$_.cloneDeep(selectedForEditData);

                    this.addEditDepartmentFormData.assign_users = selectedForEditData.users.map((user: any) => {
                        return {
                            label: user.email,
                            value: user.id,
                            avatar: user.avatar ?? "https://cdn.quasar.dev/img/avatar1.jpg",
                        };
                    });
                }
            },
            deep: true,
        },
    },
});
</script>

<style scoped></style>
