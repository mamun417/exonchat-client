<template>
    <div class="tw-py-6 tw-px-8" :class="$helpers.colors().defaultText">
        <div class="tw-mb-4">
            <div class="tw-text-2xl text-weight-bold tw-flex tw-gap-3">
                <div><q-icon name="far fa-id-card" size="xs" class="tw--mt-1" /></div>
                <div>Profile</div>
            </div>

            <div class="tw-grid lg:tw-grid-cols-2 md:tw-grid-col-1 tw-gap-6 tw-mt-6">
                <!--Left-->
                <div>
                    <q-card class="tw-shadow-none tw-bg-transparent">
                        <!--Personal Information-->
                        <q-card-section class="tw-p-0">
                            <div class="tw-border-b-1 tw-font-bold tw-mb-4 tw-pb-2 tw-uppercase tw-text-lg">
                                Personal Information
                            </div>

                            <div class="tw-mb-7">
                                <div class="text-weight-bold tw-mb-1 tw-text-xs">Your Name</div>
                                <q-input
                                    v-model="formData.full_name"
                                    :error-message="formDataErrors.full_name"
                                    :error="!!formDataErrors.full_name"
                                    @update:model-value="formDataErrors.full_name = ''"
                                    no-error-icon
                                    bg-color="white"
                                    class="tw-shadow tw-px-2 tw-bg-white"
                                    hide-bottom-space
                                    standout
                                    borderless
                                    dense
                                />
                            </div>

                            <div class="tw-mb-7">
                                <div class="tw-font-bold tw-mb-1 tw-text-xs">Alias Name (Publicly Visible)</div>
                                <q-input
                                    v-model="formData.display_name"
                                    :error-message="formDataErrors.display_name"
                                    :error="!!formDataErrors.display_name"
                                    @update:model-value="formDataErrors.display_name = ''"
                                    no-error-icon
                                    bg-color="white"
                                    class="tw-shadow tw-px-2 tw-bg-white"
                                    hide-bottom-space
                                    standout
                                    borderless
                                    dense
                                />
                            </div>

                            <div class="tw-mb-7">
                                <div class="tw-font-bold tw-mb-1 tw-text-xs">Email</div>
                                <q-input
                                    v-model="formData.email"
                                    :error-message="formDataErrors.email"
                                    :error="!!formDataErrors.email"
                                    @update:model-value="formDataErrors.email = ''"
                                    no-error-icon
                                    bg-color="white"
                                    class="tw-shadow tw-px-2 tw-bg-white"
                                    hide-bottom-space
                                    standout
                                    borderless
                                    dense
                                />
                            </div>

                            <q-btn class="tw-px-3" :color="globalColor" @click="updateProfile" no-caps unelevated dense>
                                Save Changes
                            </q-btn>
                        </q-card-section>

                        <!--Change Password-->
                        <q-card-section class="tw-p-0 tw-mt-10">
                            <div class="tw-font-bold tw-mb-6 tw-uppercase tw-text-lg">Change Password</div>

                            <div class="tw-mb-7">
                                <div class="text-weight-bold tw-mb-1 tw-text-xs">Current Password</div>
                                <q-input
                                    v-model="passFormData.old_password"
                                    :error-message="passFormDataErrors.old_password"
                                    :error="!!passFormDataErrors.old_password"
                                    @update:model-value="passFormDataErrors.old_password = ''"
                                    class="tw-shadow tw-px-2 tw-bg-white"
                                    no-error-icon
                                    type="password"
                                    hide-bottom-space
                                    standout
                                    borderless
                                    dense
                                />
                            </div>

                            <div class="tw-mb-7">
                                <div class="tw-font-bold tw-mb-1 tw-text-xs">New Password</div>
                                <q-input
                                    v-model="passFormData.password"
                                    :error-message="passFormDataErrors.password"
                                    :error="!!passFormDataErrors.password"
                                    @update:model-value="passFormDataErrors.password = ''"
                                    no-error-icon
                                    bg-color="white"
                                    class="tw-shadow tw-px-2 tw-bg-white"
                                    type="password"
                                    hide-bottom-space
                                    standout
                                    borderless
                                    dense
                                />
                            </div>

                            <q-btn
                                class="tw-px-3"
                                :color="globalColor"
                                @click="changePassword"
                                no-caps
                                unelevated
                                dense
                            >
                                Update Password
                            </q-btn>
                        </q-card-section>
                    </q-card>
                </div>

                <!--Right-->
                <div>
                    <q-card class="tw-shadow-none tw-bg-transparent">
                        <!--Photo-->
                        <q-card-section class="tw-p-0">
                            <div class="tw-border-b-1 tw-font-bold tw-mb-4 tw-pb-2 tw-uppercase tw-text-lg">Photo</div>

                            <div class="tw-flex tw-gap-4">
                                <div>
                                    <ec-avatar
                                        :image_src="profile?.user_meta?.attachment?.src"
                                        :name="profile?.user_meta?.display_name"
                                        :email="profile?.email"
                                        size="110px"
                                    />
                                </div>

                                <div>
                                    <div class="tw-pb-2 tw-text-xs text-grey">Photo tips:</div>

                                    <div class="tw-pl-6">
                                        <ul class="tw-list-disc" style="line-height: 20px">
                                            <li>
                                                Visitors feel more comfortable when they can see who they're speaking
                                                with.
                                            </li>
                                            <li>
                                                Using a real photo also helps visitors feel they're talking to a real
                                                person.
                                            </li>
                                            <li>Be sure to use a professional photo as your visitors will see this.</li>
                                        </ul>
                                    </div>

                                    <div class="tw-mt-2 text-blue-5 cursor-pointer" @click="updateAvatarModalHandle">
                                        Change your photo with Gravatar
                                    </div>
                                </div>
                            </div>

                            <div class="tw-mt-6">
                                <div class="tw-flex tw-items-center tw-justify-between">
                                    <div class="tw-font-bold tw-text-xs">Enable Gravatar</div>
                                    <div>
                                        <q-toggle
                                            v-model="enable_avatar"
                                            checked-icon="check"
                                            color="green"
                                            unchecked-icon="clear"
                                        />
                                    </div>
                                </div>
                                <div class="text-grey tw-text-xs">
                                    Use the gravatar associated with your email when enabled, or just use the default
                                    image
                                </div>
                            </div>
                        </q-card-section>

                        <!--Chat Settings-->
                        <q-card-section class="tw-p-0 tw-mt-10">
                            <div class="tw-font-bold tw-mb-4 tw-uppercase tw-text-lg">Chat Settings</div>

                            <div class="tw-flex tw-items-center tw-justify-between">
                                <div class="tw-font-bold tw-text-xs tw-mb-1">Auto Away/Idle Timeout Queue</div>
                                <div>
                                    <q-toggle
                                        v-model="idle_time_queue"
                                        checked-icon="check"
                                        color="green"
                                        unchecked-icon="clear"
                                    />
                                </div>
                            </div>

                            <q-select
                                class="tw-shadow tw-px-2 tw-bg-white tw-mb-6"
                                :options="['10 minutes', '20 minutes', '30 minutes', '40 minutes']"
                                v-model="idle_time_out"
                                no-error-icon
                                bg-color="white"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />

                            <q-btn class="tw-px-3" :color="globalColor" no-caps unelevated dense> Save Changes </q-btn>
                        </q-card-section>

                        <!--Ticket Signature-->
                        <q-card-section class="tw-p-0 tw-mt-10">
                            <div class="tw-border-b-1 tw-font-bold tw-mb-4 tw-pb-2 tw-uppercase tw-text-lg">
                                Ticket Signature
                            </div>

                            <div class="tw-flex tw-gap-6">
                                <div>
                                    <q-toggle
                                        v-model="ticket_signature"
                                        checked-icon="check"
                                        color="green"
                                        unchecked-icon="clear"
                                    />
                                </div>

                                <div class="">
                                    <div>Enable Your Ticket Signature</div>
                                    <div class="text-grey tw-text-xxs">
                                        This signature will be added to al your ticket responses
                                    </div>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>

            <!--Notifications-->
            <div>
                <q-card class="tw-shadow-none tw-bg-transparent">
                    <q-card-section class="tw-p-0 tw-mt-10">
                        <div class="tw-border-b-1 tw-font-bold tw-mb-4 tw-pb-2 tw-uppercase tw-text-lg">
                            Notifications
                        </div>
                    </q-card-section>
                </q-card>

                <q-card class="tw-shadow tw-mt-6">
                    <q-card-section class="tw-p-0">
                        <div>
                            <q-list separator>
                                <q-item>
                                    <q-item-section>
                                        <div class="tw-font-bold text-grey-5">Event</div>
                                    </q-item-section>
                                    <q-item-section side>
                                        <div class="tw-font-bold text-grey-5">Email</div>
                                    </q-item-section>
                                </q-item>

                                <q-item>
                                    <q-item-section>Ticket Assigned To Me</q-item-section>
                                    <q-item-section side>
                                        <q-toggle
                                            v-model="enable_avatar"
                                            checked-icon="check"
                                            color="green"
                                            unchecked-icon="clear"
                                        />
                                    </q-item-section>
                                </q-item>

                                <q-item>
                                    <q-item-section>Ticket Created</q-item-section>
                                    <q-item-section side>
                                        <q-toggle
                                            v-model="enable_avatar"
                                            checked-icon="check"
                                            color="green"
                                            unchecked-icon="clear"
                                        />
                                    </q-item-section>
                                </q-item>

                                <q-item>
                                    <q-item-section>Ticket Reply</q-item-section>
                                    <q-item-section side>
                                        <q-toggle
                                            v-model="enable_avatar"
                                            checked-icon="check"
                                            color="green"
                                            unchecked-icon="clear"
                                        />
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <!--<q-card class="tw-mb-4 tw-shadow">
            <q-card-section>
                <div class="tw-flex tw-flex-col tw-items-center">
                    <div class="tw-mb-3 ec-settings-profile-img tw-relative">
                        <ec-avatar
                            :image_src="profile?.user_meta?.attachment?.src"
                            :name="profile?.user_meta?.display_name"
                            :email="profile?.email"
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
                                no-error-icon bg-color="white"
                                class="tw-mb-2 tw-shadow tw-px-2"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />
                        </div>

                        <div class="tw-mb-6">
                            <div>Display Name</div>
                            <q-input
                                v-model="formData.display_name"
                                :error-message="formDataErrors.display_name"
                                :error="!!formDataErrors.display_name"
                                @update:model-value="formDataErrors.display_name = ''"
                                no-error-icon bg-color="white"
                                class="tw-mb-2 tw-shadow tw-px-2"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />
                        </div>

                        <div class="tw-mb-6">
                            <div>Email Address</div>
                            <q-input
                                v-model="formData.email"
                                :error-message="formDataErrors.email"
                                :error="!!formDataErrors.email"
                                @update:model-value="formDataErrors.email = ''"
                                no-error-icon bg-color="white"
                                class="tw-mb-2 tw-shadow tw-px-2"
                                hide-bottom-space
                                standout
                                borderless
                                dense
                            />
                        </div>
                    </q-card-section>

                    <q-card-actions class="tw-py-2 tw-pb-4 tw-flex tw-justify-center">
                        <q-btn :color="globalColor" @click="updateProfile" no-caps unelevated>
                            Update Personal Information
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
                                no-error-icon bg-color="white"
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
                                no-error-icon bg-color="white"
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
                                no-error-icon bg-color="white"
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
                                no-error-icon bg-color="white"
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
                                no-error-icon bg-color="white"
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
                                no-error-icon bg-color="white"
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
                                no-error-icon bg-color="white"
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
                                no-error-icon bg-color="white"
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
        </div>-->

        <q-dialog :model-value="updateAvatarModal" @hide="updateAvatarModal = false">
            <q-card style="min-width: 350px">
                <q-card-section class="text-center tw-pb-1">
                    <ec-avatar
                        :image_src="profile.user_meta.attachment?.src"
                        :name="profile.user_meta.display_name"
                        :email="profile.email"
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

        <!--<update-email-otp-modal v-if="emailUpdateVerifyOtpModalShow" />-->
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import EcAvatar from "components/common/EcAvatar.vue";
import * as _l from "lodash";
// import UpdateEmailOtpModal from "pages/subscriber/settings/profile/UpdateEmailOtpModal.vue";

export default defineComponent({
    name: "SettingProfile",
    components: { EcAvatar },
    data(): any {
        return {
            idle_time_out: "30 minutes",
            ticket_signature: false,
            idle_time_queue: true,
            enable_avatar: true,
            existingAvatarUrl: "",
            updateAvatarModal: false,
            previewAvatar: "",
            avatar: "",

            formData: {
                full_name: "",
                display_name: "",
                email: "",
                phone: "",
                address: "",
                facebook: "",
                twitter: "",
                linkedin: "",
            },
            formDataErrors: {},

            passFormData: {
                old_password: "",
                password: "",
            },
            passFormDataErrors: {},

            updateProfileLoading: false,
            emailUpdateVerifyOtpModalShow: false,
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

                await this.$store.dispatch("setting_profile/reloadProfileImage", _l.cloneDeep(this.profile));

                this.updateAvatarModal = false;
                this.$helpers.showSuccessNotification(this, "Avatar update successful");
            } catch (err) {
                this.$helpers.showErrorNotification(this, "Avatar update failed");
            }
        },

        async updateProfile() {
            this.updateProfileLoading = true;

            try {
                const updateProfileRes = await this.$store.dispatch("setting_profile/updateProfile", {
                    inputs: this.formData,
                });

                // if (updateProfileRes.data.send_otp) {
                //     this.emailUpdateVerifyOtpModalShow = true;
                //     return;
                // }

                await this.$store.dispatch("auth/updateAuthInfo");

                this.$helpers.showSuccessNotification(this, "Profile update successful");

                // this.updateProfileLoading = false;
            } catch (err) {
                // this.updateProfileLoading = false;
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
            // if (this.passFormData.password !== this.passFormData.confirm_password) {
            //     this.$helpers.showErrorNotification(this, "Password does not match");
            //     return;
            // }

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
                this.formData.email = profile.email;
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
