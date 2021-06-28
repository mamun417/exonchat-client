<template>
    <div>
        <q-card>
            <q-card-section>
                <div class="tw-font-medium tw-mb-2">Global Color</div>
                <div class="tw-flex tw-flex-wrap tw-gap-4 tw-justify-start">
                    <div
                        v-for="color in [
                            'green',
                            'blue',
                            'purple',
                            'teal',
                            'orange',
                            'deep-purple',
                            'indigo',
                            'lime',
                            'amber',
                            'light-green',
                            'deep-orange',
                            'blue-grey',
                            'brown',
                        ]"
                        :key="color"
                        :class="[
                            `bg-${color}`,
                            { [`tw-border-2 tw-border-${color}-600 inset-shadow`]: color === globalColor },
                        ]"
                        class="tw-h-12 tw-w-12 tw-rounded-lg tw-cursor-pointer shadow-3"
                        @click="updateGlobalColor(color)"
                    ></div>
                </div>
            </q-card-section>
        </q-card>
        <q-card class="tw-mt-6">
            <q-card-section>
                <div class="tw-font-medium tw-mb-2">Left sidepanel items visibility</div>
                <q-list separator bordered>
                    <q-item v-for="(item, key) in leftBarItems" :key="key">
                        <q-item-section>
                            <q-item-label>{{ item.name }}</q-item-label>
                            <q-item-label caption
                                >{{ item.open ? 'Mazimized' : 'Minimized' }} height when section is first
                                load</q-item-label
                            >
                        </q-item-section>
                        <q-item-section
                            ><q-item-label
                                ><q-badge :color="item.show ? 'green' : 'orange'">{{
                                    item.show ? 'enabled' : 'disabled'
                                }}</q-badge></q-item-label
                            ></q-item-section
                        >
                        <q-item-section class="tw-flex tw-gap-2" side
                            ><q-btn
                                :icon="item.show ? 'visibility_off' : 'visibility'"
                                :color="item.show ? 'orange' : 'green'"
                                :label="item.show ? 'Hide' : 'Show'"
                                size="sm"
                                no-caps
                                dense /><q-btn
                                :icon="item.open ? 'minimize' : 'open_in_full'"
                                :color="item.open ? 'orange' : 'green'"
                                :label="item.open ? 'Minimized When Load' : 'Maximized When Load'"
                                size="sm"
                                no-caps
                                dense
                        /></q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations, mapGetters } from 'vuex';

export default defineComponent({
    name: '',
    props: {},

    data(): any {
        return {
            leftBarItems: [
                { name: 'incoming chat requests', show: true, open: true },
                { name: 'chat requests for me', show: true, open: false },

                { name: 'chat requests for me', show: false, open: true },
            ],
        };
    },

    computed: {
        ...mapGetters({ globalColor: 'setting_ui/globalColor' }),
    },

    methods: {
        ...mapMutations({ updateGlobalColor: 'setting_ui/updateGlobalColor' }),
    },

    watch: {},
});
</script>

<style lang="scss"></style>
