<template>
    <div>
        <q-card>
            <q-card-section>
                <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                    <div class="tw-flex">
                        <pre>{{ mamun }}</pre>
                        <q-avatar size="96px" class="tw-mr-4 ec-settings-profile-img">
                            <img :src="existingAvaterUrl" />
                            <!--<img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" />-->
                            <q-btn
                                @click="updateAvaterModalHandle"
                                icon="edit"
                                :color="globalColor"
                                class="ec-edit-profile-img tw-absolute tw-top-0 tw-right-0 tw-hidden"
                                size="sm"
                                round
                                unelevated
                                dense
                        /></q-avatar>
                        <div class="tw-self-center">
                            <div class="tw-font-medium tw-text-lg" :class="[globalTextColor]">
                                {{ $_.upperFirst(profile.user_meta?.full_name) }}
                            </div>
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

        <q-dialog :model-value="updateAvaterModal" @hide="updateAvaterModal = !updateAvaterModal" persistent>
            <q-card style="min-width: 350px">
                <q-card-section class="text-center">
                    <q-avatar size="150px" class="tw-mr-4 ec-settings-profile-img">
                        <img :src="previewAvater || existingAvaterUrl" alt="" />
                    </q-avatar>
                    <div>
                        <q-btn color="green" label="Upload Image" outline class="tw-mt-3" />
                    </div>
                    <div class="tw-mt-3">
                        <q-file
                            @update:model-value="loadAvater"
                            clearable
                            filled
                            color="purple-12"
                            v-model="avater"
                            label="Label"
                        />
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn @click="updateAvatar" label="Save Change" color="primary" v-close-popup flat />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
    name: '',
    props: {},

    data(): any {
        return {
            existingAvaterUrl: '',
            updateAvaterModal: false,
            previewAvater: '',
            avater: '',
        };
    },

    computed: {
        ...mapGetters({
            profile: 'auth/profile',
            globalTextColor: 'ui/globalTextColor',
            globalColor: 'ui/globalColor',
        }),
    },

    mounted() {
        this.getExistingAvaterUrl();
    },

    methods: {
        getExistingAvaterUrl() {
            this.$store
                .dispatch('ui/getAvaterPath', {
                    id: this.profile.user_meta.attachment.id,
                })
                .then((res: any) => {
                    console.log(res);

                    this.existingAvaterUrl = URL.createObjectURL(
                        new Blob([res.data], { type: res.headers['content-type'] })
                    );
                });
        },

        updateAvaterModalHandle() {
            this.updateAvaterModal = !this.updateAvaterModal;
            this.previewAvater = '';
            this.avater = '';
        },

        loadAvater(file: any) {
            if (!file) return (this.previewAvater = '');

            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = (event: any) => {
                this.previewAvater = event.target.result;
            };
        },

        updateAvatar() {
            console.log('ok');
        },
    },
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
