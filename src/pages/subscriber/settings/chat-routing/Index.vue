<template>
    <div>
        <q-card class="tw-mb-4 tw-shadow">
            <q-card-section>
                <div class="tw-font-medium tw-text-lg">Chat Assignment</div>
            </q-card-section>
        </q-card>

        <q-card class="tw-mb-4 tw-shadow">
            <q-card-section>
                <div class="tw-font-medium tw-mb-2 tw-border-b-1 tw-mb-4">Choose how chats are distributed</div>

                <div class="tw-flex tw-gap-8 tw-cursor-pointer">
                    <div
                        class="tw-border-1 tw-p-3 tw-rounded-lg"
                        :class="{
                            'tw-border-green-500': formInputs.conversation_at_initiate_notify_policy === 'auto',
                        }"
                        @click="updateDistributedPolicy('auto')"
                    >
                        <div class="tw-mb-1 tw-font-medium">Auto</div>
                        <div class="tw-text-xs">
                            Chats are evenly distributed among agents with accepting chats status. When all agents hit
                            their limit, new visitors are queued.
                        </div>
                    </div>
                    <div
                        class="tw-border-1 tw-p-3 tw-rounded-lg"
                        :class="{
                            'tw-border-green-500': formInputs.conversation_at_initiate_notify_policy === 'manual',
                        }"
                        @click="updateDistributedPolicy('manual')"
                    >
                        <div class="tw-mb-1 tw-font-medium">Manual</div>
                        <div class="tw-text-xs">
                            All agents get notified about a customer waiting in the queue. Chat will be assigned to the
                            first agent who picks it up.
                        </div>
                    </div>
                </div>
            </q-card-section>
        </q-card>

        <q-card class="tw-mb-4 tw-shadow">
            <q-card-section>
                <div class="text-center">Upcoming auto chat distribute related features...</div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "",
    props: {},

    data(): any {
        return {
            formInputs: {
                conversation_at_initiate_notify_policy: "",
            },
        };
    },

    mounted() {
        this.getChatSetting();
    },

    methods: {
        getChatSetting() {
            this.$store
                .dispatch("setting_chat/getChatSetting")
                .then((res: any) => {
                    res.data.forEach((chatSetting: any) => {
                        this.formInputs[chatSetting.slug] = this.getSingleInputValue(chatSetting);
                    });
                })
                .catch((err: any) => {
                    console.log(err.response.data);
                });
        },

        updateDistributedPolicy(conversationAtInitiateNotifyPolicy: any) {
            this.formInputs.conversation_at_initiate_notify_policy = conversationAtInitiateNotifyPolicy;
            this.updateChatSetting();
        },

        updateChatSetting() {
            const data = Object.keys(this.formInputs).map((inputName: any) => {
                return {
                    name: inputName,
                    value: this.formInputs[inputName].toString(),
                };
            });

            this.$store
                .dispatch("setting_chat/updateChatSetting", {
                    inputs: {
                        chat_settings: data,
                    },
                })
                .then(() => {
                    this.$helpers.showSuccessNotification(this, "Chat setting update successful");
                    this.getChatSetting();
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
