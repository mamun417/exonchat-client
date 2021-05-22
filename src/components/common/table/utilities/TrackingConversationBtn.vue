<template>
    <q-btn icon="gps_fixed" text-color="green" size="sm" dense flat>
        <q-tooltip :offset="[10, 10]"> Tracking conversation </q-tooltip>
    </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'TrackingConversationBtn',
});
</script>

<style scoped></style>
