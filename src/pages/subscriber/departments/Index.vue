<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Department List</div>
            <q-btn color="green" icon="add" label="Add New" @click="showCreateDepartmentModal"></q-btn>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <ec-table
                    :rows="mappedDepartments"
                    :columns="columns"
                    :bodyCelTemplate="bodyCelTemplate"
                    @handleEdit="showEditDepartmentModal($event)"
                    @handleDelete="showConfirmDeleteModal($event)"
                >
                    <template v-slot:cell-assigned_agents="slotProps">
                        <div v-if="slotProps.row.assigned_agents.length">
                            <q-avatar
                                v-for="(agent, key) in slotProps.row.assigned_agents"
                                :key="agent.email"
                                size="35px"
                                :style="key !== 0 ? { marginLeft: '-8px' } : ''"
                            >
                                <img :src="agent.avatar ?? 'https://cdn.quasar.dev/img/avatar1.jpg'" alt="" />
                                <q-tooltip class="">
                                    {{ agent.email }}
                                </q-tooltip>
                            </q-avatar>
                        </div>
                        <div v-else></div>
                    </template>

                    <template v-slot:action-at-middle="slotProps">
                        <q-btn icon="settings" text-color="green" size="sm" dense flat>
                            <q-menu>
                                <div class="row no-wrap q-pa-md">
                                    <div class="column">
                                        <div class="text-h7 q-mb-md">Settings</div>
                                        <q-toggle
                                            @click="changeDepartmentActiveStatus(slotProps.row)"
                                            v-model="slotProps.row.active"
                                            label="Status"
                                        />
                                    </div>
                                </div>
                            </q-menu>
                        </q-btn>
                    </template>
                </ec-table>

                <div class="tw-text-xxs tw-mt-5 text-grey-8 tw-p-2 tw-font-medium">
                    Note: If a agent is assigned to a department then agent will be prioritized to this department. Else
                    all the department.
                </div>
            </div>
        </div>

        <add-edit-department-form
            :showAddEditDepartmentModal="showAddEditDepartmentModal"
            :updateModal="updateModal"
            :selectedForEditData="selectedForEditData"
            @createdDepartment="getDepartments"
            @updatedDepartment="handleUpdatedDepartment"
            @hideModal="handleHideAddEditDepartmentModal"
        />

        <confirm-modal v-if="showDeleteModal" @confirmed="deleteDepartment" @hide="showDeleteModal = false" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AddEditDepartmentForm from 'pages/subscriber/departments/AddEditDepartmentForm.vue';
import ConfirmModal from 'components/common/modal/ConfirmModal.vue';
import EcTable from 'components/common/table/EcTable.vue';

export default defineComponent({
    components: { EcTable, ConfirmModal, AddEditDepartmentForm },
    data(): any {
        return {
            columns: [
                {
                    name: 'tag',
                    align: 'left',
                    label: 'Department Tag',
                    field: 'tag',
                },
                {
                    name: 'description',
                    align: 'left',
                    label: 'Description',
                    field: 'description',
                },
                {
                    name: 'assigned_agents',
                    align: 'center',
                    label: 'Assigned Agents',
                    field: 'users',
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
            ],
            departments: [],
            showAddEditDepartmentModal: false,
            updateModal: false,
            selectedForEditData: {},
            deleteDepartmentId: '',
            showDeleteModal: false,
            bodyCelTemplate: {},
        };
    },

    mounted() {
        this.getDepartments();
    },

    computed: {
        mappedDepartments(): any {
            return this.departments.map((department: any) => {
                department.assigned_agents = department.users;
                department.status = department.active ? 'active' : 'inactive';

                return department;
            });
        },
    },

    methods: {
        getDepartments() {
            this.$store
                .dispatch('department/getDepartments')
                .then((res: any) => {
                    this.departments = res.data;
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        showCreateDepartmentModal() {
            this.showAddEditDepartmentModal = true;
            this.updateModal = false;
        },

        showEditDepartmentModal(department: any) {
            this.updateModal = true;
            this.showAddEditDepartmentModal = true;
            this.selectedForEditData = department;
        },

        handleUpdatedDepartment($event: any) {
            const updatedDepartment = $event;

            const departmentIndex = this.departments.findIndex((intent: any) => intent.id === updatedDepartment.id);

            this.departments[departmentIndex] = updatedDepartment;
        },

        changeDepartmentActiveStatus(department: any) {
            this.$store
                .dispatch('department/changeDepartmentActiveStatus', {
                    id: department.id,
                    active: department.active,
                })
                .then((res: any) => {
                    const index = this.departments.findIndex((department: any) => department.id === res.data.id);

                    this.departments[index] = res.data;

                    this.$helpers.showSuccessNotification(this, 'Department active status change successful');
                })
                .catch((err: any) => {
                    this.$helpers.showErrorNotification(this, err.response.data.message);
                });
        },

        showConfirmDeleteModal(department: any) {
            this.showDeleteModal = !this.showDeleteModal;
            this.deleteDepartmentId = department.id;
        },

        deleteDepartment() {
            this.$store
                .dispatch('department/deleteDepartment', {
                    id: this.deleteDepartmentId,
                })
                .then(() => {
                    this.showDeleteModal = false;
                    this.getDepartments();

                    this.$helpers.showSuccessNotification(this, 'Department deleted successful');
                })
                .catch((err: any) => {
                    this.$helpers.showErrorNotification(this, err.response.data.message);
                });
        },

        handleHideAddEditDepartmentModal() {
            this.showAddEditDepartmentModal = false;
            this.selectedForEditData = {};
        },
    },
});
</script>
