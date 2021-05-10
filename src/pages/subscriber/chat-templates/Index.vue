<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">My Chat Templates</div>
            <q-btn color="green" icon="add" label="Add New" @click="showCreateChatTemplateModal"></q-btn>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <q-table
                    :rows="mappedChatTemplates"
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

                    <template v-slot:body-cell-tag="props">
                        <q-td :props="props">
                            <q-badge color="green" class="text-italic">
                                /{{ props.row.tag }}
                                <q-tooltip class="" anchor="center right" :offset="[50, 14]">
                                    {{ props.row.description }}
                                </q-tooltip>
                            </q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-intent="props">
                        <q-td :props="props">
                            <div class="tw-text-xxs tw-text-gray-700">
                                {{ props.row.intent ? '@' + props.row.intent.tag : '' }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-msg="props">
                        <q-td :props="props">
                            <div class="tw-text-xxs tw-text-gray-700">
                                <div v-if="props.row.intent">
                                    <div class="tw-text-xxs tw-text-gray-700">
                                        {{ props.row.intent.content.content }}
                                        <q-inner-loading :showing="!!props.row.intent.content.loading">
                                            <q-spinner-dots size="sm" color="green" />
                                        </q-inner-loading>
                                    </div>
                                </div>
                                <div v-else>
                                    {{ props.row.content }}
                                </div>
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge :color="props.row.status === 'active' ? 'green' : 'orange'">
                                {{ $_.upperFirst(props.row.status) }}
                            </q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                            <q-btn
                                @click="showEditChatTemplateModal(props.row)"
                                icon="create"
                                text-color="green"
                                size="sm"
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
            </div>
        </div>

        <!--        <q-dialog v-model="newTemplateModal" @update:modelValue="(value) => (newTemplateModal = value)" persistent>
            <q-card style="max-width: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Add New Chat Template</div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input label="Tag Name" color="green" prefix="/" class="tw-my-2" dense
                        ><template v-slot:prepend> <q-icon name="label" color="green" /> </template
                    ></q-input>

                    <q-select
                        label="Choose Department"
                        :options="['Technical', 'Support']"
                        class="tw-my-2"
                        color="green"
                        v-model="newTemplateType"
                        dense
                        ><template v-slot:prepend> <q-icon name="ballot" color="green" /> </template
                    ></q-select>

                    <q-select
                        label="Content Type"
                        :options="['intent', 'static']"
                        class="tw-my-2"
                        color="green"
                        v-model="newTemplateType"
                        dense
                        ><template v-slot:prepend> <q-icon name="ballot" color="green" /> </template
                    ></q-select>

                    <q-select
                        v-show="newTemplateType === 'intent'"
                        label="Choose Intent"
                        :options="[
                            {
                                label: '@price/hosting',
                                value: '@price/hosting',
                                description: 'Get the hosting price',
                            },
                            {
                                label: '@info/user',
                                value: '@info/user',
                                description: 'Get user info',
                            },
                        ]"
                        class="tw-my-2"
                        color="green"
                        options-selected-class="text-green"
                        v-model="intentChoosed"
                        dense
                        ><template v-slot:prepend>
                            <q-icon name="work" color="green" />
                        </template>
                        <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" dense>
                                <q-item-section class="tw-py-1">
                                    <q-item-label v-html="scope.opt.label" />
                                    <q-item-label class="tw-text-xxs" caption>{{ scope.opt.description }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template></q-select
                    >

                    &lt;!&ndash;content&ndash;&gt;
                    <q-input
                        label="Message"
                        color="green"
                        class="tw-my-2"
                        :readonly="newTemplateType === 'intent'"
                        :loading="newTemplateType === 'intent' && true"
                        autogrow
                        dense
                        ><template v-slot:prepend> <q-icon name="text_snippet" color="green" /> </template
                    ></q-input>

                    <q-input label="Description" color="green" class="tw-my-2" dense
                        ><template v-slot:prepend> <q-icon name="description" color="green" /> </template
                    ></q-input>

                    <div>
                        <q-checkbox :v-model="true" class="tw-mt-2" label="Only For Me" color="green" dense />
                    </div>

                    <div>
                        <q-checkbox
                            :v-model="true"
                            class="tw-mt-2"
                            label="Activate This Chat Template"
                            color="green"
                            dense
                        />
                    </div>

                    <div class="tw-text-xxs tw-font-medium tw-mt-5 tw-text-gray-700">
                        You can use dynamic variables in content input as $${variable} from list.
                        <span class="text-green cursor-pointer" @click="variableListModal = true"
                            >Show Variables List</span
                        >
                    </div>
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-my-4">
                    <q-btn color="green" label="submit" class="full-width" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="variableListModal" @update:modelValue="(value) => (variableListModal = value)">
            <q-card style="max-width: 500px; min-width: 300px; max-height: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Variable List</div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section
                    ><q-list separator dense padding>
                        <q-item class="text-green tw-font-bold">
                            <q-item-section> Name </q-item-section>
                            <q-item-section side class="text-green"> About </q-item-section>
                        </q-item>

                        <q-item v-for="item in dynamicVariables" class="tw-text-xs" :key="item.name" clickable v-ripple>
                            <q-item-section>{{ item.name }}</q-item-section>
                            <q-item-section class="tw-ml-4" side>{{ item.des }}</q-item-section>
                        </q-item>
                    </q-list></q-card-section
                >

                <q-card-section class="tw-pt-0"
                    ><div class="tw-text-xs text-center tw-text-gray-500">
                        Note: Click a item to copy a variable name
                    </div></q-card-section
                >
            </q-card>
        </q-dialog>-->

        <add-edit-chat-template-form
            :showAddEditChatTemplateModal="showAddEditChatTemplateModal"
            :updateModal="updateModal"
            :selectedForEditData="selectedForEditData"
            @createdChatTempPlate="getChatTemplates"
            @updatedDepartment="handleUpdatedChatTemplate"
            @hideModal="handleHideAddEditChatTemplateModal"
        />

        <delete-confirm-modal
            v-if="showDeleteModal"
            @confirmDelete="deleteChatTemplate"
            @hide="showDeleteModal = false"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DeleteConfirmModal from 'components/common/modal/DeleteConfirmModal.vue';
import AddEditChatTemplateForm from 'pages/subscriber/chat-templates/AddEditChatTemplateForm.vue';

export default defineComponent({
    components: { AddEditChatTemplateForm, DeleteConfirmModal },
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
