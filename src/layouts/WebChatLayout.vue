<template>
    <q-layout view="lHh Lpr lFf" style="min-height: unset">
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
