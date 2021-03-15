<template>
    <div class="tw-min-h-screen tw-p-2 tw-flex tw-flex-col tw-justify-center">
        <div
            class="tw-max-w-md tw-w-full tw-m-auto tw-p-10 tw-bg-white tw-rounded-xl tw-shadow-2xl"
        >
            <div class="text-center tw-mb-6">
                <q-icon
                    name="published_with_changes"
                    size="50px"
                    color="green"
                ></q-icon>
            </div>

            <div class="text-caption text-center tw-text-gray-500">
                Update your password.
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

            <div class="tw-mt-8 tw-mb-4">
                <q-btn color="green" dense class="full-width">Update</q-btn>
            </div>

            <div class="text-caption tw-text-gray-500">
                Did'nt receive the mail yet.
                <span class="text-green tw-font-bold">Resend?</span>
            </div>
        </div>
    </div>
</template>
