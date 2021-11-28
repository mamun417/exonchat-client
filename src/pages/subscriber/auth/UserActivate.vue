<template>
    <div class="tw-min-h-screen tw-p-2 tw-flex tw-flex-col tw-justify-center">
        <div class="tw-max-w-md tw-w-full tw-m-auto tw-p-10 tw-bg-white tw-rounded-xl tw-shadow-2xl">
            <div v-if="!error">
                <div class="text-center tw-mb-6">
                    <q-icon name="celebration" size="50px" color="green"></q-icon>
                </div>

                <div class="text-caption text-center tw-text-gray-500">
                    Activate your <b class="text-green">{{ formData.type }}</b> account
                </div>

                <div class="tw-flex tw-mb-3">
                    <q-input
                        :error-message="formDataErrors.email"
                        :error="!!formDataErrors.email"
                        @update:model-value="formDataErrors.email = ''"
                        v-model="formData.email"
                        label="Email"
                        class="full-width"
                        color="green"
                        dense
                        :readonly="!isShareableLinkInvitation"
                        hide-bottom-space
                    >
                        <template v-slot:prepend>
                            <q-icon name="mail" color="green" />
                        </template>
                    </q-input>
                </div>

                <div class="tw-flex tw-mb-3">
                    <q-input
                        :error-message="formDataErrors.full_name"
                        :error="!!formDataErrors.full_name"
                        @update:model-value="formDataErrors.full_name = ''"
                        v-model="formData.full_name"
                        label="Full Name"
                        class="full-width"
                        color="green"
                        dense
                        hide-bottom-space
                    >
                        <template v-slot:prepend>
                            <q-icon name="badge" color="green" />
                        </template>
                    </q-input>
                </div>

                <div class="tw-flex tw-mb-3">
                    <q-input
                        :error-message="formDataErrors.display_name"
                        :error="!!formDataErrors.display_name"
                        @update:model-value="formDataErrors.display_name = ''"
                        v-model="formData.display_name"
                        label="Display Name"
                        class="full-width"
                        color="green"
                        dense
                        hide-bottom-space
                    >
                        <template v-slot:prepend>
                            <q-icon name="badge" color="green" />
                        </template>
                    </q-input>
                </div>

                <div v-if="!isShareableLinkInvitation" class="tw-flex tw-mb-3">
                    <q-input
                        :error-message="formDataErrors.code"
                        :error="!!formDataErrors.code"
                        @update:model-value="formDataErrors.code = ''"
                        v-model="formData.code"
                        label="Activation Code"
                        class="full-width"
                        color="green"
                        dense
                        hide-bottom-space
                    >
                        <template v-slot:prepend>
                            <q-icon name="qr_code" color="green" />
                        </template>
                    </q-input>
                </div>

                <div class="tw-flex tw-mb-3">
                    <q-input
                        :error-message="formDataErrors.password"
                        :error="!!formDataErrors.password"
                        @update:model-value="formDataErrors.password = ''"
                        v-model="formData.password"
                        label="Password"
                        class="full-width"
                        color="green"
                        dense
                        hide-bottom-space
                        type="password"
                    >
                        <template v-slot:prepend>
                            <q-icon name="password" color="green" />
                        </template>
                    </q-input>
                </div>

                <div class="tw-flex tw-mb-3">
                    <q-input
                        :error-message="formDataErrors.confirm_password"
                        :error="!!formDataErrors.confirm_password"
                        @update:model-value="formDataErrors.confirm_password = ''"
                        v-model="formData.confirm_password"
                        label="Confirm Password"
                        class="full-width"
                        color="green"
                        dense
                        hide-bottom-space
                        type="password"
                    >
                        <template v-slot:prepend>
                            <q-icon name="password" color="green" />
                        </template>
                    </q-input>
                </div>

                <div class="tw-mt-8 tw-mb-4">
                    <q-btn color="green" dense class="full-width" @click="join">Activate</q-btn>
                </div>
            </div>

            <div v-else>
                <q-banner
                    dense
                    inline-actions
                    class="text-white tw-text-center tw-font-medium bg-orange tw-rounded tw-py-3"
                >
                    Invalid invitation id.
                </q-banner>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    data(): any {
        return {
            formData: {
                email: "",
                full_name: "",
                display_name: "",
                password: "",
                confirm_password: "",
                code: "",
                invitation_id: "",
                type: "",
            },
            formDataErrors: {},
            error: false,
        };
    },

    computed: {
        isShareableLinkInvitation() {
            return !!this.$route.query["access_token"];
        },
    },

    mounted() {
        this.getInvitationInfo();
    },

    methods: {
        getInvitationInfo() {
            const url = this.isShareableLinkInvitation
                ? "user_invitation/getShareableLinkInvitationInfo"
                : "user_invitation/getInvitationInfo";

            this.$store
                .dispatch(url, {
                    id: this.$route.params["id"],
                })
                .then((res: any) => {
                    if (!res.data) this.error = true;

                    if (!this.isShareableLinkInvitation) {
                        this.formData.email = res.data.email;
                        this.formData.type = res.data.type;
                    }

                    this.formData.invitation_id = this.$route.params["id"];
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        join() {
            if (this.formData.password !== this.formData.confirm_password) {
                this.$helpers.showErrorNotification(this, "Password does not match");
                return;
            }

            const url = this.isShareableLinkInvitation
                ? "user_invitation/joinInvitationByShareableLink"
                : "user_invitation/joinInvitation";

            this.$store
                .dispatch(url, {
                    inputs: this.formData,
                })
                .then((res: any) => {
                    this.$helpers.showSuccessNotification(
                        this,
                        "Your account activated successful. You can login  now."
                    );

                    if (res.data.status === "success") {
                        this.$router.push({ name: "login" });
                    }
                })
                .catch((err: any) => {
                    console.log(err);
                    this.joinErrorHandle(err);
                });
        },

        joinErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.formDataErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },
    },
});
</script>
