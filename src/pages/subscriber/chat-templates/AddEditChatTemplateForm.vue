<template>
    <q-dialog @show="loadDepartment" @hide="resetForm" :model-value="showAddEditChatTemplateModal" persistent>
        <q-card style="max-width: 500px">
            <q-card-section class="row items-center tw-border-b tw-px-6 tw-py-3">
                <div class="tw-text-lg tw-font-bold" :class="`text-${globalColor}`">
                    <div v-if="updateModal">
                        Edit Chat Template<b>/{{ addEditChatTemplateFormData.tag }}</b>
                    </div>
                    <div v-else>Add New Chat Template</div>
                </div>
                <q-space></q-space>
                <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
            </q-card-section>

            <form @submit.prevent="updateModal ? updateChatTemplate() : createChatTemplate()">
                <q-card-section class="q-py-2 tw-mx-2">
                    <q-input
                        v-model="addEditChatTemplateFormData.tag"
                        :error-message="chatTemplateFormDataErrors.tag"
                        :error="!!chatTemplateFormDataErrors.tag"
                        @update:model-value="chatTemplateFormDataErrors.tag = ''"
                        :readonly="updateModal"
                        label="Tag Name"
                        :color="globalColor"
                        prefix="/"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="label" :color="globalColor" />
                        </template>
                    </q-input>

                    <q-select
                        v-model="chosenDepartment"
                        :error-message="chatTemplateFormDataErrors.department_id"
                        :error="!!chatTemplateFormDataErrors.department_id"
                        @update:model-value="chatTemplateFormDataErrors.department_id = ''"
                        label="Choose Department"
                        :options="departments"
                        :color="globalColor"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="groups" :color="globalColor" />
                        </template>
                    </q-select>

                    <q-select
                        :error="false"
                        v-model="chosenContentType"
                        label="Content Type"
                        :options="['intent', 'static']"
                        @update:modelValue="getIntents"
                        :color="globalColor"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="ballot" :color="globalColor" />
                        </template>
                    </q-select>

                    <q-select
                        v-show="chosenContentType === 'intent'"
                        label="Choose Intent"
                        :error="false"
                        @update:modelValue="getIntentInfo"
                        :options="intents"
                        v-model="chosenIntent"
                        :color="globalColor"
                        options-selected-class="text-green"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="work" :color="globalColor" />
                        </template>
                        <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" dense>
                                <q-item-section class="tw-py-1">
                                    <q-item-label v-html="scope.opt.label" />
                                    <q-item-label class="tw-text-xxs" caption>{{ scope.opt.description }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>

                    <div>
                        <!--intent info-->
                        <q-input
                            v-model="addEditChatTemplateFormData.content"
                            :error-message="chatTemplateFormDataErrors.content"
                            :error="!!chatTemplateFormDataErrors.content"
                            @update:model-value="chatTemplateFormDataErrors.content = ''"
                            :loading="
                                chosenContentType === 'intent' &&
                                chosenIntentInfo.intent_action &&
                                chosenIntentInfo.intent_action?.type !== 'static'
                            "
                            label="Message"
                            :color="globalColor"
                            :readonly="chosenContentType === 'intent'"
                            autogrow
                            dense
                        >
                            <template v-slot:prepend>
                                <q-icon name="info" :color="globalColor" />
                            </template>
                        </q-input>
                    </div>

                    <q-input
                        class="tw-mb-2"
                        v-model="addEditChatTemplateFormData.description"
                        :error-message="chatTemplateFormDataErrors.description"
                        :error="!!chatTemplateFormDataErrors.description"
                        @update:model-value="chatTemplateFormDataErrors.description = ''"
                        label="Description"
                        :color="globalColor"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="description" :color="globalColor" />
                        </template>
                    </q-input>

                    <div v-if="isAdmin">
                        <q-checkbox
                            v-model="addEditChatTemplateFormData.own"
                            label="Only For Me"
                            :color="globalColor"
                            dense
                        />
                    </div>

                    <div>
                        <q-checkbox
                            v-model="addEditChatTemplateFormData.active"
                            label="Activate This Chat Template"
                            :color="globalColor"
                            dense
                        />
                    </div>

                    <div class="tw-text-xxs tw-font-medium tw-mt-5 tw-text-gray-700">
                        You can use dynamic variables in content input as $${variable} from list.
                        <span
                            class="cursor-pointer tw-font-bold"
                            :class="`text-${globalColor}`"
                            @click="variableListModal = true"
                        >
                            Show Variables List
                        </span>
                    </div>
                </q-card-section>

                <q-card-actions class="tw-mx-6 tw-mb-4">
                    <q-btn
                        type="submit"
                        :color="globalColor"
                        :label="updateModal ? 'update' : 'submit'"
                        class="full-width"
                        unelevated
                    />
                </q-card-actions>
            </form>
        </q-card>
    </q-dialog>

    <q-dialog v-model="variableListModal" @update:modelValue="(value) => (variableListModal = value)">
        <q-card style="max-width: 500px; min-width: 300px; max-height: 500px">
            <q-card-section class="row items-center tw-border-b tw-px-6 tw-py-3">
                <div class="tw-text-lg tw-font-bold" :class="`text-${globalColor}`">Variable List</div>
                <q-space></q-space>
                <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
            </q-card-section>

            <q-card-section class="tw-px-3 tw-pt-1">
                <q-list separator dense padding>
                    <q-item class="tw-font-bold" :class="`text-${globalColor}`">
                        <q-item-section> Name</q-item-section>
                        <q-item-section side :class="`text-${globalColor}`"> About</q-item-section>
                    </q-item>

                    <q-item v-for="item in dynamicVariables" class="tw-text-xs" :key="item.name" clickable v-ripple>
                        <q-item-section>{{ item.name }}</q-item-section>
                        <q-item-section class="tw-ml-4" side>{{ item.des }}</q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>

            <q-card-section class="tw-pt-0">
                <div class="tw-text-xs text-center" :class="`text-${globalColor}`">
                    Note: Click a item to copy a variable name
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
    name: "AddEditChatTemplateForm",

    props: {
        showAddEditChatTemplateModal: {
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
            departments: [],
            intents: [],
            chosenDepartment: "",
            chosenContentType: "static",
            chosenIntent: "",
            chosenIntentInfo: {},
            addEditChatTemplateFormData: {
                tag: "",
                content: "",
                department_id: "",
                intent_id: "",
                description: [],
                own: false,
                active: true,
            },
            chatTemplateFormDataErrors: {},
            variableListModal: false,
            dynamicVariables: [
                { name: "user_name", des: "will print assigned name else guest" },
                { name: "user_id", des: "will print logged users id" },
            ],
        };
    },

    computed: {
        ...mapGetters({
            userProfile: "auth/profile",
            globalColor: "setting_ui/globalColor",
            globalBgColor: "setting_ui/globalBgColor",
        }),

        isAdmin(): any {
            return this.userProfile.role.slug === "admin";
        },
    },

    methods: {
        // load when form open
        loadDepartment() {
            this.$store.dispatch("department/getDepartments").then((res: any) => {
                this.departments = [];

                for (const department of res.data) {
                    this.departments.push({
                        label: department.tag,
                        value: department.id,
                    });
                }
            });
        },

        // load when chose content type (intent)
        getIntents(contentType: any) {
            this.chosenIntent = "";
            this.addEditChatTemplateFormData.content = "";
            this.intents = [];

            if (contentType === "intent") {
                this.$store.dispatch("intent/getIntents").then((res: any) => {
                    for (const intent of res.data) {
                        this.intents.push({
                            label: `@${intent.tag}`,
                            value: intent.id,
                            description: intent.description,
                        });
                    }
                });
            }
        },

        // get chosen intent information
        getIntentInfo(intent: any) {
            if (intent) {
                const id = intent.value;

                this.$store
                    .dispatch("intent/getIntent", {
                        id,
                    })
                    .then((res: any) => {
                        this.chosenIntentInfo = res.data;
                        this.addEditChatTemplateFormData.content = this.chosenIntentInfo.intent_action.content;
                    })
                    .catch((err: any) => {
                        console.log(err);
                    });
            }
        },

        createChatTemplate() {
            if (this.chosenDepartment) {
                this.addEditChatTemplateFormData.department_id = this.chosenDepartment.value;
            }

            if (this.chosenIntent) {
                this.addEditChatTemplateFormData.intent_id = this.chosenIntent.value;
            }

            this.$store
                .dispatch("chat_template/createChatTemplate", {
                    inputs: this.addEditChatTemplateFormData,
                })
                .then(() => {
                    this.resetForm();

                    this.$emit("createdChatTempPlate");

                    this.$helpers.showSuccessNotification(this, "Chat Template created successful");
                })
                .catch((err: any) => this.addEditChatTemplateErrorHandle(err));
        },

        updateChatTemplate() {
            if (this.chosenDepartment) {
                this.addEditChatTemplateFormData.department_id = this.chosenDepartment.value;
            }

            this.addEditChatTemplateFormData.intent_id = "";
            if (this.chosenIntent) {
                this.addEditChatTemplateFormData.intent_id = this.chosenIntent.value;
            }

            // console.log(this.addEditChatTemplateFormData);

            this.$store
                .dispatch("chat_template/updateChatTemplate", {
                    inputs: this.addEditChatTemplateFormData,
                })
                .then((res: any) => {
                    this.resetForm();

                    this.$emit("updatedChatTemplate", res.data);

                    this.$helpers.showSuccessNotification(this, "Chat Template updated successful");
                })
                .catch((err: any) => this.addEditChatTemplateErrorHandle(err));
        },

        addEditChatTemplateErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.chatTemplateFormDataErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },

        resetForm() {
            this.$emit("hideModal");
            this.addEditChatTemplateFormData = {};
            this.addEditChatTemplateFormData.own = false;
            this.addEditChatTemplateFormData.active = true;
            this.chosenDepartment = "";
            this.chosenContentType = "static";
            this.chosenIntent = "";
            this.chatTemplateFormDataErrors = {};
        },
    },

    watch: {
        selectedForEditData: {
            handler(selectedForEditData) {
                if (this.showAddEditChatTemplateModal) {
                    this.addEditChatTemplateFormData = this.$_.cloneDeep(selectedForEditData);
                    this.addEditChatTemplateFormData.own = !!selectedForEditData.user_id;

                    // set chat_department information
                    if (selectedForEditData.chat_department_id) {
                        this.chosenDepartment = {
                            label: selectedForEditData.chat_department.tag,
                            value: selectedForEditData.chat_department_id,
                        };
                    }

                    // set intent information
                    if (selectedForEditData.intent_id) {
                        // content type
                        this.chosenContentType = "intent";

                        // load intent list
                        this.getIntents("intent");

                        // intent
                        this.chosenIntent = {
                            label: selectedForEditData.intent.tag,
                            value: selectedForEditData.intent_id,
                            description: selectedForEditData.intent.description,
                        };

                        // message
                        this.getIntentInfo({
                            value: selectedForEditData.intent_id,
                        });
                    }
                }
            },
            deep: true,
        },
    },
});
</script>

<style scoped></style>
