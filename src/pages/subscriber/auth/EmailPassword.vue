<template>
    <div class="tw-min-h-screen tw-p-2 tw-flex tw-flex-col tw-justify-center">
        <div class="tw-p-10 tw-max-w-md tw-m-auto tw-w-full tw-bg-white tw-rounded-xl tw-shadow-2xl">
            <form @submit.prevent="sendPasswordResetEmail">
                <div class="text-center tw-mb-6">
                    <q-icon name="restart_alt" size="50px" color="green"></q-icon>
                </div>

                <div class="text-caption text-center tw-text-gray-500">A reset mail will be send</div>

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

                <div class="tw-mt-8 tw-mb-4">
                    <q-btn :loading="sendingEmail" class="full-width" type="submit" color="green" dense>
                        Send Email
                    </q-btn>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'EmailPassword',
    data(): any {
        return {
            sendingEmail: false,
            formData: {
                email: '',
            },
            formDataError: {},
        };
    },

    methods: {
        sendPasswordResetEmail() {
            this.sendingEmail = true;

            this.$store
                .dispatch('auth/sendPasswordResetEmail', {
                    inputs: this.formData,
                })
                .then((res: any) => {
                    this.$helpers.showSuccessNotification(this, res.data.msg);
                })
                .catch((err: any) => this.sendPasswordResetEmailErrorHandle(err))
                .then(() => {
                    this.sendingEmail = false;
                });
        },

        sendPasswordResetEmailErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.formDataError = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },
    },
});
</script>
