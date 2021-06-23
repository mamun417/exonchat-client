<template>
    <q-card class="tw-shadow-lg">
        <q-card-section class="row no-wrap items-center" :class="{ 'tw-p-0': mini_mode }">
            <q-item class="tw-w-full">
                <q-item-section v-if="conversationWithUsersInfo.length === 1" avatar>
                    <ec-avatar
                        :size="mini_mode ? 'md' : 'xl'"
                        :image_src="
                            conversationWithUsersInfo[0].socket_session.user
                                ? conversationWithUsersInfo[0].socket_session.user.user_meta.src || null
                                : null
                        "
                        :name="
                            conversationWithUsersInfo[0].socket_session.user
                                ? conversationWithUsersInfo[0].socket_session.user.user_meta.display_name
                                : conversationWithUsersInfo[0].socket_session.init_name
                        "
                    ></ec-avatar>
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
                            >Closed
                        </q-badge>
                    </q-item-label>
                </q-item-section>

                <q-item-section v-if="!mini_mode" side>
                    <q-item-label>
                        <connected-users-faces :users_conv_ses="conversationConnectedUsers" />
                    </q-item-label>
                </q-item-section>

                <q-item-section v-if="!conversationInfo.users_only" side>
                    <q-item-label>
                        <q-btn icon="more_vert" class="tw-px-1" unelevated>
                            <q-menu anchor="bottom right" self="top right">
                                <q-list dense style="min-width: 100px">
                                    <template v-if="!conversationInfo.users_only">
                                        <q-item v-if="!conversationStatusForMe" clickable v-close-popup>
                                            <q-item-section class="tw-w-8 tw-min-w-0" avatar>
                                                <q-icon name="add" />
                                            </q-item-section>
                                            <q-item-section
                                                @click="
                                                    modalForState = 'join';
                                                    confirmModal = !confirmModal;
                                                "
                                                >Join Chat
                                            </q-item-section>
                                        </q-item>

                                        <q-item v-if="!conversationInfo.closed_at" clickable v-close-popup>
                                            <q-item-section class="tw-w-8 tw-min-w-0" avatar>
                                                <q-icon name="confirmation_number" />
                                            </q-item-section>
                                            <q-item-section @click="openTicket">Open Ticket</q-item-section>
                                        </q-item>

                                        <q-item v-if="conversationStatusForMe === 'joined'" clickable v-close-popup>
                                            <q-item-section class="tw-w-8 tw-min-w-0" avatar>
                                                <q-icon name="exit_to_app" />
                                            </q-item-section>
                                            <q-item-section
                                                @click="
                                                    modalForState = 'leave';
                                                    confirmModal = !confirmModal;
                                                "
                                                >Leave Chat
                                            </q-item-section>
                                        </q-item>
                                        <q-item
                                            v-if="['joined', 'left'].includes(conversationStatusForMe)"
                                            clickable
                                            v-close-popup
                                        >
                                            <q-item-section class="tw-w-8 tw-min-w-0" avatar>
                                                <q-icon name="close" />
                                            </q-item-section>
                                            <q-item-section
                                                @click="
                                                    modalForState = 'close';
                                                    confirmModal = !confirmModal;
                                                "
                                                >Close Chat
                                            </q-item-section>
                                        </q-item>
                                    </template>

                                    <template v-if="rightBarState.mode === 'conversation'">
                                        <q-item clickable v-close-popup>
                                            <q-item-section class="tw-w-8 tw-min-w-0" avatar>
                                                <q-icon name="close_fullscreen" />
                                            </q-item-section>
                                            <q-item-section @click="updateRightDrawerState({ mode: 'client_info' })"
                                                >Close tracking
                                            </q-item-section>
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
import EcAvatar from 'src/components/common/EcAvatar.vue';

export default defineComponent({
    name: 'MessagesTopSection',
    components: { ConversationStateConfirmModal, ConnectedUsersFaces, EcAvatar },
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
            rightBarState: 'setting_ui/rightBarState',
        }),

        conversationInfo(): any {
            return this.$store.getters['chat/conversationInfo'](this.conv_id);
        },

        conversationStatusForMe(): any {
            return this.$store.getters['chat/conversationStatusForMe'](this.conv_id, this.profile?.socket_session?.id);
        },

        conversationWithUsersInfo(): any {
            return this.$store.getters['chat/conversationWithUsersInfo'](
                this.conv_id,
                this.profile?.socket_session?.id
            );
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

        openTicket() {
            window.socketSessionApi
                .post(`/apps/whmcs/tickets/open/${this.conv_id}`)
                .then((res: any) => {
                    console.log(res);
                })
                .catch((e: any) => {
                    console.log(e);
                });
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
