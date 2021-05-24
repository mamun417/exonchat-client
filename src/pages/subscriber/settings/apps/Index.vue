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
                    :type="isPwdWhmcs ? 'password' : 'text'"
                    color="green"
                    class="tw-mb-2"
                    dense
                    ><template v-slot:append>
                        <q-icon
                            :name="isPwdWhmcs ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwdWhmcs = !isPwdWhmcs"
                        /> </template
                ></q-input>
                <q-input
                    v-model="formInputs.apps_whmcs_secret_key"
                    label="Secret Key"
                    type="password"
                    color="green"
                    class="tw-mb-2"
                    dense
                    ><template v-slot:append>
                        <q-icon
                            :name="isPwdWhmcs ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwdWhmcs = !isPwdWhmcs"
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
                        @click="formInputs.apps_whmcs_enable = !formInputs.apps_whmcs_enable"
                        no-caps
                        unelevated
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
            isPwdWhmcs: true,
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

    methods: {
        ...mapMutations({}),
    },

    watch: {},
});
</script>

<style lang="scss"></style>
