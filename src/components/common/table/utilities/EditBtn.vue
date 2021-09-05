<template>
    <q-btn icon="create" :text-color="globalColor" size="sm" dense flat>
        <q-tooltip :offset="[10, 10]"> Edit item</q-tooltip>
    </q-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
    name: "EditBtn",
    computed: {
        ...mapGetters({
            globalColor: "setting_ui/globalColor",
        }),
    },
});
</script>

<style scoped></style>
