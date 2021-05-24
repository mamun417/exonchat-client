<template>
    <div class="tw-flex tw-flex-col" v-if="conversationInfo.messages.length">
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

        <message :ses-id="sesId" chat-panel-type="user" :conversationInfo="conversationInfo"></message>

        <conversation-state-confirm-modal
            v-if="confirm"
            :conv-state-button-info="convStateButtonInfo"
            @convStateHandle="convStateHandle($event)"
            @hide="confirm = false"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Message from 'components/common/Message.vue';
import { mapGetters } from 'vuex';
import ConversationStateConfirmModal from 'components/common/modal/ConversationStateConfirmModal.vue';

export default defineComponent({
    name: 'ChatPanel',
    components: { ConversationStateConfirmModal, Message },
    setup() {
        return {};
    },
    props: {
        conversationId: {
            type: String,
            default: '',
        },
    },
    data(): any {
        return {
            sesId: '',
            convId: '',
            confirm: false,
            convState: '',
            msg: '',
            typingInstance: null,
            msgInputFocused: false,
            gotoBottomBtnShow: false,
        };
    },

    mounted() {
        console.log('chat panel initiated');
        this.sesId = sessionStorage.getItem('ec_user_socket_ses_id');
    },

    computed: {
        conversationInfo(): any {
            const convId = this.getConvId();
            return this.$store.getters['chat/conversationInfo'](convId);
        },

        convStateButtonInfo() {
            const convState = this.conversationInfo.stateInfo.status;

            if (convState === 'left') {
                return { name: 'Close', action: 'close' };
            } else if (convState === 'closed') {
                return { name: 'Closed' };
            } else if (convState === 'joined') {
                return { name: 'Leave', action: 'leave' };
            }

            return { name: 'Join', action: 'join' };
        },

        isAgentToAgentConversation(): any {
            return this.conversationInfo.stateInfo.users_only;
        },

        ...mapGetters({
            profile: 'auth/profile',
        }),
    },

    methods: {
        async getConvMessages(convId: string) {
            await this.$store.dispatch('chat/getAgentConvMessages', {
                convId,
            });
        },

        getConvId() {
            return this.$route.params['conv_id'];
        },

        convStateHandle(type: string) {
            if (!type) return;
            this[`${type}Conversation`](this.getConvId());
        },

        joinConversation(conv_id: any) {
            console.log(conv_id);

            this.$socket.emit('ec_join_conversation', {
                conv_id: conv_id,
            });
        },

        leaveConversation(conv_id: any) {
            this.$socket.emit('ec_leave_conversation', {
                conv_id: conv_id,
            });
        },

        closeConversation(conv_id: any) {
            console.log('from close');

            this.$socket.emit('ec_close_conversation', {
                conv_id: conv_id,
            });
        },
    },

    watch: {
        $route: {
            handler: function () {
                const convId = this.getConvId();

                if (convId) {
                    this.getConvMessages(convId);
                }
            },
            deep: true,
            immediate: true,
        },
    },
});
</script>
