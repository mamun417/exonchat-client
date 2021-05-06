<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Department List</div>
            <q-btn color="green" icon="add" label="Add New" @click="showCreateDepartmentModal"></q-btn>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <q-table
                    :rows="departments"
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
                                class="text-italic text-green tw-font-bold tw-text-lg"
                            >
                                {{ col.label }}
                            </q-th>
                        </q-tr>
                    </template>

                    <template v-slot:body-cell-assigned_agents="props">
                        <q-td :props="props">
                            <q-avatar
                                v-for="(agent, key) in props.row.assigned_agents"
                                :key="agent.email"
                                size="35px"
                                :style="key !== 0 ? { marginLeft: '-8px' } : ''"
                            >
                                <img :src="agent.avatar ?? 'https://cdn.quasar.dev/img/avatar1.jpg'" />
                                <q-tooltip class="">
                                    {{ agent.email }}
                                </q-tooltip>
                            </q-avatar>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-active="props">
                        <q-td :props="props">
                            <q-badge :color="props.row.active ? 'green' : 'orange'">
                                {{ $_.upperFirst(props.row.active ? 'Active' : 'Inactive') }}
                            </q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                            <q-btn
                                @click="showEditIntentModal(props.row)"
                                icon="create"
                                text-color="green"
                                size="sm"
                                dense
                                flat
                            ></q-btn>
                            <q-btn icon="settings" text-color="green" size="sm" dense flat>
                                <q-menu>
                                    <div class="row no-wrap q-pa-md">
                                        <div class="column">
                                            <div class="text-h7 q-mb-md">Settings</div>
                                            <q-toggle
                                                @click="changeDepartmentActiveStatus(props.row)"
                                                v-model="props.row.active"
                                                label="Status"
                                            />
                                        </div>
                                    </div>
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

        <delete-confirm-modal
            v-if="showDeleteModal"
            @confirmDelete="deleteDepartment"
            @hide="showDeleteModal = false"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AddEditDepartmentForm from 'pages/subscriber/departments/AddEditDepartmentForm.vue';
import DeleteConfirmModal from 'components/common/modal/DeleteConfirmModal.vue';

export default defineComponent({
    components: { DeleteConfirmModal, AddEditDepartmentForm },
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
                    name: 'active',
                    label: 'Status',
                    field: 'active',
                    align: 'center',
                },
                {
                    name: 'action',
                    label: 'Actions',
                    field: 'action',
                    align: 'center',
                },
            ],
            // rows: [
            //     {
            //         dep_name: 'Technical',
            //         assigned_agents: [
            //             { name: 'hasan', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' },
            //             {
            //                 name: 'susmita',
            //                 avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
            //             },
            //         ],
            //         status: 'active',
            //     },
            // ],
            // dynamicVariables: [
            //     { name: 'user_name', des: 'will print assigned name else guest' },
            //     { name: 'user_id', des: 'will print logged users id' },
            // ],
            departments: [],
            showAddEditDepartmentModal: false,
            updateModal: false,
            selectedForEditData: {},
            deleteDepartmentId: '',
            showDeleteModal: false,
        };
    },

    mounted() {
        this.getDepartments();
    },

    methods: {
        getDepartments() {
            this.$store
                .dispatch('department/getDepartments')
                .then((res: any) => {
                    this.departments = res.data.map((department: any) => {
                        return {
                            ...department,
                            assigned_agents: department.users,
                        };
                    });
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        showCreateDepartmentModal() {
            this.showAddEditDepartmentModal = true;
            this.updateModal = false;
        },

        showEditIntentModal(department: any) {
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
                    const index = this.departments.findIndex((speech: any) => speech.id === res.data.id);

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
