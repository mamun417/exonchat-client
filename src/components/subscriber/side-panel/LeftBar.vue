<template>
    <div id="realtime-left-bar" class="tw-w-full tw-h-full">
        <div></div>

        <q-scroll-area
            class="fit"
            :thumb-style="{
                marginRight: '-10px',
                ...$helpers.getThumbStyle(),
            }"
        >
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
                            <q-list v-if="myOngoingWithFbChats.length">
                                <q-item
                                    class="tw-pr-0"
                                    v-for="ongoingChat in myOngoingWithFbChats"
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
                                            :name="ongoingChat.clientSocketSession.init_name"
                                            :email="ongoingChat.clientSocketSession.init_email"
                                            :image_src="ongoingChat.clientSocketSession.user_info?.profile_pic || null"
                                            size="23px"
                                        ></ec-avatar>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label class="tw-text-sm" style="word-break: break-all">
                                            {{ ongoingChat.clientSocketSession.init_name }}
                                        </q-item-label>
                                    </q-item-section>

                                    <q-item-section v-if="ongoingChat.myUnseenMessageCount" side>
                                        <q-badge color="orange" class="tw-mr-2">
                                            {{
                                                ongoingChat.myUnseenMessageCount > 9
                                                    ? "9+"
                                                    : ongoingChat.myUnseenMessageCount
                                            }}
                                        </q-badge>
                                    </q-item-section>

                                    <!--<pre>{{ ongoingChat }}</pre>-->

                                    <q-item-section v-if="showDraftIcon(ongoingChat.id)" side>
                                        <q-badge color="transparent"><i class="fa fa-pen text-grey-5"></i> </q-badge>
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
                                        <q-item-label class="tw-text-sm text-weight-medium tw-uppercase"
                                            >All
                                        </q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label side class="text-right tw-text-sm text-grey-7">
                                            {{
                                                Object.values(departmentalOngoingChats).reduce((acc, cur) => {
                                                    return +acc + +cur.conversations.length;
                                                }, 0)
                                            }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item
                                    v-for="department of chatDepartmentModel.get()"
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
                                        <q-item-label class="tw-text-sm text-weight-medium tw-uppercase"
                                            >{{ department.tag }}
                                        </q-item-label>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label side class="text-right tw-text-sm text-grey-7"
                                            >{{ departmentalOngoingChats[department.id]?.conversations.length }}
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
                                <transition-group name="flip-list">
                                    <q-item
                                        v-for="user in chatUsers"
                                        @click="openUserToUserConversation(user)"
                                        :active-class="`text-grey-9 bg-${globalColor}-2`"
                                        :active="
                                            user.conversation_id && user.conversation_id === $route.params?.conv_id
                                        "
                                        class="tw-py-2 tw-pr-0"
                                        :key="user.id"
                                        clickable
                                        dense
                                    >
                                        <q-item-section class="tw-min-w-0" avatar>
                                            <ec-avatar
                                                :image_src="user?.user_meta?.attachment?.src"
                                                :name="user?.user_meta?.display_name"
                                                :email="user?.email"
                                                :key="user.id"
                                                size="30px"
                                            >
                                                <q-badge floating rounded class="bg-white" style="padding: 1px">
                                                    <q-icon
                                                        :name="`${
                                                            user.online_status === 'logout' ? 'block' : 'circle'
                                                        }`"
                                                        size="12px"
                                                        :color="
                                                            user.online_status === 'online'
                                                                ? 'green'
                                                                : user.online_status === 'offline'
                                                                ? 'red'
                                                                : 'grey-6'
                                                        "
                                                        class="bg-grey-4 tw-rounded-full"
                                                    />
                                                </q-badge>
                                            </ec-avatar>
                                        </q-item-section>

                                        <q-item-section>
                                            <q-item-label
                                                class="text-weight-medium tw-text-sm tw-capitalize"
                                                :class="{ 'text-grey': user.online_status === 'logout' }"
                                            >
                                                {{ user.user_meta.display_name }}
                                            </q-item-label>
                                        </q-item-section>

                                        <q-item-section v-if="agentMsgInfo(user.conversation_id).count_unseen_msg" side>
                                            <q-badge color="orange" class="tw-mr-2">
                                                {{
                                                    agentMsgInfo(user.conversation_id).count_unseen_msg > 9
                                                        ? "9+"
                                                        : agentMsgInfo(user.conversation_id).count_unseen_msg
                                                }}
                                            </q-badge>
                                        </q-item-section>

                                        <q-item-section v-if="showDraftIcon(user.conversation_id)" side>
                                            <q-badge color="transparent"
                                                ><i class="fa fa-pen text-grey-5"></i>
                                            </q-badge>
                                        </q-item-section>
                                    </q-item>
                                </transition-group>
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
import ChatDepartment from "src/store/models/ChatDepartment";
import Conversation from "src/store/models/Conversation";

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

            departmentalOngoingChats: "chat/departmentalOngoingChats",

            myOngoingChats: "chat/myOngoingChats",

            chatUsers: "chat/chatUsers",
            meAsChatUser: "chat/meAsChatUser",
            globalBgColor: "setting_ui/globalBgColor",
            globalColor: "setting_ui/globalColor",
            profile: "auth/profile",
            teamConversations: "chat/teamConversation",
        }),

        chatDepartmentModel(): any {
            return ChatDepartment.query();
        },

        myOngoingWithFbChats(): any {
            const facebookChats = Conversation.query()
                .where("type", (value: any) => value === "facebook_chat")
                .where("closed_at", null)
                // .whereHas("conversation_sessions", (conversationSessionQuery) => {
                //     conversationSessionQuery; //
                // })
                .orderBy("created_at")
                .get();

            return [...this.myOngoingChats, ...facebookChats];
        },

        selectAbleOnlineStatus(): any {
            return this.onlineStatus.filter(
                (onlineStatus: any) => onlineStatus?.status !== this.getMyOnlineStatus?.status
            );
        },

        getMyOnlineStatus(): any {
            return this.onlineStatus.find(
                (onlineStatus: any) => this.meAsChatUser?.online_status === onlineStatus.status
            );
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

                    ChatDepartment.insert({ data: res.data });
                })
                .catch((e: any) => {
                    console.log(e);
                });
        },

        async getChatRequest() {
            try {
                await this.$store.dispatch("chat/getChatRequests");
            } catch (e) {}
        },
        async getOtherJoinedChats() {
            try {
                await this.$store.dispatch("chat/getOtherJoinedChats");
            } catch (e) {}
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

        agentMsgInfo(convId: any) {
            if (!convId) return "";

            const returnObj: any = {
                count_unseen_msg: 0,
            };

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

        updateOnlineStatus(status: any) {
            // try {
            this.$store
                .dispatch("setting_profile/updateOnlineStatus", {
                    inputs: {
                        online_status: status,
                    },
                })
                .then(() => {
                    this.$store.dispatch("auth/updateAuthInfo");

                    this.$socket.emit("ec_updated_socket_room_info", {
                        online_status: status,
                        status_for: "user",
                    });
                })
                .catch(() => {
                    // this.updateOnlineStatusErrorHandle(err);
                });
        },

        myConversationSession(convId: any) {
            return Conversation.find(convId)?.myConversationSession || {};
        },

        showDraftIcon(convId: any) {
            return this.myConversationSession(convId).draft_message && this.$route.params["conv_id"] !== convId;
        },
    },

    watch: {
        incomingChatRequestsForMe: {
            handler: function () {
                if (this.incomingChatRequestsForMe.length) {
                    if (!this.chatRequestSoundLoop) {
                        this.chatRequestSoundLoop = setInterval(() => {
                            if (
                                this.$browser_tab_id === localStorage.getItem("ec_current_visiting_tab") &&
                                this.incomingChatRequestsForMe.length &&
                                this.profile.online_status === "online"
                            ) {
                                helpers.notifications().reqOne.play();
                            }
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
