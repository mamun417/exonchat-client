<template>
    <div class="tw-min-h-screen tw-p-2 tw-flex tw-flex-col tw-justify-center">
        <div
            class="tw-p-10 tw-max-w-md tw-m-auto tw-w-full tw-bg-white tw-rounded-xl tw-shadow-2xl"
        >
            <div class="text-center tw-mb-6">
                <q-icon name="restart_alt" size="50px" color="green"></q-icon>
            </div>

            <div class="text-caption text-center tw-text-gray-500">
                A reset mail will be send
            </div>

            <div class="tw-flex tw-mb-3">
                <q-input label="Email" class="full-width" color="green">
                    <template v-slot:prepend>
                        <q-icon name="mail" color="green" />
                    </template>
                </q-input>
            </div>

            <div class="tw-mt-8 tw-mb-4">
                <q-btn
                    color="green"
                    dense
                    class="full-width"
                    @click="resetHandle()"
                    >Reset</q-btn
                >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    setup() {
        return {};
    },
    methods: {
        resetHandle() {
            this.$router.push('/auth/change-pass');
        },
    },
};
</script>
