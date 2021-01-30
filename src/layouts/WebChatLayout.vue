<template>
    <q-layout view="lHh Lpr lFf" class="tw-text-blueGray-900">
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    name: 'WebChatLayout',
    components: {}
});
</script>
