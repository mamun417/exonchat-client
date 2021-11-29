<template>
    <div v-if="users_conv_ses && users_conv_ses.length">
        <!-- {{ users_conv_ses }} -->
        <ec-avatar
            v-for="(userConv, key) in users_conv_ses"
            :image_src="userConv.socket_session.user?.user_meta?.src || null"
            :name="
                userConv.socket_session.user
                    ? userConv.socket_session.user.user_meta.display_name
                    : userConv.socket_session.init_name
            "
            :key="`${userConv.id}-${key}`"
            :style="key !== 0 ? 'margin-left: -12px' : ''"
            :size="size"
            :email="
                userConv.socket_session.user ? userConv.socket_session.user.email : userConv.socket_session.init_email
            "
            style="border: 2px solid white; border-radius: 50%"
        >
            <q-tooltip class="">
                {{
                    userConv.socket_session.user
                        ? userConv.socket_session.user.email
                        : userConv.socket_session.init_email
                }}
            </q-tooltip>
        </ec-avatar>
    </div>
</template>

<script lang="ts">
import EcAvatar from "src/components/common/EcAvatar.vue";
import { defineComponent } from "vue";

export default defineComponent({
    name: "ConnectedUsersFaces",
    components: { EcAvatar },
    props: {
        users_conv_ses: {
            type: Array,
        },
        size: {
            type: String,
            default: "lg",
        },
    },

    data(): any {
        return {};
    },

    mounted() {
        // console.log("msg top section initiated");
    },

    computed: {},

    methods: {},
});
</script>
