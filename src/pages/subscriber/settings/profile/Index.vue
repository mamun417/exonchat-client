<template>
    <div>
        <!--        <q-card class="tw-mb-4">-->
        <!--            <q-card-section class="tw-text-lg tw-font-bold">Profile</q-card-section>-->
        <!--        </q-card>-->

        <q-card class="tw-mb-4 tw-shadow">
            <q-card-section>
                <div class="tw-flex tw-flex-col tw-items-center">
                    <div class="tw-mb-3 ec-settings-profile-img tw-relative">
                        <ec-avatar
                            :image_src="profile?.user_meta?.attachment?.src"
                            :name="profile?.user_meta?.display_name"
                            size="100px"
                        ></ec-avatar>
                        <q-btn
                            @click="updateAvatarModalHandle"
                            icon="edit"
                            :color="globalColor"
                            class="ec-edit-profile-img tw-absolute tw-top-0 tw-right-0 tw-hidden"
                            size="sm"
                            round
                            unelevated
                            dense
                        >
                            <q-tooltip class=""> Change avatar</q-tooltip>
                        </q-btn>
                    </div>

                    <div class="tw-mb-1 tw-font-medium">{{ profile?.email }}</div>

                    <div class="tw-flex tw-gap-2">
                        <div class="tw-text-xs">Assigned Departments:</div>
                        <q-badge :color="globalColor" v-for="dep of profile?.chat_departments" :key="dep.id"
                            >{{ dep.tag }}
                        </q-badge>
                    </div>
                </div>
            </q-card-section>
        </q-card>

        <div class="tw-grid lg:tw-grid-cols-2 md:tw-grid-cold-1 tw-grid tw-gap-4">
            <div>
                <q-card class="tw-mb-4 tw-shadow">
                    <q-card-section class="tw-py-2">
                        <div class="tw-border-b-1 tw-text-lg tw-font-medium tw-mb-4">Personal Information</div>

                        <div class="tw-mb-6">
                            <div>Full Name</div>
                            <q-input
                                v-model="formData.full_name"
                                :error-message="formDataErrors.full_name"
                                :error="!!formDataErrors.full_name"
                                @update:model-value="formDataErrors.full_name = ''"
                                bg-color="white"
                                class="tw-mb-2 tw-shadow tw-px-2"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />
                        </div>
                        <div>
                            <div>Display Name</div>
                            <q-input
                                v-model="formData.display_name"
                                :error-message="formDataErrors.display_name"
                                :error="!!formDataErrors.display_name"
                                @update:model-value="formDataErrors.display_name = ''"
                                bg-color="white"
                                class="tw-mb-2 tw-shadow tw-px-2"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />
                        </div>
                    </q-card-section>

                    <q-card-actions class="tw-py-2 tw-flex tw-justify-center">
                        <q-btn :color="globalColor" @click="updateProfile" no-caps unelevated
                            >Update Personal Information
                        </q-btn>
                    </q-card-actions>
                </q-card>

                <q-card class="tw-shadow">
                    <q-card-section class="tw-py-2">
                        <div class="tw-border-b-1 tw-text-lg tw-font-medium tw-mb-4">Other Information</div>

                        <div class="tw-mb-6">
                            <div>Phone Number</div>
                            <q-input
                                v-model="formData.phone"
                                bg-color="white"
                                class="tw-mb-2 tw-shadow tw-px-2"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />
                        </div>
                        <div class="tw-mb-6">
                            <div>Address</div>
                            <q-input
                                v-model="formData.address"
                                bg-color="white"
                                class="tw-mb-2 tw-shadow tw-px-2"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />
                        </div>
                        <div class="tw-mb-6">
                            <div>Facebook URI</div>
                            <q-input
                                v-model="formData.facebook"
                                bg-color="white"
                                class="tw-mb-2 tw-shadow tw-px-2"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />
                        </div>
                        <div class="tw-mb-6">
                            <div>Twitter URI</div>
                            <q-input
                                v-model="formData.twitter"
                                bg-color="white"
                                class="tw-mb-2 tw-shadow tw-px-2"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />
                        </div>
                        <div>
                            <div>Linkdin URI</div>
                            <q-input
                                v-model="formData.linkedin"
                                bg-color="white"
                                class="tw-mb-2 tw-shadow tw-px-2"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />
                        </div>
                    </q-card-section>

                    <q-card-actions class="tw-py-2 tw-flex tw-justify-center">
                        <q-btn :color="globalColor" @click="updateProfile" no-caps unelevated>
                            Update Other Information
                        </q-btn>
                    </q-card-actions>
                </q-card>
            </div>

            <div>
                <q-card class="tw-mb-4 tw-shadow">
                    <q-card-section class="tw-py-2">
                        <div class="tw-border-b-1 tw-text-lg tw-font-medium tw-mb-4">Change Password</div>

                        <div class="tw-mb-6">
                            <div>Old Password</div>
                            <q-input
                                v-model="passFormData.old_password"
                                :error-message="formDataErrors.old_password"
                                :error="!!formDataErrors.old_password"
                                @update:model-value="formDataErrors.old_password = ''"
                                bg-color="white"
                                class="tw-mb-2 tw-shadow tw-px-2"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />
                        </div>

                        <div class="tw-mb-6">
                            <div>New Password</div>
                            <q-input
                                v-model="passFormData.password"
                                :error-message="formDataErrors.password"
                                :error="!!formDataErrors.password"
                                @update:model-value="formDataErrors.password = ''"
                                bg-color="white"
                                class="tw-mb-2 tw-shadow tw-px-2"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />
                        </div>

                        <div>
                            <div>Confirm New Password</div>
                            <q-input
                                v-model="passFormData.confirm_password"
                                bg-color="white"
                                class="tw-mb-2 tw-shadow tw-px-2"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />
                        </div>
                    </q-card-section>

                    <q-card-actions class="tw-py-2 tw-flex tw-justify-center">
                        <q-btn :color="globalColor" @click="changePassword" no-caps unelevated>Change Password</q-btn>
                    </q-card-actions>
                </q-card>

                <q-card class="tw-shadow">
                    <q-card-section>
                        <div class="text-center">...</div>
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <q-dialog :model-value="updateAvatarModal" @hide="updateAvatarModal = false">
            <q-card style="min-width: 350px">
                <q-card-section class="text-center tw-pb-1">
                    <ec-avatar
                        :image_src="profile.user_meta.attachment?.src"
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
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import EcAvatar from "components/common/EcAvatar.vue";
import * as _l from "lodash";

export default defineComponent({
    name: "SettingProfile",
    components: { EcAvatar },
    data(): any {
        return {
            existingAvatarUrl: "",
            updateAvatarModal: false,
            previewAvatar: "",
            avatar: "",

            formData: {
                full_name: "",
                display_name: "",
                phone: "",
                address: "",
                facebook: "",
                twitter: "",
                linkedin: "",
            },
            passFormData: {
                old_password: "",
                password: "",
                confirm_password: "",
            },

            formDataErrors: {},
            passFormDataErrors: {},
        };
    },

    computed: {
        ...mapGetters({ profile: "auth/profile", globalColor: "setting_ui/globalColor" }),
    },

    methods: {
        updateAvatarModalHandle() {
            this.updateAvatarModal = !this.updateAvatarModal;
            this.previewAvatar = "";
            this.avatar = "";
        },
        clickUploadImage() {
            this.$refs.submitBtn.pickFiles();
        },
        loadAvatar(file: any) {
            if (!file) return (this.previewAvatar = "");

            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = (event: any) => {
                this.previewAvatar = event.target.result;
            };
        },
        async updateAvatar() {
            let formData = new FormData();
            formData.append("attachments", this.avatar, this.avatar.name);

            try {
                await this.$store.dispatch("setting_profile/updateAvatar", formData);

                this.$store.dispatch("setting_profile/reloadProfileImage", _l.cloneDeep(this.profile));

                this.updateAvatarModal = false;
                this.$helpers.showSuccessNotification(this, "Avatar update successful");
            } catch (err) {
                this.$helpers.showErrorNotification(this, "Avatar update failed");
            }
        },

        async updateProfile() {
            try {
                await this.$store.dispatch("setting_profile/updateProfile", {
                    inputs: this.formData,
                });
                await this.$store.dispatch("auth/updateAuthInfo");

                this.$helpers.showSuccessNotification(this, "Profile update successful");
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

        changePassword() {
            if (this.passFormData.password !== this.passFormData.confirm_password) {
                this.$helpers.showErrorNotification(this, "Password does not match");
                return;
            }

            this.$store
                .dispatch("auth/changePassword", {
                    inputs: this.passFormData,
                })
                .then(() => {
                    this.$helpers.showSuccessNotification(this, "Password change successful");

                    // clear form
                    Object.keys(this.passFormData).forEach((key: any) => {
                        this.passFormData[key] = "";
                    });
                })
                .catch((err: any) => {
                    this.changePasswordErrorHandle(err);
                });
        },
        changePasswordErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.passFormDataErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },
    },

    watch: {
        profile: {
            handler(profile) {
                if (!profile?.user_meta) return;

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

<style lang="scss">
.ec-settings-profile-img {
    &:hover {
        .ec-edit-profile-img {
            display: inline-flex;
        }
    }
}
</style>
