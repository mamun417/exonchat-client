<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Intents List</div>
            <q-btn color="green" icon="add" label="Add New" @click="newIntentModal = true"></q-btn>
        </div>
        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <q-table
                    :rows="intents"
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
                                @click="handleEditIntent(props.row)"
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

        <q-dialog
            @before-hide="resetForm"
            v-model="newIntentModal"
            @update:modelValue="(value) => (newIntentModal = value)"
            persistent
        >
            <q-card style="max-width: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Add New Intent</div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input
                        label="Intent Tag"
                        color="green"
                        prefix="@"
                        class="tw-my-2"
                        v-model="intentFormData.tag"
                        :error-message="intentFormDataErrors[0]"
                        :error="!!intentFormDataErrors[0]"
                        @input="intentFormDataErrors[0] = ''"
                        autofocus
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="label" color="green" />
                        </template>
                    </q-input>

                    <q-select
                        label="Content Type"
                        :options="['action', 'static', 'external']"
                        class="tw-my-2"
                        color="green"
                        v-model="intentFormData.type"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="ballot" color="green" />
                        </template>
                    </q-select>

                    <q-input
                        :label="getContentTypeUtility"
                        class="tw-my-2"
                        color="green"
                        options-selected-class="text-green"
                        v-model="intentChosen"
                        :autogrow="intentFormData.type === 'static'"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="work" color="green" />
                        </template>
                    </q-input>

                    <q-input
                        label="Description"
                        v-model="intentFormData.description"
                        color="green"
                        class="tw-my-2"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="description" color="green" />
                        </template>
                    </q-input>

                    <q-checkbox
                        v-model="intentFormData.active"
                        class="tw-mt-2"
                        label="Activate This Intent"
                        color="green"
                        dense
                    />

                    <div class="tw-text-xxs tw-mt-6 text-white bg-orange tw-p-2 tw-font-bold">
                        <div>When a msg is parsed by ai it will resolve to your intents action or content.</div>
                    </div>
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-mb-4 tw-mt-2">
                    <q-btn color="green" label="submit" class="full-width" @click="saveIntent" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog
            @before-hide="resetForm"
            v-model="editIntent"
            @update:modelValue="(value) => (editIntent = value)"
            persistent
        >
            <!-- load parent intents all content -->
            <!--  -->
            <q-card style="max-width: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">
                        Edit Intent <b>@{{ intentFormData.tag }}</b>
                    </div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input
                        v-model="intentFormData.tag"
                        :error-message="intentFormDataErrors[0]"
                        :error="!!intentFormDataErrors[0]"
                        @input="intentFormDataErrors[0] = ''"
                        autofocus
                        label="Intent Tag"
                        color="green"
                        prefix="@"
                        class="tw-my-2"
                        dense
                        readonly
                    >
                        <template v-slot:prepend>
                            <q-icon name="label" color="green" />
                        </template>
                    </q-input>

                    <q-select
                        label="Content Type"
                        :options="['action', 'static', 'external']"
                        class="tw-my-2"
                        color="green"
                        v-model="intentFormData.type"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="ballot" color="green" />
                        </template>
                    </q-select>

                    <q-input
                        :label="getContentTypeUtility"
                        class="tw-my-2"
                        color="green"
                        options-selected-class="text-green"
                        v-model="intentChosen"
                        :autogrow="intentChosen.type === 'static'"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="work" color="green" />
                        </template>
                    </q-input>

                    <q-input
                        v-model="intentFormData.description"
                        label="Description"
                        color="green"
                        class="tw-my-2"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="description" color="green" />
                        </template>
                    </q-input>

                    <q-checkbox
                        v-model="intentFormData.active"
                        class="tw-mt-2"
                        label="Activate This Intent"
                        color="green"
                        dense
                    />
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-my-4">
                    <q-btn color="green" label="update" class="full-width" @click="updateIntent" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog @before-hide="deleteIntentId = ''" v-model="confirmDelete" persistent>
            <q-card style="min-width: 350px">
                <q-card-section class="row items-center">
                    <span class="q-ml-sm">Are you want to delete ?</span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn @click="deleteIntent" label="Yes" color="primary" v-close-popup flat />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Intents',
    data(): any {
        return {
            intents: [],
            intentFormData: {
                tag: '',
                description: '',
                type: 'action',
                content: '',
                action_name: '',
                external_path: '',
                active: true,
            },
            intentFormDataErrors: {},
            newIntentModal: false,
            editIntent: false,
            newIntentType: 'action',
            confirmDelete: false,
            deleteIntentId: '',
            variableListModal: false,
            intentChosen: '',
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
        console.log('get intents');
        this.getIntents();
    },

    computed: {
        getContentTypeUtility(): any {
            return this.intentFormData.type === 'action'
                ? 'Action Name'
                : this.intentFormData.type === 'static'
                ? 'Static Content'
                : 'External Path';
        },
    },

    methods: {
        getIntents() {
            this.$store
                .dispatch('intent/getIntents')
                .then((res: any) => {
                    res.data.map((e: any) => {
                        console.log(e);

                        e.url_path =
                            e.intent_action.type === 'external'
                                ? e.intent_action.external_path
                                : e.intent_action.type === 'action'
                                ? 'apisiteurl.com/action_resolver?action' + e.intent_action.action_name
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
                    this.intents = res.data;
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        saveIntent() {
            ['content', 'action_name', 'external_path'].forEach((item: any) => {
                this.intentFormData[item] = this.intentChosen;
            });

            this.$store
                .dispatch('intent/saveIntent', {
                    inputs: this.intentFormData,
                })
                .then((res: any) => {
                    this.newIntentModal = false;
                    this.getIntents();

                    this.$q.notify({
                        color: 'positive',
                        message: 'Intent created successful',
                        position: 'top',
                    });
                })
                .catch((err: any) => {
                    console.log(err.response.data.message);
                    if (Array.isArray(err.response.data.message)) {
                        this.intentFormDataErrors = err.response.data.message;
                    } else {
                        this.$q.notify({
                            color: 'negative',
                            message: err.response.data.message,
                            position: 'top',
                        });
                    }
                });
        },

        handleEditIntent(intent: any) {
            this.editIntent = true;

            this.intentFormData.id = intent.id;
            this.intentFormData.tag = intent.tag;
            this.intentFormData.description = intent.description;
            this.intentFormData.type = intent.intent_action.type;
            this.intentChosen = intent.intent_action.content;
            this.intentFormData.action_name = intent.intent_action.action_name;
            this.intentFormData.external_path = intent.url_path;
            this.intentFormData.active = intent.active;
        },

        updateIntent() {
            ['content', 'action_name', 'external_path'].forEach((item: any) => {
                this.intentFormData[item] = this.intentChosen;
            });

            this.$store
                .dispatch('intent/updateIntent', {
                    inputs: this.intentFormData,
                })
                .then((res: any) => {
                    this.editIntent = false;
                    this.getIntents();

                    this.$q.notify({
                        color: 'positive',
                        message: 'Intent updated successful',
                        position: 'top',
                    });
                })
                .catch((err: any) => {
                    console.log(err.response.data.message);
                    if (Array.isArray(err.response.data.message)) {
                        this.intentFormDataErrors = err.response.data.message;
                    } else {
                        this.$q.notify({
                            color: 'negative',
                            message: err.response.data.message,
                            position: 'top',
                        });
                    }
                });

            console.log(this.intentFormData);
        },

        showConfirmDeleteModal(intent: any) {
            this.confirmDelete = !this.confirmDelete;
            this.deleteIntentId = intent.id;
        },

        deleteIntent() {
            this.$store
                .dispatch('intent/deleteIntent', {
                    id: this.deleteIntentId,
                })
                .then((res: any) => {
                    this.confirmDelete = false;
                    this.getIntents();

                    this.$q.notify({
                        color: 'positive',
                        message: 'Intent deleted successful',
                        position: 'top',
                    });
                })
                .catch((err: any) => {
                    console.log(err);

                    // this.$q.notify({
                    //     color: 'negative',
                    //     message: err.response.data.message,
                    //     position: 'top',
                    // });
                });
        },

        resetForm() {
            this.intentFormData = {};
            this.intentFormData.active = true;
            this.intentFormDataErrors = {};
            this.intentChosen = '';
        },
    },
});
</script>
