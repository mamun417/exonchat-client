<template>
    <div id="realtime-left-bar" class="tw-w-full tw-h-full">
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
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-xs`"
                    dense
                >
                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list v-if="incomingChatRequests.length">
                                <q-item
                                    v-for="chatRequest in incomingChatRequests"
                                    :to="{ name: 'chats', params: { conv_id: chatRequest.conversation_id } }"
                                    :key="chatRequest.conversation_id"
                                    clickable
                                    v-ripple
                                    :active="true"
                                    :active-class="`bg-${globalColor}-2`"
                                >
                                    <q-item-section avatar>
                                        <ec-avatar
                                            :image_src="senderInfo(chatRequest).src || null"
                                            :name="senderInfo(chatRequest).img_alt_name"
                                            size="md"
                                        ></ec-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-bold tw-text-xs" style="word-break: break-all">
                                            {{ senderInfo(chatRequest).display_name }}
                                        </q-item-label>
                                        <q-item-label lines="2" caption>
                                            {{ chatRequest.msg }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="tw-p-4">Currently no chat requests</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    dense
                    label="Chat Requests For Me"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-xs`"
                >
                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list v-if="incomingChatRequestsForMe.length">
                                <q-item
                                    v-for="chatRequest in incomingChatRequestsForMe"
                                    :to="{ name: 'chats', params: { conv_id: chatRequest.conversation_id } }"
                                    :key="chatRequest.conversation_id"
                                    clickable
                                    v-ripple
                                    :active="true"
                                    :active-class="`bg-${globalColor}-2`"
                                >
                                    <q-item-section avatar>
                                        <ec-avatar
                                            :image_src="senderInfo(chatRequest).src || null"
                                            :name="senderInfo(chatRequest).img_alt_name"
                                            size="md"
                                        ></ec-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-bold tw-text-xs" style="word-break: break-all">
                                            {{ senderInfo(chatRequest).display_name }}
                                        </q-item-label>
                                        <q-item-label lines="2" caption>
                                            {{ chatRequest.msg }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="tw-p-4">Currently no chat requests</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    label="Chats by department"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-xs`"
                    dense
                >
                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list v-if="Object.keys(departmentalChatRequestsCount).length" dense>
                                <q-item
                                    v-for="department of departmentalChatRequestsCount"
                                    :key="department.id"
                                    class="tw-text-xs"
                                    clickable
                                    dense
                                >
                                    <q-item-section>
                                        <q-item-label class="text-weight-bold">{{ department.name }}</q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label side class="text-weight-bold text-right tw-text-xs"
                                            >{{ department.count }} chats</q-item-label
                                        >
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="tw-p-4">None</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    label="My Ongoing Chats"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-xs`"
                    dense
                >
                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list v-if="myOngoingChats.length">
                                <q-item
                                    v-for="ongoingChat in myOngoingChats"
                                    :to="{ name: 'chats', params: { conv_id: ongoingChat.conversation_id } }"
                                    :key="ongoingChat.conversation_id"
                                    clickable
                                    v-ripple
                                    :active="true"
                                    active-class="text-white bg-blue-9"
                                >
                                    <q-item-section avatar>
                                        <ec-avatar
                                            :image_src="senderInfo(ongoingChat).src || null"
                                            :name="senderInfo(ongoingChat).img_alt_name"
                                            size="md"
                                        ></ec-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-bold tw-text-xs" style="word-break: break-all">
                                            {{ senderInfo(ongoingChat).display_name }}
                                        </q-item-label>
                                        <q-item-label lines="2" caption>
                                            {{ ongoingChat.msg }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="tw-p-4">Currently no ongoing chats</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    label="Ongoing Others Chats"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-xs`"
                    dense
                >
                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list v-if="ongoingOtherChats.length">
                                <q-item
                                    v-for="ongoingOtherChat in ongoingOtherChats"
                                    :to="{ name: 'chats', params: { conv_id: ongoingOtherChat.conversation_id } }"
                                    :key="ongoingOtherChat.conversation_id"
                                    clickable
                                    v-ripple
                                    :active="true"
                                    active-class="text-white bg-blue-9"
                                >
                                    <q-item-section avatar>
                                        <ec-avatar
                                            :image_src="senderInfo(ongoingOtherChat).src || null"
                                            :name="senderInfo(ongoingOtherChat).img_alt_name"
                                            size="md"
                                        ></ec-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-bold tw-text-xs" style="word-break: break-all">
                                            {{ senderInfo(ongoingOtherChat).display_name }}
                                        </q-item-label>
                                        <q-item-label lines="2" caption>
                                            {{ ongoingOtherChat.msg }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="tw-p-4">Currently no ongoing other chats</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    label="Teammates"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-xs`"
                    dense
                >
                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list>
                                <q-item
                                    v-for="(user, index) in chatUsers"
                                    @click="openUserToUserConversation(user)"
                                    :active-class="`text-grey-9 bg-${globalColor}-2`"
                                    :active="user.conversation_id && user.conversation_id === $route.params?.conv_id"
                                    :key="index"
                                    clickable
                                >
                                    <q-item-section avatar>
                                        <ec-avatar
                                            :image_src="user?.user_meta?.attachment?.src"
                                            :name="user?.user_meta?.display_name"
                                            size="md"
                                        ></ec-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-bold tw-text-xs">
                                            {{ user.user_meta.display_name }}
                                        </q-item-label>

                                        <q-item-label lines="2" caption>
                                            <!-- {{ teamConversations }} -->
                                            {{ teammateMsg(user.conversation_id, user.socket_sessions[0].id) }}
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
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-xs`"
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
import EcAvatar from 'src/components/common/EcAvatar.vue';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import * as _l from 'lodash';
import moment from 'moment';

export default defineComponent({
    name: 'LeftBar',

    components: { EcAvatar },

    setup() {
        return {};
    },

    data(): any {
        return {
            chatUsersAvatarLoading: false,
        };
    },

    async mounted() {
        console.log('left bar initiated');
        await this.getChatRequest();
        await this.getOtherJoinedChats();
        await this.getJoinedChatsWithMe();
    },

    computed: {
        ...mapGetters({
            incomingChatRequests: 'chat/incomingChatRequests',
            incomingChatRequestsForMe: 'chat/incomingChatRequestsForMe',

            departmentalChatRequestsCount: 'chat/departmentalChatRequestsCount',

            myOngoingChats: 'chat/myOngoingChats',
            ongoingOtherChats: 'chat/ongoingOtherChats',

            chatUsers: 'chat/chatUsers',
            globalBgColor: 'setting_ui/globalBgColor',
            globalColor: 'setting_ui/globalColor',
        }),

        teamConversations(): any {
            const teamConversations = this.$_.cloneDeep(this.$store.getters['chat/teamConversation']);

            if (teamConversations.length) {
                return teamConversations.map((conv: any) => {
                    conv.message = msgMaker(conv.messages);

                    return conv;
                });
            }

            function msgMaker(messagesObj: any) {
                if (messagesObj && Object.keys(messagesObj).length) {
                    const messages = _l.cloneDeep(Object.values(messagesObj));

                    const tempMsgObj: any = _l
                        .sortBy(
                            messages.filter((msg: any) => msg.msg || (msg.attachments && msg.attachments.length)),
                            [(msg: any) => moment(msg.created_at).format('x')]
                        )
                        .reverse()[0];

                    if (!tempMsgObj.msg) {
                        tempMsgObj.msg = 'Uploaded Attachments';
                    }

                    return tempMsgObj;
                }

                return null;
            }

            return [];
        },
    },

    methods: {
        async getChatRequest() {
            await this.$store.dispatch('chat/getChatRequests');
        },
        async getOtherJoinedChats() {
            await this.$store.dispatch('chat/getOtherJoinedChats');
        },
        async getJoinedChatsWithMe() {
            await this.$store.dispatch('chat/getJoinedChatsWithMe');
        },

        teammateMsg(convId: any, sesId: any) {
            if (!convId) return '';

            const typingStates = this.$store.getters['chat/typingState'](convId);
            const sesTypingState = _l.find(typingStates, ['socket_session_id', sesId]);

            if (sesTypingState && sesTypingState.status === 'typing') {
                return 'Typing...';
            }

            const conv: any = _l.cloneDeep(this.teamConversations).filter((conv: any) => conv.id === convId);
            // console.log(conv.length, convId, conv[0]);

            if (conv.length && conv[0].message) {
                return conv[0].message.msg;
            }

            return '';
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

        senderInfo(conv: any) {
            if (conv.conversation_session?.socket_session) {
                return {
                    display_name: conv.conversation_session.socket_session.init_name,
                    img_alt_name: conv.conversation_session.socket_session.init_name,
                    email: conv.conversation_session.socket_session.init_email,
                };
            }

            return {};
        },
    },

    watch: {
        // if you need to load avatars everywhere then watch conversation n use same way in the layout template
        chatUsers: {
            handler: async function () {
                console.log('chatUsers watcher started');
                if (this.chatUsersAvatarLoading) return;

                this.chatUsersAvatarLoading = true;
                // console.log(this.chatUsers);

                const tempArray: any = [];

                if (this.chatUsers.length) {
                    for (const chatUser of this.chatUsers) {
                        if (chatUser.user_meta?.attachment_id && !chatUser.user_meta?.src) {
                            try {
                                const imgRes = await this.$api.get(`attachments/${chatUser.user_meta.attachment_id}`, {
                                    responseType: 'arraybuffer',
                                });

                                tempArray.push({
                                    user_id: chatUser.id,
                                    src: URL.createObjectURL(
                                        new Blob([imgRes.data], { type: imgRes.headers['content-type'] })
                                    ),
                                });
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                }

                if (tempArray.length) {
                    this.$store.commit('chat/updateChatUsersAvatar', tempArray);
                }

                this.chatUsersAvatarLoading = false;
            },
            deep: true,
            immediate: true,
        },
    },
});
</script>
