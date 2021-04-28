<template>
    <div id="realtime-left-bar" class="tw-pb-3 tw-h-full">
        <div></div>

        <q-scroll-area
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
            <!-- <div
                        class="text-weight-bold tw-text-lg text-center tw-py-2"
                    >
                        Interactions
                    </div> -->

            <q-list class="tw-text-gray-600">
                <!-- <q-item class="text-weight-bold tw-pr-2">
                    <q-item-section>Real Time Info</q-item-section>
                    <q-item-section side
                        ><q-btn
                            icon="navigate_before"
                            color="green"
                            class="tw-px-2"
                            flat
                        ></q-btn
                    ></q-item-section>
                </q-item> -->

                <q-expansion-item
                    default-opened
                    label="Incoming chat request"
                    header-class="text-weight-bold bg-green-1 tw-text-sm"
                    dense
                >
                    <q-card v-if="Object.keys(chatRequests).length">
                        <q-card-section class="tw-p-0">
                            <q-list>
                                <q-item
                                    v-for="request in chatRequests"
                                    :to="{ name: 'chats', params: { conv_id: request.conv_id } }"
                                    :key="request.conv_id"
                                    clickable
                                    v-ripple
                                    :active="true"
                                    active-class="text-white bg-blue-9"
                                >
                                    <q-item-section avatar>
                                        <q-avatar size="md">
                                            <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" alt="image" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-bold tw-text-xs" style="word-break: break-all">
                                            {{ request.conv_id }}
                                        </q-item-label>
                                        <q-item-label lines="2">
                                            {{ request.messages.msg }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>

                    <q-card v-else>
                        <q-card-section> Currently no chat requests </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item default-opened dense label="Chat For Me" header-class="text-weight-bold bg-green-1">
                    <q-card>
                        <q-list>
                            <q-item class="" clickable>
                                <q-item-section avatar>
                                    <q-avatar size="md">
                                        <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" alt="" />
                                    </q-avatar>
                                </q-item-section>

                                <q-item-section>
                                    <q-item-label class="text-weight-bold tw-text-xs">Hasan</q-item-label
                                    ><q-item-label caption lines="2">How can i buy a bd domain name</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item class="" clickable>
                                <q-item-section avatar>
                                    <q-avatar>
                                        <img :src="`https://cdn.quasar.dev/img/avatar3.jpg`" alt="" />
                                    </q-avatar>
                                </q-item-section>

                                <q-item-section>
                                    <q-item-label class="text-weight-bold">Nasir</q-item-label
                                    ><q-item-label caption lines="2">My site is hacked... Please help me.</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    label="Chat Departments"
                    header-class="text-weight-bold bg-green-1 tw-text-sm"
                    dense
                >
                    <q-card>
                        <q-list dense>
                            <q-item class="tw-text-xs" clickable>
                                <q-item-section>
                                    <q-item-label class="text-weight-bold">All</q-item-label>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label side class="text-right tw-text-xs">10 chats</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item class="tw-text-xs" clickable>
                                <q-item-section>
                                    <q-item-label class="text-weight-bold">Sales</q-item-label>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label side class="text-right">5 chats</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item class="tw-text-xs" clickable>
                                <q-item-section>
                                    <q-item-label class="text-weight-bold">Technical Support</q-item-label>
                                </q-item-section>
                                <q-item-section class="tw-max-w-16">
                                    <q-item-label side class="text-right">5 chats</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    label="My Ongoing Chats"
                    header-class="text-weight-bold bg-green-1 tw-text-sm"
                    dense
                >
                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list v-for="n in 3" :key="n">
                                <q-item class="" clickable>
                                    <q-item-section avatar>
                                        <q-avatar size="md">
                                            <img :src="`https://cdn.quasar.dev/img/avatar2.jpg`" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-bold tw-text-xs">Mamun</q-item-label>
                                        <q-item-label caption lines="2">hi hello & thank you!</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    label="Ongoing Others Chats"
                    header-class="text-weight-bold bg-green-1 tw-text-sm"
                    dense
                >
                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list v-for="n in 3" :key="n">
                                <q-item class="" clickable>
                                    <q-item-section avatar>
                                        <q-avatar size="md">
                                            <img :src="`https://cdn.quasar.dev/img/avatar2.jpg`" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-bold tw-text-xs">Mamun</q-item-label>
                                        <q-item-label caption lines="2">hi hello & thank you!</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    label="Teammates"
                    header-class="text-weight-bold bg-green-1 tw-text-sm"
                    dense
                >
                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list>
                                <q-item
                                    v-for="(agent, index) in chatAgents"
                                    @click="openUserToUserConversation(agent)"
                                    active-class="text-white bg-blue-9"
                                    :active="agent.conversation_id === $route.params?.conv_id"
                                    :key="index"
                                    clickable
                                >
                                    <q-item-section avatar>
                                        <q-avatar size="md">
                                            <img :src="`https://cdn.quasar.dev/img/avatar2.jpg`" alt="" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-bold tw-text-xs"
                                            >{{ agent.email }}
                                        </q-item-label>
                                        <!-- <q-item-label class="text-weight-bold">
                                            <pre>{{ agent }}</pre>
                                        </q-item-label>-->
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    label="Some Last Chats With Me"
                    header-class="text-weight-bold bg-green-1 tw-text-sm"
                    dense
                >
                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list v-for="n in 3" :key="n">
                                <q-item class="" clickable>
                                    <q-item-section avatar>
                                        <q-avatar size="md">
                                            <img :src="`https://cdn.quasar.dev/img/avatar2.jpg`" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-bold tw-text-xs">Mamun</q-item-label>
                                        <q-item-label caption lines="2">hi hello & thank you!</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>
            </q-list>
        </q-scroll-area>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
    name: 'LeftBar',

    components: {},

    setup() {
        return {};
    },

    data(): any {
        return {};
    },

    mounted() {
        console.log('left bar initiated');
        this.getChatRequest();

        this.fireSocketListeners();
    },

    computed: {
        ...mapGetters({
            chatRequests: 'chat/chatRequests',
            chatAgents: 'chat/chatAgents',
            onlineChatAgents: 'chat/onlineChatAgents',
        }),
    },

    methods: {
        fireSocketListeners() {
            this.$socket.on('ec_conv_initiated_from_user', async (res: any) => {
                // server conversation construct
                this.$socket.emit('ec_init_user_to_user_chat', {});

                await this.$store.dispatch('chat/getAgents');

                await this.$router.push({ name: 'chats', params: { conv_id: res.data.conv_id } });
            });
        },

        getChatRequest() {
            this.$store.dispatch('chat/getChatRequests');
        },

        checkOnlineStatus(agent: any) {
            const onlineAgents = this.onlineChatAgents;

            if (!onlineAgents.length) return false;

            const filterSocketSessions = this.$_.filter(agent.socket_sessions, (socket_session: any) => {
                return onlineAgents.includes(socket_session.id);
            });

            return !!filterSocketSessions.length;
        },

        openUserToUserConversation(agent: any) {
            if (agent.conversation_id) {
                this.$router.push({ name: 'chats', params: { conv_id: agent.conversation_id } });
                return;
            }

            const targetUserSocketSessId = agent.socket_sessions[0].id;

            // create user to user conversation
            this.$socket.emit('ec_init_conv_from_user', {
                ses_ids: [targetUserSocketSessId],
                chat_type: 'user_to_user_chat',
                users_only: true,
            });

            this.handleAlreadyCreatedConversation(targetUserSocketSessId);
        },

        handleAlreadyCreatedConversation(targetUserSocketSessId: any) {
            // find already created conversation_id from agents
            const fn = () => {
                this.$store.dispatch('chat/getAgents').then((chatAgents: any) => {
                    const findAgent = chatAgents.find(
                        (agent: any) => targetUserSocketSessId === agent.socket_sessions[0].id
                    );

                    this.$router.push({ name: 'chats', params: { conv_id: findAgent.conversation_id } });
                });

                this.$emitter.off('listened_error_ec_init_conv_from_user', fn);
            };

            // this event fire from MainLayout if any error
            this.$emitter.on('listened_error_ec_init_conv_from_user', fn);
        },
    },
});
</script>
