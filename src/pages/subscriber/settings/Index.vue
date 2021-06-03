<template>
    <div>
        <q-card>
            <q-card-section>
                <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                    <div class="tw-flex">
                        <q-avatar size="96px" class="tw-mr-4 ec-settings-profile-img">
                            <img :src="existingAvaterUrl || defaultAvater" alt="image" />
                            <q-btn
                                @click="updateAvaterModalHandle"
                                icon="edit"
                                :color="globalColor"
                                class="ec-edit-profile-img tw-absolute tw-top-0 tw-right-0 tw-hidden"
                                size="sm"
                                round
                                unelevated
                                dense
                        /></q-avatar>
                        <div class="tw-self-center">
                            <div class="tw-font-medium tw-text-lg" :class="[globalTextColor]">
                                {{ $_.upperFirst(profile.user_meta?.full_name) }}
                            </div>
                            <div class="text-caption">{{ profile.chat_departments.length ? '' : 'All' }}</div>
                        </div>
                    </div>
                    <div class="text-right tw-self-center">
                        <div class="tw-flex tw-justify-end tw-items-center">
                            <div class="tw-mr-1">
                                {{ profile.email }}
                            </div>
                            <q-icon name="email" />
                        </div>
                        <div v-if="profile.user_meta?.facebook" class="tw-flex tw-justify-end tw-items-center">
                            <div class="tw-mr-1">
                                {{ profile.user_meta?.facebook }}
                            </div>
                            <q-icon name="facebook" />
                        </div>
                        <div v-if="profile.user_meta?.twitter" class="tw-flex tw-justify-end tw-items-center">
                            <div class="tw-mr-1">
                                {{ profile.user_meta?.twitter }}
                            </div>
                            <q-icon name="fab fa-twitter" />
                        </div>
                        <div v-if="profile.user_meta?.linkedin" class="tw-flex tw-justify-end tw-items-center">
                            <div class="tw-mr-1">
                                {{ profile.user_meta?.linkedin }}
                            </div>
                            <q-icon name="fab fa-linkedin" />
                        </div>
                    </div>
                </div>
            </q-card-section>
            <q-separator />
            <q-tabs align="left" class="shadow-2 tw-font-medium" :indicator-color="globalColor" no-caps>
                <q-icon name="settings" class="tw-px-6" size="20px" :color="globalColor" />
                <q-route-tab to="/settings/profile" exact>Profile</q-route-tab>
                <q-route-tab to="/settings/ui" exact>UI</q-route-tab>
                <q-route-tab to="/settings/apps" exact>Apps</q-route-tab>
                <q-route-tab to="/settings/testing" exact>Testing</q-route-tab>
                <q-route-tab>Others</q-route-tab>
            </q-tabs>
        </q-card>
        <div class="tw-mt-6">
            <router-view></router-view>
        </div>

        <q-dialog :model-value="updateAvaterModal" @hide="updateAvaterModal = false" persistent>
            <q-card style="min-width: 350px">
                <q-card-section class="text-center">
                    <q-avatar size="150px" class="tw-mr-4 ec-settings-profile-img">
                        <img :src="previewAvater || existingAvaterUrl || defaultAvater" alt="" />
                    </q-avatar>
                    <div>
                        <q-btn @click="clickUploadImage" color="green" label="Upload Image" outline class="tw-mt-3" />
                    </div>
                    <div class="tw-mt-3">
                        <q-file
                            @update:model-value="loadAvater"
                            ref="submitBtn"
                            clearable
                            filled
                            color="purple-12"
                            v-model="avater"
                            label="Label"
                            accept="image/*"
                            class="hidden"
                        />
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn @click="updateAvatar" label="Save Change" color="primary" flat />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
    name: '',
    props: {},

    data(): any {
        return {
            defaultAvater: 'https://cdn.quasar.dev/img/avatar1.jpg',
            existingAvaterUrl: '',
            updateAvaterModal: false,
            previewAvater: '',
            avater: '',
        };
    },

    computed: {
        ...mapGetters({
            profile: 'auth/profile',
            globalTextColor: 'setting_ui/globalTextColor',
            globalColor: 'setting_ui/globalColor',
        }),
    },

    mounted() {
        if (this.profile && this.profile.user_meta.attachment) {
            this.getExistingAvaterUrl();
        }
    },

    methods: {
        getExistingAvaterUrl() {
            this.$store
                .dispatch('setting_profile/getAvaterPath', {
                    id: this.profile.user_meta.attachment.id,
                })
                .then((res: any) => {
                    this.existingAvaterUrl = URL.createObjectURL(
                        new Blob([res.data], { type: res.headers['content-type'] })
                    );
                });
        },

        updateAvaterModalHandle() {
            this.updateAvaterModal = !this.updateAvaterModal;
            this.previewAvater = '';
            this.avater = '';
        },

        clickUploadImage() {
            this.$refs.submitBtn.pickFiles();
        },

        loadAvater(file: any) {
            if (!file) return (this.previewAvater = '');

            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = (event: any) => {
                this.previewAvater = event.target.result;
            };
        },

        async updateAvatar() {
            let formData = new FormData();
            formData.append('avater', this.avater);

            try {
                await this.$store.dispatch('setting_profile/updateAvater', formData);
                await this.$store.dispatch('auth/updateAuthInfo');
                this.getExistingAvaterUrl();

                this.updateAvaterModal = false;
                this.$helpers.showSuccessNotification(this, 'Avater update successful');
            } catch (err) {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },
    },
});
</script>

<style lang="scss">
.ec-settings-profile-img {
    &:hover {
        .ec-edit-profile-img {
            display: inline-flex;
        }
    }
}
</style>
