<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Intents List</div>
            <q-btn color="green" icon="add" label="Add New" @click="addEditIntentModal = true"></q-btn>
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

                <!-- just uncomment me for see the work and changes -->
                <!-- <ec-table :rows="mappedIntents" :columns="columns"> -->
                <!-- style less cz i want to modify this -->
                <!-- for all col select dynamix v-slot:[header-cell-itemName from loop] -->
                <!-- <template v-slot:header-cell-intent_tag="slotProps">{{ slotProps.col.name }}</template> -->

                <!-- <template v-slot:action-at-start><q-btn icon="settings" size="sm" dense flat /></template> -->
                <!-- <template v-slot:action-at-middle="slotProps">{{ slotProps.row.id }}</template> -->
                <!-- <template v-slot:action-at-end><q-badge>i am badge</q-badge></template> -->
                <!-- </ec-table> -->
            </div>
        </div>

        <q-dialog
            @before-hide="resetForm"
            v-model="addEditIntentModal"
            @update:modelValue="(value) => (addEditIntentModal = value)"
            persistent
        >
            <q-card style="max-width: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">
                        <div v-if="updateIntentModal">
                            Edit Intent <b>@{{ addEditIntentFormData.tag }}</b>
                        </div>
                        <div v-else>Add New Intent</div>
                    </div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <form @submit.prevent="createIntent">
                    <q-card-section class="q-py-2 tw-mx-6">
                        <q-input
                            label="Intent Tag"
                            color="green"
                            prefix="@"
                            class="tw-my-2"
                            v-model="addEditIntentFormData.tag"
                            :error-message="intentFormDataErrors.tag"
                            :error="!!intentFormDataErrors.tag"
                            @update:model-value="intentFormDataErrors.tag = ''"
                            autofocus
                            fill-mask="_"
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
                            :error-message="intentFormDataErrors.type"
                            :error="!!intentFormDataErrors.type"
                            @update:model-value="intentFormDataErrors.external_path = ''"
                            v-model="addEditIntentFormData.type"
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
                            :error-message="intentFormDataErrors.external_path"
                            :error="!!intentFormDataErrors.external_path"
                            @update:model-value="intentFormDataErrors.external_path = ''"
                            v-model="intentChosen"
                            :autogrow="addEditIntentFormData.type === 'static'"
                            dense
                        >
                            <template v-slot:prepend>
                                <q-icon name="work" color="green" />
                            </template>
                        </q-input>

                        <q-input
                            label="Description"
                            v-model="addEditIntentFormData.description"
                            :error-message="intentFormDataErrors.description"
                            :error="!!intentFormDataErrors.description"
                            @update:model-value="intentFormDataErrors.description = ''"
                            color="green"
                            class="tw-my-2"
                            dense
                        >
                            <template v-slot:prepend>
                                <q-icon name="description" color="green" />
                            </template>
                        </q-input>

                        <q-checkbox
                            v-model="addEditIntentFormData.active"
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
                        <q-btn
                            type="submit"
                            color="green"
                            label="submit"
                            class="full-width"
                            @click="updateIntentModal ? updateIntent() : createIntent()"
                        />
                    </q-card-actions>
                </form>
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
import _ from 'lodash';
// import EcTable from 'src/components/common/table/EcTable.vue';
import { defineComponent } from 'vue';
// import IntentList from 'pages/subscriber/intents/IntentList.vue';

export default defineComponent({
    name: 'Intents',
    // components: { EcTable },
    data(): any {
        return {
            intents: [],
            addEditIntentFormData: {
                tag: '',
                description: '',
                type: 'action',
                content: '',
                action_name: '',
                external_path: '',
                active: true,
            },
            intentFormDataErrors: {},
            addEditIntentModal: false,
            updateIntentModal: false,
            confirmDelete: false,
            deleteIntentId: '',
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

        getContentTypeUtility(): any {
            return this.addEditIntentFormData.type === 'action'
                ? 'Action Name'
                : this.addEditIntentFormData.type === 'static'
                ? 'Static Content'
                : 'External Path';
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

        createIntent() {
            ['content', 'action_name', 'external_path'].forEach((item: any) => {
                this.addEditIntentFormData[item] = this.intentChosen;
            });

            // note: check error carefully,
            // after add/delete reload intent list. now um thining it will cause prb if unshift
            // but edit dont need reload
            // cz if a user in other page or filter its a prb

            this.$store
                .dispatch('intent/createIntent', {
                    inputs: this.addEditIntentFormData,
                })
                .then((res: any) => {
                    this.addEditIntentModal = false;
                    this.intents.unshift(res.data);

                    this.$helpers.showSuccessNotification(this, 'Intent created successful');
                })
                .catch((err: any) => this.addEditIntentErrorHandle(err));
        },

        handleEditIntent(intent: any) {
            this.updateIntentModal = true;
            this.addEditIntentModal = true;

            this.addEditIntentFormData.id = intent.id;
            this.addEditIntentFormData.tag = intent.tag;
            this.addEditIntentFormData.description = intent.description;
            this.addEditIntentFormData.type = intent.intent_action.type;
            this.intentChosen = intent.intent_action.content;
            this.addEditIntentFormData.action_name = intent.intent_action.action_name;
            this.addEditIntentFormData.external_path = intent.url_path;
            this.addEditIntentFormData.active = intent.active;
        },

        updateIntent() {
            ['content', 'action_name', 'external_path'].forEach((item: any) => {
                this.addEditIntentFormData[item] = this.intentChosen;
            });

            this.$store
                .dispatch('intent/updateIntent', {
                    inputs: this.addEditIntentFormData,
                })
                .then((res: any) => {
                    this.addEditIntentModal = false;

                    const intentIndex = this.intents.findIndex((intent: any) => intent.id === res.data.id);
                    this.intents[intentIndex] = res.data;

                    this.$helpers.showSuccessNotification(this, 'Intent updated successful');
                })
                .catch((err: any) => this.addEditIntentErrorHandle(err));
        },

        showConfirmDeleteModal(intent: any) {
            this.confirmDelete = !this.confirmDelete;
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
                    this.confirmDelete = false;
                    this.getIntents();
                    // remove the item from intents array

                    this.$helpers.showSuccessNotification(this, 'Intent deleted successful');
                })
                .catch((err: any) => {
                    this.$helpers.showErrorNotification(this, err.response.data.message);
                });
        },

        addEditIntentErrorHandle(err: any) {
            if (_.isObject(err.response.data.message)) {
                this.intentFormDataErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },

        resetForm() {
            this.updateIntentModal = false;
            this.addEditIntentFormData = {};
            this.addEditIntentFormData.active = true;
            this.intentFormDataErrors = {};
            this.intentChosen = '';
        },
    },
});
</script>
