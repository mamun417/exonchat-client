<template>
    <div class="tw-min-h-screen tw-p-2 tw-flex tw-flex-col tw-justify-center">
        <div class="tw-max-w-md tw-w-full tw-m-auto tw-p-10 tw-bg-white tw-rounded-xl tw-shadow-2xl">
            <form @submit.prevent="resetPassword">
                <div class="text-center tw-mb-6">
                    <q-icon name="published_with_changes" size="50px" color="green"></q-icon>
                </div>

                <div class="text-caption text-center tw-text-gray-500">Update your password.</div>
                <div class="tw-flex tw-mb-3">
                    <q-input
                        v-model="formData.email"
                        :error-message="formDataError.email"
                        :error="!!formDataError.email"
                        @update:model-value="formDataError.email = ''"
                        label="Email"
                        class="full-width"
                        color="green"
                    >
                        <template v-slot:prepend>
                            <q-icon name="mail" color="green" />
                        </template>
                    </q-input>
                </div>

                <div class="tw-flex tw-mb-3">
                    <q-input
                        v-model="formData.password"
                        :error-message="formDataError.password"
                        :error="!!formDataError.password"
                        @update:model-value="formDataError.password = ''"
                        label="Password"
                        class="full-width"
                        color="green"
                        type="password"
                    >
                        <template v-slot:prepend>
                            <q-icon name="password" color="green" />
                        </template>
                    </q-input>
                </div>
                <div class="tw-flex tw-mb-3">
                    <q-input
                        v-model="formData.confirm_password"
                        label="Confirm Password"
                        class="full-width"
                        color="green"
                        type="password"
                    >
                        <template v-slot:prepend>
                            <q-icon name="password" color="green" />
                        </template>
                    </q-input>
                </div>

                <div class="tw-mt-8 tw-mb-4">
                    <q-btn type="submit" color="green" dense class="full-width">Update</q-btn>
                </div>

                <div class="text-caption tw-text-gray-500">
                    Didn't receive the mail yet.
                    <span
                        class="text-green tw-font-bold tw-cursor-pointer"
                        @click="$router.push({ name: 'password-email' })"
                    >
                        Resend?
                    </span>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "ResetPassword",
    data(): any {
        return {
            formData: {
                email: "",
                password: "",
                confirm_password: "",
                token: this.$route.params.token,
            },
            formDataError: {},
        };
    },

    methods: {
        resetPassword() {
            if (this.formData.password !== this.formData.confirm_password) {
                this.$helpers.showErrorNotification(this, "Password does not match");
                return;
            }

            this.sendingEmail = true;

            this.$store
                .dispatch("auth/resetPassword", {
                    inputs: this.formData,
                })
                .then(() => {
                    this.$helpers.showSuccessNotification(this, "Password reset successful");
                    this.$router.push({ name: "login" });
                })
                .catch((err: any) => this.resetPasswordErrorHandle(err))
                .then(() => {
                    this.sendingEmail = false;
                });
        },

        resetPasswordErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.formDataError = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },
    },
});
</script>
