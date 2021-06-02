<template>
    <div>
        <q-card class="tw-my-2">
            <q-card-section>
                <div class="text-center text-green">Third Party Apps</div>
            </q-card-section>
        </q-card>

        <!-- these will come from api (which apps, their inputs, input types) -->
        <q-card>
            <q-card-section>
                <div class="tw-flex tw-items-center tw-mb-2">
                    <div class="tw-font-medium">WHMCS Api Manager</div>
                </div>
                <q-input
                    v-model="formInputs.apps_whmcs_identifier_key"
                    label="Identifier Key"
                    :type="isPwdWhmcs.identifier ? 'password' : 'text'"
                    color="green"
                    class="tw-mb-2"
                    dense
                    ><template v-slot:append>
                        <q-icon
                            :name="isPwdWhmcs.identifier ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwdWhmcs.identifier = !isPwdWhmcs.identifier"
                        /> </template
                ></q-input>
                <q-input
                    v-model="formInputs.apps_whmcs_secret_key"
                    label="Secret Key"
                    :type="isPwdWhmcs.secret ? 'password' : 'text'"
                    color="green"
                    class="tw-mb-2"
                    dense
                    ><template v-slot:append>
                        <q-icon
                            :name="isPwdWhmcs.secret ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwdWhmcs.secret = !isPwdWhmcs.secret"
                        /> </template
                ></q-input>

                <div class="tw-flex tw-items-center tw-my-4">
                    <div>
                        Api connection is :
                        <span
                            class="tw-font-medium tw-mr-2"
                            :class="[formInputs.apps_whmcs_enable ? 'text-green' : 'text-orange']"
                            >{{ formInputs.apps_whmcs_enable ? 'Enabled' : 'Disabled' }}</span
                        >
                    </div>
                    <!-- handle click api -->
                    <q-btn
                        :label="`${formInputs.apps_whmcs_enable ? 'Disable' : 'Enable'} Connection`"
                        :color="formInputs.apps_whmcs_enable ? 'orange' : 'green'"
                        size="sm"
                        @click="updateAppSetting(true)"
                        no-caps
                        unelevated
                        :disable="!formInputs.apps_whmcs_identifier_key || !formInputs.apps_whmcs_secret_key"
                    />
                </div>

                <div v-if="formInputs.apps_whmcs_enable">
                    <div class="tw-mb-2 tw-font-medium">Enable/Disable these services</div>
                    <q-checkbox
                        v-model="formInputs.apps_whmcs_ticket_notification"
                        label="Ticket notification"
                        color="green"
                        class="tw-mb-2 tw-mr-2"
                        dense
                    />
                    <q-checkbox
                        v-model="formInputs.apps_whmcs_ticket_manage"
                        label="Ticket manager"
                        color="green"
                        class="tw-mb-2 tw-mr-2"
                        dense
                    />
                    <q-checkbox
                        v-model="formInputs.apps_whmcs_ticket_submit_from_chat"
                        label="Ticket submit from chat"
                        color="green"
                        class="tw-mb-2 tw-mr-2"
                        dense
                    />
                </div>
            </q-card-section>

            <q-card-actions>
                <q-btn
                    type="submit"
                    @click="updateAppSetting(false)"
                    :disable="!formInputs.apps_whmcs_identifier_key || !formInputs.apps_whmcs_secret_key"
                    color="green"
                    class="tw-mb-4"
                >
                    Update App Setting
                </q-btn>
            </q-card-actions>
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
            // if need
            appSetting: {},
            isPwdWhmcs: {
                identifier: true,
                secret: true,
            },
            formInputs: {
                apps_whmcs_identifier_key: '',
                apps_whmcs_secret_key: '',
                apps_whmcs_enable: true,
                apps_whmcs_ticket_notification: true,
                apps_whmcs_ticket_manage: true,
                apps_whmcs_ticket_submit_from_chat: true,
            },
        };
    },

    computed: {
        ...mapGetters({}),
    },

    mounted() {
        this.getAppSetting();
    },

    methods: {
        getAppSetting() {
            this.$store
                .dispatch('ui/getAppSetting')
                .then((res: any) => {
                    res.data.forEach((appSetting: any) => {
                        this.formInputs[appSetting.slug] = this.getSingleInputValue(appSetting);
                    });

                    // if need
                    this.appSetting = res.data;
                })
                .catch((err: any) => {
                    console.log(err.response.data);
                });
        },

        updateAppSetting(connectionUpdate = false) {
            if (connectionUpdate) {
                this.formInputs.apps_whmcs_enable = !this.formInputs.apps_whmcs_enable;
            }

            const data = Object.keys(this.formInputs).map((inputName: any) => {
                return {
                    name: inputName,
                    value: this.formInputs[inputName].toString(),
                };
            });

            this.$store
                .dispatch('ui/updateAppSetting', {
                    inputs: {
                        app_settings: data,
                    },
                })
                .then(() => {
                    this.$helpers.showSuccessNotification(this, 'App setting update successful');
                    this.getAppSetting();
                })
                .catch((err: any) => {
                    console.log(err.response.data);
                });
        },

        getSingleInputValue(appSetting: any) {
            let value: any;

            if (appSetting.user_settings_value.length) {
                value = appSetting.user_settings_value[0].value;
            } else {
                value = appSetting.default_value;
            }

            return appSetting.input_type === 'checkbox' ? value === 'true' : value;
        },
    },

    watch: {},
});
</script>

<style lang="scss"></style>
