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
                                <span>{{ mv }}</span
                                ><span class="tw-mx-2">=></span><span>{{ $store._modules.root.state[m][mv] }}</span>
                            </div>
                        </div>
                    </q-menu>
                </q-btn>
                <q-space />
                <q-avatar size="lg" class="cursor-pointer">
                    <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" />

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
                                    <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
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
            v-if="$route.path === '/chats'"
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
        socketInitialize() {
            if (this.handshake || 'logged') {
                this.sesId = sessionStorage.getItem('exonchat-agent-ses-id');
                console.log(this.sesId);

                if (!this.sesId) {
                    this.sesId = new Date().getTime().toString();

                    sessionStorage.setItem('exonchat-agent-ses-id', this.sesId);
                }
                // console.log(this.$socket);

                this.$socket.io.opts.query = `api_key=999&ses_id=${this.sesId}&client_type=agent`;

                this.socket = this.$socket.connect();

                console.log(this.socket);

                this.fireSocketListners();
            }
        },
        fireSocketListners() {
            this.socket.on('connect', () => {
                console.log(`Your Agent Connection id is ${this.socket.id}`); // x8WIv7-mJelg7on_ALbx

                this.socketId = this.socket.id;
            });

            this.socket.on('disconnect', () => {
                console.log('You Are Disconnected'); // undefined

                this.socketId = this.socket.id;
            });

            this.socket.on('ec_msg_to_agent', async (data: any) => {
                await this.$store.dispatch('chat/storeTemporaryMessage', data);
                console.log(`from ec_msg_to_agent ${data}`);
            });

            // get msg from me & also from other agents connected with this conv.
            // me msg will be used for my other tabs update
            this.socket.on('ec_msg_from_agent', (data: any) => {
                console.log(`from ec_msg_from_agent ${data}`);
            });

            this.socket.on('ec_msg_from_client', (data: any) => {
                this.$store.dispatch('chat/storeTemporaryMessage', data);

                this.$q.notify({
                    message: 'Jim pinged you.',
                    icon: 'announcement',
                    position: 'top-left',
                });

                console.log(`from ec_msg_from_client ${data}`);
            });

            // handle only other agents typing
            this.socket.on('ec_is_typing_from_agent', (data: any) => {
                console.log(`from ec_is_typing_from_agent ${data}`);
            });

            this.socket.on('ec_is_typing_to_agent', (data: any) => {
                console.log(`from ec_is_typing_to_agent ${data}`);
            });

            this.socket.on('ec_is_typing_from_client', (data: any) => {
                console.log('from ec_is_typing_from_client', data.msg);
            });

            this.socket.on('ec_conv_initiated_from_client', (data: any) => {
                console.log(`from ec_conv_initiated_from_client ${data}`);

                if (data.status === 'success') {
                    //
                }
            });

            this.socket.on('ec_is_joined_from_conversation', (data: any) => {
                data.data = {
                    convState: 'joined',
                };

                this.$store.dispatch('chat/setConvState', data);
                console.log(`from ec_is_joined_from_conversation ${data}`);
            });

            this.socket.on('ec_is_leaved_from_conversation', (data: any) => {
                data.data = {
                    convState: 'left',
                };

                this.$store.dispatch('chat/setConvState', data);

                console.log(`from ec_is_leaved_from_conversation ${data}`);
            });

            this.socket.on('ec_is_closed_from_conversation', (data: any) => {
                console.log('okk');

                console.log(`from ec_is_closed_from_conversation ${data}`);
            });

            this.socket.on('ec_error', (data: any) => {
                console.log(`from ec_error ${data.reason}`);
            });
        },

        scrollToBottom() {
            const msgScrollArea = this.$refs.msgScrollArea;
            const scrollTarget = msgScrollArea.getScrollTarget();

            msgScrollArea.setScrollPosition('vertical', scrollTarget.scrollHeight);
        },

        logout() {
            this.$store
                .dispatch('auth/logOut')
                .then(() => {
                    this.$q.notify({
                        color: 'positive',
                        message: 'Logut Successful',
                        position: 'top',
                    });

                    // this.$router.push({ name: 'login' });
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },
    },
});
</script>
