<template>
    <div class="tw-min-h-screen tw-p-2 tw-flex tw-flex-col tw-justify-center">
        <div
            class="tw-max-w-md tw-w-full tw-m-auto tw-p-10 tw-bg-white tw-rounded-xl tw-shadow-2xl"
        >
            <div class="text-center tw-mb-6">
                <q-icon name="celebration" size="50px" color="green"></q-icon>
            </div>

            <div class="text-caption text-center tw-text-gray-500">
                Activate your agent account
            </div>

            <div class="tw-flex tw-mb-3">
                <q-input
                    label="Email"
                    class="full-width"
                    color="green"
                    readonly
                >
                    <template v-slot:prepend>
                        <q-icon name="mail" color="green" />
                    </template>
                </q-input>
            </div>
            <div class="tw-flex tw-mb-3">
                <q-input label="Full Name" class="full-width" color="green">
                    <template v-slot:prepend>
                        <q-icon name="badge" color="green" />
                    </template>
                </q-input>
            </div>

            <div class="tw-flex tw-mb-3">
                <q-input
                    label="Activation Code"
                    class="full-width"
                    color="green"
                >
                    <template v-slot:prepend>
                        <q-icon name="qr_code" color="green" /> </template
                ></q-input>
            </div>

            <div class="tw-flex tw-mb-3">
                <q-input label="Password" class="full-width" color="green">
                    <template v-slot:prepend>
                        <q-icon name="password" color="green" /> </template
                ></q-input>
            </div>
            <div class="tw-flex tw-mb-3">
                <q-input
                    label="Confirm Password"
                    class="full-width"
                    color="green"
                >
                    <template v-slot:prepend>
                        <q-icon name="password" color="green" /> </template
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
                <q-btn color="green" dense class="full-width">Activate</q-btn>
            </div>
        </div>
    </div>
</template>
