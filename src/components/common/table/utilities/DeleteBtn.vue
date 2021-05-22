<template>
    <q-btn icon="delete" text-color="red" size="sm" dense flat>
        <q-tooltip :offset="[10, 10]"> Delete item </q-tooltip>
    </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'DeleteBtn',
});
</script>

<style scoped></style>
