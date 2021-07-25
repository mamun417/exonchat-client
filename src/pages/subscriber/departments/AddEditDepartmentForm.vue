<template>
    <q-dialog @show="getUsers" @hide="resetForm" :model-value="showAddEditDepartmentModal" persistent>
        <q-card style="max-width: 500px">
            <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                <div class="tw-text-lg text-green">
                    <div v-if="updateModal">
                        Edit Department <b>@{{ addEditDepartmentFormData.tag }}</b>
                    </div>
                    <div v-else>Add New Department</div>
                </div>
                <q-space></q-space>
                <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
            </q-card-section>

            <form @submit.prevent="updateModal ? updateDepartment() : createDepartment()">
                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input
                        v-model="addEditDepartmentFormData.tag"
                        :error-message="departmentFormDataErrors.tag"
                        :error="!!departmentFormDataErrors.tag"
                        @update:model-value="departmentFormDataErrors.tag = ''"
                        :readonly="updateModal"
                        :disable="updateModal"
                        label="Department Name"
                        color="green"
                        class="tw-my-2"
                        dense
                        hide-bottom-space
                    >
                        <template v-slot:prepend> <q-icon name="tag" color="green" /> </template>
                    </q-input>

                    <!--<q-input
                        v-model="addEditDepartmentFormData.description"
                        :error-message="departmentFormDataErrors.description"
                        :error="!!departmentFormDataErrors.description"
                        @update:model-value="departmentFormDataErrors.description = ''"
                        label="Description"
                        color="green"
                        class="tw-my-2"
                        dense
                    >
                        <template v-slot:prepend> <q-icon name="description" color="green" /> </template>
                    </q-input>-->

                    <q-select
                        label="Select Agents"
                        :options="filterAgentList"
                        v-model="addEditDepartmentFormData.assign_users"
                        :error-message="departmentFormDataErrors.user_ids"
                        :error="!!departmentFormDataErrors.user_ids"
                        @update:model-value="departmentFormDataErrors.user_ids = ''"
                        @filter="filterAgent"
                        class="tw-my-2"
                        color="green"
                        use-chips
                        multiple
                        use-input
                        dense
                        hide-bottom-space
                    >
                        <template v-slot:prepend> <q-icon name="group_add" color="green" /> </template>
                        <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" class="tw-py-2" dense>
                                <q-item-section avatar>
                                    <q-avatar><img :src="scope.opt.avatar" /></q-avatar>
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
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-my-4">
                    <q-btn type="submit" color="green" :label="updateModal ? 'update' : 'submit'" class="full-width" />
                </q-card-actions>
            </form>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AddEditDepartmentForm',

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
                tag: '',
                user_ids: [],
                assign_users: [],
            },
            departmentFormDataErrors: {},
        };
    },

    methods: {
        filterAgent(val: any, update: any) {
            update(() => {
                if (val === '') {
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
                .dispatch('department/getUsers')
                .then((res: any) => {
                    this.agentList = res.data.map((user: any) => {
                        return {
                            label: user.email,
                            value: user.id,
                            avatar: user.avatar ?? 'https://cdn.quasar.dev/img/avatar1.jpg',
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
                .dispatch('department/createDepartment', {
                    inputs: this.addEditDepartmentFormData,
                })
                .then(() => {
                    this.resetForm();

                    this.$emit('createdDepartment');

                    this.$helpers.showSuccessNotification(this, 'Department created successful');
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
                .dispatch('department/updateDepartment', {
                    inputs: this.addEditDepartmentFormData,
                })
                .then((res: any) => {
                    this.resetForm();

                    this.$emit('updatedDepartment', res.data);

                    this.$helpers.showSuccessNotification(this, 'Department updated successful');
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
            this.$emit('hideModal');
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
                            avatar: user.avatar ?? 'https://cdn.quasar.dev/img/avatar1.jpg',
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
