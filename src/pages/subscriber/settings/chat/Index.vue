<template>
    <div>
        <!--        <q-card class="tw-my-2">-->
        <!--            <q-card-section>-->
        <!--                <div class="text-center text-green"></div>-->
        <!--            </q-card-section>-->
        <!--        </q-card>-->

        <q-card>
            <q-card-section>
                <div class="tw-flex tw-items-center tw-mb-4 tw-border-b-2">
                    <div class="tw-font-medium tw-text-lg">Chat Assignment</div>
                </div>

                <div class="tw-font-medium tw-mb-2">Choose how chats are distributed</div>
                <div class="tw-flex tw-gap-8 tw-cursor-pointer">
                    <div
                        class="tw-border-2 tw-p-3 tw-rounded-lg"
                        :class="{
                            'tw-border-green-500': formInputs.conversation_at_initiate_notify_policy === 'auto',
                        }"
                        @click="updateAssignmentPolicy('auto')"
                    >
                        <div class="tw-mb-1 tw-font-medium">Auto</div>
                        <div class="tw-text-xs">
                            Chats are evenly distributed among agents with accepting chats status. When all agents hit
                            their limit, new visitors are queued.
                        </div>
                    </div>
                    <div
                        class="tw-border-2 tw-p-3 tw-rounded-lg"
                        :class="{
                            'tw-border-green-500': formInputs.conversation_at_initiate_notify_policy === 'manual',
                        }"
                        @click="updateAssignmentPolicy('manual')"
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
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: '',
    props: {},

    data(): any {
        return {
            formInputs: {
                conversation_at_initiate_notify_policy: 'manual',
            },
        };
    },

    mounted() {
        // this.getChatSetting();
    },

    methods: {
        updateAssignmentPolicy(policy: any) {
            this.formInputs.conversation_at_initiate_notify_policy = policy;
        },
        // getChatSetting() {
        //     this.$store
        //         .dispatch('')
        //         .then((res: any) => {})
        //         .catch((err: any) => {
        //             console.log(err.response.data);
        //         });
        // },
    },

    watch: {},
});
</script>

<style lang="scss"></style>
