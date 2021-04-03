<template>
    <q-layout view="hhh LpR fff" class="bg-white">
        <q-drawer
            :model-value="true"
            :mini="true"
            class="tw-shadow-lgr"
            mini-width="80"
            breakpoint="xs"
            persistent
            no-swipe-close
            show-if-above
            ><admin-left-bar></admin-left-bar
        ></q-drawer>
        <q-page-container>
            <q-page>
                <div class="tw-min-h-screen bg-green-1">
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
import AdminLeftBar from 'src/components/super-admin/side-panel/AdminLeftBar.vue';

export default defineComponent({
    name: 'MainLayout',
    components: { AdminLeftBar },
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
