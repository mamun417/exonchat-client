<template>
    <q-dialog :model-value="true" persistent>
        <q-card style="min-width: 25rem">
            <q-card-section class="tw-flex tw-justify-between tw-items-center tw-border-b">
                <div>
                    <span :class="`q-ml-sm tw-text-base tw-font-medium text-${globalColor}`">
                        Reply offline chat request
                    </span>
                </div>
                <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
            </q-card-section>

            <q-card-section>
                <div>
                    <q-input
                        hide-bottom-space
                        dense
                        no-error-icon
                        :color="globalColor"
                        class="tw-mb-3"
                        label="Subject"
                        type="email"
                        outlined
                    />

                    <q-input
                        hide-bottom-space
                        dense
                        no-error-icon
                        label="Your Message"
                        :color="globalColor"
                        class="tw-mb-3"
                        autogrow
                        outlined
                        type="textarea"
                        input-style="min-height: 50px"
                        rows="3"
                    />
                </div>
            </q-card-section>

            <q-card-section class="tw-py-2 tw-pb-4">
                <q-btn :color="globalColor" no-caps unelevated class="tw-w-full"> Send Reply</q-btn>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "ReplyOfflineChatReqModal",
    computed: {
        ...mapGetters({ globalColor: "setting_ui/globalColor" }),
    },
};
</script>

<style scoped></style>
