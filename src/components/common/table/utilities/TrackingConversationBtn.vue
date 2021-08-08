<template>
    <q-btn icon="gps_fixed" text-color="green" size="sm" :disable="disable" dense flat>
        <q-tooltip :offset="[10, 10]"> {{ disable ? "Already tracking" : "Track this conversation" }}</q-tooltip>
    </q-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "TrackingConversationBtn",
    props: {
        disable: { type: Boolean, default: false },
    },
    computed: {},
});
</script>

<style scoped></style>
