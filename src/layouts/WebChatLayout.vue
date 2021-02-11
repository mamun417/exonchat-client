<template>
    <q-layout view="lHh Lpr lFf" class="tw-bg-blue-50 tw-text-blueGray-900">
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'WebChatLayout',
    components: {},
});
</script>
