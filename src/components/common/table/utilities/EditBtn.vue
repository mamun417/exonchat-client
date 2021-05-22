<template>
    <q-btn icon="create" text-color="green" size="sm" dense flat>
        <q-tooltip :offset="[10, 10]"> Edit item </q-tooltip>
    </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'EditBtn',
});
</script>

<style scoped></style>
