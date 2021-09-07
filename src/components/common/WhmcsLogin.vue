<template>
    <div class="tw-my-7">
        Welcome to our LiveChat! Please fill in the form below before starting the chat. Need more text about WHMCS
        login ................
    </div>

    <q-input
        v-model="whmcsLoginForm.email"
        :error="!!whmcsLoginFormErrors.email"
        @update:model-value="whmcsLoginFormErrors.email = ''"
        hide-bottom-space
        dense
        no-error-icon
        label="Your Email"
        :color="globalColor"
        class="tw-mb-3"
        outlined
    >
    </q-input>

    <q-input
        v-model="whmcsLoginForm.password"
        :error="!!whmcsLoginFormErrors.password"
        @update:model-value="whmcsLoginFormErrors.password = ''"
        hide-bottom-space
        dense
        no-error-icon
        :color="globalColor"
        class="tw-mb-3"
        label="Your Password"
        :type="isPwd ? 'password' : 'text'"
        outlined
    >
        <template v-slot:append>
            <q-icon
                size="xs"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
            />
        </template>
    </q-input>

    <div class="tw-flex tw-gap-4">
        <q-btn
            @click="$emit('cancelWhmcsLogin')"
            :color="globalColor"
            text-color="white"
            class="full-width tw-mt-2"
            no-caps
            unelevated
            no-wrap
        >
            Go Back
        </q-btn>

        <q-btn
            :color="globalColor"
            :loading="loadingLogin"
            class="full-width tw-mt-2"
            @click="login"
            no-caps
            unelevated
        >
            Login
        </q-btn>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "WhmcsLogin",
    data(): any {
        return {
            loadingLogin: false,
            isPwd: true,
            whmcsLoginForm: {
                email: "",
                password: "",
            },
            whmcsLoginFormErrors: {},
        };
    },

    props: {
        chatDepartments: {
            type: [],
            default: [],
        },
        globalColor: {
            type: String,
            default: "green-10",
        },
    },

    methods: {
        login() {
            this.loadingLogin = true;

            window.socketSessionApi
                .post("apps/whmcs/login", this.whmcsLoginForm)
                .then((res: any) => {
                    console.log(res);
                })
                .catch((err: any) => {
                    this.loginErrorHandle(err);
                })
                .finally(() => {
                    this.loadingLogin = false;
                });
        },

        loginErrorHandle(err: any) {
            if (this.$_.isObject(err.response.data.message)) {
                this.whmcsLoginFormErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },
    },
});
</script>

<style scoped></style>
