<template>
    <div id="realtime-left-bar" class="tw-h-full">
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
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-sm`"
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

                <q-expansion-item
                    default-opened
                    dense
                    label="Chat Requests For Me"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-sm`"
                >
                    <!-- <q-card>
                        <q-card-section class="tw-p-0">
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
                                        <q-avatar size="md">
                                            <img :src="`https://cdn.quasar.dev/img/avatar3.jpg`" alt="" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-bold tw-text-xs">Nasir</q-item-label
                                        ><q-item-label caption lines="2"
                                            >My site is hacked... Please help me.</q-item-label
                                        >
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card> -->
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    label="Chat Departments"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-sm`"
                    dense
                >
                    <!-- <q-card>
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
                    </q-card> -->
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    label="My Ongoing Chats"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-sm`"
                    dense
                >
                    <!-- <q-card>
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
                    </q-card> -->
                </q-expansion-item>

                <q-expansion-item
                    label="Ongoing Others Chats"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-sm`"
                    dense
                >
                    <!-- <q-card>
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
                    </q-card> -->
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    label="Teammates"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-sm`"
                    dense
                >
                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list>
                                <q-item
                                    v-for="(user, index) in chatUsers"
                                    @click="openUserToUserConversation(user)"
                                    active-class="text-white bg-blue-7"
                                    :active="user.conversation_id === $route.params?.conv_id"
                                    :key="index"
                                    clickable
                                >
                                    <q-item-section avatar>
                                        <q-avatar size="md">
                                            <img :src="`https://cdn.quasar.dev/img/avatar2.jpg`" alt="" />
                                        </q-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-bold tw-text-xs">
                                            {{ user.id }}
                                        </q-item-label>
                                    </q-item-section>

                                    <q-item-section side>
                                        <q-badge rounded :color="user.is_online ? 'green' : 'grey'" />
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    label="Some Old Chats With Me"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-sm`"
                    dense
                >
                    <!-- <q-card>
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
                    </q-card> -->
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
    },

    computed: {
        ...mapGetters({
            chatRequests: 'chat/chatRequests',
            chatUsers: 'chat/chatUsers',
            globalBgColor: 'ui/globalBgColor',
        }),
    },

    methods: {
        getChatRequest() {
            this.$store.dispatch('chat/getChatRequests');
        },

        openUserToUserConversation(user: any) {
            if (user.conversation_id) {
                this.$router.push({ name: 'chats', params: { conv_id: user.conversation_id } });
                return;
            }

            const userSocketSessId = user.socket_sessions[0].id;

            // firing before emit. cz if emit return res before this fn call.
            // though its not possible for js event manager. but safe then sorry
            this.handleCreatedConversation(userSocketSessId);

            // create user to user conversation
            this.$socket.emit('ec_init_conv_from_user', {
                ses_ids: [userSocketSessId],
                chat_type: 'user_to_user_chat',
                users_only: true,
            });
        },

        handleCreatedConversation(userSocketSessId: any) {
            // find already created conversation_id from agents
            const fn = (data: any) => {
                if (data.status === 'success' || data.status === 'conflict') {
                    this.$store.commit('chat/updateConvIdToAChatUser', {
                        ses_id: userSocketSessId,
                        conv_id: data.data.conv_id,
                    });

                    this.$router.push({ name: 'chats', params: { conv_id: data.data.conv_id } });
                }

                this.$emitter.off('listen_ec_init_conv_from_user', fn);

                // this.$emitter.off('listen_error_ec_init_conv_from_user', fn);
            };

            // this event fire from MainLayout if conv from user created
            this.$emitter.on('listen_ec_init_conv_from_user', fn);

            // no need this for now. cz returning if exists from api
            // this.$emitter.on('listen_error_ec_init_conv_from_user', fn);
        },
    },
});
</script>
