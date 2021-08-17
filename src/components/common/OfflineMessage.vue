<template>
    <div class="tw-mb-5">
        Unfortunately Live Chat is not available. Please fill out the form below to leave us a message.
    </div>

    <q-input
        v-model="convInitFields.name"
        :error="!!convInitFieldsErrors.name"
        @update:model-value="convInitFieldsErrors.name = ''"
        hide-bottom-space
        dense
        no-error-icon
        label="Your Name"
        :color="globalColor"
        class="tw-mb-3"
        outlined
    >
        <!--<template v-slot:prepend>
            <q-icon name="person" size="xs" :color="globalColor" />
        </template>-->
    </q-input>

    <q-input
        v-model="convInitFields.email"
        :error="!!convInitFieldsErrors.email"
        @update:model-value="convInitFieldsErrors.email = ''"
        hide-bottom-space
        dense
        no-error-icon
        :color="globalColor"
        class="tw-mb-3"
        label="Your Email"
        type="email"
        outlined
    >
        <!--<template v-slot:prepend>
            <q-icon name="email" size="xs" :color="globalColor" />
        </template>-->
    </q-input>

    <q-select
        v-model="convInitFields.department"
        :options="chatDepartments"
        @update:model-value="changeDepartment($event)"
        :error="!!convInitFieldsErrors.chat_department_id"
        hide-bottom-space
        option-value="id"
        option-label="tag"
        label="Chat Department"
        class="tw-mb-3"
        :color="globalColor"
        emit-value
        map-options
        dense
        no-error-icon
        outlined
    >
        <!--<template v-slot:prepend>
            <q-icon name="person" size="xs" :color="globalColor" />
        </template>-->
    </q-select>

    <q-input
        v-model="convInitFields.subject"
        :error="!!convInitFieldsErrors.subject"
        @update:model-value="convInitFieldsErrors.subject = ''"
        hide-bottom-space
        dense
        no-error-icon
        label="Your Subject"
        :color="globalColor"
        class="tw-mb-3"
        outlined
    >
        <!--<template v-slot:prepend>
            <q-icon name="subject" size="xs" :color="globalColor" />
        </template>-->
    </q-input>

    <q-input
        v-model="convInitFields.message"
        :error="!!convInitFieldsErrors.message"
        @update:model-value="convInitFieldsErrors.message = ''"
        hide-bottom-space
        dense
        no-error-icon
        label="Your Message"
        :color="globalColor"
        class="tw-mb-3"
        autogrow
        outlined
    >
        <!--<template v-slot:prepend>
            <q-icon name="textsms" size="xs" :color="globalColor" />
        </template>-->
    </q-input>

    <q-btn dense :color="globalColor" class="full-width tw-mt-4" @click="submitOfflineChatReq" no-caps unelevated>
        Submit Ticket
    </q-btn>

    <div class="tw-text-xxs tw-mt-2 tw-shadow-none">Note: Our agents will resolve your issue when they are online.</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "OfflineMessage",
    data(): any {
        return {
            convInitFields: {
                name: "",
                email: "",
                department: "",
                department_tag: "",
                subject: "",
                message: "",
                user_info: {},
            },
            convInitFieldsErrors: {},
        };
    },

    props: {
        chatDepartments: {
            type: [],
            default: [],
        },
        globalColor: {
            type: String,
            default: "green-10",
        },
    },

    methods: {
        submitOfflineChatReq() {
            this.convInitFields.chat_department_id = this.convInitFields.department;

            window.socketSessionApi
                .post("offline-chat-requests", this.convInitFields)
                .then((res: any) => {
                    console.log(res.data);
                    localStorage.setItem("success_submit_offline_chat_req", "true");
                    this.resetConvInitForm();

                    this.$emit("submitOfflineMessage");
                })
                .catch((err: any) => {
                    this.submitOfflineChatReqErrorHandle(err);
                });
        },

        resetConvInitForm() {
            this.convInitFields = {};
            this.convInitFieldsErrors = {};
        },

        submitOfflineChatReqErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.convInitFieldsErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },

        changeDepartment(event: any) {
            this.convInitFields.department_tag = this.$_.find(this.chatDepartments, ["id", event]).tag;
            this.convInitFieldsErrors.chat_department_id = "";
        },
    },
});
</script>

<style scoped></style>
