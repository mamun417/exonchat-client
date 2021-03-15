<template>
    <q-layout
        view="lHh Lpr lFf"
        class="tw-bg-gradient-to-br tw-from-blue-400 tw-to-green-400 tw-text-blueGray-900"
    >
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AuthLayout',
    components: {},
});
</script>
