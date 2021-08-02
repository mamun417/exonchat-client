<template>
    <q-input
        v-model="convInitFields.name"
        :error-message="convInitFieldsErrors.name"
        :error="!!convInitFieldsErrors.name"
        @update:model-value="convInitFieldsErrors.name = ''"
        hide-bottom-space
        dense
        label="Your Name"
        color="blue-grey"
        class="tw-mb-3"
    >
        <template v-slot:prepend>
            <q-icon name="person" size="xs" color="blue-grey" />
        </template>
    </q-input>

    <q-input
        v-model="convInitFields.email"
        :error-message="convInitFieldsErrors.email"
        :error="!!convInitFieldsErrors.email"
        @update:model-value="convInitFieldsErrors.email = ''"
        hide-bottom-space
        dense
        color="blue-grey"
        class="tw-mb-3"
        label="Your Email"
        type="email"
    >
        <template v-slot:prepend>
            <q-icon name="email" size="xs" color="blue-grey" />
        </template>
    </q-input>

    <q-select
        v-model="convInitFields.department"
        :options="chatDepartments"
        @update:model-value="changeDepartment($event)"
        :error-message="convInitFieldsErrors.chat_department_id"
        :error="!!convInitFieldsErrors.chat_department_id"
        hide-bottom-space
        option-value="id"
        option-label="tag"
        label="Chat Department"
        class="tw-mb-3"
        color="blue-grey"
        emit-value
        map-options
        dense
    >
        <template v-slot:prepend>
            <q-icon name="person" size="xs" color="blue-grey" />
        </template>
    </q-select>

    <q-input
        v-model="convInitFields.subject"
        :error-message="convInitFieldsErrors.subject"
        :error="!!convInitFieldsErrors.subject"
        @update:model-value="convInitFieldsErrors.subject = ''"
        hide-bottom-space
        dense
        label="Your Subject"
        color="blue-grey"
        class="tw-mb-3"
    >
        <template v-slot:prepend>
            <q-icon name="subject" size="xs" color="blue-grey" />
        </template>
    </q-input>

    <q-input
        v-model="convInitFields.message"
        :error-message="convInitFieldsErrors.message"
        :error="!!convInitFieldsErrors.message"
        @update:model-value="convInitFieldsErrors.message = ''"
        hide-bottom-space
        dense
        label="Your Message"
        color="blue-grey"
        class="tw-mb-3"
        autogrow
    >
        <template v-slot:prepend>
            <q-icon name="textsms" size="xs" color="blue-grey" />
        </template>
    </q-input>

    <q-btn dense color="blue-grey" class="full-width tw-mt-6" @click="submitOfflineChatReq" no-caps unelevated>
        Submit Ticket
    </q-btn>

    <div class="tw-text-xxs tw-mt-2">
        <div>Note: Our agents will resolve your issue when they are online.</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'OfflineMessage',
    data(): any {
        return {
            convInitFields: {
                name: '',
                email: '',
                department: '',
                department_tag: '',
                subject: '',
                message: '',
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
    },

    methods: {
        submitOfflineChatReq() {
            this.convInitFields.chat_department_id = this.convInitFields.department;

            window.socketSessionApi
                .post('offline-chat-requests', this.convInitFields)
                .then((res: any) => {
                    console.log(res.data);
                    localStorage.setItem('success_submit_offline_chat_req', 'true');
                    this.resetConvInitForm();

                    this.$emit('submitOfflineMessage');
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
            this.convInitFields.department_tag = this.$_.find(this.chatDepartments, ['id', event]).tag;
            this.convInitFieldsErrors.chat_department_id = '';
        },
    },
});
</script>

<style scoped></style>
