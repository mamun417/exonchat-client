<template>
    <q-avatar v-if="image_src" :size="size"><img :src="image_src" alt="" /> <slot name="default"></slot></q-avatar>

    <q-avatar v-else :size="size" :class="`text-white ${globalBgColor}`">
        <img v-if="local_preview_src" :src="local_preview_src" alt="" />
        <template v-else>{{ name[0].toUpperCase() }}</template>

        <slot name="default"></slot>
    </q-avatar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
    name: 'EcAvatar',
    props: {
        image_src: {
            type: String,
            default: '',
        },
        name: {
            type: String,
            default: '',
        },
        local_preview_src: {
            default: null,
        },
        size: {
            type: String,
            default: 'lg',
        },
    },

    data(): any {
        return {};
    },

    computed: {
        ...mapGetters({
            globalBgColor: 'setting_ui/globalBgColor',
        }),
    },
});
</script>

<style lang="scss"></style>
