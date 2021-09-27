<template>
    <q-layout view="hHh LpR fff" class="bg-white">
        <template v-if="domReady">
            <q-header v-model="notificationDisabledWarning"
                ><q-toolbar class="bg-yellow-2 text-blue-grey-8 tw-px-16"
                    ><div>
                        We suggest you to
                        <span @click="requestNotificationPermission" class="tw-font-bold text-blue-10 tw-cursor-pointer"
                            >enable desktop notification</span
                        >
                    </div>
                    <q-space />
                    <q-btn
                        @click="hideNotificationDisabledWarning"
                        label="Close"
                        color="white"
                        text-color="blue-grey-8"
                        no-caps
                        unelevated /></q-toolbar
            ></q-header>

            <q-drawer
                :model-value="true"
                class="tw-shadow"
                style="overflow: unset"
                side="left"
                :breakpoint="599"
                :width="!leftDrawer ? 65 : 280"
                persistent
                show-if-above
            >
                <div class="tw-flex tw-h-full">
                    <div
                        id="left-bar-menu"
                        :class="[`${globalBgColor}-8`]"
                        class="tw-w-16 tw-flex tw-flex-col tw-justify-between tw-py-3 text-white"
                    >
                        <div class="tw-flex tw-flex-col tw-items-center">
                            <q-icon name="fas fa-headset" class="tw-mb-2 tw-rounded-full tw-p-1" size="lg" />

                            <ec-avatar
                                :image_src="profile?.user_meta?.attachment?.src"
                                :name="profile?.user_meta?.display_name"
                                :email="profile.email"
                                icon_color="text-white"
                                class="cursor-pointer tw-my-3"
                                @click="$router.push({ name: 'settings_profile' })"
                            >
                                <q-tooltip :offset="[10, 10]">Profile</q-tooltip>
                            </ec-avatar>

                            <!--                            <q-btn icon="question_answer" @click="leftDrawer = !leftDrawer" flat size="18px">-->
                            <!--                                <q-tooltip :offset="[10, 10]">Interactions</q-tooltip>-->
                            <!--                            </q-btn>-->

                            <q-btn
                                :class="{ 'active-btn': $route.name === 'chat-interaction' }"
                                icon="question_answer"
                                :to="{ name: 'chat-interaction' }"
                                flat
                                size="18px"
                            >
                                <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                                    Interactions
                                </q-tooltip>
                            </q-btn>

                            <q-btn
                                :class="{ 'active-btn': $route.name === 'visitors' }"
                                icon="dynamic_feed"
                                :to="{ name: 'visitors' }"
                                flat
                                size="18px"
                            >
                                <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                                    Visitors
                                </q-tooltip>
                            </q-btn>

                            <q-btn
                                :class="{ 'active-btn': $route.name === 'chat-history' }"
                                icon="history"
                                :to="{ name: 'chat-history' }"
                                flat
                                size="18px"
                            >
                                <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                                    Chat History
                                </q-tooltip>
                            </q-btn>

                            <q-btn
                                :class="{ 'active-btn': $route.name === 'offline-chat-req' }"
                                icon="feedback"
                                :to="{ name: 'offline-chat-req' }"
                                flat
                                size="18px"
                            >
                                <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                                    Offline Chat Requests
                                </q-tooltip>
                            </q-btn>
                        </div>

                        <div class="tw-flex tw-gap-1 tw-flex-col tw-items-center">
                            <q-btn icon="info" flat>
                                <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                                    Developer debug
                                </q-tooltip>

                                <q-menu class="tw-p-2" style="min-width: 350px">
                                    <store-debug></store-debug>
                                </q-menu>
                            </q-btn>

                            <q-btn
                                :class="{ 'active-btn': $route.name === 'settings' }"
                                icon="settings"
                                :to="{ name: 'settings' }"
                                flat
                            >
                                <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                                    Ui settings
                                </q-tooltip>
                            </q-btn>

                            <q-btn icon="logout" @click="logout" flat>
                                <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                                    Log Out
                                </q-tooltip>
                            </q-btn>
                        </div>
                    </div>
                    <left-bar v-show="leftDrawer"></left-bar>
                </div>
            </q-drawer>

            <q-drawer
                :model-value="rightDrawerVisible"
                :class="{
                    'tw-shadow': rightBarState.mode === 'conversation',
                }"
                class="bg-blue-grey-1"
                side="right"
                :breakpoint="599"
                :width="rightBarState.mode === 'conversation' ? 400 : 350"
                persistent
            >
                <right-bar style="background-color: #f8fafb"></right-bar>
            </q-drawer>

            <q-page-container>
                <!--<pre>{{ tempStore }}</pre>-->
                <q-card
                    v-show="myChatTransferRequest.id"
                    :class="`tw-fixed tw-top-0 tw-shadow-lg tw-rounded-none tw-bg-transparent`"
                    :style="{ width: `${qPageSize.width}px`, zIndex: 9999 }"
                >
                    <q-card-section v-if="myChatTransferRequest.id" class="tw-flex tw-flex-grow tw-p-0">
                        <div
                            :class="`tw-flex tw-flex-col text-white tw-justify-center tw-items-center tw-p-4 ${globalBgColor}-9`"
                        >
                            <q-icon name="chat" size="md" />
                            <div class="tw-whitespace-nowrap">Transfer Request</div>
                        </div>

                        <div :class="`tw-opacity-95 tw-p-4 tw-flex tw-flex-grow tw-justify-between ${globalBgColor}-8`">
                            <div class="text-white tw-flex tw-flex-col tw-justify-around">
                                <span class="tw-font-bold tw-text-base tw-capitalize">
                                    Chat transfer request from
                                    {{
                                        myChatTransferRequest.transfer_request_info?.info?.transfer_from?.user_meta
                                            ?.display_name
                                    }}</span
                                >
                                <div class="tw-flex tw-mt-4">
                                    <q-badge
                                        class="tw-capitalize"
                                        color="blue-grey-10"
                                        :label="myChatTransferRequest.chat_department?.tag"
                                    />
                                </div>
                            </div>
                            <div class="tw-flex tw-items-center tw-mr-4">
                                <div class="tw-flex tw-gap-3">
                                    <q-btn
                                        label="Accept"
                                        color="green-2"
                                        text-color="black"
                                        size="md"
                                        @click="takeThisChat(myChatTransferRequest, true)"
                                        no-caps
                                        unelevated
                                    />
                                    <q-btn
                                        label="Reject"
                                        color="orange-2"
                                        text-color="black"
                                        size="md"
                                        @click="rejectChatRequest(myChatTransferRequest)"
                                        no-caps
                                        unelevated
                                    />
                                </div>
                            </div>
                        </div>
                        <!--                        <div class='tw-flex tw-gap-2 tw-mb-2 text-white tw-text-base'><div>younus</div><div>|</div><div class='tw-px-2 bg-blue-grey-6 tw-rounded-md'>technical</div></div>-->
                    </q-card-section>
                </q-card>
                <q-card
                    v-show="newConversationInfo.id && !myChatTransferRequests.length"
                    :class="`tw-fixed tw-top-0 tw-shadow-lg tw-rounded-none tw-bg-transparent`"
                    :style="{ width: `${qPageSize.width}px`, zIndex: 9999 }"
                >
                    <q-card-section
                        v-if="newConversationInfo.id && !myChatTransferRequests.length"
                        class="tw-flex tw-flex-grow tw-p-0"
                    >
                        <div
                            :class="`tw-flex tw-flex-col text-white tw-justify-center tw-items-center tw-p-4 ${globalBgColor}-9`"
                        >
                            <q-icon name="chat" size="md" />
                            <div class="tw-whitespace-nowrap">New Chat</div>
                        </div>
                        <div :class="`tw-opacity-95 tw-p-4 tw-flex tw-flex-grow tw-justify-between ${globalBgColor}-8`">
                            <div class="text-white tw-flex tw-flex-col tw-justify-between">
                                <div class="tw-flex tw-items-center tw-gap-4">
                                    <q-badge
                                        :label="newConversationInfo.chat_department?.tag"
                                        class="tw-capitalize"
                                        color="blue-grey-10"
                                    />
                                    <span class="tw-font-bold tw-text-base tw-capitalize">
                                        {{ newConversationInfo.conversation_sessions[0].socket_session.init_name }}
                                    </span>
                                </div>
                                <div class="tw-flex tw-gap-6">
                                    <div>
                                        <div>
                                            Online for
                                            {{
                                                $helpers.fromNowTime(
                                                    newConversationInfo.conversation_sessions[0].socket_session
                                                        .created_at,
                                                    true
                                                )
                                            }}
                                        </div>
                                    </div>
                                    <div>
                                        <div>{{ newConversationInfo.prev_chat_count || 0 }} chats so far</div>
                                    </div>
                                </div>
                            </div>
                            <div class="tw-flex tw-items-center tw-mr-4">
                                <div
                                    v-if="conversationConnectedUsers.length"
                                    class="tw-flex tw-flex-col tw-items-center"
                                >
                                    <div class="text-white tw-mb-2">Someone already accepted this conversation</div>
                                    <div class="tw-flex tw-gap-3">
                                        <q-btn
                                            @click="superviseChat(newConversationInfo.id)"
                                            label="Supervise"
                                            color="white"
                                            text-color="black"
                                            size="md"
                                            no-caps
                                            unelevated
                                        />
                                        <q-btn
                                            @click="newConversationInfo = {}"
                                            label="Cancel"
                                            color="white"
                                            text-color="black"
                                            size="md"
                                            no-caps
                                            unelevated
                                        />
                                    </div>
                                </div>

                                <q-btn
                                    v-else
                                    @click="takeThisChat(newConversationInfo)"
                                    label="Take This Chat"
                                    color="white"
                                    text-color="black"
                                    size="md"
                                    no-caps
                                    unelevated
                                />
                            </div>
                        </div>
                        <!--                        <div class='tw-flex tw-gap-2 tw-mb-2 text-white tw-text-base'><div>younus</div><div>|</div><div class='tw-px-2 bg-blue-grey-6 tw-rounded-md'>technical</div></div>-->
                    </q-card-section>
                </q-card>

                <q-page class="tw-flex">
                    <div
                        v-if="
                            rightBarState.mode &&
                            ((rightBarState.mode === 'client_info' && !conversationInfo.users_only) ||
                                (rightBarState.mode === 'conversation' && rightBarState.conv_id))
                        "
                        class="tw-absolute tw-top-6 tw-right-0"
                        style="z-index: 9999"
                    >
                        <q-btn
                            size="sm"
                            :icon="rightDrawerVisible ? 'chevron_right' : 'chevron_left'"
                            @click="updateRightDrawerState({ visible: !rightDrawerVisible })"
                            class="tw-px-0 tw-py-3"
                            color="blue-grey-2"
                            unelevated
                        />
                    </div>

                    <router-view
                        :class="`tw-w-full tw-p-3`"
                        style="background-color: #f8fafb"
                        :key="$route.fullPath"
                    ></router-view>

                    <q-resize-observer @resize="updateQPageSizeInfo" />
                </q-page>
            </q-page-container>
        </template>

        <q-inner-loading :showing="!domReady">
            <q-spinner-facebook size="50px" :color="globalBgColor" />
        </q-inner-loading>

        <q-dialog
            v-model="socketConnectError"
            position="top"
            class="tw-px-0"
            id="network-error-dialog"
            style="z-index: 999999999"
            full-width
            seamless
            persistent
            square
        >
            <q-card class="tw-shadow-sm bg-orange-8">
                <q-card-section
                    class="tw-flex tw-items-center tw-justify-center tw-py-1 text-center text-blue-grey-10 tw-text-xs"
                    ><q-spinner-ios color="blue-grey-10" class="tw-mr-1" /><span
                        >Network Error - Trying to Reconnect</span
                    ></q-card-section
                >
            </q-card>
        </q-dialog>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { mapGetters, mapMutations } from "vuex";
import LeftBar from "src/components/subscriber/side-panel/LeftBar.vue";
import RightBar from "src/components/subscriber/side-panel/RightBar.vue";

import * as _l from "lodash";
import EcAvatar from "src/components/common/EcAvatar.vue";
import StoreDebug from "src/components/debug/StoreDebug.vue";
import helpers from "boot/helpers/helpers";
import Conversation from "src/store/models/Conversation";
import ConversationSession from "src/store/models/ConversationSession";
import SocketSession from "src/store/models/SocketSession";
import Message from "src/store/models/Message";
import User from "src/store/models/User";
import ChatDepartment from "src/store/models/ChatDepartment";
import { Query } from "@vuex-orm/core";
import MessageAttachment from "src/store/models/MessageAttachment";

declare global {
    interface Window {
        exonchat_whmcs_info: any;
        exonChat: any;
    }
}

export default defineComponent({
    name: "MainLayout",
    components: { StoreDebug, LeftBar, RightBar, EcAvatar },
    data(): any {
        return {
            domReady: false,
            leftDrawer: true,
            rightDrawer: false,
            socket: null,

            sesId: null,
            socketToken: null,

            convIds: [],

            typingHandler: null,
            mobileData: true,
            bluetooth: true,

            usersAvatarLoading: false,

            chatRequestSoundLoop: false,

            newChatTimeout: null,
            newConversationInfo: {},

            qPageSize: {
                width: 100,
                height: 100,
            },

            socketConnectError: null,

            notificationDisabledWarning: false,
        };
    },

    setup() {
        const miniMode = ref(false);

        return { miniMode };
    },

    computed: {
        // ...mapGetters('socket', ['handshake']),
        ...mapGetters({
            profile: "auth/profile",
            chatUsers: "chat/chatUsers",
            conversations: "chat/conversations",
            globalBgColor: "setting_ui/globalBgColor",
            rightBarState: "setting_ui/rightBarState", // its a mistake to store & get from there
            myChatTransferRequests: "chat/myChatTransferRequests",
        }),

        myChatTransferRequest(): any {
            return this.myChatTransferRequests?.length ? this.myChatTransferRequests[0] : {};
        },

        conversationInfo(): any {
            if (this.$route.name !== "chats" || !this.$route.params.conv_id) return {};

            return this.$store.getters["chat/conversationInfo"](this.$route.params.conv_id);
        },

        currentRouteName() {
            return this.$route.name;
        },

        rightDrawerVisible() {
            if (this.rightBarState.visible && this.rightBarState.mode) {
                if (this.$route.name !== "chats" && this.rightBarState.mode === "client_info") {
                    return false;
                }

                if (this.$route.name === "chats" && this.rightBarState.mode === "client_info") {
                    const conv: any = this.conversations[this.$route.params.conv_id];

                    if (!conv) return false;

                    return !conv.users_only;
                }

                return true;
            }

            return false;
        },

        conversationConnectedUsers(): any {
            if (this.newConversationInfo) {
                return this.$store.getters["chat/conversationConnectedUsers"](this.newConversationInfo.id);
            }

            return [];
        },

        tempStore(): any {
            return {
                conversations: Conversation.query()
                    .with(["conversation_sessions.*", "messages", "chat_department"])
                    .get(),
                conversation_sessions: ConversationSession.query().withAll().get(),
                socket_sessions: SocketSession.query().withAll().get(),
                chat_departments: ChatDepartment.query().withAll().get(),
                messages: Message.query().with(["conversation", "socket_session"]).get(),
                users: User.query().withAll().get(),
            };
        },
    },

    async mounted() {
        // console.log('main layout mounted');

        if (this.profile.id) {
            this.openChatPanelBoxForTest();

            await this.socketInitialize();

            this.firePageVisibilityListener();
        }

        this.domReady = true;

        if (this.currentRouteName === "chats") {
            this.rightDrawer = true;
        }

        this.$store.dispatch("setting_ui/getUiSetting");

        // its now only for check logout from other tab
        window.addEventListener("storage", (event) => {
            // !event.key means clear all key fire
            if (!event.key || (event.key === "exonchat_token" && !event.newValue)) {
                this.mutateAuthToLogout(); // it's also for update state
                this.$router.push({ name: "login" });
            }
        });

        this.$emitter.on("user_socket_token_timeout", () => {
            this.$store.dispatch("auth/logOut");
        });

        if (Notification.permission === "default" && !localStorage.getItem("ec_notification_hide_warning")) {
            this.notificationDisabledWarning = true;
        }
    },

    // hit update profile
    // 160. then fire event "ec_updated_socket_room_info"
    // listen event "ec_updated_socket_room_info_res" => {
    // 148.emit "ec_get_logged_users"
    //}

    methods: {
        ...mapMutations({
            mutateAuthToLogout: "auth/logOut",
            updateRightDrawerState: "setting_ui/updateRightDrawerState",
        }),

        updateQPageSizeInfo(size: any) {
            this.qPageSize = size;
        },

        getAllUsers() {
            this.$store.dispatch("chat/getAllUsers");
        },

        getUsers(ses_id = null) {
            // if ses_id => check for exist. if not then new user registered
            if (!ses_id || !this.chatUsers?.hasOwnProperty(ses_id)) {
                // console.log('reloading users list');

                this.$store.dispatch("chat/getUsers").then(() => {
                    // get new list first then get online
                    this.$socket.emit("ec_get_logged_users", {});

                    // load all users so that we can load user avatar
                    // this.getAllUsers();
                });
            } else {
                this.$socket.emit("ec_get_logged_users", {});
            }
        },

        async socketInitialize() {
            this.sesId = this.$helpers.getMySocketSessionId();
            this.socketToken = sessionStorage.getItem("ec_user_socket_token");
            // console.log(this.sesId);

            if (!this.sesId) {
                try {
                    const res = await this.$api.post("/socket-sessions", {
                        api_key: this.profile.subscriber.subscriber_secret.api_key,
                        user_id: this.profile.id,
                    });

                    this.sesId = res.data.data.socket_session.id;
                    this.socketToken = res.data.bearerToken;

                    sessionStorage.setItem("ec_user_socket_ses_id", this.sesId);
                    sessionStorage.setItem("ec_user_socket_token", this.socketToken);
                } catch (err: any) {
                    console.log(err);
                }
            }

            if (!this.socketToken) {
                //handle error
                console.log("socket token not found for this sesId");
                return;
            }

            this.$socket.io.opts.query = `token=${this.socketToken}&client_type=user&online_status=${this.profile.online_status}`;

            this.socket = this.$socket.connect();

            this.getUsers();
            this.fireSocketListeners();
            this.reloadForProfileImageLoad();
            this.vuexOrmMutationListener();
            this.$socket.emit("ec_get_logged_users", {});

            // in future handle interval for page visiting update. check visiting time & mutate visiting value
            // so that update reflects cz if a client's net gone or other issue happens visiting value might not change
        },
        fireSocketListeners() {
            this.socket.on("connect", () => {
                console.log(`Your user Connection id is ${this.socket.id}`); // x8WIv7-mJelg7on_ALbx

                this.socketId = this.socket.id;

                if (this.socketConnectError === true && !process.env.DEV) {
                    location.reload();
                }

                this.socketConnectError = null;
            });

            this.socket.on("disconnect", () => {
                console.log("You Are Disconnected"); // undefined

                this.socketId = this.socket.id;
            });

            // successfully sent to client
            this.socket.on("ec_msg_to_user", (res: any) => {
                this.$store.dispatch("chat/storeMessage", res);
                console.log("from ec_msg_to_user", res);
            });

            // get msg from me & also from other users connected with this conv.
            // me msg will be used for my other tabs update
            this.socket.on("ec_msg_from_user", (res: any) => {
                res.socket_event = "ec_msg_from_user";

                this.$store.dispatch("chat/storeMessage", res);

                this.$emitter.emit(`new_message_from_user_${res.conversation.id}`, res);

                console.log("from ec_msg_from_user", res);
            });

            this.socket.on("ec_msg_from_client", (res: any) => {
                res.socket_event = "ec_msg_from_client";

                this.$store.dispatch("chat/storeMessage", res);

                this.$emitter.emit(`new_message_from_client_${res.conversation.id}`, res);

                console.log("from ec_msg_from_client", res);
            });

            this.socket.on("ec_reply_from_ai", (res: any) => {
                this.$store.dispatch("chat/storeMessage", res);

                console.log("from ec_reply_from_ai", res);
            });

            // handle only other users typing
            this.socket.on("ec_is_typing_from_user", (res: any) => {
                this.$store.dispatch("chat/updateTypingState", res);

                // console.log("from ec_is_typing_from_user", res);
            });

            // this.socket.on('ec_is_typing_to_user', (data: any) => {
            //     console.log('from ec_is_typing_to_user', data);
            // });

            this.socket.on("ec_is_typing_from_client", (res: any) => {
                this.$store.dispatch("chat/updateTypingState", res);

                console.log("from ec_is_typing_from_client", res.msg);
            });

            this.socket.on("ec_conv_initiated_from_user", (data: any) => {
                console.log("from ec_conv_initiated_from_user", data);

                this.$emitter.emit("listen_ec_init_conv_from_user", data);
            });

            this.socket.on("ec_conv_initiated_from_client", (res: any) => {
                console.log("from ec_conv_initiated_from_client", res);

                if (res.data.notify) {
                    clearTimeout(this.newChatTimeout);

                    this.newConversationInfo = res.data.conv_data;

                    if (!this.myChatTransferRequests?.length) {
                        // clear before assign for safety
                        clearTimeout(this.newChatTimeout);

                        this.newChatTimeout = setTimeout(() => {
                            this.newConversationInfo = {};
                        }, 1000 * 5);
                    }

                    if (this.profile.online_status === "online") {
                        helpers.notifications().reqOne.play();
                    }
                }

                this.$store.dispatch("chat/storeNewChatFromClient", res.data);
            });

            this.socket.on("ec_is_joined_from_conversation", (res: any) => {
                const convSesInfo = res.data.conv_ses_data;
                convSesInfo.from_chat_transfer_request = res.data.from_chat_transfer_request;

                this.$store.dispatch("chat/updateConvState", convSesInfo);

                console.log("from ec_is_joined_from_conversation", convSesInfo);
            });

            this.socket.on("ec_is_leaved_from_conversation", (res: any) => {
                const convSesInfo = res.data.conv_ses_data;

                this.$store.dispatch("chat/updateConvState", convSesInfo);

                console.log("from ec_is_leaved_from_conversation", convSesInfo);
            });

            this.socket.on("ec_is_closed_from_conversation", (res: any) => {
                const convInfo = res.data.conv_data;

                this.$store.dispatch("chat/updateConvStateToClosed", convInfo);

                console.log("from ec_is_closed_from_conversation", convInfo);
            });

            this.socket.on("ec_conversation_session_updated", (res: any) => {
                // handle this emit for all conversation session update like join left etc also. life will be easier
                this.$store.dispatch("chat/updateConversationSession", res.data.conversation_session);

                // console.log("from ec_conversation_session_updated", res);
            });

            // emitting this socket into mount
            // get online users list
            this.socket.on("ec_logged_users_res", (data: any) => {
                this.$store.dispatch("chat/updateOnlineUsers", data.users);
                console.log("from ec_logged_users_res", data);
            });

            this.socket.on("ec_user_logged_in", (data: any) => {
                // used if a new user registered but not listed yet
                this.getUsers(data.ses_id);

                console.log(`from ec_user_logged_in ${data}`);
            });

            this.socket.on("ec_user_logged_out", (data: any) => {
                setTimeout(() => {
                    // this.getUsers(); // currently no need cz we are getting this at first
                    this.$socket.emit("ec_get_logged_users", {});
                    console.log(`from ec_user_logged_out ${data}`);
                }, 3000);
            });

            this.socket.on("ec_from_api_events", (res: any) => {
                // res = {action: [logout, others_are_coming], msg: res.msg || null, reason: res.reason || null}
                // reason = why this type sent
                // msg = if you want to show notification or taster
                // type = what type of action need

                // in future handle if needed. if client logs by whmcs or other supported app
                // then sesInfo will change & receive an emit
                // then convs search by clients ses then update socket session info

                if (res.action === "logout") {
                    this.$q.notify({
                        position: "top",
                        progress: true,
                        message: res.msg,
                        color: "orange",
                        timeout: 5000,
                        badgeClass: "hidden",
                    });

                    setTimeout(() => {
                        this.logout();
                    }, 6000);
                }

                console.log("from ec_from_api_events1", res);
            });

            this.socket.on("ec_page_visit_info_from_client", (res: any) => {
                this.$store.dispatch("visitor/updateVisitor", res);

                // console.log('from ec_page_visit_info_from_client', res);
            });

            this.socket.on("ec_apps_notification", (res: any) => {
                if (res.app === "whmcs" && res.type === "ticket") {
                    const ticket = res.data;

                    this.$q.notify({
                        group: 1,
                        message: `Ticket#${ticket.tid} From:${ticket.email}`,
                        caption: ticket.subject,
                        progress: true,
                        multiLine: true,
                        icon: "confirmation_number",
                        color: "grey-10",
                        textColor: "white",
                        position: "top-right",
                        classes: "tw-w-80 tw-p-2",
                        timeout: 20000,
                        badgeClass: "hidden",
                        actions: [
                            {
                                icon: "close",
                                color: "orange",
                                size: "xs",
                            },
                        ],
                    });
                }
                console.log("from ec_apps_notification", res);
            });

            this.socket.on("ec_conversation_rated_from_client", (res: any) => {
                this.$store.dispatch("chat/updateConvRating", res);
                console.log("from ec_conversation_rated_from_client", res);
            });

            this.socket.on("ec_chat_transfer", (data: any) => {
                if (data.from === "own" && data.status === "success") {
                    this.$helpers.showSuccessNotification(this, "Chat transfer request sent");
                    this.$emitter.emit(`ec_chat_transfer_res_${data.conv_id}`, data);
                    return;
                }

                this.$store.dispatch("chat/updateConvSesInfo", {
                    payload_type: "conversation_session", // later set by action type
                    action: data.action,
                    conv_id: data.conv_id,
                    conv_ses_obj: data.conv_ses_obj,
                    original_payload: data,
                });

                console.log("from ec_chat_transfer", data);
            });

            this.socket.on("ec_updated_socket_room_info_res", (data: any) => {
                this.$store.dispatch("chat/updateOnlineUsers", [
                    { online_status: data.data.online_status, ses_id: data.ses_id, db_change: true },
                ]);

                this.$store.dispatch("auth/updateAuthInfo");

                this.socket.emit("ec_get_logged_users", {});
                console.log("from ec_updated_socket_room_info_res", data);
            });

            this.socket.on("ec_error", (data: any) => {
                console.log("from ec_error", data);

                if (data.step === "ec_chat_transfer") {
                    this.$q.notify({
                        color: "warning",
                        textColor: "black",
                        message: data.reason.message ? data.reason.message : data.reason,
                        position: "top",
                        badgeClass: "hidden",
                    });
                }

                if (data.type === "auth") {
                    this.logout();
                }

                // check if not then new event
                this.$emitter.emit(`listen_error_${data.step}`, data);
            });

            this.socket.on("connect_error", (err: any) => {
                console.log(`connect_error due to ${err.message}`);
                this.socketConnectError = true;
            });
        },

        takeThisChat(convData: any, fromChatTransferRequest = false) {
            // its for both. clear before safety
            clearTimeout(this.newChatTimeout);

            if (fromChatTransferRequest && this.newConversationInfo.id) {
                this.newChatTimeout = setTimeout(() => {
                    this.newConversationInfo = {};
                }, 1000 * 5);
            }

            if (!fromChatTransferRequest) {
                this.newConversationInfo = {};
            }

            window.socketInstance.emit("ec_join_conversation", {
                conv_id: convData.id,
                chat_transfer_request_from: fromChatTransferRequest
                    ? convData.transfer_request_info?.info?.transfer_from
                    : null,
            });

            this.$router.push(`/chats/${convData.id}`);
        },

        rejectChatRequest(convData: any) {
            console.log(convData);
            this.$socket.emit("ec_chat_transfer", {
                conv_id: convData.id,
                action: "reject",
            });
        },

        openChatPanelBoxForTest() {
            const ls = window.localStorage.getItem("chat_panel_box_for_test");

            if (ls && ls === "true") {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const self = this;

                // setTimeout for testing
                setTimeout(() => {
                    console.log("init client logged in id");

                    // window.exonChat.whmcs_info = { clientId: "7", clientEmail: "abdullah.ssc13@gmail.com" };
                    window.exonChat.whmcs_info = { clientId: "", clientEmail: "" };
                }, 20000);

                window.exonChat = {};
                (function (d, s, id) {
                    let js: any,
                        fjs: any = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s);
                    js.id = id;
                    js.setAttribute("data-widget-id", self.profile.subscriber.subscriber_secret.api_key);
                    js.src = `${location.origin}/assets/js/web-chat/web-chat.js`; // for other site dont use location.origin
                    fjs.parentNode.insertBefore(js, fjs);
                })(document, "script", "exhonchat-chat-script");
            }
        },

        reloadForProfileImageLoad() {
            // clonedeep needed cz we are updating profiles image
            this.$store.dispatch("setting_profile/reloadProfileImage", _l.cloneDeep(this.profile));
        },

        logout() {
            this.$store
                .dispatch("auth/logOut")
                .then(() => {
                    this.$q.notify({
                        color: "positive",
                        message: "Logout Successful",
                        position: "top",
                        badgeClass: "hidden",
                    });

                    if (this.socket) {
                        this.socket.close();
                    }

                    this.$socket.close();

                    this.$router.push({ name: "login" });
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },

        superviseChat(convId: any) {
            this.$router.push(`/chats/${convId}`);

            this.newConversationInfo = {};
        },

        firePageVisibilityListener() {
            // Warn if the browser doesn't support addEventListener or the Page Visibility API
            if (typeof document.addEventListener === "undefined" || document.hidden === undefined) {
                console.log(
                    "This check requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API."
                );
            } else {
                // Handle page visibility change
                document.addEventListener("visibilitychange", this.handlePageVisibilityChange, false);

                localStorage.setItem("ec_current_visiting_tab", this.$browser_tab_id);
            }
        },

        handlePageVisibilityChange() {
            if (document.visibilityState === "visible") {
                localStorage.setItem("ec_current_visiting_tab", this.$browser_tab_id);
                localStorage.removeItem("ec_not_in_tabs");
            } else {
                // ec_last_visited_tab will help for now to show notification from a tab only. not from every tab
                localStorage.setItem("ec_last_visited_tab", this.$browser_tab_id);
                localStorage.setItem("ec_not_in_tabs", "true");
            }
        },

        vuexOrmMutationListener() {
            Query.on("afterCreate", (model: any) => {
                if (model instanceof MessageAttachment) {
                    if (!model.loaded && !model.src) {
                        MessageAttachment.update({
                            where: model.id,
                            data: { loaded: true, status: "done" },
                        });

                        window.socketSessionApi
                            .get(`attachments/${model.id}`, {
                                responseType: "arraybuffer",
                            })
                            .then((imgRes: any) => {
                                const src = URL.createObjectURL(
                                    new Blob([imgRes.data], { type: imgRes.headers["content-type"] })
                                );

                                MessageAttachment.update({
                                    where: model.id,
                                    data: { src: src },
                                });
                            })
                            .catch();
                    }
                }
            });
        },

        requestNotificationPermission() {
            if (Notification.permission === "default") {
                Notification.requestPermission().then((permission) => {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                        new Notification("New message from ExonHost Live Chat", {
                            body: "Nice, notifications are enabled! ",
                        });
                    }

                    this.hideNotificationDisabledWarning();
                });
            }
        },
        hideNotificationDisabledWarning() {
            this.notificationDisabledWarning = false;

            localStorage.setItem("ec_notification_hide_warning", "true");
        },
    },

    beforeRouteUpdate() {
        if (this.rightBarState?.mode || this.rightBarState.mode === "conversation") {
            this.updateRightDrawerState({ mode: "client_info", visible: true });
        }
    },

    watch: {
        // if you need to load avatars everywhere then watch conversation n use same way in the layout template
        conversations: {
            handler: async function () {
                // console.log('conversations watcher started');

                if (this.usersAvatarLoading) return;

                this.usersAvatarLoading = true;

                if (this.conversations) {
                    for (const convObj of Object.values(this.conversations)) {
                        const conv: any = convObj;
                        const tempArray: any = { conv_id: conv.id, srcs: [] };

                        for (const convSes of conv.sessions) {
                            if (convSes.socket_session.user) {
                                // I can send attachment from db but for that I have to send from all the query
                                // I have to get the image so y give hard time to api so here check that
                                if (
                                    convSes.socket_session.user?.user_meta?.attachment_id &&
                                    !convSes.socket_session.user?.user_meta?.src
                                ) {
                                    try {
                                        const imgRes = await this.$api.get(
                                            `attachments/${convSes.socket_session.user.user_meta.attachment_id}`,
                                            {
                                                responseType: "arraybuffer",
                                            }
                                        );

                                        tempArray.srcs.push({
                                            conv_ses_id: convSes.id,
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

                        if (tempArray.srcs.length) {
                            this.$store.commit("chat/updateConversationUserAvatar", tempArray);
                        }
                    }
                }

                this.usersAvatarLoading = false;
            },
            deep: true,
            immediate: true,
        },

        newConversationInfo: {
            handler: function (newVal, oldVal) {
                if (newVal?.id && (!oldVal?.id || newVal.id !== oldVal.id)) {
                    window.api
                        .get(
                            `/conversations/client-previous-conversations-count?email=${this.newConversationInfo.conversation_sessions[0].socket_session.init_email}`
                        )
                        .then((res: any) => {
                            this.newConversationInfo.prev_chat_count = +res.data.count - 1;
                        })
                        .catch((e: any) => {
                            e;
                        });
                }
            },
            immediate: true,
        },
    },

    unmounted() {
        //its safe then sorry
        // console.log('calling unmounted from main layout');

        const dom = document.getElementById("exhonchat-container");

        if (dom) {
            dom.parentNode?.removeChild(dom);
        }

        if (this.socket) {
            this.socket.close();
        }

        this.$emitter.all.clear();
    },
});
</script>

<style lang="scss">
body {
    font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif !important;
}

#network-error-dialog {
    .q-dialog__inner {
        padding: 0;

        & > div {
            box-shadow: 0 1px 0 -1px rgb(0 0 0 / 20%), 0 1px 0 rgb(0 0 0 / 14%), 0 1px 5px rgb(0 0 0 / 12%);
        }
    }
}

.active-btn {
    background: #5f7079 !important;
}

.custom-border-top {
    border-top: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
