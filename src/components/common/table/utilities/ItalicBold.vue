<template>
    <div class="tw-text-xxs tw-font-medium tw-text-gray-700">
        {{ content }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "ItalicBold",
    props: {
        content: {
            type: String,
            default: "",
        },
    },
});
</script>

<style scoped></style>
