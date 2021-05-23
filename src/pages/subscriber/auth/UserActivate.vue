<template>
    <div class="tw-min-h-screen tw-p-2 tw-flex tw-flex-col tw-justify-center">
        <div class="tw-max-w-md tw-w-full tw-m-auto tw-p-10 tw-bg-white tw-rounded-xl tw-shadow-2xl">
            <div class="text-center tw-mb-6">
                <q-icon name="celebration" size="50px" color="green"></q-icon>
            </div>

            <div class="text-caption text-center tw-text-gray-500">
                Activate your <b class="text-green">{{ formData.type }}</b> account
            </div>

            <div class="tw-flex tw-mb-3">
                <q-input v-model="formData.email" label="Email" class="full-width" color="green" dense readonly>
                    <template v-slot:prepend>
                        <q-icon name="mail" color="green" />
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
                <q-input v-model="formData.code" label="Activation Code" class="full-width" color="green" dense>
                    <template v-slot:prepend> <q-icon name="qr_code" color="green" /> </template
                ></q-input>
            </div>

            <div class="tw-flex tw-mb-3">
                <q-input v-model="formData.password" label="Password" class="full-width" color="green" dense>
                    <template v-slot:prepend> <q-icon name="password" color="green" /> </template
                ></q-input>
            </div>
            <div class="tw-flex tw-mb-3">
                <q-input
                    v-model="formData.confirm_password"
                    label="Confirm Password"
                    class="full-width"
                    color="green"
                    dense
                >
                    <template v-slot:prepend> <q-icon name="password" color="green" /> </template
                ></q-input>
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
                <q-btn color="green" dense class="full-width" @click="join">Activate</q-btn>
            </div>
        </div>
    </div>
</template>

// this.$route.params['conv_id']

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data(): any {
        return {
            formData: {
                email: '',
                full_name: '',
                display_name: '',
                password: '',
                confirm_password: '',
                code: '',
                invitation_id: '',
            },
        };
    },
    mounted() {
        window.api
            .get(`/users/invitations/${this.$route.params['id']}`)
            .then((res: any) => {
                console.log(res.data);
                this.formData.email = res.data.email;
                this.formData.type = res.data.type;
                this.formData.invitation_id = this.$route.params['id'];
            })
            .catch((err: any) => {
                console.log(err);
            });
    },
    methods: {
        handleActivateDeactivate() {
            //
        },

        join() {
            if (this.formData.password !== this.formData.confirm_password) {
                // this.$helpers.showErrorNotification(this, 'Password does not match');
                return;
            }

            window.api
                .post('/users/invitations/join', this.formData)
                .then((res: any) => {
                    console.log(res.data);

                    if (res.data.status === 'success') {
                        this.$router.push('/auth/login');
                    }
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },
    },
});
</script>
