<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Intents List</div>
            <q-btn color="green" icon="add" label="Add New" @click="newIntentModal = true"></q-btn>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <q-table
                    :rows="rows"
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

                    <template v-slot:body-cell-intent="props">
                        <q-td :props="props">
                            <q-badge color="green" class="text-italic">
                                {{ props.row.intent.name }}
                                <q-tooltip class="" anchor="center right" :offset="[50, 14]">
                                    {{ props.row.intent.desc }}
                                </q-tooltip>
                            </q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-map_to="props">
                        <q-td :props="props">
                            <div class="tw-text-xxs text-italic tw-font-medium tw-text-gray-700">
                                {{ props.row.map_to }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-parent_intent="props">
                        <q-td :props="props">
                            <div class="tw-text-xxs text-italic tw-font-medium tw-text-gray-700">
                                {{ props.row.parent_intent }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge>{{ props.row.status }}</q-badge>
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

        <q-dialog v-model="newIntentModal" @update:modelValue="(value) => (newIntentModal = value)" persistent>
            <q-card style="max-width: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Add New Intent</div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input
                        label="Intent Name"
                        color="green"
                        prefix="@"
                        class="tw-my-2"
                        v-model="addIntentData.name"
                        :error-message="addIntentDataErrors[0]"
                        :error="!!addIntentDataErrors[0]"
                        @input="addIntentDataErrors[0] = ''"
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
                        v-model="newIntentType"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="ballot" color="green" />
                        </template>
                    </q-select>

                    <q-input
                        :label="newIntentType === 'action' ? 'Action Name' : 'Static Content'"
                        class="tw-my-2"
                        color="green"
                        options-selected-class="text-green"
                        v-model="intentChoosed"
                        :autogrow="newIntentType === 'static'"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="work" color="green" />
                        </template>
                    </q-input>

                    <q-input label="Description" color="green" class="tw-my-2" dense>
                        <template v-slot:prepend>
                            <q-icon name="description" color="green" />
                        </template>
                    </q-input>

                    <q-checkbox
                        v-model="addIntentData.active"
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

        <q-dialog v-model="editIntent" @update:modelValue="(value) => (editIntent = value)" persistent>
            <!-- load parent intents all content -->
            <!--  -->
            <q-card style="max-width: 500px">
                <q-card-section class="row items-center tw-border-b tw-border-green-500 tw-px-10">
                    <div class="tw-text-lg text-green">Edit Intent <b>@get_lowest_hosting_price</b></div>
                    <q-space></q-space>
                    <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
                </q-card-section>

                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input label="Intent Name" color="green" prefix="@" class="tw-my-2" dense readonly>
                        <template v-slot:prepend>
                            <q-icon name="label" color="green" />
                        </template>
                    </q-input>

                    <q-select
                        label="Content Type"
                        :options="['action', 'static', 'external']"
                        class="tw-my-2"
                        color="green"
                        v-model="newIntentType"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="ballot" color="green" />
                        </template>
                    </q-select>

                    <q-input
                        :label="newIntentType === 'action' ? 'Action Name' : 'Static Content'"
                        class="tw-my-2"
                        color="green"
                        options-selected-class="text-green"
                        v-model="intentChoosed"
                        :autogrow="newIntentType === 'static'"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="work" color="green" />
                        </template>
                    </q-input>

                    <q-input label="Description" color="green" class="tw-my-2" dense>
                        <template v-slot:prepend>
                            <q-icon name="description" color="green" />
                        </template>
                    </q-input>

                    <q-checkbox class="tw-mt-2" label="Activate This Intent" color="green" dense />
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-my-4">
                    <q-btn color="green" label="update" class="full-width" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Intents',
    data() {
        return {
            addIntentData: {
                name: '',
                tag: '',
                description: '',
                type: '',
                active: true,
                action_name: '',
            },
            addIntentDataErrors: {},
            newIntentModal: false,
            editIntent: false,
            newIntentType: 'action',
            variableListModal: false,
            intentChoosed: '',
            columns: [
                { name: 'intent', align: 'left', label: 'Intent Name', field: 'intent' },
                {
                    name: 'map_to',
                    align: 'center',
                    label: 'Map to Action/Content',
                    field: 'map_to',
                },
                {
                    name: 'parent_intent',
                    align: 'center',
                    label: 'Intent Mapped To',
                    field: 'parent_intent',
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
            rows: [
                {
                    intent: { name: '@get/hosting/low/price', desc: 'message hi' },
                    map_to: 'get_lowest_hosting_price',
                    parent_intent: 'nill',
                    status: 'active',
                },
                {
                    intent: { name: '@del/order', desc: 'message hello' },
                    map_to: 'delte_order_by_id',
                    parent_intent: 'nill',
                    status: 'inactive',
                },
                {
                    intent: {
                        name: '@post/profile/name',
                        desc: 'give shared hosting price',
                    },
                    map_to: 'update_profile_name',
                    parent_intent: 'nill',
                    status: 'pending',
                },
                {
                    intent: {
                        name: '@post/user/name',
                        desc: 'give shared hosting price',
                    },
                    map_to: 'update_user_name',
                    parent_intent: '@post/profile/name',
                    status: 'pending',
                },
            ],
            dynamicVariables: [
                { name: 'user_name', des: 'will print assigned name else guest' },
                { name: 'user_id', des: 'will print logged users id' },
            ],
        };
    },

    setup() {
        return {};
    },

    mounted() {
        console.log('get intents');
        this.getIntents();
    },

    methods: {
        getIntents() {
            this.$store
                .dispatch('intent/getIntents')
                .then((res: any) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        saveIntent() {
            this.$store
                .dispatch('intent/saveIntent', {
                    inputs: this.formData,
                })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    if (!err.response.data.message.length) {
                        this.$q.notify({
                            color: 'negative',
                            message: err.response.data.message,
                            position: 'top',
                        });
                    } else {
                        this.addIntentDataErrors = err.response.data.message;
                    }
                });
        },

        // saveIntent() {
        //     this.$api
        //         .post('intents', {
        //             tag: 'bbb',
        //             description: 'b',
        //             type: 'action',
        //             active: true,
        //             action_name: 'bbb',
        //         })
        //         .then((res: any) => {
        //             console.log(res);
        //         })
        //         .catch((e: any) => console.log(e));
        //     this.$api
        //         .post('intents/intent-id', {
        //             description: 'b',
        //             type: 'action',
        //             active: true,
        //             action_name: 'bbb',
        //         })
        //         .then((res: any) => {
        //             console.log(res);
        //         })
        //         .catch((e: any) => console.log(e));
        //     this.$api
        //         .post('intents/intent-id/active-status', {
        //             active: true,
        //         })
        //         .then((res: any) => {
        //             console.log(res);
        //         })
        //         .catch((e: any) => console.log(e));
        //     this.$api
        //         .get('intents')
        //         .then((res: any) => {
        //             console.log(res);
        //         })
        //         .catch((e: any) => console.log(e));
        // },
    },
});
</script>
