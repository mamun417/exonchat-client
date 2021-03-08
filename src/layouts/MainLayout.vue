<template>
    <q-layout view="hhh LpR fff" class="tw-bg-white">
        <q-page-container>
            <q-page
                ><main-left-bar></main-left-bar>

                <left-bar></left-bar>

                <div class="tw-ml-78 tw-grid tw-grid-cols-12 tw-min-h-screen">
                    <router-view
                        class="tw-h-full tw-p-3 tw-col-span-9 tw-border-r-2 tw-border-blue-50 tw-bg-blue-50"
                    ></router-view>

                    <right-bar
                        class="tw-h-full tw-col-span-3 tw-shadow-lg tw-overflow-hidden"
                    ></right-bar>
                </div>
            </q-page>

            <!-- <router-view class="tw-ml-78" /> -->
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// import { mapGetters } from 'vuex';
import LeftBar from 'src/components/subscriber/side-panel/LeftBar.vue';
import MainLeftBar from 'src/components/subscriber/side-panel/MainLeftBar.vue';
import RightBar from 'src/components/subscriber/side-panel/RightBar.vue';

export default defineComponent({
    name: 'MainLayout',
    components: { MainLeftBar, LeftBar, RightBar },
    data(): any {
        return {
            socket: null,

            sesId: null,
            convIds: [],

            typingHandler: null,
        };
    },
    setup() {
        const miniMode = ref(false);

        return { miniMode };
    },
    mounted() {
        console.log('main layout mounted');

        if ('logged in') {
            this.socketInitialize();
        }
    },
    computed: {
        // ...mapGetters('socket', ['handshake']),
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

            // get msg from me & also from other agents connected with this conv.
            // me msg will be used for my other tabs update
            this.socket.on('ec_msg_from_agent', (data: any) => {
                console.log(`from ec_msg_from_agent ${data}`);
            });

            this.socket.on('ec_msg_from_client', (data: any) => {
                console.log(`from ec_msg_from_client ${data}`);
            });

            // handle only other agents typing
            this.socket.on('ec_is_typing_from_agent', (data: any) => {
                console.log(`from ec_is_typing_from_agent ${data}`);
            });

            this.socket.on('ec_is_typing_from_client', (data: any) => {
                console.log(`from ec_is_typing_from_client ${data}`);
            });

            this.socket.on('ec_conv_initiated_from_client', (data: any) => {
                console.log(`from ec_conv_initiated_from_client ${data}`);

                if (data.status === 'success') {
                    //
                }
            });

            this.socket.on('ec_is_joined_from_conversation', (data: any) => {
                console.log(`from ec_is_joined_from_conversation ${data}`);
            });

            this.socket.on('ec_is_leaved_from_conversation', (data: any) => {
                console.log(`from ec_is_leaved_from_conversation ${data}`);
            });

            this.socket.on('ec_is_closed_conversation', (data: any) => {
                console.log(`from ec_is_closed_conversation ${data}`);
            });

            this.socket.on('ec_error', (data: any) => {
                console.log(`from ec_error ${data.reason}`);
            });
        },
    },
});
</script>
