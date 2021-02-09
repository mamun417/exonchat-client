<template>
    <q-layout view="hhh LpR fff" class="tw-bg-white">
        <!-- <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
        /> -->

        <!-- <q-drawer mini show-if-above bordered content-class="tw-bg-gray-900">
            <q-list padding>
                <q-item active clickable v-ripple>
                    <q-item-section avatar>
                        <q-icon name="user" />
                    </q-item-section>

                    <q-item-section>
                        Star
                    </q-item-section>
                </q-item>
            </q-list>
        </q-drawer> -->

        <q-page-container>
            <q-page
                ><main-left-bar></main-left-bar>

                <left-bar></left-bar>

                <div class="tw-ml-78 tw-grid tw-grid-cols-12 tw-min-h-screen">
                    <router-view
                        class="tw-h-full tw-p-3 tw-col-span-9 tw-border-r-2 tw-border-blue-50  tw-bg-blue-50"
                    ></router-view>

                    <right-bar
                        class="tw-h-full tw-col-span-3 tw-shadow-lg tw-overflow-hidden"
                    ></right-bar>
                </div>
            </q-page>

            <!-- <router-view class="tw-ml-78" /> -->
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import LeftBar from 'src/components/subscriber/side-panel/LeftBar.vue';
import MainLeftBar from 'src/components/subscriber/side-panel/MainLeftBar.vue';
import RightBar from 'src/components/subscriber/side-panel/RightBar.vue';

export default defineComponent({
    name: 'MainLayout',
    components: { MainLeftBar, LeftBar, RightBar },
    setup() {
        const miniMode = ref(false);

        return { miniMode };
    }
});
</script>
