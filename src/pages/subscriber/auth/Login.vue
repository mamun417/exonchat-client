<template>
    <div class="tw-min-h-screen tw-p-2 tw-flex tw-flex-col tw-justify-center">
        <div class="tw-px-10 tw-py-8 tw-max-w-md tw-m-auto tw-w-full tw-bg-white tw-rounded-lg tw-shadow-2xl">
            <form @submit.prevent="loginButtonClicked">
                <div class="text-center tw-mb-8">
                    <q-img src="https://www.exonhost.com/img/logo.png" width="200px" />
                    <div class="tw-mt-3 tw-text-base" style="color: #555">Sign In to Your Account</div>
                    <!--<q-icon name="lock_open" size="50px" color="green"></q-icon>-->
                </div>

                <!--<div class="tw-flex tw-mb-3">
                    <q-input
                        label="Company Name"
                        class="full-width"
                        color="green"
                        v-model="formData.company_name"
                        autofocus
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="business" color="green" />
                        </template>
                    </q-input>
                </div>-->

                <div class="tw-flex tw-mb-3">
                    <q-input label="Email" class="full-width" color="green" v-model="formData.email" autofocus dense>
                        <template v-slot:prepend>
                            <q-icon name="mail" color="green" />
                        </template>
                    </q-input>
                </div>

                <div class="tw-flex tw-mb-3">
                    <q-input
                        label="Password"
                        class="full-width"
                        color="green"
                        v-model="formData.password"
                        type="password"
                        dense
                    >
                        <template v-slot:prepend>
                            <q-icon name="password" color="green" />
                        </template>
                    </q-input>
                </div>

                <div class="tw-flex tw-items-center tw-justify-between tw-mt-6">
                    <q-btn
                        :loading="loginLoading"
                        type="submit"
                        @click="loginButtonClicked"
                        color="green"
                        class="tw-px-10"
                        unelevated
                    >
                        <q-icon v-if="loginSuccess" name="check"></q-icon>
                        <div v-else>Login</div>
                    </q-btn>
                    <div
                        class="text-green tw-cursor-pointer tw-font-medium"
                        @click="$router.push({ name: 'password-email' })"
                    >
                        Forgot Password?
                    </div>
                </div>

                <div class="tw-mt-8 tw-mb-4"></div>

                <!--<div class="text-caption tw-text-gray-500">-->
                <!--    Dont have an account.-->
                <!--    <span class="text-green tw-font-bold tw-cursor-pointer" @click="$router.push('/auth/register')"-->
                <!--        >Create One?</span-->
                <!--    >-->
                <!--</div>-->

                <!--<div class="tw-text-xxs tw-mt-6 text-white bg-orange tw-p-2 tw-font-bold">-->
                <!--    admin is test@test.com. for agent/user test1@test.com or test2@test.com. for all password is 123-->
                <!--</div>-->
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "Login",
    data(): any {
        return {
            loginLoading: false,
            formData: {
                email: "",
                password: "",
                company_name: "exonhost",
            },
            loginSuccess: false,
        };
    },

    methods: {
        loginButtonClicked() {
            this.loginLoading = true;

            const inputs = {
                pass: this.formData.password,
                login_info: JSON.stringify({
                    email: this.formData.email,
                    company_name: this.formData.company_name,
                }),
            };

            this.$store
                .dispatch("auth/login", {
                    inputs,
                })
                .then((res: any) => {
                    const userInfo = res.data;
                    localStorage.setItem("ec_update_storage_auth", JSON.stringify(userInfo));

                    // this.$helpers.showSuccessNotification(this, "Login successful");

                    setTimeout(() => {
                        this.loginLoading = false;
                    }, 500);

                    this.loginSuccess = true;

                    setTimeout(() => {
                        this.$router.push({ name: "chat-interaction" });
                    }, 1000);
                })
                .catch((err: any) => {
                    this.loginLoading = false;
                    this.$helpers.showErrorNotification(this, err.response.data.message);
                });
        },
    },
});
</script>
