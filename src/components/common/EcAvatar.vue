<template>
    <q-avatar
        v-if="is_icon"
        class="shadow-1"
        :size="size"
        :icon="image_src"
        :class="`text-white ${globalBgColor}`"
    ></q-avatar>
    <q-avatar v-else-if="image_src && !local_preview_src" class="shadow-1" :size="size">
        <img :src="image_src" alt="" />
        <slot name="default"></slot>
    </q-avatar>

    <q-avatar v-else-if="local_preview_src" class="shadow-1" :size="size" :class="`text-white ${globalBgColor}`">
        <img :src="local_preview_src" alt="" />
    </q-avatar>
    <q-avatar v-else :size="size" icon="person" :class="`shadow-1 ${icon_color}`">
        <slot name="default"></slot>
    </q-avatar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
    name: "EcAvatar",
    props: {
        image_src: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "",
        },
        local_preview_src: {
            default: null,
        },
        size: {
            type: String,
            default: "lg",
        },
        is_icon: {
            type: Boolean,
            default: false,
        },
        icon_color: {
            type: String,
            default: "text-grey-8",
        },
    },

    data(): any {
        return {};
    },

    computed: {
        ...mapGetters({
            globalBgColor: "setting_ui/globalBgColor",
        }),
    },
});
</script>

<style lang="scss"></style>
