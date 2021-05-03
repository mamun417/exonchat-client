<template>
    <q-dialog @hide="resetForm" :model-value="showAddEditIntentModal" persistent>
        <!--<q-dialog @before-hide="resetForm" :model-value="true" persistent>-->
        <q-card style="max-width: 500px">
            <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                <div class="tw-text-lg text-green">
                    <div v-if="updateModal">
                        Edit Intent <b>@{{ addEditIntentFormData.tag }}</b>
                    </div>
                    <div v-else>Add New Intent</div>
                </div>
                <q-space></q-space>
                <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
            </q-card-section>

            <form @submit.prevent="updateModal ? updateIntent() : createIntent()">
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
                        :disable="updateModal"
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
                    <q-btn type="submit" color="green" :label="updateModal ? 'update' : 'submit'" class="full-width" />
                </q-card-actions>
            </form>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import _ from 'lodash';

export default defineComponent({
    name: 'AddEditIntentForm',
    props: {
        showAddEditIntentModal: {
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
            intentChosen: '',
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
        };
    },

    methods: {
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
                .then(() => {
                    this.resetForm();

                    this.$emit('createdIntent');

                    this.$helpers.showSuccessNotification(this, 'Intent created successful');
                })
                .catch((err: any) => this.addEditIntentErrorHandle(err));
        },

        updateIntent() {
            ['content', 'action_name', 'external_path'].forEach((item: any) => {
                this.addEditIntentFormData[item] = this.intentChosen;
            });

            console.log(this.addEditIntentFormData);

            // check intent tag not update
            this.$store
                .dispatch('intent/updateIntent', {
                    inputs: this.addEditIntentFormData,
                })
                .then((res: any) => {
                    this.resetForm();

                    this.$emit('updatedIntent', res.data);

                    this.$helpers.showSuccessNotification(this, 'Intent updated successful');
                })
                .catch((err: any) => this.addEditIntentErrorHandle(err));
        },

        addEditIntentErrorHandle(err: any) {
            if (_.isObject(err.response.data.message)) {
                this.intentFormDataErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },

        getContentTypeUtility(): any {
            return this.addEditIntentFormData.type === 'action'
                ? 'Action Name'
                : this.addEditIntentFormData.type === 'static'
                ? 'Static Content'
                : 'External Path';
        },

        resetForm() {
            this.$emit('hideModal');
            this.addEditIntentFormData = {};
            this.addEditIntentFormData.active = true;
            this.intentFormDataErrors = {};
            this.intentChosen = '';
        },
    },

    watch: {
        selectedForEditData: {
            handler(selectedForEditData) {
                if (this.showAddEditIntentModal) {
                    const intent = _.cloneDeep(selectedForEditData);

                    this.addEditIntentFormData.id = intent.id;
                    this.addEditIntentFormData.tag = intent.tag;
                    this.addEditIntentFormData.description = intent.description;
                    this.addEditIntentFormData.type = intent.intent_action.type;
                    this.intentChosen = intent.intent_action.content;
                    this.addEditIntentFormData.action_name = intent.intent_action.action_name;
                    this.addEditIntentFormData.external_path = intent.url_path;
                    this.addEditIntentFormData.active = intent.active;
                }
            },
            deep: true,
        },
    },
});
</script>

<style scoped></style>
