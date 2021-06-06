<template>
    <div>
        <q-card>
            <q-card-section>
                <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                    <div class="tw-flex">
                        <div class="tw-mr-4 ec-settings-profile-img tw-relative">
                            <ec-avatar
                                :image_src="profile.user_meta.attachment.src"
                                :name="profile.user_meta.display_name"
                                size="96px"
                            />
                            <q-btn
                                @click="updateAvatarModalHandle"
                                icon="edit"
                                :color="globalColor"
                                class="ec-edit-profile-img tw-absolute tw-top-0 tw-right-0 tw-hidden"
                                size="sm"
                                round
                                unelevated
                                dense
                            />
                        </div>

                        <div class="tw-self-center">
                            <div class="tw-font-medium tw-text-lg" :class="[globalTextColor]">
                                {{ $_.upperFirst(profile.user_meta?.full_name) }}
                            </div>
                            <div class="tw-text-xxs">
                                Chat Department:
                                <span :class="[globalTextColor]">{{
                                    profile.chat_departments.length ? '' : 'All'
                                }}</span>
                            </div>
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

        <q-dialog :model-value="updateAvatarModal" @hide="updateAvatarModal = false">
            <q-card style="min-width: 350px">
                <q-card-section class="text-center tw-pb-1">
                    <ec-avatar
                        :image_src="profile.user_meta.attachment.src"
                        :name="profile.user_meta.display_name"
                        :local_preview_src="previewAvatar"
                        size="150px"
                    />

                    <div>
                        <q-btn
                            v-if="!previewAvatar"
                            @click="clickUploadImage"
                            color="green"
                            label="Upload Image"
                            outline
                            class="tw-mt-3"
                        />
                        <q-btn v-else @click="updateAvatar" label="Save Change" color="green" class="tw-mt-3" outline />
                    </div>
                    <div class="tw-mt-3">
                        <q-file
                            @update:model-value="loadAvatar"
                            ref="submitBtn"
                            clearable
                            filled
                            color="purple-12"
                            v-model="avatar"
                            label="Label"
                            accept="image/*"
                            class="hidden"
                        />
                    </div>
                </q-card-section>

                <!-- <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="orange" v-close-popup />
                    <q-btn @click="updateAvatar" label="Save Change" color="green" flat />
                </q-card-actions> -->
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import EcAvatar from 'src/components/common/EcAvatar.vue';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import * as _l from 'lodash';

export default defineComponent({
    components: { EcAvatar },
    name: '',
    props: {},

    data(): any {
        return {
            existingAvatarUrl: '',
            updateAvatarModal: false,
            previewAvatar: '',
            avatar: '',
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
            this.getExistingAvatarUrl();
        }
    },

    methods: {
        getExistingAvatarUrl() {
            this.$store
                .dispatch('setting_profile/getAvatarPath', {
                    id: this.profile.user_meta.attachment.id,
                })
                .then((res: any) => {
                    this.existingAvatarUrl = URL.createObjectURL(
                        new Blob([res.data], { type: res.headers['content-type'] })
                    );
                });
        },

        updateAvatarModalHandle() {
            this.updateAvatarModal = !this.updateAvatarModal;
            this.previewAvatar = '';
            this.avatar = '';
        },

        clickUploadImage() {
            this.$refs.submitBtn.pickFiles();
        },

        loadAvatar(file: any) {
            if (!file) return (this.previewAvatar = '');

            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = (event: any) => {
                this.previewAvatar = event.target.result;
            };
        },

        async updateAvatar() {
            let formData = new FormData();
            formData.append('attachments', this.avatar, this.avatar.name);

            try {
                await this.$store.dispatch('setting_profile/updateAvatar', formData);

                this.$store.dispatch('setting_profile/reloadProfileImage', _l.cloneDeep(this.profile));

                this.updateAvatarModal = false;
                this.$helpers.showSuccessNotification(this, 'Avatar update successful');
            } catch (err) {
                this.$helpers.showErrorNotification(this, 'Avatar update failed');
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
