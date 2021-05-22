<template>
    <div class="tw-h-full tw-flex tw-flex-col">
        <q-card v-if="trackingConversation.conversationId" class="tw-shadow-sm">
            <q-card-section class="tw-flex tw-items-center tw-py-2 tw-px-2">
                <div>
                    <view-conversation-btn
                        :to="{ name: 'chats', params: { conv_id: trackingConversation.conversationId } }"
                    />

                    <q-btn
                        @click="confirm = true"
                        text-color="green"
                        size="sm"
                        dense
                        flat
                        icon="person_add_alt"
                        class="tw-px-2"
                    >
                        <q-tooltip :offset="[10, 10]"> Join chat </q-tooltip>
                    </q-btn>
                </div>

                <div class="tw-ml-auto">
                    <q-btn text-color="green" size="sm" dense flat icon="more_vert">
                        <q-menu>
                            <q-list dense style="min-width: 100px">
                                <q-item clickable v-close-popup>
                                    <q-item-section>Item 1</q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup>
                                    <q-item-section>Item 2</q-item-section>
                                </q-item>
                                <q-separator />
                                <q-item clickable v-close-popup>
                                    <q-item-section @click="$emit('conversationTrackingRightBar', false)">
                                        Quit
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </div>
            </q-card-section>
        </q-card>
        <message
            v-if="trackingConversation.conversationId"
            :ses-id="sesId"
            chat-panel-type="client"
            :is-conversation-tracking="true"
            :conversation-id="trackingConversation.conversationId"
            :conversationInfo="conversationInfo"
        ></message>
        <!--        <q-btn
            icon="chevron_right"
            color="green"
            size="sm"
            class="tw-absolute tw-top-7"
            style="z-index: 999; right: 235px"
            round
            unelevated
        />-->
        <q-scroll-area
            v-else
            class="fit"
            :bar-style="{
                background: '#60A5FA',
                width: '4px',
                opacity: 0.2,
                borderRadius: '10px',
            }"
            :thumb-style="{
                borderRadius: '9px',
                backgroundColor: '#60A5FA',
                width: '4px',
                opacity: 0.5,
            }"
        >
            <q-list class="tw-px-1 tw-my-3">
                <q-item class="">
                    <q-item-section avatar>
                        <q-avatar size="xl">
                            <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" alt="" />
                        </q-avatar>
                    </q-item-section>

                    <q-item-section class="tw-w-full">
                        <q-item-label class="text-weight-bold tw-text-lg">
                            {{ $_.upperFirst(profile.user_meta.full_name) }}
                        </q-item-label>
                        <q-item-label caption>{{ profile.email }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item class="tw-text-xs tw-w-full" dense>
                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                        <q-icon name="language" size="xs"> </q-icon>
                    </q-item-section>
                    <q-item-section no-wrap>
                        <q-item-label class="text-weight-bold">Browser</q-item-label
                        ><q-item-label caption>mozilla firefox</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item class="tw-text-xs tw-w-full" dense>
                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                        <q-icon name="devices" size="xs"> </q-icon>
                    </q-item-section>
                    <q-item-section no-wrap>
                        <q-item-label class="text-weight-bold">Operating System</q-item-label
                        ><q-item-label caption>WIndows 10</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item class="tw-text-xs tw-w-full" dense>
                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                        <q-icon name="dns" size="xs"> </q-icon>
                    </q-item-section>
                    <q-item-section no-wrap>
                        <q-item-label class="text-weight-bold">User IP</q-item-label
                        ><q-item-label caption>127.0.0.1</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item class="tw-text-xs tw-w-full" dense>
                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                        <q-icon name="schedule" size="xs"> </q-icon>
                    </q-item-section>
                    <q-item-section no-wrap>
                        <q-item-label class="text-weight-bold">Initiated At</q-item-label
                        ><q-item-label caption>Sun Aug 11 11 1111 11:11:11</q-item-label>
                    </q-item-section>
                </q-item>

                <q-expansion-item
                    icon="web"
                    label="User Visiting"
                    dense
                    default-opened
                    header-class="text-weight-bold bg-green-1"
                    class="tw-py-2"
                >
                    <q-card
                        ><q-card-section class="tw-p-0">
                            <q-list class="">
                                <q-item dense class="tw-text-xs">
                                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                                        <q-icon name="wysiwyg" size="xs"> </q-icon>
                                    </q-item-section>
                                    <q-item-section
                                        ><q-item-label>http://my.exonhost.com</q-item-label
                                        ><q-item-label caption>30 sec ago</q-item-label></q-item-section
                                    ></q-item
                                >
                                <q-item dense class="tw-text-xs">
                                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                                        <q-icon name="wysiwyg" size="xs"> </q-icon>
                                    </q-item-section>
                                    <q-item-section
                                        ><q-item-label>http://my.exonhost.com</q-item-label
                                        ><q-item-label caption>15 sec ago</q-item-label></q-item-section
                                    ></q-item
                                >
                                <q-item dense class="tw-text-xs">
                                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                                        <q-icon name="visibility" size="xs"> </q-icon>
                                    </q-item-section>
                                    <q-item-section
                                        ><q-item-label>http://my.exonhost.com/invoice</q-item-label
                                        ><q-item-label caption>5 sec ago</q-item-label></q-item-section
                                    ></q-item
                                ></q-list
                            ></q-card-section
                        ></q-card
                    >
                </q-expansion-item>
            </q-list>
        </q-scroll-area>

        <conversation-state-confirm-modal
            v-if="confirm"
            :conv-state-button-info="{ name: 'join' }"
            @convStateHandle="joinConversation()"
            @hide="confirm = false"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Message from 'components/common/Message.vue';
import { mapGetters } from 'vuex';
import ViewConversationBtn from 'components/common/table/utilities/ViewConversationBtn.vue';
import ConversationStateConfirmModal from 'components/common/modal/ConversationStateConfirmModal.vue';

export default defineComponent({
    name: 'RightBar',
    components: { ConversationStateConfirmModal, ViewConversationBtn, Message },
    setup() {
        return {};
    },
    data(): any {
        return {
            sesId: '',
            confirm: false,
        };
    },

    computed: {
        ...mapGetters({
            trackingConversation: 'ui/trackingConversation',
            profile: 'auth/profile',
        }),

        conversationInfo(): any {
            const convId = this.trackingConversation.conversationId;
            return this.$store.getters['chat/conversationInfo'](convId);
        },

        currentRouteName() {
            return this.$route.name;
        },
    },

    mounted() {
        console.log('right bar initiated');
        this.sesId = sessionStorage.getItem('ec_user_socket_ses_id');
    },

    methods: {
        async getConvMessages(convId: string) {
            await this.$store.dispatch('chat/getAgentConvMessages', {
                convId,
            });
        },

        // set self status (join/left/closed)
        getSelfConversationStateStatus() {
            //
        },

        joinConversation() {
            const convId = this.trackingConversation.conversationId;

            if (!convId) return;

            this.$socket.emit('ec_join_conversation', {
                conv_id: convId,
            });

            this.$router.push({ name: 'chats', params: { conv_id: convId } });
        },
    },

    watch: {
        trackingConversation: {
            handler(trackingConversation) {
                if (trackingConversation.conversationId) {
                    this.getConvMessages(trackingConversation.conversationId);
                    this.$emit('conversationTrackingRightBar', true);
                }
            },
            deep: true,
        },
    },
});
</script>
