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
import { mapGetters } from 'vuex';
import LeftBar from 'src/components/subscriber/side-panel/LeftBar.vue';
import MainLeftBar from 'src/components/subscriber/side-panel/MainLeftBar.vue';
import RightBar from 'src/components/subscriber/side-panel/RightBar.vue';

export default defineComponent({
    name: 'MainLayout',
    components: { MainLeftBar, LeftBar, RightBar },
    data(): any {
        return {
            sesId: null,
        };
    },
    setup() {
        const miniMode = ref(false);

        return { miniMode };
    },
    mounted() {
        if ('logged in') {
            this.socketInitialize();
        }
    },
    computed: {
        ...mapGetters('socket', ['handshake']),
    },
    methods: {
        socketInitialize() {
            if (this.handshake) {
                console.log(this.$socket);

                this.socket.on('connect', () => {
                    console.log(`connected ${this.$socket.id}`); // x8WIv7-mJelg7on_ALbx
                });

                this.socket.on('disconnect', () => {
                    console.log(`disconnected ${this.$socket.id}`); // undefined
                });

                this.socket.on('exonchat_msg_from_client', (data: any) => {
                    console.log(`from server ${data}`);

                    if (data) {
                        // mark sended msg to done by match the time else use setTimeout to mark for resend
                    }
                });
            }
        },
    },
});
</script>
