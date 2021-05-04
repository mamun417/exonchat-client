<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Speech List</div>
            <q-btn color="green" icon="add" label="Add New" @click="showCreateSpeechModal"></q-btn>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <q-table
                    :rows="speeches"
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

                    <template v-slot:body-cell-speech="props">
                        <q-td :props="props">
                            <div class="tw-font-medium">
                                {{ props.row.speech }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-intent="props">
                        <q-td :props="props" v-if="props.row.intent">
                            <q-badge color="green" class="text-italic">
                                @{{ props.row.intent.tag }}
                                <q-tooltip class="" anchor="center right" :offset="[50, 14]">
                                    {{ props.row.intent.description }}
                                </q-tooltip></q-badge
                            >
                        </q-td>
                        <q-td v-else></q-td>
                    </template>

                    <template v-slot:body-cell-generated_by="props">
                        <q-td :props="props">
                            <div class="tw-font-medium">
                                {{ props.row.generated_by ?? 'Me' }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-speech_in_ai="props">
                        <q-td :props="props">
                            <q-badge :color="props.row.has_in_ai ? 'green' : 'orange'">
                                {{ props.row.has_in_ai }}
                            </q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-forced_intent="props">
                        <q-td :props="props">
                            <q-badge :color="props.row.forced_intent ? 'green' : 'orange'">
                                {{ props.row.forced_intent }}
                            </q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge :color="props.row.active ? 'green' : 'orange'">{{ props.row.active }}</q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                            <q-btn
                                icon="create"
                                text-color="green"
                                size="sm"
                                @click="showEditSpeechModal(props.row)"
                                dense
                                flat
                            ></q-btn>
                            <q-btn icon="settings" text-color="green" size="sm" dense flat>
                                <q-menu>
                                    <div class="row no-wrap q-pa-md">
                                        <div class="column">
                                            <div class="text-h7 q-mb-md">Settings</div>
                                            <q-toggle
                                                @click="changeSpeechActiveStatus(props.row)"
                                                v-model="props.row.active"
                                                label="Status"
                                            />
                                        </div>
                                    </div>
                                </q-menu>
                            </q-btn>
                            <q-btn
                                icon="delete"
                                @click="showConfirmDeleteModal(props.row)"
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

        <add-edit-speech-form
            :showAddEditSpeechModal="showAddEditSpeechModal"
            :updateModal="updateModal"
            :selectedForEditData="selectedForEditData"
            @createdSpeech="getSpeeches"
            @updatedSpeech="handleUpdatedSpeech"
            @hideModal="handleAddEditSpeechHideModal"
        />

        <delete-confirm-modal v-if="showDeleteModal" @confirmDelete="deleteSpeech" @hide="showDeleteModal = false" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AddEditSpeechForm from 'pages/subscriber/speech-recognition/AddEditSpeechForm.vue';
import DeleteConfirmModal from 'components/common/modal/DeleteConfirmModal.vue';

export default defineComponent({
    components: { DeleteConfirmModal, AddEditSpeechForm },
    data(): any {
        return {
            columns: [
                { name: 'speech', align: 'left', label: 'Speech', field: 'speech' },
                {
                    name: 'intent',
                    align: 'center',
                    label: 'Mapped to Intent',
                    field: 'intent',
                },
                {
                    name: 'confidence',
                    align: 'center',
                    label: 'Confidence Level',
                    field: 'confidence',
                },
                {
                    name: 'generated_by',
                    align: 'center',
                    label: 'Generated By',
                    field: 'generated_by',
                },
                {
                    name: 'speech_in_ai',
                    align: 'center',
                    label: 'Speech in AI',
                    field: 'speech_in_ai',
                },
                {
                    name: 'forced_intent',
                    align: 'center',
                    label: 'Forced Intent',
                    field: 'forced_intent',
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
            speeches: [],
            showAddEditSpeechModal: false,
            updateModal: false,
            selectedForEditData: {},
            deleteSpeechId: '',
            showDeleteModal: false,
            newSpeechIntent: '',
            variableListModal: false,
        };
    },

    mounted() {
        this.getSpeeches();
    },

    methods: {
        getSpeeches() {
            this.$store
                .dispatch('speech/getSpeeches')
                .then((res: any) => {
                    this.speeches = res.data;
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        showCreateSpeechModal() {
            this.showAddEditSpeechModal = true;
            this.updateModal = false;
        },

        showEditSpeechModal(speech: any) {
            this.updateModal = true;
            this.showAddEditSpeechModal = true;
            this.selectedForEditData = speech;
        },

        handleUpdatedSpeech($event: any) {
            const updatedSpeech = $event;

            const speechIndex = this.speeches.findIndex((speech: any) => speech.id === updatedSpeech.id);

            this.speeches[speechIndex] = updatedSpeech;
        },

        changeSpeechActiveStatus(speech: any) {
            this.$store
                .dispatch('speech/changeIntentActiveStatus', {
                    id: speech.id,
                    active: speech.active,
                })
                .then((res: any) => {
                    const speechIndex = this.speeches.findIndex((speech: any) => speech.id === res.data.id);

                    this.speeches[speechIndex] = res.data;

                    this.$helpers.showSuccessNotification(this, 'Speech active status change successful');
                })
                .catch((err: any) => {
                    this.$helpers.showErrorNotification(this, err.response.data.message);
                });
        },

        showConfirmDeleteModal(speech: any) {
            this.showDeleteModal = !this.showDeleteModal;
            this.deleteSpeechId = speech.id;
        },

        deleteSpeech() {
            this.$store
                .dispatch('speech/deleteSpeech', {
                    id: this.deleteSpeechId,
                })
                .then(() => {
                    this.showDeleteModal = false;
                    this.speeches();

                    this.$helpers.showSuccessNotification(this, 'Speech deleted successful');
                })
                .catch((err: any) => {
                    this.$helpers.showErrorNotification(this, err.response.data.message);
                });
        },

        handleAddEditSpeechHideModal() {
            this.showAddEditSpeechModal = false;
            this.selectedForEditData = {};
        },
    },
});
</script>
