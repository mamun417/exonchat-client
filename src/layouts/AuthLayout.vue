<template>
    <q-layout view="lHh Lpr lFf" class="tw-bg-gradient-to-br tw-from-blue-400 tw-to-green-400 tw-text-blueGray-900">
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';

export default defineComponent({
    name: 'AuthLayout',
    components: {},

    mounted() {
        window.addEventListener('storage', (event) => {
            if (event.oldValue !== event.newValue) {
                // we can check only exonchat_token key but there are user state involved also
                // but later check exonchat_token for update token
                if (event.key === 'ec_update_storage_auth' && !event.oldValue && event.newValue) {
                    localStorage.removeItem('ec_update_storage_auth');

                    this.mutateAuth(JSON.parse(event.newValue)); // this mutate only for refresh state

                    this.$router.push({ name: 'chat-interaction' });
                }
            }
        });
    },

    methods: {
        ...mapMutations({ mutateAuth: 'auth/authSuccess' }),
    },
});
</script>
