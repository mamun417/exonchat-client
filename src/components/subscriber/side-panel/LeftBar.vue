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
                <q-item>
                    <q-item-section>
                        <q-item-label class="text-center tw-font-bold">INTERACTION</q-item-label>
                    </q-item-section>
                </q-item>
                <q-expansion-item
                    :header-class="{ 'bg-green-8 text-white': true }"
                    :expand-icon-class="{ 'text-white': true }"
                    dense
                >
                    <template v-slot:header>
                        <q-item-section>
                            <q-item-label
                                ><span class="tw-mr-2">Chat:</span
                                ><span class="tw-font-bold">Available</span></q-item-label
                            >
                        </q-item-section>
                    </template>

                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list>
                                <q-item
                                    v-for="(onlineStatus, key) in [
                                        { status: 'online', label: 'Available' },
                                        { status: 'offline', label: 'Away' },
                                        { status: 'invisible', label: 'Invisible' },
                                    ]"
                                    :key="key"
                                    clickable
                                    dense
                                >
                                    <q-item-section>
                                        <q-item-label class="tw-flex tw-items-center">
                                            <q-badge
                                                rounded
                                                class="tw-mr-2"
                                                :color="
                                                    onlineStatus.status === 'online'
                                                        ? 'green'
                                                        : onlineStatus.status === 'offline'
                                                        ? 'red'
                                                        : 'grey'
                                                "
                                            />
                                            {{ onlineStatus.label }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    :model-value="true"
                    default-opened
                    label="INCOMING REQUESTS"
                    expand-icon-class="hidden"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-xs`"
                    dense
                    expand-icon-toggle
                >
                    <q-card>
                        <q-card-section class="tw-p-4 tw-flex tw-justify-between tw-items-center">
                            <div class="tw-font-bold">
                                {{ incomingChatRequestsForMe.length || '-' }} Chat{{
                                    incomingChatRequestsForMe.length > 1 ? 's' : ''
                                }}
                            </div>
                            <q-btn
                                label="Accept Next"
                                color="green"
                                size="sm"
                                :disable="incomingChatRequestsForMe.length < 0"
                                @click="acceptNextChatHandler(incomingChatRequestsForMe[0].id)"
                                unelevated
                            />
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    label="Conversations"
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
                                    :active-class="`text-black ${globalBgColor}-2`"
                                    dense
                                >
                                    <q-item-section class="tw-min-w-0" avatar>
                                        <ec-avatar
                                            :image_src="senderInfo(ongoingChat).src || null"
                                            :name="senderInfo(ongoingChat).img_alt_name"
                                            size="20px"
                                        ></ec-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-bold tw-text-xs" style="word-break: break-all">
                                            {{ senderInfo(ongoingChat).display_name }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="tw-px-4 tw-py-2 tw-text-xs">Currently no ongoing chats</div>
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
                                            >{{ department.count }} chats
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="tw-p-4">None</div>
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
                                    <q-item-section class="tw-min-w-0" avatar>
                                        <ec-avatar
                                            :image_src="user?.user_meta?.attachment?.src"
                                            :name="user?.user_meta?.display_name"
                                            size="20px"
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
                                        <q-badge
                                            rounded
                                            :color="
                                                user.online_status === 'online'
                                                    ? 'green'
                                                    : user.online_status === 'offline'
                                                    ? 'red'
                                                    : 'grey'
                                            "
                                        />
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
import EcAvatar from 'src/components/common/EcAvatar.vue';
import { defineComponent } from 'vue';
import { mapGetters, mapMutations } from 'vuex';

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
            incomingChatRequestsForMe: 'chat/incomingChatRequestsForMe',

            departmentalChatRequestsCount: 'chat/departmentalChatRequestsCount',

            myOngoingChats: 'chat/myOngoingChats',

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
        ...mapMutations({ updateRightDrawerState: 'setting_ui/updateRightDrawerState' }),

        async getChatRequest() {
            await this.$store.dispatch('chat/getChatRequests');
        },
        async getOtherJoinedChats() {
            await this.$store.dispatch('chat/getOtherJoinedChats');
        },
        async getJoinedChatsWithMe() {
            await this.$store.dispatch('chat/getJoinedChatsWithMe');
        },

        acceptNextChatHandler(convId: any) {
            this.$socket.emit('ec_join_conversation', {
                conv_id: convId,
            });

            this.$router.push({ name: 'chats', params: { conv_id: convId } });
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
                if (this.$route.name === 'chats') {
                    this.updateRightDrawerState({
                        conv_id: user.conversation_id,
                        mode: 'conversation',
                        visible: true,
                    });
                } else {
                    this.$router.push({ name: 'chats', params: { conv_id: user.conversation_id } });
                }

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

                    if (this.$route.name === 'chats') {
                        this.updateRightDrawerState({
                            conv_id: data.data.conv_id,
                            mode: 'conversation',
                            visible: true,
                        });
                    } else {
                        this.$router.push({ name: 'chats', params: { conv_id: data.data.conv_id } });
                    }
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
