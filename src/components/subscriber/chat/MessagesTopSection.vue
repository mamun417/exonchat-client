<template>
    <q-card class="tw-shadow-lg">
        <q-card-section class="row no-wrap items-center" :class="{ 'tw-p-0': mini_mode }">
            <q-item class="tw-w-full">
                <q-item-section avatar>
                    <q-avatar :size="mini_mode ? 'md' : 'xl'">
                        <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" alt="" />
                    </q-avatar>
                </q-item-section>

                <q-item-section class="tw-w-full">
                    <q-item-label class="text-weight-bold" :class="[mini_mode ? 'tw-text-sm' : 'tw-text-lg']">
                        <div v-for="{ socket_session } in conversationWithUsersInfo" :key="socket_session.id">
                            {{
                                socket_session.user
                                    ? socket_session.user.user_meta.display_name
                                    : socket_session.init_name
                            }}
                        </div>
                    </q-item-label>
                    <q-item-label caption>
                        <q-badge color="green" :class="{ 'tw-px-2 tw-py-1': !mini_mode }">Online</q-badge>
                        <q-badge
                            v-if="conversationInfo.closed_at"
                            color="orange"
                            :class="{ 'tw-px-2 tw-py-1': !mini_mode }"
                            >Closed</q-badge
                        >
                    </q-item-label>
                </q-item-section>

                <q-item-section v-if="!mini_mode" side>
                    <q-item-label>
                        <connected-users-faces :users_conv_ses="conversationConnectedUsers" />
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-item-label>
                        <q-btn icon="more_vert" class="tw-px-1" unelevated>
                            <q-menu>
                                <q-list dense style="min-width: 100px">
                                    <template v-if="!conversationInfo.users_only">
                                        <q-item v-if="!conversationStatusForMe" clickable v-close-popup>
                                            <q-item-section
                                                @click="
                                                    modalForState = 'join';
                                                    confirmModal = !confirmModal;
                                                "
                                                >Join Chat</q-item-section
                                            >
                                        </q-item>
                                        <q-item v-if="conversationStatusForMe === 'joined'" clickable v-close-popup>
                                            <q-item-section
                                                @click="
                                                    modalForState = 'leave';
                                                    confirmModal = !confirmModal;
                                                "
                                                >Leave Chat</q-item-section
                                            >
                                        </q-item>
                                        <q-item
                                            v-if="['joined', 'left'].includes(conversationStatusForMe)"
                                            clickable
                                            v-close-popup
                                        >
                                            <q-item-section
                                                @click="
                                                    modalForState = 'close';
                                                    confirmModal = !confirmModal;
                                                "
                                                >Close Chat</q-item-section
                                            >
                                        </q-item>
                                    </template>
                                    <template v-if="rightBarState.mode === 'conversation'">
                                        <q-item clickable v-close-popup>
                                            <q-item-section @click="updateRightDrawerState({ mode: 'client_info' })"
                                                >Close tracking</q-item-section
                                            >
                                        </q-item>
                                    </template>
                                </q-list>
                            </q-menu>
                        </q-btn>
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-card-section>

        <conversation-state-confirm-modal
            v-if="confirmModal"
            :conv-state-button-info="{ name: modalForState }"
            @convStateHandle="convStateHandle($event)"
            @hide="confirm = false"
        />
    </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConversationStateConfirmModal from 'components/common/modal/ConversationStateConfirmModal.vue';

import ConnectedUsersFaces from 'src/components/subscriber/chat/ConnectedUsersFaces.vue';

import { mapGetters, mapMutations } from 'vuex';

export default defineComponent({
    name: 'MessagesTopSection',
    components: { ConversationStateConfirmModal, ConnectedUsersFaces },
    props: {
        conv_id: {
            type: String,
        },
        mini_mode: {
            type: Boolean,
            default: false,
        },
    },

    setup() {
        // const messageInputAutoFocus = ref(false);
        // provide('messageInputAutoFocus', messageInputAutoFocus);
        // return {
        //     messageInputAutoFocus,
        // };
    },

    data(): any {
        return {
            confirmModal: false,
            modalForState: '',
        };
    },

    mounted() {
        console.log('msg top section initiated');
    },

    computed: {
        ...mapGetters({
            profile: 'auth/profile',
            conversationInfo: 'chat/conversationInfo',
            rightBarState: 'setting_ui/rightBarState',
        }),

        conversationStatusForMe(): any {
            return this.$store.getters['chat/conversationStatusForMe'](this.conv_id, this.profile.socket_session.id);
        },

        conversationWithUsersInfo(): any {
            return this.$store.getters['chat/conversationWithUsersInfo'](this.conv_id, this.profile.socket_session.id);
        },

        conversationConnectedUsers(): any {
            return this.$store.getters['chat/conversationConnectedUsers'](this.conv_id);
        },
    },

    methods: {
        ...mapMutations({ updateRightDrawerState: 'setting_ui/updateRightDrawerState' }),

        convStateHandle() {
            if (!this.modalForState) return;
            this[`${this.modalForState}Conversation`](this.conv_id);
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
});
</script>
