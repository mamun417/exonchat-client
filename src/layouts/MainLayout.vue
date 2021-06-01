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

                <q-btn icon="forum" :to="{ name: 'clients-conversations' }" flat size="lg">
                    <q-tooltip :offset="[10, 10]">Clients conversations</q-tooltip>
                </q-btn>

                <q-btn icon="account_tree" :to="{ name: 'departments' }" flat>
                    <q-tooltip :offset="[10, 10]">Departments</q-tooltip>
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

                <q-avatar size="lg" class="cursor-pointer">
                    <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" alt="image" />

                    <q-badge color="primary" floating rounded>2</q-badge>

                    <q-menu>
                        <div class="row no-wrap q-pa-md">
                            <div class="column">
                                <div class="text-h6 q-mb-md">Settings</div>
                                <q-toggle v-model="mobileData" label="Use Mobile Data" />
                                <q-toggle v-model="bluetooth" label="Bluetooth" />
                            </div>

                            <q-separator vertical inset class="q-mx-lg" />

                            <div class="column items-center">
                                <q-avatar size="72px">
                                    <img src="https://cdn.quasar.dev/img/avatar4.jpg" alt="" />
                                </q-avatar>

                                <div class="tw-text-xs tw-mt-2 tw-mb-1">
                                    {{ $_.upperFirst(profile.user_meta?.full_name) }}
                                </div>
                                <div class="tw-text-xxs tw-mb-2">{{ profile.email }}</div>

                                <q-btn @click="logout" color="orange" label="Logout" size="sm" />
                            </div>
                        </div>
                    </q-menu>
                </q-avatar>
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
                width="250"
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

declare global {
    interface Window {
        exonChat: any;
    }
}

export default defineComponent({
    name: 'MainLayout',
    components: { LeftBar, RightBar },
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
            globalBgColor: 'ui/globalBgColor',
            rightBarState: 'ui/rightBarState',
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
        ...mapMutations({ toggleRightDrawer: 'ui/toggleRightDrawer' }),

        getUsers(ses_id = null) {
            // if ses_id => check for exist. if not then new user registered
            if (!ses_id || !this.chatUsers.hasOwnProperty(ses_id)) {
                console.log('reloading users list');

                this.$store.dispatch('chat/getUsers').then(() => {
                    // get new list first then get online
                    this.$socket.emit('ec_get_logged_users', {});
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
            this.$socket.emit('ec_get_logged_users', {});
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
                this.$store.dispatch('chat/storeMessage', res);

                console.log('from ec_msg_from_client', res);
            });

            // handle only other users typing
            // this.socket.on('ec_is_typing_from_user', (data: any) => {
            //     console.log('from ec_is_typing_from_user', data);
            // });

            // this.socket.on('ec_is_typing_to_user', (data: any) => {
            //     console.log('from ec_is_typing_to_user', data);
            // });

            // this.socket.on('ec_is_typing_from_client', (data: any) => {
            //     console.log('from ec_is_typing_from_client', data.msg);
            // });

            this.socket.on('ec_conv_initiated_from_user', (data: any) => {
                console.log('from ec_conv_initiated_from_user', data);

                this.$emitter.emit('listen_ec_init_conv_from_user', data);
            });

            this.socket.on('ec_conv_initiated_from_client', (data: any) => {
                console.log('from ec_conv_initiated_from_client', data);

                if (data.status === 'success') {
                    //
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
                    js.src = 'http://localhost:8080/assets/js/web-chat/web-chat.js';
                    fjs.parentNode.insertBefore(js, fjs);
                })(document, 'script', 'exhonchat-chat-frame');
            }
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

                    this.$socket.close();
                    this.$router.push({ name: 'login' });
                })
                .catch((err: any) => {
                    console.log(err);
                });
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
