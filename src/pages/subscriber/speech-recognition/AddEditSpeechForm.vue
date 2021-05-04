<template>
    <q-dialog @show="getIntents" @hide="resetForm" :model-value="showAddEditSpeechModal" persistent>
        <q-card style="max-width: 500px">
            <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                <div class="tw-text-lg text-green">
                    <div v-if="updateModal">
                        Edit Intent <b>@{{ addEditSpeechFormData.speech }}</b>
                    </div>
                    <div v-else>Add New Speech</div>
                </div>
                <q-space></q-space>
                <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
            </q-card-section>

            <form @submit.prevent="updateModal ? updateSpeech() : createSpeech()">
                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input
                        v-model="addEditSpeechFormData.speech"
                        :error-message="speechFormErrors.speech"
                        :error="!!speechFormErrors.speech"
                        @update:model-value="speechFormErrors.speech = ''"
                        label="New Speech"
                        color="green"
                        class="tw-my-2"
                        :readonly="updateModal"
                        dense
                    >
                        <template v-slot:prepend> <q-icon name="label" color="green" /> </template>
                    </q-input>

                    <q-select
                        hint="leave intent select if wanted by ai automate"
                        label="Select a Intent"
                        @update:modelValue="getIntentInfo"
                        :options="intents"
                        v-model="intentChosen"
                        class="tw-my-2"
                        color="green"
                        clearable
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="ballot" color="green" />
                        </template>
                        <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" dense>
                                <q-item-section class="tw-py-1">
                                    <q-item-label v-html="scope.opt.label" />
                                    <q-item-label class="tw-text-xxs" caption>
                                        {{ scope.opt.description }}
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>

                    <div v-if="intentChosen">
                        <!--intent info-->
                        <q-input
                            :loading="chosenIntentInfo.intent_action?.type !== 'static'"
                            :model-value="chosenIntentInfo.intent_action?.content"
                            label="Intent Content"
                            color="green"
                            class="tw-my-2"
                            readonly
                            dense
                        >
                            <template v-slot:prepend> <q-icon name="info" color="green" /> </template>
                        </q-input>
                    </div>

                    <q-checkbox
                        v-model="addEditSpeechFormData.active"
                        label="Activate This As soon it resolved"
                        class="tw-mt-2"
                        color="green"
                        dense
                    />

                    <div v-if="intentChosen">
                        <!-- it will be like radio. any one will be checked not both -->
                        <q-checkbox
                            v-model="addEditSpeechFormData.forced_intent"
                            class="tw-mt-2"
                            label="Force this intent to use with this speech."
                            color="green"
                            dense
                        />

                        <div class="tw-text-xs tw-mt-5 text-white bg-orange tw-p-2 tw-font-bold">
                            <div>
                                If you don`t select intent then it will generate from AI. But generated AI won`t be
                                submitted to train AI again.
                            </div>
                        </div>
                        <div class="tw-text-xs tw-mt-2 text-white bg-orange tw-p-2 tw-font-bold">
                            <div>
                                IF you uncheck 'force intent checkbox then speech will submitted to AI for train. For
                                that all other AI generated message intents will be affected.
                            </div>
                        </div>
                        <div class="tw-text-xs tw-mt-2 text-white bg-orange tw-p-2 tw-font-bold">
                            <div>
                                If forced check then speech wont submitted to AI. Its a good idea to submit to train AI
                                for better speech understand.
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-mb-4">
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
    name: 'AddEditSpeechForm',
    props: {
        showAddEditSpeechModal: {
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
            intents: [],
            addEditSpeechFormData: {
                speech: '',
                intent_id: '',
                forced_intent: false,
                active: false,
            },
            speechFormErrors: {},
            intentChosen: '',
            chosenIntentInfo: {},
        };
    },

    mounted() {
        // this.getIntents();
    },

    methods: {
        // later, load when modal form open
        getIntents() {
            this.$store
                .dispatch('intent/getIntents')
                .then((res: any) => {
                    this.intents = [];

                    for (const intent of res.data) {
                        this.intents.push({
                            label: `@${intent.tag}`,
                            value: intent.id,
                            description: intent.description,
                        });
                    }
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        getIntentInfo(intent: any) {
            if (intent) {
                const id = intent.value;

                this.$store
                    .dispatch('intent/getIntent', {
                        id,
                    })
                    .then((res: any) => {
                        this.chosenIntentInfo = res.data;
                    })
                    .catch((err: any) => {
                        console.log(err);
                    });
            }
        },

        createSpeech() {
            this.addEditSpeechFormData.intent_id = this.intentChosen?.value;

            this.$store
                .dispatch('speech/createSpeech', {
                    inputs: this.addEditSpeechFormData,
                })
                .then(() => {
                    this.resetForm();

                    this.$emit('createdSpeech');

                    this.$helpers.showSuccessNotification(this, 'Speech created successful');
                })
                .catch((err: any) => {
                    this.addEditSpeechErrorHandle(err);
                });
        },

        updateSpeech() {
            this.$store
                .dispatch('speech/updateIntent', {
                    inputs: this.addEditSpeechFormData,
                })
                .then((res: any) => {
                    this.resetForm();

                    this.$emit('updatedSpeech', res.data);

                    this.$helpers.showSuccessNotification(this, 'Speech updated successful');
                })
                .catch((err: any) => this.addEditSpeechErrorHandle(err));
        },

        addEditSpeechErrorHandle(err: any) {
            if (_.isObject(err.response.data.message)) {
                this.speechFormErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },

        resetForm() {
            this.$emit('hideModal');
            this.addEditSpeechFormData = {};
            this.intentFormDataErrors = {};
            this.addEditSpeechFormData.active = false;
            this.addEditSpeechFormData.forced_intent = false;
            this.intentChosen = '';
        },
    },

    watch: {
        selectedForEditData: {
            handler(selectedForEditData) {
                if (this.showAddEditSpeechModal) {
                    this.addEditSpeechFormData = _.cloneDeep(selectedForEditData);
                    this.intentChosen = selectedForEditData.intent_id;
                }
            },
            deep: true,
        },
    },
});
</script>

<style scoped></style>
