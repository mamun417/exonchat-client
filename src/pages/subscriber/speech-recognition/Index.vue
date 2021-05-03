<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Speech List</div>
            <q-btn color="green" icon="add" label="Add New" @click="newSpeechModal = true"></q-btn>
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
                        <q-td :props="props">
                            <q-badge color="green" class="text-italic">
                                @{{ props.row.intent.tag }}
                                <q-tooltip class="" anchor="center right" :offset="[50, 14]">
                                    {{ props.row.intent.description }}
                                </q-tooltip></q-badge
                            >
                        </q-td>
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
                            <div class="tw-font-medium" :class="[props.row.has_in_ai ? 'text-green' : 'text-orange']">
                                {{ props.row.has_in_ai }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge>{{ props.row.active }}</q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                            <q-btn
                                icon="create"
                                text-color="green"
                                size="sm"
                                @click="editIntent = true"
                                dense
                                flat
                            ></q-btn>
                            <q-btn icon="settings" text-color="green" size="sm" dense flat></q-btn>
                            <q-btn icon="delete" text-color="red" size="sm" dense flat></q-btn>
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

        <q-dialog v-model="newSpeechModal" @update:modelValue="(value) => (newSpeechModal = value)" persistent>
            <q-card style="max-width: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Add New Speech</div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <form @submit.prevent="createSpeech">
                    <q-card-section class="q-py-2 tw-mx-6">
                        <q-input
                            v-model="addEditSpeechFormData.speech"
                            label="New Speech"
                            color="green"
                            class="tw-my-2"
                            dense
                        >
                            <template v-slot:prepend> <q-icon name="label" color="green" /> </template>
                        </q-input>

                        <q-select
                            label="Select a Intent"
                            :options="intents"
                            v-model="addEditSpeechFormData.intent"
                            class="tw-my-2"
                            color="green"
                            hint="leave intent select if wanted by ai automate"
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

                        <div v-if="addEditSpeechFormData.intent">show intents content or other here after selected</div>

                        <q-checkbox
                            v-model="addEditSpeechFormData.active"
                            label="Activate This As soon it resolved"
                            class="tw-mt-2"
                            color="green"
                            dense
                        />

                        <div v-if="addEditSpeechFormData.intent">
                            <!-- it will be like radio. any one will be checked not both -->
                            <q-checkbox
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
                                    IF you uncheck 'force intent checkbox then speech will submitted to AI for train.
                                    For that all other AI generated message intents will be affected.
                                </div>
                            </div>
                            <div class="tw-text-xs tw-mt-2 text-white bg-orange tw-p-2 tw-font-bold">
                                <div>
                                    If forced check then speech wont submitted to AI. Its a good idea to submit to train
                                    AI for better speech understand.
                                </div>
                            </div>
                        </div>
                    </q-card-section>

                    <q-card-actions class="tw-mx-6 tw-mb-4">
                        <q-btn type="submit" color="green" label="submit" class="full-width" />
                    </q-card-actions>
                </form>
            </q-card>
        </q-dialog>

        <q-dialog v-model="editSpeech" @update:modelValue="(value) => (editSpeech = value)" persistent>
            <!-- load parent intents all content -->
            <!--  -->
            <q-card style="max-width: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Edit Speech lalala</div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input label="Speech" color="green" prefix="@" class="tw-my-2" readonly dense
                        ><template v-slot:prepend> <q-icon name="label" color="green" /> </template
                    ></q-input>

                    <q-select
                        label="Select a Intent"
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
                        v-model="newSpeechIntent"
                        class="tw-my-2"
                        color="green"
                        hint="leave intent select if wanted by ai automate"
                        dense
                        ><template v-slot:prepend> <q-icon name="ballot" color="green" /> </template
                        ><template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" dense>
                                <q-item-section class="tw-py-1">
                                    <q-item-label v-html="scope.opt.label" />
                                    <q-item-label class="tw-text-xxs" caption>{{ scope.opt.description }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template></q-select
                    >

                    <q-checkbox class="tw-mt-2" label="Activate This As soon it resolved" color="green" dense />

                    <div>
                        <q-checkbox
                            class="tw-mt-2"
                            label="Associate updated intetnt with the msg to AI"
                            color="green"
                            dense
                        />

                        <div class="tw-text-xs tw-mt-1 text-white bg-orange tw-p-2 tw-font-bold">
                            <div>You have changed your intent. Deselect this if not want to subbmit to AI</div>
                        </div>
                    </div>

                    <div class="tw-text-xs tw-mt-5 text-white bg-orange tw-p-2 tw-font-bold">
                        <div>
                            It looks like this speech holds by ai. By updating this will remove from ai speech
                            association
                        </div>
                    </div>
                    <div class="tw-text-xs tw-mt-1 text-white bg-orange tw-p-2 tw-font-bold">
                        <div>It will also affect all other speech intent which are generated by ai</div>
                    </div>
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-my-4">
                    <q-btn color="green" label="submit" class="full-width" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const columns = [
    { name: 'speech', align: 'left', label: 'Speech', field: 'speech' },
    {
        name: 'intent',
        align: 'center',
        label: 'Maped to Intent',
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
];

const rows = [
    {
        speech: 'lalala',
        intent: { name: '@aaa', desc: 'zzz' },
        confidence: '0.999',
        generated_by: 'Me',
        speech_in_ai: 'True',
        status: 'active',
    },
];

const dynamicVariables = [
    { name: 'user_name', des: 'will print assigned name else guest' },
    { name: 'user_id', des: 'will print logged users id' },
];
export default defineComponent({
    data() {
        return {
            intents: [],
            speeches: [],
            addEditSpeechFormData: {
                speech: '',
                intent_id: '',
                intent: '',
                forced_intent: false,
                active: false,
            },
            newSpeechModal: false,
            newSpeechIntent: '',
            editSpeech: false,
            newIntentType: 'action',
            variableListModal: false,
            intentChoosed: '',
        };
    },

    mounted() {
        this.getIntents();
        this.getSpeeches();
    },

    setup() {
        return {
            columns,
            dynamicVariables,
        };
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

        // later, load when modal form open
        getIntents() {
            this.$store
                .dispatch('intent/getIntents')
                .then((res: any) => {
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

        createSpeech() {
            this.addEditSpeechFormData.intent_id = this.addEditSpeechFormData.intent.value;

            this.$store
                .dispatch('speech/createSpeech', {
                    inputs: this.addEditSpeechFormData,
                })
                .then(() => this.getSpeeches())
                .catch((err: any) => console.log(err.response.data));
        },

        saveSpeech() {
            // this.$api.post('speech', {
            //     speech: 'ccc',
            //     active: false,
            //     intent_id: 'intent-id',
            //     forced_intent: true,
            // });
            // this.$api.post('speech/speech-id', {
            //     active: false,
            //     intent_id: 'intent-id',
            //     forced_intent: true,
            // });
            // this.$api.post('speech/speech-id/active-status', {
            //     active: false,
            // });
            // this.$api.get('/speech');
        },
    },
});
</script>
