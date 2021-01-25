<template>
    <q-layout view="lHh Lpr lFf" class="tw-bg-blueGray-700 tw-text-gray-100">
        <q-header elevated class="tw-bg-blueGray-800">
            <q-toolbar>
                <q-btn
                    flat
                    dense
                    round
                    icon="menu"
                    aria-label="Menu"
                    @click="leftDrawerOpen = !leftDrawerOpen"
                />

                <q-toolbar-title>
                    ExonChat App
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="leftDrawerOpen"
            show-if-above
            bordered
            content-class="bg-grey-1"
        >
            <q-list>
                <q-item-label header class="text-grey-8">
                    Essential Links
                </q-item-label>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
    name: 'MainLayout',
    components: {},
    setup() {
        const leftDrawerOpen = ref(false);

        return { leftDrawerOpen };
    }
});
</script>
