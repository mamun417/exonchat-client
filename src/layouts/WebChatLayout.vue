<template>
    <q-layout view="lHh Lpr lFf" style="min-height: unset; height: 100%">
        <q-page-container class="tw-h-full">
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
