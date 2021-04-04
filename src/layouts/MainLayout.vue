<template>
    <q-layout view="hHh LpR fff" class="bg-white">
        <q-header class="bg-green-8" elevated>
            <q-toolbar class="tw-px-8">
                <q-btn icon="mediation" flat />
                <q-btn :icon="leftDrawer ? 'menu_open' : 'menu'" @click="leftDrawer = !leftDrawer" flat />
                <q-space />
                <q-btn icon="forum" flat />
                <q-btn icon="star" flat />
                <q-btn icon="send" flat />
                <q-btn icon="drafts" flat />
                <q-btn icon="info" flat>
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

                                <div class="tw-text-xs tw-mt-2 tw-mb-1">John Doe</div>
                                <div class="tw-text-xxs tw-mb-2">{{ profile.email }}</div>

                                <q-btn @click="logout" color="orange" label="Logout" size="sm" />
                            </div>
                        </div>
                    </q-menu>
                </q-avatar>
            </q-toolbar>
        </q-header>

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
            v-if="1 < 0"
            v-model="rightDrawer"
            class="tw-shadow-lgl"
            side="right"
            breakpoint="xs"
            width="250"
            persistent
            show-if-above
        >
            <right-bar></right-bar>
        </q-drawer>
        <q-page-container>
            <q-page class="tw-flex">
                <router-view class="tw-w-full tw-p-3 bg-green-1"></router-view>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapGetters } from 'vuex';
import LeftBar from 'src/components/subscriber/side-panel/LeftBar.vue';
import RightBar from 'src/components/subscriber/side-panel/RightBar.vue';

export default defineComponent({
    name: 'MainLayout',
    components: { LeftBar, RightBar },
    data(): any {
        return {
            leftDrawer: true,
            rightDrawer: true,
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
        }),
    },

    mounted() {
        console.log(this.$store._modules.root.state);
        console.log('main layout mounted');

        if ('logged in') {
            this.socketInitialize();
        }
    },

    methods: {
        async socketInitialize() {
            if (this.handshake || 'logged') {
                this.sesId = sessionStorage.getItem('ec_user_socket_ses_id');
                this.socketToken = sessionStorage.getItem('ec_user_socket_token');
                console.log(this.sesId);

                if (!this.sesId) {
                    await this.$api
                        .post('/socket-sessions', {
                            api_key: 'test',
                            user_id: this.profile.id,
                        })
                        .then((res: any) => {
                            this.sesId = res.data.data.id;
                            this.socketToken = res.data.bearerToken;

                            sessionStorage.setItem('ec_user_socket_ses_id', this.sesId);
                            sessionStorage.setItem('ec_user_socket_token', res.data.bearerToken);
                        })
                        .catch((err: any) => {
                            console.log(err);
                        });
                }

                if (!this.socketToken) {
                    //handle error
                    console.log('socket token not found for this sesId');
                    return;
                }

                this.$socket.io.opts.query = `token=${this.socketToken}&client_type=user`;

                this.socket = this.$socket.connect();

                console.log(this.socket);

                this.fireSocketListeners();
            }
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
            this.socket.on('ec_msg_to_user', async (data: any) => {
                await this.$store.dispatch('chat/storeTemporaryMessage', data);
                console.log('from ec_msg_to_user', data);
            });

            // get msg from me & also from other users connected with this conv.
            // me msg will be used for my other tabs update
            this.socket.on('ec_msg_from_user', (data: any) => {
                console.log('from ec_msg_from_user', data);
            });

            this.socket.on('ec_msg_from_client', async (data: any) => {
                await this.$store.dispatch('chat/storeTemporaryMessage', data);
                await this.$store.dispatch('chat/storeTempChatRequest', data);

                this.$q.notify({
                    message: 'Jim pinged you.',
                    icon: 'announcement',
                    position: 'top-left',
                });

                console.log('from ec_msg_from_client', data);
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

            this.socket.on('ec_conv_initiated_from_client', (data: any) => {
                console.log('from ec_conv_initiated_from_client', data);

                if (data.status === 'success') {
                    //
                }
            });

            this.socket.on('ec_is_joined_from_conversation', (data: any) => {
                data.data = {
                    convState: 'joined',
                };

                this.$store.dispatch('chat/setConvState', data);
                console.log('from ec_is_joined_from_conversation', data);
            });

            this.socket.on('ec_is_leaved_from_conversation', (data: any) => {
                data.data = {
                    convState: 'left',
                };

                this.$store.dispatch('chat/setConvState', data);

                console.log('from ec_is_leaved_from_conversation', data);
            });

            this.socket.on('ec_is_closed_from_conversation', (data: any) => {
                console.log('okk');

                console.log('from ec_is_closed_from_conversation', data);
            });

            this.socket.on('ec_error', (data: any) => {
                console.log('from ec_error', data);
            });
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

                    this.$router.push({ name: 'login' });
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },
    },
});
</script>
