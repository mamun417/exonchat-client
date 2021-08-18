<template>
    <div>
        <q-card class="tw-mb-4 tw-shadow">
            <q-card-section class="tw-border-b-1">
                <div class="tw-font-medium te-text-base">Apps Integration</div>
            </q-card-section>

            <q-tabs
                v-model="currentTab"
                dense
                class="text-grey"
                :active-color="globalColor"
                :indicator-color="globalColor"
                align="left"
                narrow-indicator
            >
                <q-tab name="own" label="Own" />
                <q-tab name="third-party" label="Third Party" />
            </q-tabs>
        </q-card>

        <!-- these will come from api (which apps, their inputs, input types) -->
        <q-card class="tw-shadow">
            <q-card-section>
                <div class="tw-mb-4 tw-border-b-1">
                    <div class="tw-font-medium">WHMCS Api Manager</div>
                </div>

                <div class="tw-mb-6">
                    <div>Identifier Key</div>
                    <q-input
                        v-model="formInputs.apps_whmcs_identifier_key"
                        :type="isPwdWhmcs.identifier ? 'password' : 'text'"
                        bg-color="white"
                        class="tw-mb-2 tw-shadow tw-px-2"
                        hide-bottom-space
                        standout
                        borderless
                        dense
                    />
                </div>

                <div class="tw-mb-6">
                    <div>Secret Key</div>
                    <q-input
                        v-model="formInputs.apps_whmcs_secret_key"
                        :type="isPwdWhmcs.secret ? 'password' : 'text'"
                        bg-color="white"
                        class="tw-mb-2 tw-shadow tw-px-2"
                        hide-bottom-space
                        standout
                        borderless
                        dense
                    />
                </div>

                <div class="tw-flex tw-items-center tw-my-4">
                    <div>
                        Api connection is :
                        <span
                            class="tw-font-medium tw-mr-2"
                            :class="[formInputs.apps_whmcs_enable ? 'text-green' : 'text-orange']"
                            >{{ formInputs.apps_whmcs_enable ? "Enabled" : "Disabled" }}</span
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

            <q-card-actions class="tw-px-4">
                <q-btn
                    type="submit"
                    @click="updateAppSetting(false)"
                    :disable="!formInputs.apps_whmcs_identifier_key || !formInputs.apps_whmcs_secret_key"
                    color="green"
                    size="sm"
                    unelevated
                >
                    Update App Setting
                </q-btn>
            </q-card-actions>
        </q-card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
    name: "",
    props: {},

    data(): any {
        return {
            currentTab: "third-party",

            appSetting: {},
            isPwdWhmcs: {
                identifier: true,
                secret: true,
            },
            formInputs: {
                apps_whmcs_identifier_key: "",
                apps_whmcs_secret_key: "",
                apps_whmcs_enable: true,
                apps_whmcs_ticket_notification: true,
                apps_whmcs_ticket_manage: true,
                apps_whmcs_ticket_submit_from_chat: true,
            },
        };
    },

    mounted() {
        this.getAppSetting();
    },

    computed: {
        ...mapGetters({ profile: "auth/profile", globalColor: "setting_ui/globalColor" }),
    },

    methods: {
        getAppSetting() {
            this.$store
                .dispatch("setting_app/getAppSetting")
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
                .dispatch("setting_app/updateAppSetting", {
                    inputs: {
                        app_settings: data,
                    },
                })
                .then(() => {
                    this.$helpers.showSuccessNotification(this, "App setting update successful");
                    this.getAppSetting();
                })
                .catch((err: any) => {
                    if (this.$_.isObject(err.response.data.message)) {
                        this.formDataErrors = err.response.data.message;
                    } else {
                        this.$helpers.showErrorNotification(this, err.response.data.message);
                    }
                });
        },

        getSingleInputValue(appSetting: any) {
            const value = appSetting.user_settings_value.length
                ? appSetting.user_settings_value[0].value
                : appSetting.default_value;

            return appSetting.input_type === "checkbox" ? value === "true" : value;
        },
    },

    watch: {},
});
</script>

<style lang="scss"></style>
