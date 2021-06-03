<template>
    <div>
        <q-card>
            <form @submit.prevent="updateProfile">
                <q-card-section>
                    <div class="tw-flex tw-items-center tw-mb-2">
                        <div class="tw-font-medium">Update Profile</div>
                    </div>
                    <q-input
                        label="Full Name"
                        v-model="formData.full_name"
                        :error-message="formDataErrors.full_name"
                        :error="!!formDataErrors.full_name"
                        @update:model-value="formDataErrors.full_name = ''"
                        color="green"
                        class="tw-mb-2"
                        dense
                    />
                    <q-input
                        label="Display Name"
                        v-model="formData.display_name"
                        :error-message="formDataErrors.display_name"
                        :error="!!formDataErrors.display_name"
                        @update:model-value="formDataErrors.display_name = ''"
                        color="green"
                        class="tw-mb-2"
                        dense
                    />
                    <q-input label="Phone Number" v-model="formData.phone" color="green" class="tw-mb-2" dense />
                    <q-input label="Full Address" v-model="formData.address" color="green" class="tw-mb-2" dense />
                    <q-input label="Facebook URl" v-model="formData.facebook" color="green" class="tw-mb-2" dense />
                    <q-input label="Twitter URl" v-model="formData.twitter" color="green" class="tw-mb-2" dense />
                    <q-input label="Linkedin URl" v-model="formData.linkedin" color="green" class="tw-mb-2" dense />
                </q-card-section>

                <q-card-actions>
                    <q-btn type="submit" color="green" class="tw-mb-4"> Update Profile </q-btn>
                </q-card-actions>
            </form>
        </q-card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
    name: 'SettingProfile',

    data(): any {
        return {
            formData: {
                full_name: '',
                display_name: '',
                phone: '',
                address: '',
                facebook: '',
                twitter: '',
                linkedin: '',
            },
            formDataErrors: {},
        };
    },

    computed: {
        ...mapGetters({ profile: 'auth/profile' }),
    },

    methods: {
        async updateProfile() {
            try {
                await this.$store.dispatch('setting_profile/updateProfile', {
                    inputs: this.formData,
                });
                await this.$store.dispatch('auth/updateAuthInfo');

                this.$helpers.showSuccessNotification(this, 'Profile update successful');
            } catch (err) {
                this.updateProfileErrorHandle(err);
            }
        },

        updateProfileErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.formDataErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },
    },

    watch: {
        profile: {
            handler(profile) {
                this.formData.full_name = profile.user_meta.full_name;
                this.formData.display_name = profile.user_meta.display_name;
                this.formData.phone = profile.user_meta.phone;
                this.formData.address = profile.user_meta.address;
                this.formData.facebook = profile.user_meta.facebook;
                this.formData.twitter = profile.user_meta.twitter;
                this.formData.linkedin = profile.user_meta.linkedin;
            },
            deep: true,
            immediate: true,
        },
    },
});
</script>
