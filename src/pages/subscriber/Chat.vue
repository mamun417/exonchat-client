<template>
    <div>
        <div class="tw-flex tw-flex-col tw-h-full" v-if="conversationInfo.messages.length">
            <q-card class="tw-shadow-lg">
                <q-card-section class="row no-wrap items-center">
                    <q-item class="">
                        <q-item-section avatar>
                            <q-avatar size="xl">
                                <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" alt="" />
                            </q-avatar>
                        </q-item-section>

                        <q-item-section class="tw-w-full">
                            <q-item-label class="text-weight-bold tw-text-lg">
                                {{ $_.upperFirst(profile.user_meta?.full_name) }}
                            </q-item-label>
                            <q-item-label caption>
                                <q-badge color="green" class="tw-px-2 tw-py-1">Active</q-badge>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-space></q-space>
                    <q-btn
                        flat
                        no-caps
                        color="orange-8"
                        @click="confirm = !confirm"
                        v-if="!isAgentToAgentConversation"
                        :label="`${convStateButtonInfo.name} Chat`"
                    ></q-btn>
                </q-card-section>
            </q-card>

            <message :conv_id="this.$route.params['conv_id']"></message>

            <conversation-state-confirm-modal
                v-if="confirm"
                :conv-state-button-info="convStateButtonInfo"
                @convStateHandle="convStateHandle($event)"
                @hide="confirm = false"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Message from 'components/common/Message.vue';
import ConversationStateConfirmModal from 'components/common/modal/ConversationStateConfirmModal.vue';

export default defineComponent({
    name: 'ChatPage',
    components: { ConversationStateConfirmModal, Message },

    setup() {
        // const messageInputAutoFocus = ref(false);
        // provide('messageInputAutoFocus', messageInputAutoFocus);
        // return {
        //     messageInputAutoFocus,
        // };
    },

    data(): any {
        return {};
    },

    mounted() {
        console.log('chat page initiated');
    },

    // beforeRouteEnter(to, from, next) {
    //     next((vm: any) => {
    //         vm.messageInputAutoFocus = from.name === 'clients-conversations';
    //     });
    // },

    // beforeRouteUpdate(to, from, next) {
    //     this.messageInputAutoFocus = false;
    //     next();
    // },

    methods: {},
});
</script>
