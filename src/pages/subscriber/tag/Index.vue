<template>
    <div class="tw-flex tw-flex-col">
        <div
            class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7"
        >
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">
                My Tags
            </div>
            <q-btn
                color="green"
                icon="add"
                label="Add New"
                @click="newTagModal = true"
            ></q-btn>
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
                        <q-input
                            borderless
                            dense
                            debounce="300"
                            placeholder="Search"
                            color="green"
                        >
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
                            <q-badge color="green" class="text-italic"
                                >{{ props.row.tag.name
                                }}<q-tooltip
                                    class=""
                                    anchor="center right"
                                    :offset="[50, 14]"
                                >
                                    {{ props.row.tag.desc }}
                                </q-tooltip></q-badge
                            >
                        </q-td>
                    </template>

                    <template v-slot:body-cell-intent="props">
                        <q-td :props="props">
                            <div class="tw-text-xxs tw-text-gray-700">
                                {{ props.row.intent || 'nill' }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-msg="props">
                        <q-td :props="props">
                            <div class="tw-text-xxs tw-text-gray-700">
                                {{ props.row.msg.content }}
                                <q-inner-loading
                                    :showing="!!props.row.msg.loading"
                                >
                                    <q-spinner-dots size="sm" color="green" />
                                </q-inner-loading>
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
                                dense
                                flat
                            ></q-btn>
                            <q-btn
                                icon="settings"
                                text-color="green"
                                size="sm"
                                dense
                                flat
                            ></q-btn>
                            <q-btn
                                icon="delete"
                                text-color="red"
                                size="sm"
                                dense
                                flat
                            ></q-btn>
                        </q-td>
                    </template>

                    <template v-slot:no-data="{ message }">
                        <div
                            class="full-width row flex-center text-red q-gutter-sm"
                        >
                            <q-icon size="2em" name="sentiment_dissatisfied" />
                            <span> Well this is sad... {{ message }} </span>
                        </div>
                    </template>
                </q-table>
            </div>
        </div>

        <q-dialog
            v-model="newTagModal"
            @update:modelValue="(value) => (newTagModal = value)"
            persistent
        >
            <q-card style="max-width: 500px">
                <q-card-section
                    class="row items-center tw-border-b tw-border-green-500 tw-px-10"
                >
                    <div class="tw-text-lg text-green">Add New Tag</div>
                    <q-space></q-space>
                    <q-btn
                        icon="close"
                        color="orange"
                        flat
                        round
                        dense
                        v-close-popup
                    ></q-btn>
                </q-card-section>

                <q-card-section class="q-py-2 tw-mx-6">
                    <q-input
                        label="Tag Name"
                        color="green"
                        prefix="/"
                        class="tw-my-2"
                        dense
                        ><template v-slot:prepend>
                            <q-icon name="label" color="green" /> </template
                    ></q-input>

                    <q-select
                        label="Content Type"
                        :options="['intent', 'static']"
                        class="tw-my-2"
                        color="green"
                        v-model="newTagType"
                        dense
                        ><template v-slot:prepend>
                            <q-icon name="ballot" color="green" /> </template
                    ></q-select>

                    <q-select
                        v-show="newTagType === 'intent'"
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
                            <q-item
                                v-bind="scope.itemProps"
                                v-on="scope.itemEvents"
                                dense
                            >
                                <q-item-section class="tw-py-1">
                                    <q-item-label v-html="scope.opt.label" />
                                    <q-item-label class="tw-text-xxs" caption>{{
                                        scope.opt.description
                                    }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template></q-select
                    >

                    <q-input
                        label="Message"
                        color="green"
                        class="tw-my-2"
                        :readonly="newTagType === 'intent'"
                        :loading="newTagType === 'intent' && true"
                        autogrow
                        dense
                        ><template v-slot:prepend>
                            <q-icon
                                name="text_snippet"
                                color="green"
                            /> </template
                    ></q-input>

                    <q-input
                        label="Description"
                        color="green"
                        class="tw-my-2"
                        dense
                        ><template v-slot:prepend>
                            <q-icon
                                name="description"
                                color="green"
                            /> </template
                    ></q-input>

                    <div class="tw-text-xs tw-mt-5 tw-text-gray-700">
                        You can use dynamic variables in content input as
                        $${variable} from list.
                        <span
                            class="text-green cursor-pointer"
                            @click="variableListModal = true"
                            >Show Variables List</span
                        >
                    </div>
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-my-4">
                    <q-btn color="green" label="submit" class="full-width" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog
            v-model="variableListModal"
            @update:modelValue="(value) => (variableListModal = value)"
        >
            <q-card
                style="max-width: 500px; min-width: 300px; max-height: 500px"
            >
                <q-card-section
                    class="row items-center tw-border-b tw-border-green-500 tw-px-10"
                >
                    <div class="tw-text-lg text-green">Variable List</div>
                    <q-space></q-space>
                    <q-btn
                        icon="close"
                        color="orange"
                        flat
                        round
                        dense
                        v-close-popup
                    ></q-btn>
                </q-card-section>

                <q-card-section
                    ><q-list separator dense padding>
                        <q-item class="text-green tw-font-bold">
                            <q-item-section> Name </q-item-section>
                            <q-item-section side class="text-green">
                                About
                            </q-item-section>
                        </q-item>

                        <q-item
                            v-for="item in dynamicVariables"
                            class="tw-text-xs"
                            :key="item.name"
                            clickable
                            v-ripple
                        >
                            <q-item-section>{{ item.name }}</q-item-section>
                            <q-item-section class="tw-ml-4" side>{{
                                item.des
                            }}</q-item-section>
                        </q-item>
                    </q-list></q-card-section
                >

                <q-card-section class="tw-pt-0"
                    ><div class="tw-text-xs text-center tw-text-gray-500">
                        Note: Click a item to copy a variable name
                    </div></q-card-section
                >
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
const columns = [
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
];

const rows = [
    {
        tag: { name: '/hi', desc: 'message hi' },
        intent: '',
        msg: { content: 'how may i help you sir', type: '', loading: '' },
        status: 'active',
    },
    {
        tag: { name: '/hello', desc: 'message hello' },
        intent: '',
        msg: { content: 'hello $${user}', type: '', loading: '' },
        status: 'inactive',
    },
    {
        tag: {
            name: '/shared_hosting_price',
            desc: 'give shared hosting price',
        },
        intent: '@shared_hosting/price',
        msg: { content: '', type: 'intent', loading: true },
        status: 'pending',
    },
];

const dynamicVariables = [
    { name: 'user_name', des: 'will print assigned name else guest' },
    { name: 'user_id', des: 'will print logged users id' },
];
export default {
    data() {
        return {
            newTagModal: false,
            newTagType: 'intent',
            variableListModal: false,
            intentChoosed: '',
        };
    },
    setup() {
        return {
            columns,
            rows,
            dynamicVariables,
        };
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
    },
};
</script>
