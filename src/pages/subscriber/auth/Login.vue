<template>
    <div class="tw-min-h-screen tw-p-2 tw-flex tw-flex-col tw-justify-center">
        <div class="tw-p-10 tw-max-w-md tw-m-auto tw-w-full tw-bg-white tw-rounded-xl tw-shadow-2xl">
            <form @submit.prevent="loginButtonClicked">
                <div class="text-center tw-mb-6">
                    <q-icon name="lock_open" size="50px" color="green"></q-icon>
                </div>
                <div class="tw-flex tw-mb-3">
                    <q-input label="Email" class="full-width" color="green" v-model="formData.email" autofocus>
                        <template v-slot:prepend>
                            <q-icon name="mail" color="green" />
                        </template>
                    </q-input>
                </div>

                <div class="tw-flex tw-mb-3">
                    <q-input label="Password" class="full-width" color="green" v-model="formData.password">
                        <template v-slot:prepend> <q-icon name="password" color="green" /> </template
                    ></q-input>
                </div>

                <div class="tw-flex tw-items-center tw-justify-between tw-mt-6">
                    <q-checkbox color="green" label="Remember me" size="sm" dense></q-checkbox>
                    <div class="text-green" @click="$router.push('/auth/reset-pass')">Forgot Password?</div>
                </div>

                <div class="tw-mt-8 tw-mb-4">
                    <q-btn type="submit" @click="loginButtonClicked" color="green" class="full-width" dense unelevated>
                        Login
                    </q-btn>
                </div>

                <div class="text-caption tw-text-gray-500">
                    Dont have an account.
                    <span class="text-green tw-font-bold">Create One?</span>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Login',
    data(): any {
        return {
            formData: {
                email: 'test@test.test',
                password: '123',
                company_name: 'test',
            },
        };
    },

    methods: {
        loginButtonClicked() {
            const inputs = {
                pass: this.formData.password,
                login_info: JSON.stringify({
                    email: this.formData.email,
                    company_name: this.formData.company_name,
                }),
            };

            this.$store
                .dispatch('auth/login', {
                    inputs,
                })
                .then(() => {
                    this.$q.notify({
                        color: 'positive',
                        message: 'Login Successful',
                        position: 'top',
                    });

                    this.$router.push({ name: 'chats' });
                })
                .catch((err: any) => {
                    console.log(err.response.data);

                    if (!err.response.data.errors) {
                        this.$q.notify({
                            color: 'negative',
                            message: err.response.data.message,
                            position: 'top',
                        });

                        if (err.response.data.statusCode) {
                            this.$router.push({ name: 'chats' });
                        }
                    }
                });
        },
    },
});
</script>
