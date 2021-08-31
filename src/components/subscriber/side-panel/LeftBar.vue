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
                    :header-class="[
                        getMyOnlineStatus?.status === 'online'
                            ? 'bg-green'
                            : getMyOnlineStatus?.status === 'offline'
                            ? 'bg-red-5'
                            : 'bg-grey',
                        'text-white',
                    ]"
                    :expand-icon-class="{ 'text-white': true }"
                    dense
                >
                    <template v-slot:header>
                        <q-item-section>
                            <q-item-label>
                                <span class="tw-mr-2">Chat:</span>
                                <span class="tw-font-bold">{{ getMyOnlineStatus?.label }}</span>
                            </q-item-label>
                        </q-item-section>
                    </template>

                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list>
                                <q-item
                                    v-for="(onlineStatus, key) in selectAbleOnlineStatus"
                                    :key="key"
                                    @click="updateOnlineStatus(onlineStatus.status)"
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
                                {{ incomingChatRequestsForMe.length || "-" }} Chat{{
                                    incomingChatRequestsForMe.length > 1 ? "s" : ""
                                }}
                            </div>
                            <q-btn
                                label="Accept Next"
                                :color="globalColor"
                                size="sm"
                                :disable="!incomingChatRequestsForMe.length"
                                @click="acceptNextChatHandler(incomingChatRequestsForMe[0].id)"
                                unelevated
                                no-caps
                            />
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    label="CONVERSATIONS"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-xs`"
                    dense
                >
                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list v-if="myOngoingChats.length">
                                <q-item
                                    v-for="ongoingChat in myOngoingChats"
                                    :to="{ name: 'chats', params: { conv_id: ongoingChat.id } }"
                                    :key="ongoingChat.id"
                                    clickable
                                    v-ripple
                                    :active="true"
                                    :active-class="`${globalBgColor}-2`"
                                    dense
                                >
                                    <q-item-section class="tw-min-w-0" avatar>
                                        <ec-avatar
                                            :image_src="senderInfo(ongoingChat).src || null"
                                            :name="senderInfo(ongoingChat).img_alt_name"
                                            :email="senderInfo(ongoingChat).email"
                                            size="23px"
                                        ></ec-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="tw-text-sm" style="word-break: break-all">
                                            {{ senderInfo(ongoingChat).display_name }}
                                        </q-item-label>
                                    </q-item-section>

                                    <q-item-section v-if="ongoingChat.count_unseen_msg" side>
                                        <q-badge color="orange">
                                            {{ ongoingChat.count_unseen_msg > 9 ? "9+" : ongoingChat.count_unseen_msg }}
                                        </q-badge>
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <div v-else class="tw-px-4 tw-py-2 tw-text-xs">Currently no ongoing chats</div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    label="CHATS"
                    :header-class="`text-weight-bold ${globalBgColor}-1 tw-text-xs`"
                    dense
                >
                    <q-card>
                        <q-card-section class="tw-p-0">
                            <q-list dense>
                                <q-item
                                    class="tw-text-xs"
                                    @click="$router.push({ name: 'chat-interaction' })"
                                    clickable
                                    dense
                                >
                                    <q-item-section>
                                        <q-item-label class="tw-text-xs text-weight-medium tw-uppercase"
                                            >All
                                        </q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label side class="text-right tw-text-sm text-grey-7">
                                            {{
                                                Object.values(departmentalChatRequestsCount).reduce((acc, cur) => {
                                                    return +acc + +cur.count;
                                                }, 0)
                                            }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item
                                    v-for="department of chatDepartments"
                                    :key="department.id"
                                    class="tw-text-sm"
                                    @click="
                                        $router.push({
                                            name: 'chat-interaction',
                                            query: { department: department.tag },
                                        })
                                    "
                                    clickable
                                    dense
                                >
                                    <q-item-section>
                                        <q-item-label class="tw-text-xs text-weight-medium tw-uppercase"
                                            >{{ department.tag }}
                                        </q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label side class="text-right tw-text-sm text-grey-7"
                                            >{{ departmentalChatRequestsCount[department.tag]?.count || 0 }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item
                    default-opened
                    label="AGENTS"
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
                                    dense
                                >
                                    <q-item-section class="tw-min-w-0" avatar>
                                        <ec-avatar
                                            :image_src="user?.user_meta?.attachment?.src"
                                            :name="user?.user_meta?.display_name"
                                            :email="user?.email"
                                            size="23px"
                                        >
                                            <q-badge
                                                floating
                                                rounded
                                                :color="
                                                    user.online_status === 'online'
                                                        ? 'green'
                                                        : user.online_status === 'offline'
                                                        ? 'red'
                                                        : 'grey'
                                                "
                                                style="padding: 2px 4px; min-height: 8px"
                                            />
                                        </ec-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="text-weight-medium tw-text-xs tw-capitalize">
                                            {{ user.user_meta.display_name }}
                                        </q-item-label>

                                        <!--<q-item-label lines="2" caption>
                                            &lt;!&ndash; {{ teamConversations }} &ndash;&gt;
                                            {{ agentMsgInfo(user.conversation_id, user.socket_session.id) }}
                                        </q-item-label>-->
                                    </q-item-section>

                                    <q-item-section
                                        v-if="
                                            agentMsgInfo(user.conversation_id, user.socket_session.id).count_unseen_msg
                                        "
                                        side
                                    >
                                        <q-badge color="orange">
                                            {{
                                                agentMsgInfo(user.conversation_id, user.socket_session.id)
                                                    .count_unseen_msg > 9
                                                    ? "9+"
                                                    : agentMsgInfo(user.conversation_id, user.socket_session.id)
                                                          .count_unseen_msg
                                            }}
                                        </q-badge>
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
import EcAvatar from "src/components/common/EcAvatar.vue";
import { defineComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";

import * as _l from "lodash";
import moment from "moment";
import helpers from "boot/helpers/helpers";

export default defineComponent({
    name: "LeftBar",

    components: { EcAvatar },

    setup() {
        return {};
    },

    data(): any {
        return {
            onlineStatus: [
                { status: "online", label: "Available" },
                { status: "offline", label: "Away" },
                { status: "invisible", label: "Invisible" },
            ],
            chatUsersAvatarLoading: false,

            chatRequestSoundLoop: false,

            chatDepartments: [],
        };
    },

    async mounted() {
        // console.log("left bar initiated");
        await this.getChatRequest();
        await this.getOtherJoinedChats();
        await this.getJoinedChatsWithMe();
        this.getChatDepartments();
    },

    computed: {
        ...mapGetters({
            incomingChatRequestsForMe: "chat/incomingChatRequestsForMe",

            departmentalChatRequestsCount: "chat/departmentalChatRequestsCount",

            myOngoingChats: "chat/myOngoingChats",

            chatUsers: "chat/chatUsers",
            globalBgColor: "setting_ui/globalBgColor",
            globalColor: "setting_ui/globalColor",
            profile: "auth/profile",
            teamConversations: "chat/teamConversation",
        }),

        /*teamConversations(): any {
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
        },*/

        selectAbleOnlineStatus(): any {
            return this.onlineStatus.filter(
                (onlineStatus: any) => onlineStatus?.status !== this.getMyOnlineStatus?.status
            );
        },

        getMyOnlineStatus(): any {
            return this.onlineStatus.find((onlineStatus: any) => onlineStatus?.status === this.profile.online_status);
        },
    },

    methods: {
        ...mapMutations({ updateRightDrawerState: "setting_ui/updateRightDrawerState" }),

        getChatDepartments() {
            window.api
                .get("/departments")
                .then((res: any) => {
                    // console.log('webchat departments', res);
                    this.chatDepartments = res.data;
                })
                .catch((e: any) => {
                    console.log(e);
                });
        },

        async getChatRequest() {
            await this.$store.dispatch("chat/getChatRequests");
        },
        async getOtherJoinedChats() {
            await this.$store.dispatch("chat/getOtherJoinedChats");
        },
        async getJoinedChatsWithMe() {
            await this.$store.dispatch("chat/getJoinedChatsWithMe");
        },

        acceptNextChatHandler(convId: any) {
            this.$socket.emit("ec_join_conversation", {
                conv_id: convId,
            });

            this.$router.push({ name: "chats", params: { conv_id: convId } });
        },

        agentMsgInfo(convId: any, sesId: any) {
            if (!convId) return "";

            const returnObj: any = {
                typing: false,
                count_unseen_msg: 0,
            };

            const typingStates = this.$store.getters["chat/typingState"](convId);
            const sesTypingState = _l.find(typingStates, ["socket_session_id", sesId]);

            if (sesTypingState && sesTypingState.status === "typing") {
                returnObj.typing = true;
            }

            const conv = this.teamConversations.find((conv: any) => conv.id === convId);

            if (!conv) {
                return returnObj;
            }

            // get my last msg seen time
            const self_info = _l.find(
                conv?.sessions,
                (convSes: any) => convSes.socket_session_id === helpers.getMySocketSessionId()
            );

            const myLastMsgSeenTime = self_info?.last_msg_seen_time;

            const convMessages = Object.values(conv.messages).filter((message: any) => {
                return message.socket_session_id !== helpers.getMySocketSessionId();
            });

            if (!myLastMsgSeenTime) {
                returnObj.count_unseen_msg = convMessages.length;
            } else {
                for (const message of convMessages) {
                    if (returnObj.count_unseen_msg > 9) break;

                    const msg: any = message;

                    moment(msg.created_at).isAfter(myLastMsgSeenTime) && returnObj.count_unseen_msg++;
                }
            }

            return returnObj;
        },

        openUserToUserConversation(user: any) {
            if (user.conversation_id && user.conversation_id !== this.$route.params["conv_id"]) {
                if (this.$route.name === "chats") {
                    this.updateRightDrawerState({
                        conv_id: user.conversation_id,
                        mode: "conversation",
                        visible: true,
                    });
                } else {
                    this.$router.push({ name: "chats", params: { conv_id: user.conversation_id } });
                }

                return;
            }

            const userSocketSessId = user.socket_session.id;

            // firing before emit. cz if emit return res before this fn call.
            // though it's not possible for JS event manager. but safe then sorry
            this.handleCreatedConversation(userSocketSessId);

            // create user to user conversation
            this.$socket.emit("ec_init_conv_from_user", {
                ses_ids: [userSocketSessId],
                chat_type: "user_to_user_chat",
                users_only: true,
            });
        },

        handleCreatedConversation(userSocketSessId: any) {
            // find already created conversation_id from agents
            const fn = (data: any) => {
                if (data.status === "success" || data.status === "conflict") {
                    this.$store.commit("chat/updateConvIdToAChatUser", {
                        ses_id: userSocketSessId,
                        conv_id: data.data.conv_id,
                    });

                    if (this.$route.params["conv_id"] !== data.data.conv_id) {
                        if (this.$route.name === "chats") {
                            this.updateRightDrawerState({
                                conv_id: data.data.conv_id,
                                mode: "conversation",
                                visible: true,
                            });
                        } else {
                            this.$router.push({ name: "chats", params: { conv_id: data.data.conv_id } });
                        }
                    }
                }

                this.$emitter.off("listen_ec_init_conv_from_user", fn);

                // this.$emitter.off('listen_error_ec_init_conv_from_user', fn);
            };

            // this event fire from MainLayout if conv from user created
            this.$emitter.on("listen_ec_init_conv_from_user", fn);

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

        async updateOnlineStatus(status: any) {
            // try {
            await this.$store.dispatch("setting_profile/updateOnlineStatus", {
                inputs: {
                    online_status: status,
                },
            });

            this.$socket.emit("ec_updated_socket_room_info", {
                online_status: status,
                status_for: "user",
            });

            // } catch (err) {
            //     this.updateOnlineStatusErrorHandle(err);
            // }
        },

        // updateOnlineStatusErrorHandle(err: any) {
        //     if (this.$_.isObject(err.response.data.message)) {
        //         this.formDataErrors = err.response.data.message;
        //     } else {
        //         this.$helpers.showErrorNotification(this, err.response.data.message);
        //     }
        // },
    },

    watch: {
        // if you need to load avatars everywhere then watch conversation n use same way in the layout template
        chatUsers: {
            handler: async function () {
                // console.log("chatUsers watcher started");
                if (this.chatUsersAvatarLoading) return;

                this.chatUsersAvatarLoading = true;
                // console.log(this.chatUsers);

                const tempArray: any = [];

                if (this.chatUsers.length) {
                    for (const chatUser of this.chatUsers) {
                        if (chatUser.user_meta?.attachment_id && !chatUser.user_meta?.src) {
                            try {
                                const imgRes = await this.$api.get(`attachments/${chatUser.user_meta.attachment_id}`, {
                                    responseType: "arraybuffer",
                                });

                                tempArray.push({
                                    user_id: chatUser.id,
                                    src: URL.createObjectURL(
                                        new Blob([imgRes.data], { type: imgRes.headers["content-type"] })
                                    ),
                                });
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                }

                if (tempArray.length) {
                    this.$store.commit("chat/updateChatUsersAvatar", tempArray);
                }

                this.chatUsersAvatarLoading = false;
            },
            deep: true,
            immediate: true,
        },

        incomingChatRequestsForMe: {
            handler: function () {
                if (this.incomingChatRequestsForMe.length) {
                    if (!this.chatRequestSoundLoop) {
                        this.chatRequestSoundLoop = setInterval(() => {
                            helpers.notifications().reqOne.play();
                        }, 10000);
                    }
                } else {
                    if (this.chatRequestSoundLoop) {
                        clearInterval(this.chatRequestSoundLoop);
                    }
                }
            },
        },
    },
});
</script>
