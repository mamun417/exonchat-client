<template>
    <q-avatar
        v-if="is_icon"
        class="shadow-1"
        :size="size"
        :icon="image_src"
        :class="`text-white ${globalBgColor}`"
    ></q-avatar>
    <q-avatar v-else-if="image_src && !local_preview_src" :size="size">
        <img :src="image_src" alt="" />
        <slot name="default"></slot>
    </q-avatar>

    <q-avatar v-else-if="local_preview_src" :size="size" :class="`text-white ${globalBgColor}`">
        <img :src="local_preview_src" alt="" />
    </q-avatar>

    <!--check email-->
    <q-avatar v-else-if="email && foundAvatar && !local_preview_src" :size="size">
        <q-img :src="this.avatarUrl" alt="" @error="foundAvatar = false" />
    </q-avatar>

    <q-icon v-else :size="size" name="fa fa-user-circle" :class="`${icon_color}`">
        <slot name="default"></slot>
    </q-icon>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import CryptoJS from "crypto-js";

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
            default: "text-blue-grey-3",
        },
        email: {
            type: String,
            default: "",
        },
    },

    data(): any {
        return {
            avatarUrl: "",
            foundAvatar: true,
        };
    },

    mounted() {
        this.loadAvatar();
    },

    computed: {
        ...mapGetters({
            globalBgColor: "setting_ui/globalBgColor",
        }),
    },

    methods: {
        loadAvatar() {
            if (this.email) {
                const hash = CryptoJS.MD5(this.email.trim());
                const client_photo = `https://www.gravatar.com/avatar/${hash}?d=404`;

                this.avatarUrl = client_photo;
                console.log({ client_photo });
            }
        },
    },
});
</script>

<style lang="scss"></style>
