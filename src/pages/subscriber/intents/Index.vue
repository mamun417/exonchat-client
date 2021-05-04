<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Intents List</div>
            <q-btn color="green" icon="add" label="Add New" @click="showCreateIntentModal"></q-btn>
        </div>

        <!--intent list-->
        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <ec-table
                    :rows="mappedIntents"
                    :columns="columns"
                    :bodyCelTemplate="bodyCelTemplate"
                    @handleEdit="showEditIntentModal($event)"
                    @handleDelete="showConfirmDeleteModal($event)"
                >
                    <!--style less cz i want to modify this -->
                    <!--for all col select dynamix v-slot:[header-cell-itemName from loop] -->
                    <!--                    <template v-slot:header-cell-intent_tag="slotProps">{{ slotProps.col.name }}</template>-->
                    <template v-slot:cell-tag="slotProps">
                        <q-badge color="green" class="text-italic">
                            @{{ slotProps.row.tag }}
                            <q-tooltip class="" anchor="center right" :offset="[50, 14]">
                                {{ slotProps.row.description }}
                            </q-tooltip>
                        </q-badge>
                    </template>

                    <template v-slot:cell-content="slotProps">
                        <div class="tw-text-xxs tw-text-gray-700">
                            {{ slotProps.row.content.content }}
                            <q-inner-loading :showing="!!slotProps.row.content.loading">
                                <q-spinner-dots size="sm" color="green" />
                            </q-inner-loading>
                        </div>
                    </template>

                    <template v-slot:action-at-middle="slotProps">
                        <q-btn icon="settings" text-color="green" size="sm" dense flat>
                            <q-menu>
                                <div class="row no-wrap q-pa-md">
                                    <div class="column">
                                        <div class="text-h7 q-mb-md">Settings</div>
                                        <q-toggle
                                            @click="changeIntentActiveStatus(slotProps.row)"
                                            v-model="slotProps.row.active"
                                            label="Status"
                                        />
                                    </div>
                                </div>
                            </q-menu>
                        </q-btn>
                    </template>
                </ec-table>
            </div>
        </div>

        <add-edit-intent-form
            :showAddEditIntentModal="showAddEditIntentModal"
            :updateModal="updateModal"
            :selectedForEditData="selectedForEditData"
            @createdIntent="getIntents"
            @updatedIntent="handleUpdatedIntent"
            @hideModal="handleHideAddEditIntentModal"
        />

        <!--<add-edit-intent-form v-if="showAddEditIntentModal" @hide="showAddEditIntentModal = false" :updateModal="updateModal" />-->

        <delete-confirm-modal v-if="showDeleteModal" @confirmDelete="deleteIntent" @hide="showDeleteModal = false" />
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import EcTable from 'src/components/common/table/EcTable.vue';
import { defineComponent } from 'vue';
import DeleteConfirmModal from 'components/common/modal/DeleteConfirmModal.vue';
import AddEditIntentForm from 'pages/subscriber/intents/AddEditIntentForm.vue';
// import IntentList from 'pages/subscriber/intents/IntentList.vue';

export default defineComponent({
    name: 'Intents',
    components: { AddEditIntentForm, DeleteConfirmModal, EcTable },
    data(): any {
        return {
            intents: [],
            showAddEditIntentModal: false,
            updateModal: false,
            selectedForEditData: {},
            deleteIntentId: '',
            showDeleteModal: false,
            bodyCelTemplate: { url_path: 'italic-bold' },
            columns: [
                { name: 'tag', align: 'left', label: 'Intent Tag', field: 'tag' },
                {
                    name: 'url_path',
                    align: 'center',
                    label: 'URL Path',
                    field: 'url_path',
                },
                {
                    name: 'content',
                    align: 'center',
                    label: 'Intent Mapped To',
                    field: 'content',
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
            // dynamicVariables: [
            //     { name: 'user_name', des: 'will print assigned name else guest' },
            //     { name: 'user_id', des: 'will print logged users id' },
            // ],
        };
    },

    setup() {
        return {};
    },

    mounted() {
        this.getIntents();
    },

    computed: {
        mappedIntents(): any {
            const intents = _.cloneDeep(this.intents);

            intents.map((intent: any) => {
                intent.url_path =
                    intent.intent_action.type === 'external'
                        ? intent.intent_action.external_path
                        : intent.intent_action.type === 'action'
                        ? `apisiteurl.com/action_resolver?action${intent.intent_action.action_name}`
                        : 'nil';

                intent.content = {
                    content: intent.intent_action.type === 'static' ? intent.intent_action.content : '',
                    loading: intent.intent_action.type !== 'static',
                    type: intent.intent_action.type,
                };

                intent.status = intent.active ? 'active' : 'inactive';

                if (intent.type !== 'static') {
                    // call e.url_path get res & assign to e.content.content & e.content.loading = false
                }
            });

            return intents;
        },
    },

    methods: {
        getIntents() {
            this.$store
                .dispatch('intent/getIntents')
                .then((res: any) => {
                    this.intents = res.data;
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        showCreateIntentModal() {
            this.showAddEditIntentModal = true;
            this.updateModal = false;
        },

        showEditIntentModal(intent: any) {
            this.updateModal = true;
            this.showAddEditIntentModal = true;
            this.selectedForEditData = intent;
        },

        handleUpdatedIntent($event: any) {
            const updatedIntent = $event;

            const intentIndex = this.intents.findIndex((intent: any) => intent.id === updatedIntent.id);

            this.intents[intentIndex] = updatedIntent;
        },

        showConfirmDeleteModal(intent: any) {
            this.showDeleteModal = !this.showDeleteModal;
            this.deleteIntentId = intent.id;
        },

        deleteIntent() {
            // id dnt know wy u need
            // include: {
            //     intent_action: true,
            // },
            // but if u need let me know
            this.$store
                .dispatch('intent/deleteIntent', {
                    id: this.deleteIntentId,
                })
                .then(() => {
                    this.showDeleteModal = false;
                    this.getIntents();

                    this.$helpers.showSuccessNotification(this, 'Intent deleted successful');
                })
                .catch((err: any) => {
                    this.$helpers.showErrorNotification(this, err.response.data.message);
                });
        },

        changeIntentActiveStatus(intent: any) {
            this.$store
                .dispatch('intent/changeIntentActiveStatus', {
                    id: intent.id,
                    active: intent.active,
                })
                .then((res: any) => {
                    const intentIndex = this.intents.findIndex((intent: any) => intent.id === res.data.id);

                    this.intents[intentIndex] = res.data;

                    this.$helpers.showSuccessNotification(this, 'Intent active status change successful');
                })
                .catch((err: any) => {
                    this.$helpers.showErrorNotification(this, err.response.data.message);
                });
        },

        handleHideAddEditIntentModal() {
            this.showAddEditIntentModal = false;
            this.selectedForEditData = {};
        },
    },
});
</script>
