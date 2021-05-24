<template>
    <div>
        <q-card>
            <q-card-section>
                <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                    <div class="tw-flex">
                        <q-avatar size="96px" class="tw-mr-4 ec-settings-profile-img"
                            ><img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" /><q-btn
                                icon="edit"
                                :color="globalColor"
                                class="ec-edit-profile-img tw-absolute tw-top-0 tw-right-0 tw-hidden"
                                size="sm"
                                round
                                unelevated
                                dense
                        /></q-avatar>
                        <div class="tw-self-center">
                            <div class="tw-font-medium tw-text-lg" :class="[globalTextColor]">John Doe</div>
                            <div class="text-caption">Technical Support</div>
                        </div>
                    </div>
                    <div class="text-right tw-self-center">
                        <div class="tw-flex tw-justify-end tw-items-center">
                            <div class="tw-mr-1">john@doe</div>
                            <q-icon name="email" />
                        </div>
                        <div class="tw-flex tw-justify-end tw-items-center">
                            <div class="tw-mr-1">john@facebook</div>
                            <q-icon name="facebook" />
                        </div>
                    </div>
                </div>
            </q-card-section>
            <q-separator />
            <q-tabs align="left" class="shadow-2 tw-font-medium" :indicator-color="globalColor" no-caps>
                <q-icon name="settings" class="tw-px-6" size="20px" :color="globalColor" />
                <q-route-tab>Profile</q-route-tab>
                <q-route-tab to="/settings/ui" exact>UI</q-route-tab>
                <q-route-tab to="/settings/apps" exact>Apps</q-route-tab>
                <q-route-tab to="/settings/testing" exact>Testing</q-route-tab>
                <q-route-tab>Others</q-route-tab>
            </q-tabs>
        </q-card>
        <div class="tw-mt-6">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
    name: '',
    props: {},

    data(): any {
        return {};
    },

    computed: {
        ...mapGetters({ globalTextColor: 'ui/globalTextColor', globalColor: 'ui/globalColor' }),
    },

    methods: {},

    watch: {},
});
</script>

<style lang="scss">
.ec-settings-profile-img {
    &:hover {
        .ec-edit-profile-img {
            display: inline-flex;
        }
    }
}
</style>
