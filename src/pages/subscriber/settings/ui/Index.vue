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
                    >
                        <div v-if="color === globalColor" class="tw-flex tw-justify-center tw-mt-2">
                            <q-icon name="check" color="white" size="sm" />
                        </div>
                        <q-btn
                            icon="edit"
                            color="white"
                            style="display: inline-flex"
                            class="tw-absolute tw-top-0 tw-right-0 tw-hidden"
                            size="sm"
                            round
                            unelevated
                            dense
                        />

                        <q-tooltip> {{ $_.upperFirst(color) }} </q-tooltip>
                    </div>
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
import { mapGetters } from 'vuex';

export default defineComponent({
    name: '',
    props: {},

    data(): any {
        return {
            formInputs: {
                global_color: '',
            },
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

    mounted() {
        this.getUiSetting();
    },

    methods: {
        // ...mapMutations({ updateGlobalColor: 'setting_ui/updateGlobalColor' }),

        getUiSetting() {
            this.$store
                .dispatch('setting_ui/getUiSetting')
                .then((res: any) => {
                    res.data.forEach((uiSetting: any) => {
                        this.formInputs[uiSetting.slug] = this.getSingleInputValue(uiSetting);
                    });
                })
                .catch((err: any) => {
                    console.log(err.response.data);
                });
        },

        updateGlobalColor(color: any) {
            this.formInputs.global_color = color;
            this.updateUiSetting();
        },

        updateUiSetting() {
            const data = Object.keys(this.formInputs).map((inputName: any) => {
                return {
                    name: inputName,
                    value: this.formInputs[inputName].toString(),
                };
            });

            this.$store
                .dispatch('setting_ui/updateUiSetting', {
                    inputs: {
                        ui_settings: data,
                    },
                })
                .then(() => {
                    this.$helpers.showSuccessNotification(this, 'Ui setting update successful');
                    this.getUiSetting();
                })
                .catch((err: any) => {
                    if (this.$_.isObject(err.response.data.message)) {
                        console.log(err.response.data.messages);
                    } else {
                        this.$helpers.showErrorNotification(this, err.response.data.message);
                    }
                });
        },

        getSingleInputValue(uiSetting: any) {
            const value = uiSetting.user_settings_value.length
                ? uiSetting.user_settings_value[0].value
                : uiSetting.default_value;

            return uiSetting.input_type === 'checkbox' ? value === 'true' : value;
        },
    },

    watch: {},
});
</script>

<style lang="scss"></style>
