<template>
    <q-dialog :model-value="true">
        <q-card>
            <q-card-section class="tw-flex tw-justify-between tw-items-center tw-border-b">
                <div>
                    <span :class="`q-ml-sm tw-text-base tw-font-medium text-${globalColor}`"> Verification OTP </span>
                </div>
                <q-btn icon="close" color="orange" flat round dense v-close-popup></q-btn>
            </q-card-section>

            <q-card-section>
                <div>
                    <div>Enter verification code sent to your email address.</div>
                    <q-input
                        v-model="formData.twitter"
                        bg-color="white"
                        hide-bottom-space
                        dense
                        no-error-icon
                        :color="globalColor"
                        class="tw-my-3"
                        label="OTP"
                        outlined
                    />
                    <div>Didn't receive code? <span class="tw-underline">Resend code</span></div>
                </div>
            </q-card-section>

            <q-card-actions class="tw-py-2 tw-pb-4 tw-flex tw-justify-center">
                <q-btn :color="globalColor" no-caps unelevated class="tw-w-full"> Verify OTP </q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineComponent } from "vue";

export default defineComponent({
    name: "UpdateEmailOtpModal",
    data(): any {
        return {
            formData: {
                otp: "",
            },
        };
    },

    computed: {
        ...mapGetters({ globalColor: "setting_ui/globalColor" }),
    },
});
</script>

<style scoped></style>
