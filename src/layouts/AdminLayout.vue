<template>
    <q-layout view="hhh LpR fff" class="tw-bg-white">
        <q-page-container>
            <q-page
                ><main-left-bar></main-left-bar>

                <div class="tw-ml-18 tw-min-h-screen tw-bg-blue-50">
                    <router-view class="tw-h-full tw-p-5"></router-view>
                </div>
            </q-page>

            <!-- <router-view class="tw-ml-78" /> -->
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// import { mapGetters } from 'vuex';
import MainLeftBar from 'src/components/subscriber/side-panel/MainLeftBar.vue';

export default defineComponent({
    name: 'MainLayout',
    components: { MainLeftBar },
    data(): any {
        return {};
    },
    setup() {
        const miniMode = ref(false);

        return { miniMode };
    },
    mounted() {
        console.log('admin layout mounted');
    },
    computed: {},
    methods: {},
});
</script>
