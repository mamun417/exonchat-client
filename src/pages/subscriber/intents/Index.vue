<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Intents List</div>
            <q-btn color="green" icon="add" label="Add New" @click="showCreateIntentModal"></q-btn>
        </div>

        <!--intent list-->
        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <q-table
                    :rows="mappedIntents"
                    :columns="columns"
                    row-key="name"
                    :pagination="{ rowsPerPage: 0 }"
                    hide-pagination
                    flat
                >
                    <template v-slot:top-left>
                        <q-input dense debounce="300" placeholder="Search" color="green">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>

                    <template v-slot:top-right>
                        <q-btn label="Filter" color="green" icon="filter" size="sm" no-caps flat>
                            <q-menu>
                                <q-list>
                                    <q-select placeholder="type"></q-select>
                                    <q-select placeholder="status"></q-select>
                                </q-list>
                            </q-menu>
                        </q-btn>
                        <q-badge class="tw-px-1">
                            type: active
                            <q-btn size="xs" icon="close" class="tw-ml-1 tw-p-0" round flat />
                        </q-badge>
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

                    <template v-slot:body-cell-intent_tag="props">
                        <q-td :props="props">
                            <q-badge color="green" class="text-italic">
                                @{{ props.row.tag }}
                                <q-tooltip class="" anchor="center right" :offset="[50, 14]">
                                    {{ props.row.description }}
                                </q-tooltip>
                            </q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-url_path="props">
                        <q-td :props="props">
                            <div class="tw-text-xxs text-italic tw-font-medium tw-text-gray-700">
                                {{ props.row.url_path }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-content="props">
                        <q-td :props="props">
                            <div class="tw-text-xxs tw-text-gray-700">
                                {{ props.row.content.content }}
                                <q-inner-loading :showing="!!props.row.content.loading">
                                    <q-spinner-dots size="sm" color="green" />
                                </q-inner-loading>
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge :color="props.row.active ? '' : 'red'">
                                {{ props.row.active ? 'Active' : 'Inactive' }}
                            </q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                            <q-btn
                                icon="create"
                                text-color="green"
                                size="sm"
                                @click="showEditIntentModal(props.row)"
                                dense
                                flat
                            ></q-btn>
                            <q-btn icon="settings" text-color="green" size="sm" dense flat></q-btn>
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

                <!--&lt;!&ndash;just uncomment me for see the work and changes &ndash;&gt;-->
                <!--<ec-table :rows="mappedIntents" :columns="columns" :bodyCelTemplate="{ intent_tag: 'italic-bold' }">-->
                <!--    &lt;!&ndash;style less cz i want to modify this &ndash;&gt;-->
                <!--    &lt;!&ndash;for all col select dynamix v-slot:[header-cell-itemName from loop] &ndash;&gt;-->
                <!--    <template v-slot:header-cell-intent_tag="slotProps">{{ slotProps.col.name }}</template>-->

                <!--    <template v-slot:action-at-start><q-btn icon="settings" size="sm" dense flat /></template>-->
                <!--    <template v-slot:action-at-middle="slotProps">{{ slotProps.row.id }}</template>-->
                <!--    <template v-slot:action-at-end><q-badge>i am badge</q-badge></template>-->
                <!--</ec-table>-->
            </div>
        </div>

        <add-edit-intent-form
            v-model:showAddEditIntentModal="showAddEditIntentModal"
            :modalTypeUpdate="modalTypeUpdate"
            :selectedForEditData="selectedForEditData"
            @createdIntent="getIntents"
            @updatedIntent="handleUpdatedIntent"
        />

        <!--<add-edit-intent-form v-if="showAddEditIntentModal" @hide="showAddEditIntentModal = false" :modalTypeUpdate="modalTypeUpdate" />-->

        <delete-confirm-modal v-if="showDeleteModal" @confirmDelete="deleteIntent" @hide="showDeleteModal = false" />
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
// import EcTable from 'src/components/common/table/EcTable.vue';
import { defineComponent } from 'vue';
import DeleteConfirmModal from 'components/common/modal/DeleteConfirmModal.vue';
import AddEditIntentForm from 'pages/subscriber/intents/AddEditIntentForm.vue';
// import IntentList from 'pages/subscriber/intents/IntentList.vue';

export default defineComponent({
    name: 'Intents',
    components: { AddEditIntentForm, DeleteConfirmModal },
    data(): any {
        return {
            intents: [],
            showAddEditIntentModal: false,
            modalTypeUpdate: false,
            selectedForEditData: '',
            deleteIntentId: '',
            showDeleteModal: false,
            columns: [
                { name: 'intent_tag', align: 'left', label: 'Intent Tag', field: 'tag' },
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

            intents.map((e: any) => {
                e.url_path =
                    e.intent_action.type === 'external'
                        ? e.intent_action.external_path
                        : e.intent_action.type === 'action'
                        ? `apisiteurl.com/action_resolver?action${e.intent_action.action_name}`
                        : 'nil';

                e.content = {
                    content: e.intent_action.type === 'static' ? e.intent_action.content : '',
                    loading: e.intent_action.type !== 'static',
                    type: e.intent_action.type,
                };

                if (e.type !== 'static') {
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
            this.modalTypeUpdate = false;
        },

        showEditIntentModal(intent: any) {
            this.modalTypeUpdate = true;
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
    },
});
</script>
