<template>
    <div>
        <q-card>
            <form @submit.prevent="changePassword">
                <q-card-section>
                    <div class="tw-flex tw-items-center tw-mb-2">
                        <div class="tw-font-medium">Change Password</div>
                    </div>
                    <q-input
                        label="Old Password"
                        v-model="formData.old_password"
                        :error-message="formDataErrors.old_password"
                        :error="!!formDataErrors.old_password"
                        @update:model-value="formDataErrors.old_password = ''"
                        color="green"
                        class="tw-mb-2"
                        dense
                    />
                    <q-input
                        label="New Password"
                        v-model="formData.password"
                        :error-message="formDataErrors.password"
                        :error="!!formDataErrors.password"
                        @update:model-value="formDataErrors.password = ''"
                        color="green"
                        class="tw-mb-2"
                        dense
                    />
                    <q-input
                        label="Confirm Password"
                        v-model="formData.confirm_password"
                        color="green"
                        class="tw-mb-2"
                        dense
                    />
                </q-card-section>

                <q-card-actions>
                    <q-btn type="submit" color="green" class="tw-mb-4"> Change Password </q-btn>
                </q-card-actions>
            </form>
        </q-card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SettingProfile',

    data(): any {
        return {
            formData: {
                old_password: '',
                password: '',
                confirm_password: '',
            },
            formDataErrors: {},
        };
    },

    methods: {
        changePassword() {
            if (this.formData.password !== this.formData.confirm_password) {
                this.$helpers.showErrorNotification(this, 'Password does not match');
                return;
            }

            this.$store
                .dispatch('auth/changePassword', {
                    inputs: this.formData,
                })
                .then(() => {
                    this.$helpers.showSuccessNotification(this, 'Password change successful');

                    // clear form
                    Object.keys(this.formData).forEach((key: any) => {
                        this.formData[key] = '';
                    });
                })
                .catch((err: any) => {
                    this.changePasswordErrorHandle(err);
                });
        },

        changePasswordErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.formDataErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },
    },
});
</script>
