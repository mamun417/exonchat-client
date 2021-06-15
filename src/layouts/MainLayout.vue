<template>
    <q-layout view="hHh LpR fff" class="bg-white">
        <q-header :class="[`${globalBgColor}-8`]" elevated>
            <q-toolbar class="tw-px-8">
                <q-btn icon="mediation" flat />
                <q-btn :icon="leftDrawer ? 'menu_open' : 'menu'" @click="leftDrawer = !leftDrawer" flat />
                <q-space />

                <q-btn icon="insert_comment" :to="{ name: 'chat-templates' }" flat>
                    <q-tooltip :offset="[10, 10]">Chat templates</q-tooltip>
                </q-btn>

                <q-btn icon="smart_toy" :to="{ name: 'intents' }" flat>
                    <q-tooltip :offset="[10, 10]">Intents</q-tooltip>
                </q-btn>

                <q-btn icon="record_voice_over" :to="{ name: 'speech-recognition' }" flat>
                    <q-tooltip :offset="[10, 10]">Speech recognitions</q-tooltip>
                </q-btn>

                <q-btn icon="account_tree" :to="{ name: 'departments' }" flat>
                    <q-tooltip :offset="[10, 10]">Departments</q-tooltip>
                </q-btn>

                <q-btn icon="forum" :to="{ name: 'clients-conversations' }" flat size="lg">
                    <q-tooltip :offset="[10, 10]">Clients conversations</q-tooltip>
                </q-btn>

                <q-btn icon="dynamic_feed" :to="{ name: 'visitors' }" flat>
                    <q-tooltip :offset="[10, 10]">Visitors</q-tooltip>
                </q-btn>

                <q-btn v-if="profile?.role?.slug === 'admin'" icon="people" :to="{ name: 'users' }" flat>
                    <q-tooltip :offset="[10, 10]">Users</q-tooltip>
                </q-btn>

                <q-btn
                    v-if="profile?.role?.slug === 'admin'"
                    icon="person_add"
                    :to="{ name: 'users-invitations' }"
                    flat
                >
                    <q-tooltip :offset="[10, 10]">User Invitations</q-tooltip>
                </q-btn>

                <q-btn icon="settings" :to="{ name: 'settings_ui' }" flat>
                    <q-tooltip :offset="[10, 10]">Ui settings</q-tooltip>
                </q-btn>

                <q-btn icon="info" flat>
                    <q-tooltip :offset="[10, 10]">Developer debug</q-tooltip>

                    <q-menu class="tw-p-2" style="min-width: 350px">
                        <div
                            class="tw-p-2 tw-border-1 tw-shadow-md"
                            v-for="(m, i) in Object.keys($store._modules.root.state)"
                            :key="i"
                        >
                            <div class="text-green text-center">{{ m }}</div>
                            <div class="tw-my-2" v-for="(mv, k) in Object.keys($store._modules.root.state[m])" :key="k">
                                <span>
                                    <pre>{{ mv }}</pre>
                                </span>
                                <span class="tw-mx-2">=></span>
                                <span>
                                    <pre>{{ $store._modules.root.state[m][mv] }}</pre>
                                </span>
                            </div>
                        </div>
                    </q-menu>
                </q-btn>

                <q-space />

                <q-btn class="tw-mr-2" :icon="rightDrawer ? 'menu_open' : 'menu'" @click="toggleRightDrawer" flat />

                <ec-avatar
                    :image_src="profile?.user_meta?.attachment?.src"
                    :name="profile?.user_meta?.display_name"
                    class="cursor-pointer"
                >
                    <q-badge color="primary" floating rounded>2</q-badge>

                    <q-menu>
                        <div class="row no-wrap q-pa-md">
                            <div class="column">
                                <div class="text-h6 q-mb-md">upcomming...</div>
                            </div>

                            <q-separator vertical inset class="q-mx-lg" />

                            <div class="column items-center">
                                <ec-avatar
                                    size="72px"
                                    :image_src="profile?.user_meta?.attachment?.src"
                                    :name="profile?.user_meta?.display_name"
                                />

                                <div class="tw-text-xs tw-mt-2 tw-mb-1">
                                    {{ $_.upperFirst(profile.user_meta?.full_name) }}
                                </div>
                                <div class="tw-text-xxs tw-mb-2">{{ profile.email }}</div>

                                <q-btn @click="logout" color="orange" label="Logout" size="sm" />
                            </div>
                        </div>
                    </q-menu>
                </ec-avatar>
            </q-toolbar>
        </q-header>

        <template v-if="domReady">
            <q-drawer
                v-model="leftDrawer"
                class="tw-shadow-lgr"
                side="left"
                breakpoint="xs"
                width="250"
                persistent
                show-if-above
            >
                <left-bar></left-bar>
            </q-drawer>

            <q-drawer
                :model-value="rightDrawerVisible"
                class="tw-shadow-lgl"
                side="right"
                breakpoint="xs"
                :width="this.rightBarState.mode === 'conversation' ? 300 : 250"
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
            <q-spinner-facebook size="50px" color="primary" />
        </q-inner-loading>

        <div v-if="false">
            <!-- add style pointer event none for accessing the underlying parent elements -->
            <!-- and also add opacity if user moved to parent -->
            <div class="tw-fixed tw-bottom-0" style="z-index: 99999; right: 75px">
                <q-card
                    class="bg-white shadow-5 tw-flex tw-flex-col"
                    style="width: 300px"
                    :style="{ height: '!mini' ? '450px' : 'auto' }"
                >
                    <!-- change bg color by status -->
                    <q-card-section class="row no-wrap bg-green items-center tw-p-0">
                        <q-item class="">
                            <q-item-section avatar>
                                <q-avatar size="lg">
                                    <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" />

                                    <!-- <q-badge label="." color="green" text-color="green" rounded floating /> -->
                                </q-avatar>
                            </q-item-section>

                            <q-item-section class="tw-w-full">
                                <q-item-label class="text-weight-bold text-white tw-text-md">Hasan</q-item-label>
                                <!-- <q-item-label caption>
                                    <q-badge color="green" class="tw-px-2 tw-py-1">Active</q-badge>
                                </q-item-label> -->
                            </q-item-section>
                        </q-item>

                        <q-space />

                        <q-btn class="tw-px-2" icon="more_horiz" color="green" unelevated />
                        <q-btn
                            class="tw-px-2"
                            :icon="!'mini' ? 'arrow_drop_up' : 'arrow_drop_down'"
                            color="green"
                            unelevated
                        />
                        <!-- <q-btn class="tw-mr-2 tw-px-2" icon="close" color="white" flat /> -->
                    </q-card-section>

                    <q-card-section v-if="'!mini'" class="tw-p-0 tw-flex-1 tw-flex tw-flex-col">
                        <q-scroll-area
                            @scroll="handleScroll"
                            ref="msgScrollArea"
                            class="tw-flex-1 tw-px-1 tw-py-2"
                            style="height: 1px"
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
                                opacity: 0.7,
                            }"
                            :content-style="{}"
                        >
                        </q-scroll-area>

                        <div class="tw-w-full tw-flex tw-px-1 tw-self-end">
                            <q-btn flat color="green" icon="attachment"></q-btn>
                            <q-btn flat color="green" icon="mood"></q-btn>
                            <q-input
                                debounce="0"
                                placeholder="Write Message..."
                                color="green-8"
                                class="tw-flex-auto"
                                autogrow
                                borderless
                                dense
                            ></q-input>
                            <q-btn icon="send" flat color="green-8"></q-btn>
                        </div>
                    </q-card-section>

                    <q-badge v-if="!'!mini'" label="5" color="orange" text-color="black" rounded floating />
                </q-card>
            </div>

            <q-fab
                color="green"
                icon="chat"
                direction="up"
                class="tw-fixed tw-bottom-4"
                style="z-index: 99999; right: 10px"
                persistent
            >
                <q-fab-action
                    v-for="(a, i) in [1, 2, 3]"
                    :key="i"
                    padding="1px"
                    label="a new message"
                    anchor="start"
                    color="green"
                    ><q-avatar><img :src="`https://cdn.quasar.dev/img/avatar${i + 1}.jpg`" /></q-avatar
                ></q-fab-action>
            </q-fab>
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

declare global {
    interface Window {
        exonChat: any;
    }
}

export default defineComponent({
    name: 'MainLayout',
    components: { LeftBar, RightBar, EcAvatar },
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
            if (this.rightBarState.visible) {
                if (this.$route.name !== 'chats' && this.rightBarState.mode === 'client_info') {
                    return false;
                }

                return true;
            }

            return false;
        },
    },

    async mounted() {
        console.log('main layout mounted');

        if (this.profile.id) {
            this.openChatPanelBoxForTest();

            await this.socketInitialize();
        }

        this.domReady = true;

        if (this.currentRouteName === 'chats') {
            this.rightDrawer = true;
        }
    },

    methods: {
        ...mapMutations({ toggleRightDrawer: 'setting_ui/toggleRightDrawer' }),

        getAllUsers() {
            this.$store.dispatch('chat/getAllUsers');
        },

        getUsers(ses_id = null) {
            // if ses_id => check for exist. if not then new user registered
            if (!ses_id || !this.chatUsers?.hasOwnProperty(ses_id)) {
                console.log('reloading users list');

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

            this.$socket.io.opts.query = `token=${this.socketToken}&client_type=user`;

            this.socket = this.$socket.connect();

            this.getUsers();
            this.fireSocketListeners();
            this.reloadForProfileImageLoad();
            this.$socket.emit('ec_get_logged_users', {});

            // infuture handle a interval for page visiting update. check visiting time & mutate visiting value
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
                this.$store.dispatch('chat/storeMessage', res);

                console.log('from ec_msg_from_user', res);
            });

            this.socket.on('ec_msg_from_client', (res: any) => {
                res.socket_event = 'ec_msg_from_client';

                this.$store.dispatch('chat/storeMessage', res);

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

            this.socket.on('ec_conv_initiated_from_client', (data: any) => {
                console.log('from ec_conv_initiated_from_client', data);

                if (data.status === 'success') {
                    // convs search by clients ses then update socket session info
                    // y? cz after join sesinfo changes for client
                }
            });

            this.socket.on('ec_is_joined_from_conversation', (res: any) => {
                const convInfo = res.data.conv_ses_data;

                this.$store.dispatch('chat/updateConvState', convInfo);

                console.log('from ec_is_joined_from_conversation', convInfo);
            });

            this.socket.on('ec_is_leaved_from_conversation', (res: any) => {
                const convInfo = res.data.conv_ses_data;

                this.$store.dispatch('chat/updateConvState', convInfo);

                console.log('from ec_is_leaved_from_conversation', convInfo);
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
                // res = {action: [logout, others_are_comming], msg: res.msg || null, reason: res.reason || null}
                // reason = why this type sended
                // msg = if you want to show notification or taster
                // type = what type of action need

                // in future handle if needed. if client logs by whmcs or other supported app
                // then sesinfo will change & receive a emit
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

            this.socket.on('ec_error', (data: any) => {
                console.log('from ec_error', data);
                // check if has if not then new event
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
                    js.setAttribute('data-api-key', self.profile.subscriber.api_key);
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
                console.log('conversations watcher started');
                if (this.usersAvatarLoading) return;

                this.usersAvatarLoading = true;

                if (this.conversations) {
                    for (const convObj of Object.values(this.conversations)) {
                        const conv: any = convObj;
                        const tempArray: any = { conv_id: conv.id, srcs: [] };

                        for (const convSes of conv.sessions) {
                            if (convSes.socket_session.user) {
                                // i can send attachment from db but for that i have to send from all the query
                                // i have to get the image so y give hard time to api so here check that
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
        console.log('calling unmounted from main layout');

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
