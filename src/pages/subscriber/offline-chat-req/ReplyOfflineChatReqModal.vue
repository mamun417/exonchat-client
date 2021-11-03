<template>
    <q-dialog :model-value="true" persistent>
        <q-card style="min-width: 25rem">
            <q-card-section class="row items-center tw-border-b tw-px-6 tw-py-3">
                <div class="tw-text-lg tw-font-bold" :class="`text-${globalColor}`">
                    <div>Reply offline chat request</div>
                </div>
                <q-space></q-space>
                <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
            </q-card-section>

            <q-card-section>
                <div>
                    <q-input
                        v-model="replyFormData.subject"
                        :error-message="replyFormDataErrors.subject"
                        :error="!!replyFormDataErrors.subject"
                        @update:model-value="replyFormDataErrors.subject = ''"
                        :color="globalColor"
                        label="Subject"
                        class="tw-mb-3"
                        hide-bottom-space
                        no-error-icon
                        outlined
                        dense
                    />

                    <q-input
                        v-model="replyFormData.message"
                        :error-message="replyFormDataErrors.message"
                        :error="!!replyFormDataErrors.message"
                        @update:model-value="replyFormDataErrors.message = ''"
                        input-style="min-height: 50px"
                        label="Your Message"
                        :color="globalColor"
                        hide-bottom-space
                        type="textarea"
                        class="tw-mb-3"
                        no-error-icon
                        autogrow
                        outlined
                        rows="3"
                        dense
                    />
                </div>
            </q-card-section>

            <q-card-section class="tw-py-2 tw-pb-4">
                <q-btn
                    @click="createReply"
                    :color="globalColor"
                    :loading="loadingSendReply"
                    no-caps
                    unelevated
                    class="tw-w-full"
                >
                    Send Reply
                </q-btn>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineComponent } from "vue";

export default defineComponent({
    name: "ReplyOfflineChatReqModal",
    data(): any {
        return {
            loadingSendReply: false,
            replyFormData: {
                subject: "",
                message: "",
            },
            defaultForm: this.replyFormData,
            replyFormDataErrors: {},
        };
    },

    computed: {
        ...mapGetters({ globalColor: "setting_ui/globalColor" }),
    },

    methods: {
        createReply() {
            this.loadingSendReply = true;

            console.log(this.replyFormData);

            window.api
                .post("offline-chat-requests/reply", this.replyFormData)
                .then((res: any) => {
                    console.log({ defaultForm: this.defaultForm });
                    console.log(res.data);
                })
                .catch((err: any) => {
                    if (this.$_.isObject(err.response.data.message)) {
                        this.replyFormDataErrors = err.response.data.message;
                    } else {
                        this.$helpers.showErrorNotification(this, err.response.data.message);
                    }
                })
                .finally(() => {
                    this.loadingSendReply = false;
                });
        },
    },
});
</script>

<style scoped></style>
