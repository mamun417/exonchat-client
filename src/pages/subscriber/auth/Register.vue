<template>
    <div class="tw-min-h-screen tw-p-2 tw-flex tw-flex-col tw-justify-center">
        <div class="tw-max-w-md tw-w-full tw-m-auto tw-p-10 tw-bg-white tw-rounded-xl tw-shadow-2xl">
            <div class="text-center tw-mb-6">
                <q-icon name="account_circle" size="50px" color="green"></q-icon>
            </div>

            <div class="tw-flex tw-mb-3">
                <q-input v-model="formData.company_name" label="Company Name" class="full-width" color="green" dense>
                    <template v-slot:prepend>
                        <q-icon name="business" color="green" />
                    </template>
                </q-input>
            </div>
            <div class="tw-flex tw-mb-3">
                <q-input
                    v-model="formData.company_display_name"
                    label="Company Display Name"
                    class="full-width"
                    color="green"
                    dense
                >
                    <template v-slot:prepend>
                        <q-icon name="business" color="green" />
                    </template>
                </q-input>
            </div>

            <div class="tw-flex tw-mb-3">
                <q-input v-model="formData.full_name" label="Full Name" class="full-width" color="green" dense>
                    <template v-slot:prepend>
                        <q-icon name="badge" color="green" />
                    </template>
                </q-input>
            </div>
            <div class="tw-flex tw-mb-3">
                <q-input v-model="formData.display_name" label="Display Name" class="full-width" color="green" dense>
                    <template v-slot:prepend>
                        <q-icon name="badge" color="green" />
                    </template>
                </q-input>
            </div>

            <div class="tw-flex tw-mb-3">
                <q-input v-model="formData.email" label="Email" class="full-width" color="green" dense>
                    <template v-slot:prepend>
                        <q-icon name="mail" color="green" />
                    </template>
                </q-input>
            </div>

            <div class="tw-flex tw-mb-3">
                <q-input v-model="formData.password" label="Password" class="full-width" color="green" dense>
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
                    dense
                >
                    <template v-slot:prepend>
                        <q-icon name="password" color="green" />
                    </template>
                </q-input>
            </div>

            <!-- <div class="tw-flex tw-items-center tw-justify-between tw-mt-6">
                <q-checkbox
                    color="green"
                    label="Remember me"
                    size="sm"
                    dense
                ></q-checkbox>
                <div class="text-green">Forgot Password?</div>
            </div> -->

            <div class="tw-mt-8 tw-mb-4">
                <q-btn color="green" dense class="full-width" @click="registerButtonClicked">Register</q-btn>
            </div>

            <div class="text-caption tw-text-gray-500">
                Already have an account.
                <span class="text-green tw-font-bold tw-cursor-pointer" @click="$router.push('/auth/login')"
                    >Login?</span
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "Register",
    data(): any {
        return {
            formData: {
                company_name: "",
                company_display_name: "",
                full_name: "",
                display_name: "",
                email: "",
                password: "",
                confirm_password: "",
            },
        };
    },

    methods: {
        registerButtonClicked() {
            if (!this.formData.password || this.formData.password !== this.formData.confirm_password) {
                this.$helpers.showErrorNotification(this, "Passwor does not match");
                return;
            }

            const inputs = this.formData;

            this.$store
                .dispatch("auth/register", {
                    inputs,
                })
                .then(() => {
                    this.$helpers.showSuccessNotification(this, "Registration successful");
                    this.$router.push("/auth/login");
                })
                .catch((err: any) => {
                    console.log(err.response.data);
                    this.$helpers.showErrorNotification(this, err.response.data.message);
                });
        },
    },
});
</script>
