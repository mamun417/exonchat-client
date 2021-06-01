<template>
    <div v-if="users_conv_ses && users_conv_ses.length">
        <!-- {{ users_conv_ses }} -->
        <q-avatar
            v-for="(userConv, key) in users_conv_ses"
            :key="key"
            size="35px"
            :style="key !== 0 ? { marginLeft: '-8px' } : ''"
        >
            <img src="https://cdn.quasar.dev/img/avatar1.jpg" alt="image" />
            <q-tooltip class="">
                {{ userConv.socket_session.user.email }}
            </q-tooltip>
        </q-avatar>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ConnectedUsersFaces',
    components: {},
    props: {
        users_conv_ses: {
            type: Array,
        },
    },

    data(): any {
        return {};
    },

    mounted() {
        console.log('msg top section initiated');
    },

    computed: {},

    methods: {},
});
</script>
