<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Client Conversation List</div>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <ec-table
                    :rows="clientConversations"
                    :columns="columns"
                    :bodyCelTemplate="{}"
                    :selected-row-id="selectedRowId"
                >
                    <template v-slot:cell-client_name="slotProps">
                        <div>
                            {{ slotProps.row.client.init_name }}
                        </div>
                    </template>

                    <template v-slot:cell-msg="slotProps">
                        <div>
                            {{ slotProps.row.messages[0]['msg'] }}
                        </div>
                    </template>

                    <template v-slot:cell-chat_department="slotProps">
                        <div>
                            {{ slotProps.row.chat_department.tag }}
                        </div>
                    </template>

                    <template v-slot:cell-connected_agents="slotProps">
                        <div v-if="slotProps.row.connected_agents.length">
                            <q-avatar
                                v-for="(agent, key) in slotProps.row.connected_agents"
                                :key="key"
                                size="35px"
                                :style="key !== 0 ? { marginLeft: '-8px' } : ''"
                            >
                                <img :src="agent.avatar || 'https://cdn.quasar.dev/img/avatar1.jpg'" alt="image" />
                                <q-tooltip class="">
                                    {{ agent.email }}
                                </q-tooltip>
                            </q-avatar>
                        </div>
                        <div v-else></div>
                    </template>

                    <template v-slot:cell-last_sent="slotProps">
                        <div>
                            {{ $helpers.myDate(slotProps.row.messages[0]['created_at'], 'MMMM Do YYYY, h:mm:ss a') }}
                        </div>
                    </template>

                    <template v-slot:cell-status="slotProps">
                        <q-badge
                            v-if="slotProps.row.self_status"
                            :color="
                                slotProps.row.self_status === 'closed'
                                    ? 'red'
                                    : slotProps.row.self_status === 'left'
                                    ? 'orange'
                                    : ''
                            "
                        >
                            {{ slotProps.row.self_status }}
                        </q-badge>
                        <div v-else></div>
                    </template>

                    <template v-slot:cell-action="slotProps">
                        <view-conversation-btn :to="{ name: 'chats', params: { conv_id: slotProps.row.id } }" />
                        <tracking-conversation-btn @click="updateConversationTrucking(slotProps.row.id)" />
                        <direct-message-btn
                            :to="{ name: 'chats', params: { conv_id: slotProps.row.id } }"
                            :disable="slotProps.row.self_status !== 'joined'"
                        />
                        <close-conversation-btn
                            @click="showCloseConversationConfirmModal(slotProps.row.id)"
                            :disable="slotProps.row.self_status !== 'left'"
                        />
                    </template>
                </ec-table>
            </div>
        </div>

        <conversation-state-confirm-modal
            v-if="confirm"
            :conv-state-button-info="{ name: 'close' }"
            @convStateHandle="closeConversation()"
            @hide="confirm = false"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import EcTable from 'components/common/table/EcTable.vue';
import TrackingConversationBtn from 'components/common/table/utilities/TrackingConversationBtn.vue';
import DirectMessageBtn from 'components/common/table/utilities/DirectMessageBtn.vue';
import CloseConversationBtn from 'components/common/table/utilities/CloseConversationBtn.vue';
import ViewConversationBtn from 'components/common/table/utilities/ViewConversationBtn.vue';
import ConversationStateConfirmModal from 'components/common/modal/ConversationStateConfirmModal.vue';

const columns = [
    {
        name: 'client_name',
        align: 'left',
        label: 'Client Name',
        field: 'client_name',
    },
    {
        name: 'msg',
        align: 'left',
        label: 'Message',
        field: 'msg',
    },
    {
        name: 'chat_department',
        align: 'left',
        label: 'Chat Department',
        field: 'chat_department',
    },
    {
        name: 'connected_agents',
        align: 'center',
        label: 'Connected Agents',
        field: 'connected_agents',
    },
    {
        name: 'last_sent',
        align: 'center',
        label: 'Last Sent', // last msg sent time {1 mnt ago}
        field: 'last_sent',
    },
    {
        name: 'status', // conversation status {closed, pending, ongoing}
        label: 'Status',
        field: 'status',
        align: 'center',
    },
    {
        name: 'action', // only view, close if needed, join if um not joined, leave if um joined
        label: 'Actions',
        field: 'action',
        align: 'center',
    },
];

const rows = [
    {
        client_name: 'habijabi',
        msg: 'heelo',
        chat_department: 'Sales',
        connected_agents: [{ name: 'hasan', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' }],
        last_sent: '5mnt ago',
        status: 'joined',
    },
    {
        client_name: 'jabihabi',
        msg: 'hi',
        chat_department: 'Technical',
        connected_agents: [
            { name: 'hasan', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' },
            {
                name: 'susmita',
                avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
            },
        ],
        last_sent: '1mnt ago',
        status: 'closed',
    },
];

export default defineComponent({
    components: {
        ConversationStateConfirmModal,
        ViewConversationBtn,
        CloseConversationBtn,
        DirectMessageBtn,
        TrackingConversationBtn,
        EcTable,
    },
    data(): any {
        return {
            conversationId: '',
            selectedRowId: '',
            confirm: false,
        };
    },

    setup() {
        return {
            columns,
            rows,
        };
    },

    computed: {
        clientConversations(): any {
            const clientConversations = this.$_.cloneDeep(
                this.$store.getters['client_conversation/getClientConversations']
            );

            const mySocketSessionId = this.$helpers.getMySocketSessionId();

            if (clientConversations) {
                return Object.values(clientConversations).map((clientConv: any) => {
                    clientConv.connected_agents = [];

                    // set connected agents and client information
                    clientConv.conversation_sessions.forEach((convSession: any) => {
                        if (convSession.socket_session.user_id) {
                            clientConv.connected_agents.push(convSession.socket_session.user);
                        } else {
                            clientConv.client = convSession.socket_session;
                        }
                    });

                    clientConv.self_status = this.getSelfConversationStateStatus(mySocketSessionId, clientConv);

                    return clientConv;
                });
            }

            return [];
        },

        // if need later
        ...mapGetters({
            trackingConversation: 'ui/trackingConversation',
        }),
    },

    mounted() {
        this.getClientConversations();
    },

    methods: {
        ...mapMutations({ updateConversationTrucking: 'ui/updateConversationTrucking' }),

        getClientConversations() {
            this.$store.dispatch('client_conversation/getClientConversations');
        },

        // set self status (join/left/closed)
        getSelfConversationStateStatus(mySocketSessionId: any, clientConv: any) {
            if (clientConv.closed_by_id === mySocketSessionId) {
                return 'closed';
            } else {
                const mySocketSession = clientConv.conversation_sessions.find(
                    (convSession: any) => convSession.socket_session_id === mySocketSessionId
                );

                if (mySocketSession) {
                    return mySocketSession.left_at ? 'left' : 'joined';
                }
            }
        },

        showCloseConversationConfirmModal(conversationId: any) {
            this.confirm = true;
            this.conversationId = conversationId;
        },

        closeConversation() {
            const convId = this.conversationId;

            if (!convId) return;

            this.$socket.emit('ec_close_conversation', {
                conv_id: convId,
            });
        },
    },

    watch: {
        trackingConversation: {
            handler(trackingConversation) {
                this.selectedRowId = trackingConversation.conversationId;
            },
            deep: true,
            immediate: true,
        },
    },
});
</script>
