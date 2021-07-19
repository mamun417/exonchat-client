<template>
    <q-layout view="hHh LpR fff" class="bg-white">
        <template v-if="domReady">
            <q-drawer
                :model-value="true"
                class="tw-shadow-lgr"
                side="left"
                breakpoint="xs"
                :width="!leftDrawer ? 65 : 300"
                persistent
                show-if-above
            >
                <div class="tw-flex tw-h-full">
                    <div
                        id="left-bar-menu"
                        class="tw-w-16 tw-flex tw-flex-col tw-justify-between tw-py-3 text-white"
                        :class="[`${globalBgColor}-8`]"
                    >
                        <div class="tw-flex tw-flex-col tw-items-center">
                            <q-icon
                                name="fas fa-headset"
                                class="tw-mb-2 tw-shadow-lg tw-rounded-full tw-p-1"
                                size="lg"
                            />

                            <ec-avatar
                                :image_src="profile?.user_meta?.attachment?.src"
                                :name="profile?.user_meta?.display_name"
                                icon_color="text-white"
                                class="cursor-pointer tw-my-3"
                                @click="$router.push({ name: 'settings_profile' })"
                            >
                                <q-tooltip :offset="[10, 10]">Profile</q-tooltip>
                            </ec-avatar>

                            <!--                            <q-btn icon="question_answer" @click="leftDrawer = !leftDrawer" flat size="18px">-->
                            <!--                                <q-tooltip :offset="[10, 10]">Interactions</q-tooltip>-->
                            <!--                            </q-btn>-->

                            <q-btn icon="question_answer" :to="{ name: 'chat-interaction' }" flat size="18px">
                                <q-tooltip :offset="[10, 10]">Interactions</q-tooltip>
                            </q-btn>

                            <q-btn icon="dynamic_feed" :to="{ name: 'visitors' }" flat size="18px">
                                <q-tooltip :offset="[10, 10]">Visitors</q-tooltip>
                            </q-btn>

                            <q-btn icon="history" :to="{ name: 'chat-history' }" flat size="18px">
                                <q-tooltip :offset="[10, 10]">Chat History</q-tooltip>
                            </q-btn>

                            <q-btn icon="3p" :to="{ name: 'offline-chat-req' }" flat size="18px">
                                <q-tooltip :offset="[10, 10]">Offline Chat Requests</q-tooltip>
                            </q-btn>
                        </div>

                        <div class="tw-flex tw-gap-1 tw-flex-col tw-items-center">
                            <q-btn icon="info" flat>
                                <q-tooltip :offset="[10, 10]">Developer debug</q-tooltip>

                                <q-menu class="tw-p-2" style="min-width: 350px">
                                    <store-debug></store-debug>
                                </q-menu>
                            </q-btn>

                            <!-- <q-btn class="tw-mr-2" :icon="rightDrawer ? 'menu_open' : 'menu'" @click="toggleRightDrawer" flat /> -->
                            <q-btn icon="settings" :to="{ name: 'settings' }" flat>
                                <q-tooltip :offset="[10, 10]">Ui settings</q-tooltip>
                            </q-btn>

                            <q-btn icon="logout" @click="logout" flat>
                                <q-tooltip :offset="[10, 10]">Log Out</q-tooltip>
                            </q-btn>
                        </div>
                    </div>
                    <left-bar v-show="leftDrawer"></left-bar>
                </div>
            </q-drawer>

            <q-drawer
                :model-value="rightDrawerVisible"
                class="tw-shadow-lgl"
                side="right"
                breakpoint="xs"
                :width="this.rightBarState.mode === 'conversation' ? 340 : 260"
                persistent
            >
                <right-bar></right-bar>
            </q-drawer>

            <q-page-container>
                <q-page class="tw-flex">
                    <router-view class="tw-w-full tw-p-3 bg-green-1" :key="$route.fullPath"></router-view>
                </q-page>
            </q-page-container>
        </template>

        <q-inner-loading :showing="!domReady">
            <q-spinner-facebook size="50px" :color="globalBgColor" />
        </q-inner-loading>

        <!--        don't remove these blocks-->
        <div v-if="false">
            <!--            &lt;!&ndash; add style pointer event none for accessing the underlying parent elements &ndash;&gt;-->
            <!--            &lt;!&ndash; and also add opacity if user moved to parent &ndash;&gt;-->
            <!--            <div class="tw-fixed tw-bottom-0" style="z-index: 99999; right: 75px">-->
            <!--                <q-card-->
            <!--                    class="bg-white shadow-5 tw-flex tw-flex-col"-->
            <!--                    style="width: 300px"-->
            <!--                    :style="{ height: '!mini' ? '450px' : 'auto' }"-->
            <!--                >-->
            <!--                    &lt;!&ndash; change bg color by status &ndash;&gt;-->
            <!--                    <q-card-section class="row no-wrap bg-green items-center tw-p-0">-->
            <!--                        <q-item class="">-->
            <!--                            <q-item-section avatar>-->
            <!--                                <q-avatar size="lg">-->
            <!--                                    <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" />-->

            <!--                                    &lt;!&ndash; <q-badge label="." color="green" text-color="green" rounded floating /> &ndash;&gt;-->
            <!--                                </q-avatar>-->
            <!--                            </q-item-section>-->

            <!--                            <q-item-section class="tw-w-full">-->
            <!--                                <q-item-label class="text-weight-bold text-white tw-text-md">Hasan</q-item-label>-->
            <!--                                &lt;!&ndash; <q-item-label caption>-->
            <!--                                    <q-badge color="green" class="tw-px-2 tw-py-1">Active</q-badge>-->
            <!--                                </q-item-label> &ndash;&gt;-->
            <!--                            </q-item-section>-->
            <!--                        </q-item>-->

            <!--                        <q-space />-->

            <!--                        <q-btn class="tw-px-2" icon="more_horiz" color="green" unelevated />-->
            <!--                        <q-btn-->
            <!--                            class="tw-px-2"-->
            <!--                            :icon="!'mini' ? 'arrow_drop_up' : 'arrow_drop_down'"-->
            <!--                            color="green"-->
            <!--                            unelevated-->
            <!--                        />-->
            <!--                        &lt;!&ndash; <q-btn class="tw-mr-2 tw-px-2" icon="close" color="white" flat /> &ndash;&gt;-->
            <!--                    </q-card-section>-->

            <!--                    <q-card-section v-if="'!mini'" class="tw-p-0 tw-flex-1 tw-flex tw-flex-col">-->
            <!--                        <q-scroll-area-->
            <!--                            @scroll="handleScroll"-->
            <!--                            ref="msgScrollArea"-->
            <!--                            class="tw-flex-1 tw-px-1 tw-py-2"-->
            <!--                            style="height: 1px"-->
            <!--                            :bar-style="{-->
            <!--                                background: '#60A5FA',-->
            <!--                                width: '4px',-->
            <!--                                opacity: 0.2,-->
            <!--                                borderRadius: '10px',-->
            <!--                            }"-->
            <!--                            :thumb-style="{-->
            <!--                                borderRadius: '9px',-->
            <!--                                backgroundColor: '#60A5FA',-->
            <!--                                width: '4px',-->
            <!--                                opacity: 0.7,-->
            <!--                            }"-->
            <!--                            :content-style="{}"-->
            <!--                        >-->
            <!--                        </q-scroll-area>-->

            <!--                        <div class="tw-w-full tw-flex tw-px-1 tw-self-end">-->
            <!--                            <q-btn flat color="green" icon="attachment"></q-btn>-->
            <!--                            <q-btn flat color="green" icon="mood"></q-btn>-->
            <!--                            <q-input-->
            <!--                                debounce="0"-->
            <!--                                placeholder="Write Message..."-->
            <!--                                color="green-8"-->
            <!--                                class="tw-flex-auto"-->
            <!--                                autogrow-->
            <!--                                borderless-->
            <!--                                dense-->
            <!--                            ></q-input>-->
            <!--                            <q-btn icon="send" flat color="green-8"></q-btn>-->
            <!--                        </div>-->
            <!--                    </q-card-section>-->

            <!--                    <q-badge v-if="!'!mini'" label="5" color="orange" text-color="black" rounded floating />-->
            <!--                </q-card>-->
            <!--            </div>-->

            <!--            <q-fab-->
            <!--                color="green"-->
            <!--                icon="chat"-->
            <!--                direction="up"-->
            <!--                class="tw-fixed tw-bottom-4"-->
            <!--                style="z-index: 99999; right: 10px"-->
            <!--                persistent-->
            <!--            >-->
            <!--                <q-fab-action-->
            <!--                    v-for="(a, i) in [1, 2, 3]"-->
            <!--                    :key="i"-->
            <!--                    padding="1px"-->
            <!--                    label="a new message"-->
            <!--                    anchor="start"-->
            <!--                    color="green"-->
            <!--                >-->
            <!--                    <q-avatar><img :src="`https://cdn.quasar.dev/img/avatar${i + 1}.jpg`" /></q-avatar>-->
            <!--                </q-fab-action>-->
            <!--            </q-fab>-->
        </div>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import LeftBar from 'src/components/subscriber/side-panel/LeftBar.vue';
import RightBar from 'src/components/subscriber/side-panel/RightBar.vue';

import * as _l from 'lodash';
import EcAvatar from 'src/components/common/EcAvatar.vue';
import StoreDebug from 'src/components/debug/StoreDebug.vue';

declare global {
    interface Window {
        exonChat: any;
    }
}

export default defineComponent({
    name: 'MainLayout',
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
        };
    },

    setup() {
        const miniMode = ref(false);

        return { miniMode };
    },

    computed: {
        // ...mapGetters('socket', ['handshake']),
        ...mapGetters({
            profile: 'auth/profile',
            chatUsers: 'chat/chatUsers',
            conversations: 'chat/conversations',
            globalBgColor: 'setting_ui/globalBgColor',
            rightBarState: 'setting_ui/rightBarState', // its a mistake to store & get from there
        }),

        currentRouteName() {
            return this.$route.name;
        },

        rightDrawerVisible() {
            if (this.rightBarState.visible && this.rightBarState.mode) {
                if (this.$route.name !== 'chats' && this.rightBarState.mode === 'client_info') {
                    return false;
                }

                if (this.$route.name === 'chats' && this.rightBarState.mode === 'client_info') {
                    const conv: any = this.conversations[this.$route.params.conv_id];

                    if (!conv) return false;

                    return !conv.users_only;
                }

                return true;
            }

            return false;
        },
    },

    async mounted() {
        // console.log('main layout mounted');

        if (this.profile.id) {
            this.openChatPanelBoxForTest();

            await this.socketInitialize();
        }

        this.domReady = true;

        if (this.currentRouteName === 'chats') {
            this.rightDrawer = true;
        }

        this.$store.dispatch('setting_ui/getUiSetting');
    },

    // hit update profile
    // 160. then fire event "ec_updated_socket_room_info"
    // listen event "ec_updated_socket_room_info_res" => {
    // 148.emit "ec_get_logged_users"
    //}

    methods: {
        ...mapMutations({ toggleRightDrawer: 'setting_ui/toggleRightDrawer' }),

        getAllUsers() {
            this.$store.dispatch('chat/getAllUsers');
        },

        getUsers(ses_id = null) {
            // if ses_id => check for exist. if not then new user registered
            if (!ses_id || !this.chatUsers?.hasOwnProperty(ses_id)) {
                // console.log('reloading users list');

                this.$store.dispatch('chat/getUsers').then(() => {
                    // get new list first then get online
                    this.$socket.emit('ec_get_logged_users', {});

                    // load all users so that we can load user avatar
                    // this.getAllUsers();
                });
            } else {
                this.$socket.emit('ec_get_logged_users', {});
            }
        },

        async socketInitialize() {
            this.sesId = this.$helpers.getMySocketSessionId();
            this.socketToken = sessionStorage.getItem('ec_user_socket_token');
            console.log(this.sesId);

            if (!this.sesId) {
                try {
                    const res = await this.$api.post('/socket-sessions', {
                        api_key: this.profile.subscriber.api_key,
                        user_id: this.profile.id,
                    });

                    this.sesId = res.data.data.socket_session.id;
                    this.socketToken = res.data.bearerToken;

                    sessionStorage.setItem('ec_user_socket_ses_id', this.sesId);
                    sessionStorage.setItem('ec_user_socket_token', this.socketToken);
                } catch (err: any) {
                    console.log(err);
                }
            }

            if (!this.socketToken) {
                //handle error
                console.log('socket token not found for this sesId');
                return;
            }

            this.$socket.io.opts.query = `token=${this.socketToken}&client_type=user&online_status=${this.profile.online_status}`;

            this.socket = this.$socket.connect();

            this.getUsers();
            this.fireSocketListeners();
            this.reloadForProfileImageLoad();
            this.$socket.emit('ec_get_logged_users', {});

            // in future handle interval for page visiting update. check visiting time & mutate visiting value
            // so that update reflects cz if a client's net gone or other issue happens visiting value might not change
        },
        fireSocketListeners() {
            this.socket.on('connect', () => {
                console.log(`Your user Connection id is ${this.socket.id}`); // x8WIv7-mJelg7on_ALbx

                this.socketId = this.socket.id;
            });

            this.socket.on('disconnect', () => {
                console.log('You Are Disconnected'); // undefined

                this.socketId = this.socket.id;
            });

            // successfully sent to client
            this.socket.on('ec_msg_to_user', (res: any) => {
                this.$store.dispatch('chat/storeMessage', res);
                console.log('from ec_msg_to_user', res);
            });

            // get msg from me & also from other users connected with this conv.
            // me msg will be used for my other tabs update
            this.socket.on('ec_msg_from_user', (res: any) => {
                res.socket_event = 'ec_msg_from_user';

                this.$store.dispatch('chat/storeMessage', res);

                this.$emitter.emit(`new_message_from_user_${res.conversation.id}`, res);

                console.log('from ec_msg_from_user', res);
            });

            this.socket.on('ec_msg_from_client', (res: any) => {
                res.socket_event = 'ec_msg_from_client';

                this.$store.dispatch('chat/storeMessage', res);

                this.$emitter.emit(`new_message_from_client_${res.conversation.id}`, res);

                console.log('from ec_msg_from_client', res);
            });

            this.socket.on('ec_reply_from_ai', (res: any) => {
                this.$store.dispatch('chat/storeMessage', res);

                console.log('from ec_reply_from_ai', res);
            });

            // handle only other users typing
            this.socket.on('ec_is_typing_from_user', (res: any) => {
                this.$store.dispatch('chat/updateTypingState', res);

                console.log('from ec_is_typing_from_user', res);
            });

            // this.socket.on('ec_is_typing_to_user', (data: any) => {
            //     console.log('from ec_is_typing_to_user', data);
            // });

            this.socket.on('ec_is_typing_from_client', (res: any) => {
                this.$store.dispatch('chat/updateTypingState', res);

                console.log('from ec_is_typing_from_client', res.msg);
            });

            this.socket.on('ec_conv_initiated_from_user', (data: any) => {
                console.log('from ec_conv_initiated_from_user', data);

                this.$emitter.emit('listen_ec_init_conv_from_user', data);
            });

            this.socket.on('ec_conv_initiated_from_client', (res: any) => {
                console.log('from ec_conv_initiated_from_client', res);

                this.$store.dispatch('chat/storeNewChatFromClient', res.data);
            });

            this.socket.on('ec_is_joined_from_conversation', (res: any) => {
                const convSesInfo = res.data.conv_ses_data;

                this.$store.dispatch('chat/updateConvState', convSesInfo);

                console.log('from ec_is_joined_from_conversation', convSesInfo);
            });

            this.socket.on('ec_is_leaved_from_conversation', (res: any) => {
                const convSesInfo = res.data.conv_ses_data;

                this.$store.dispatch('chat/updateConvState', convSesInfo);

                console.log('from ec_is_leaved_from_conversation', convSesInfo);
            });

            this.socket.on('ec_is_closed_from_conversation', (res: any) => {
                const convInfo = res.data.conv_data;

                this.$store.dispatch('chat/updateConvStateToClosed', convInfo);

                console.log('from ec_is_closed_from_conversation', convInfo);
            });

            // emitting this socket into mount
            // get online users list
            this.socket.on('ec_logged_users_res', (data: any) => {
                this.$store.dispatch('chat/updateOnlineUsers', data.users);
                console.log('from ec_logged_users_res', data);
            });

            this.socket.on('ec_user_logged_in', (data: any) => {
                // used if a new user registered but not listed yet
                this.getUsers(data.ses_id);

                console.log(`from ec_user_logged_in ${data}`);
            });

            this.socket.on('ec_user_logged_out', (data: any) => {
                setTimeout(() => {
                    // this.getUsers(); // currently no need cz we are getting this at first
                    this.$socket.emit('ec_get_logged_users', {});
                    console.log(`from ec_user_logged_out ${data}`);
                }, 3000);
            });

            this.socket.on('ec_from_api_events', (res: any) => {
                // res = {action: [logout, others_are_coming], msg: res.msg || null, reason: res.reason || null}
                // reason = why this type sent
                // msg = if you want to show notification or taster
                // type = what type of action need

                // in future handle if needed. if client logs by whmcs or other supported app
                // then sesInfo will change & receive an emit
                // then convs search by clients ses then update socket session info

                if (res.action === 'logout') {
                    this.$q.notify({
                        position: 'top',
                        progress: true,
                        message: res.msg,
                        color: 'orange',
                        timeout: 5000,
                    });

                    setTimeout(() => {
                        this.logout();
                    }, 6000);
                }

                console.log('from ec_from_api_events1', res);
            });

            this.socket.on('ec_page_visit_info_from_client', (res: any) => {
                this.$store.dispatch('visitor/updateVisitor', res);

                // console.log('from ec_page_visit_info_from_client', res);
            });

            this.socket.on('ec_apps_notification', (res: any) => {
                if (res.app === 'whmcs' && res.type === 'ticket') {
                    const ticket = res.data;

                    this.$q.notify({
                        group: 1,
                        message: `Ticket#${ticket.tid} From:${ticket.email}`,
                        caption: ticket.subject,
                        progress: true,
                        multiLine: true,
                        icon: 'confirmation_number',
                        color: 'grey-10',
                        textColor: 'white',
                        position: 'top-right',
                        classes: 'tw-w-80 tw-p-2',
                        timeout: 20000,
                        badgeClass: 'hidden',
                        actions: [
                            {
                                icon: 'close',
                                color: 'orange',
                                size: 'xs',
                            },
                        ],
                    });
                }
                console.log('from ec_apps_notification', res);
            });

            this.socket.on('ec_conversation_rated_from_client', (res: any) => {
                this.$store.dispatch('chat/updateConvRating', res);
                console.log('from ec_conversation_rated_from_client', res);
            });

            this.socket.on('ec_chat_transfer', (data: any) => {
                new Audio('assets/sound/notification/notification-request-001.mp3').play();

                let actions = [
                    {
                        icon: 'send',
                        color: 'white',
                        size: 'xs',
                        handler: () => {
                            window.router.push(`/chats/${data.conv_id}`);
                        },
                    },
                ];

                if (data.from === 'client') {
                    actions.push({
                        icon: 'clear',
                        color: 'white',
                        size: 'xs',
                        handler: () => {
                            //
                        },
                    });
                }

                this.$q.notify({
                    group: `${data.conv_id}_notify`,
                    message:
                        data.from === 'client'
                            ? data.reason
                            : `Chat transfer request from ${data.agent_info.user_meta.display_name}`,
                    caption: 'Click send button to open this conversation',
                    progress: true,
                    multiLine: true,
                    icon: 'announcement',
                    color: 'grey-8',
                    textColor: 'white',
                    position: 'top-right',
                    classes: 'tw-w-80 tw-p-2',
                    timeout: 1000 * 60, // 1 min
                    badgeClass: 'hidden',
                    actions,
                });

                console.log('from ec_chat_transfer_from_user', data);
            });

            this.socket.on('ec_updated_socket_room_info_res', (data: any) => {
                this.$store.dispatch('chat/updateOnlineUsers', [
                    { online_status: data.data.online_status, ses_id: data.ses_id, db_change: true },
                ]);

                this.socket.emit('ec_get_logged_users', {});
                console.log('from ec_updated_socket_room_info_res', data);
            });

            this.socket.on('ec_error', (data: any) => {
                console.log('from ec_error', data);

                if (data.step === 'ec_chat_transfer_from_user') {
                    this.$q.notify({
                        color: 'warning',
                        textColor: 'black',
                        message: data.reason.message ? data.reason.message : data.reason,
                        position: 'top',
                    });
                }

                // check if not then new event
                this.$emitter.emit(`listen_error_${data.step}`, data);
            });
        },

        openChatPanelBoxForTest() {
            const ls = window.localStorage.getItem('chat_panel_box_for_test');

            if (ls && ls === 'true') {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const self = this;

                window.exonChat = function () {
                    return {};
                };
                (function (d, s, id) {
                    let js: any,
                        fjs: any = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s);
                    js.id = id;
                    js.setAttribute('data-widget-id', self.profile.subscriber.api_key);
                    js.src = `${location.origin}/assets/js/web-chat/web-chat.js`; // for other site dont use location.origin
                    fjs.parentNode.insertBefore(js, fjs);
                })(document, 'script', 'exhonchat-chat-script');
            }
        },

        reloadForProfileImageLoad() {
            // clonedeep needed cz we are updating profiles image
            this.$store.dispatch('setting_profile/reloadProfileImage', _l.cloneDeep(this.profile));
        },

        logout() {
            this.$store
                .dispatch('auth/logOut')
                .then(() => {
                    this.$q.notify({
                        color: 'positive',
                        message: 'Logout Successful',
                        position: 'top',
                    });

                    if (this.socket) {
                        this.socket.close();
                    }

                    this.$socket.close();
                    this.$router.push({ name: 'login' });
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },
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
                                                responseType: 'arraybuffer',
                                            }
                                        );

                                        tempArray.srcs.push({
                                            conv_ses_id: convSes.id,
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

                        if (tempArray.srcs.length) {
                            this.$store.commit('chat/updateConversationUserAvatar', tempArray);
                        }
                    }
                }

                this.usersAvatarLoading = false;
            },
            deep: true,
            immediate: true,
        },
    },

    unmounted() {
        //its safe then sorry
        // console.log('calling unmounted from main layout');

        const dom = document.getElementById('exhonchat-container');

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
