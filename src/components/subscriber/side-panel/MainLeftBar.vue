<template>
    <div
        class="tw-fixed tw-w-18 tw-h-full tw-top-0 tw-left-0 tw-flex tw-flex-col tw-justify-between tw-border-r-2 tw-border-blue-50 tw-shadow-lg"
    >
        <q-list class="tw-text-gray-600">
            <q-item class="tw-my-3 tw-py-4">
                <q-item-section class="content-center" avatar>
                    <q-icon name="mediation" />
                </q-item-section>
            </q-item>
            <div class="tw-border-b-2 tw-border-blue-50"></div>

            <q-item clickable v-ripple class="tw-my-3 tw-py-5">
                <q-item-section class="content-center" avatar>
                    <q-icon name="view_sidebar" />
                </q-item-section>
            </q-item>

            <q-item clickable v-ripple class="tw-my-3 tw-py-5">
                <q-item-section class="content-center" avatar>
                    <q-icon name="forum" />
                </q-item-section>
            </q-item>

            <q-item clickable v-ripple class="tw-my-3 tw-py-5">
                <q-item-section class="content-center" avatar>
                    <q-icon name="star" />
                </q-item-section>
            </q-item>

            <q-item clickable v-ripple class="tw-my-3 tw-py-5">
                <q-item-section class="content-center" avatar>
                    <q-icon name="send" />
                </q-item-section>
            </q-item>

            <q-item clickable v-ripple class="tw-my-3 tw-py-3">
                <q-item-section class="content-center" avatar>
                    <q-icon name="drafts" />
                </q-item-section>
            </q-item>

            <q-space />
        </q-list>

        <q-list
            ><q-item clickable v-ripple class="tw-my-3 tw-py-1">
                <q-item-section class="content-center" avatar>
                    <q-avatar size="xl">
                        <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" />
                        <q-badge color="green" floating style="background: unset !important"
                            ><q-icon name="fiber_manual_record" color="green"></q-icon
                        ></q-badge>
                    </q-avatar>
                </q-item-section> </q-item
        ></q-list>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MainLeftBar',
    components: {},
    setup() {
        return {};
    },
    data(): any {
        return {};
    },
    mounted() {
        console.log('main left bar initiated');
    },
    methods: {},
});
</script>
