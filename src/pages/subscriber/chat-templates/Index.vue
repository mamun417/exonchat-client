<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">My Chat Templates</div>
            <q-btn
                :color="globalColor"
                icon="add"
                label="Add New"
                @click="showCreateChatTemplateModal"
                unelevated
            ></q-btn>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <ec-table
                    :rows="mappedChatTemplates"
                    :columns="columns"
                    :bodyCelTemplate="bodyCelTemplate"
                    @handleEdit="showEditChatTemplateModal($event)"
                    @handleDelete="showConfirmDeleteModal($event)"
                >
                    <template v-slot:cell-tag="slotProps">
                        <q-badge :color="globalColor" class="tw-pb-1 tw-px-2">
                            /{{ slotProps.row.tag }}
                            <q-tooltip class="" anchor="center right" :offset="[50, 14]">
                                {{ slotProps.row.description }}
                            </q-tooltip>
                        </q-badge>
                    </template>

                    <template v-slot:cell-intent="slotProps">
                        <div class="tw-text-xxs tw-text-gray-700">
                            {{ slotProps.row.intent ? '@' + slotProps.row.intent.tag : '' }}
                        </div>
                    </template>

                    <template v-slot:cell-msg="slotProps">
                        <div class="tw-text-xxs tw-font-medium">
                            <template v-if="slotProps.row.intent">
                                <div class="tw-text-xxs">
                                    {{ slotProps.row.intent.content.content }}
                                    <q-inner-loading :showing="!!slotProps.row.intent.content.loading">
                                        <q-spinner-dots size="sm" color="green" />
                                    </q-inner-loading>
                                </div>
                            </template>
                            <template v-else>
                                {{ slotProps.row.content }}
                            </template>
                        </div>
                    </template>

                    <template v-slot:cell-chat_department="slotProps">
                        <div class="tw-text-xxs tw-text-gray-700">
                            {{ slotProps.row.chat_department?.tag }}
                        </div>
                    </template>

                    <template v-slot:action-at-middle="slotProps">
                        <q-btn icon="settings" size="sm" :color="globalColor" dense flat>
                            <q-menu>
                                <div class="row no-wrap q-pa-md">
                                    <div class="column">
                                        <div class="text-h7 q-mb-md">Settings</div>
                                        <q-toggle
                                            @click="changeChatTemplateActiveStatus(slotProps.row)"
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

        <add-edit-chat-template-form
            :showAddEditChatTemplateModal="showAddEditChatTemplateModal"
            :updateModal="updateModal"
            :selectedForEditData="selectedForEditData"
            @createdChatTempPlate="getChatTemplates"
            @updatedChatTemplate="handleUpdatedChatTemplate"
            @hideModal="handleHideAddEditChatTemplateModal"
        />

        <confirm-modal v-if="showDeleteModal" @confirmed="deleteChatTemplate" @hide="showDeleteModal = false" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConfirmModal from 'components/common/modal/ConfirmModal.vue';
import AddEditChatTemplateForm from 'pages/subscriber/chat-templates/AddEditChatTemplateForm.vue';
import EcTable from 'components/common/table/EcTable.vue';
import { mapGetters } from 'vuex';

export default defineComponent({
    components: { EcTable, AddEditChatTemplateForm, ConfirmModal },
    data(): any {
        return {
            columns: [
                { name: 'tag', align: 'center', label: 'Tag Name', field: 'tag' },
                { name: 'intent', align: 'center', label: 'Intent', field: 'intent' },
                {
                    name: 'msg',
                    align: 'center',
                    label: 'Message',
                    field: 'msg',
                },
                {
                    name: 'chat_department',
                    align: 'center',
                    label: 'Department',
                    field: 'chat_department',
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
            chatTemplates: [],
            showAddEditChatTemplateModal: false,
            updateModal: false,
            selectedForEditData: {},
            deleteChatTemplateId: '',
            showDeleteModal: false,
            bodyCelTemplate: {},
        };
    },

    mounted() {
        this.getChatTemplates();
    },

    computed: {
        ...mapGetters({
            globalColor: 'setting_ui/globalColor',
            globalBgColor: 'setting_ui/globalBgColor',
        }),

        mappedChatTemplates(): any {
            return this.chatTemplates.map((chatTemplate: any) => {
                if (chatTemplate.intent) {
                    chatTemplate.intent.content = {
                        content:
                            chatTemplate.intent.intent_action.type === 'static'
                                ? chatTemplate.intent.intent_action.content
                                : '',
                        loading: chatTemplate.intent.intent_action.type !== 'static',
                        type: chatTemplate.intent.intent_action.type,
                    };
                }

                chatTemplate.status = chatTemplate.active ? 'active' : 'inactive';

                return chatTemplate;
            });
        },
    },

    methods: {
        // onScrollIntent({ to, ref }) {
        // const lastIndex = options.value.length - 1;
        // if (
        //     loading.value !== true &&
        //     nextPage.value < lastPage &&
        //     to === lastIndex
        // ) {
        //     loading.value = true;
        //     setTimeout(() => {
        //         nextPage.value++;
        //         nextTick(() => {
        //             ref.refresh();
        //             loading.value = false;
        //         });
        //     }, 500);
        // }
        // },
        // filterIntent(val, update) {
        // if (val === '') {
        //     update(() => {
        //         options.value = stringOptions;
        //         // here you have access to "ref" which
        //         // is the Vue reference of the QSelect
        //     });
        //     return;
        // }
        // },

        getChatTemplates() {
            this.$store
                .dispatch('chat_template/getChatTemplates')
                .then((res: any) => {
                    this.chatTemplates = res.data;
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        showCreateChatTemplateModal() {
            this.showAddEditChatTemplateModal = true;
            this.updateModal = false;
        },

        showEditChatTemplateModal(chatTemplate: any) {
            this.updateModal = true;
            this.showAddEditChatTemplateModal = true;
            this.selectedForEditData = chatTemplate;
        },

        handleUpdatedChatTemplate($event: any) {
            const updatedChatTemplate = $event;

            const chatTemplatesIndex = this.chatTemplates.findIndex(
                (intent: any) => intent.id === updatedChatTemplate.id
            );

            this.chatTemplates[chatTemplatesIndex] = updatedChatTemplate;
        },

        changeChatTemplateActiveStatus(department: any) {
            this.$store
                .dispatch('chat_template/changeChatTemplateActiveStatus', {
                    id: department.id,
                    active: department.active,
                })
                .then((res: any) => {
                    const index = this.chatTemplates.findIndex((chatTemplate: any) => chatTemplate.id === res.data.id);

                    this.chatTemplates[index] = res.data;

                    this.$helpers.showSuccessNotification(this, 'Chat Template active status change successful');
                })
                .catch((err: any) => {
                    this.$helpers.showErrorNotification(this, err.response.data.message);
                });
        },

        showConfirmDeleteModal(chatTemplate: any) {
            this.showDeleteModal = !this.showDeleteModal;
            this.deleteChatTemplateId = chatTemplate.id;
        },

        deleteChatTemplate() {
            this.$store
                .dispatch('chat_template/deleteChatTemplate', {
                    id: this.deleteChatTemplateId,
                })
                .then(() => {
                    this.showDeleteModal = false;
                    this.getChatTemplates();

                    this.$helpers.showSuccessNotification(this, 'Chat Template deleted successful');
                })
                .catch((err: any) => {
                    this.$helpers.showErrorNotification(this, err.response.data.message);
                });
        },

        handleHideAddEditChatTemplateModal() {
            this.showAddEditChatTemplateModal = false;
            this.selectedForEditData = {};
        },
    },
});
</script>
