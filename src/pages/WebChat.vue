<template>
    <q-page class="tw-flex tw-flex-col tw-rounded-md">
        <div
            v-if="panelVisibleStatus"
            class="tw-flex tw-flex-col tw-flex-grow tw-bg-blue-50 tw-text-blueGray-900 tw-rounded-md"
        >
            <template v-if="hasApiKey">
                <div
                    class="tw-bg-green-600 text-weight-bold tw-text-gray-50 tw-px-4 tw-py-2 tw-flex tw-items-center tw-rounded-t-md"
                >
                    <div>Online - Chat With Us</div>
                    <q-btn v-if="clientInitiateConvInfo.conv_id" icon="more_vert" flat>
                        <q-menu>
                            <!-- <div
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
                    </div> -->

                            <q-list style="min-width: 100px" dense>
                                <q-item clickable dense v-close-popup>
                                    <q-item-section @click="clearSession" class="text-orange"
                                        >Close Chat</q-item-section
                                    >
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                    <div style="max-height: 100px; overflow: auto"></div>
                    <q-space></q-space>
                    <q-btn
                        :icon="panelVisibleStatus ? 'expand_more' : 'expand_less'"
                        @click="toggleChatPanel(!panelVisibleStatus)"
                        dense
                        flat
                    ></q-btn>
                </div>
                <div class="tw-flex-grow tw-flex tw-flex-col tw-p-1">
                    <div
                        v-if="clientInitiateConvInfo.conv_id"
                        id="webchat-container"
                        class="tw-flex-grow tw-flex tw-flex-col"
                    >
                        <message
                            :ses-id="sesId"
                            :socket="socket"
                            chat-panel-type="client"
                            :conversationInfo="conversationInfo"
                        ></message>
                    </div>

                    <!-- <div v-else-if="userLogged" class="tw-flex tw-flex-col justify-center tw-flex-grow">
                <div class="tw-bg-white tw-shadow tw-m-5 tw-relative">
                    <div class="tw-absolute tw-m-auto full-width text-center" style="top: -25px">
                        <q-icon name="chat" size="xl" color="green"></q-icon>
                    </div>
                    <div class="tw-px-4 tw-py-16">
                        <q-select dense label="Chat Department" color="green" class="tw-mb-3"></q-select>

                        <q-btn dense color="green" class="full-width tw-mt-6">Start Chat</q-btn>
                    </div>
                </div>
            </div> -->

                    <div v-else class="tw-flex tw-flex-col justify-center tw-flex-grow">
                        <div class="tw-bg-white tw-shadow tw-m-5 tw-relative">
                            <div class="tw-absolute tw-m-auto full-width text-center" style="top: -25px">
                                <q-icon name="account_circle" size="xl" color="green"></q-icon>
                            </div>
                            <div class="tw-px-4 tw-py-16">
                                <q-input
                                    v-model="convInitFields.name"
                                    dense
                                    label="Your Name"
                                    color="green"
                                    class="tw-mb-3"
                                >
                                    <template v-slot:prepend>
                                        <q-icon name="person" size="xs" color="green" />
                                    </template>
                                </q-input>
                                <q-input
                                    v-model="convInitFields.email"
                                    dense
                                    class="tw-mb-3"
                                    label="Your Email"
                                    type="email"
                                >
                                    <template v-slot:prepend>
                                        <q-icon name="email" size="xs" color="green" />
                                    </template>
                                </q-input>

                                <q-select
                                    v-model="convInitFields.department"
                                    :options="chatDepartments"
                                    option-value="id"
                                    option-label="tag"
                                    label="Chat Department"
                                    color="green"
                                    class="tw-mb-3"
                                    emit-value
                                    map-options
                                    dense
                                    ><template v-slot:prepend>
                                        <q-icon name="person" size="xs" color="green" /> </template
                                ></q-select>

                                <q-btn dense color="green" class="full-width tw-mt-6" @click="chatInitialize" no-caps
                                    >Start Chat as Guest
                                </q-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <div v-else class="tw-p-6 tw-flex tw-flex-col tw-flex-grow">
                <div class="tw-flex tw-flex-col tw-flex-grow tw-justify-center text-center">
                    <div class="text-orange tw-font-medium tw-text-lg">No API Key found</div>
                    <div class="text-caption">Please contact support or see manual for how to set api</div>
                    <q-btn
                        color="green"
                        class="tw-mt-4"
                        label="Hide Panle"
                        @click="toggleChatPanel(false)"
                        no-caps
                        unelevated
                    />
                </div>
                <div class="text-center">powerd by exonhost</div>
            </div>
        </div>
        <div v-else>
            <q-btn
                icon="forum"
                size="md"
                color="green"
                @click="toggleChatPanel(true)"
                class="tw-fixed tw-right-1 tw-bottom-1"
                round
            />
        </div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import io from 'socket.io-client';
import { mapGetters } from 'vuex';
import Message from 'components/common/Message.vue';

declare global {
    interface Window {
        maximizeChatPanel: any;
        minimizeChatPanel: any;
        get_api_key: any;
    }
}

export default defineComponent({
    name: 'WebChat',
    components: { Message },
    setup() {
        return {};
    },
    data(): any {
        return {
            hasApiKey: false,
            panelVisibleStatus: !!window.localStorage.getItem('chat_panel_visible'),
            socket: null,

            socketId: null,
            sesId: null,
            soketToken: null,

            showChatForm: false,
            userLogged: false,

            chatDepartments: [],
            convInitFields: {
                name: '',
                email: '',
                department: '',
            },

            msg: '',

            pageInFocus: false,

            typingHandler: {
                typing: false,
            },
            pageVisitingHandler: null,
            gotoBottomBtnShow: false,
        };
    },

    async mounted() {
        console.log('WebChat Mounted');

        this.handleChatPanelVisibility();

        console.log(window.parent.get_api_key());

        if (!window.parent.get_api_key()) {
            this.hasApiKey = false;
            return;
        }

        this.hasApiKey = true;

        await this.initializeSocket();
        this.fireSocketListeners();

        this.firePageVisitListner();

        if (this.clientInitiateConvInfo.conv_id) {
            this.getConvMessages(this.clientInitiateConvInfo.conv_id);
        }

        this.getChatDepartments();
        this.setTypingFalse();
    },

    computed: {
        ...mapGetters({
            clientInitiateConvInfo: 'chat/clientInitiateConvInfo',
        }),

        // which messages store by getConvMessages()
        conversationInfo(): any {
            return this.$store.getters['chat/conversationInfo'](this.clientInitiateConvInfo.conv_id);
        },
    },

    methods: {
        handleChatPanelVisibility() {
            if (this.panelVisibleStatus) {
                window.parent.maximizeChatPanel();
            } else {
                window.parent.minimizeChatPanel();
            }
        },
        toggleChatPanel(toggleTo: any) {
            if (toggleTo) {
                window.localStorage.setItem('chat_panel_visible', 'true');
                this.panelVisibleStatus = true;
                window.parent.maximizeChatPanel();
            } else {
                window.localStorage.removeItem('chat_panel_visible');
                this.panelVisibleStatus = false;
                window.parent.minimizeChatPanel();
            }
        },
        clearSession() {
            localStorage.clear();
            sessionStorage.clear();
            this.clientInitiateConvInfo = {};
            location.reload();
        },
        getChatDepartments() {
            window.socketSessionApi
                .get('departments')
                .then((res: any) => {
                    console.log(res);
                    this.chatDepartments = res.data;
                })
                .catch((e: any) => {
                    console.log(e);
                });
        },
        // store conversation messages and get the messages by getters (messages)
        getConvMessages(convId: string) {
            this.$store.dispatch('chat/getClientConvMessages', {
                convId,
            });
        },

        async initializeSocket() {
            // get conversation information
            const clientInitiateConvInfo: any = localStorage.getItem('clientInitiateConvInfo');
            this.clientInitiateConvInfo = clientInitiateConvInfo ? JSON.parse(clientInitiateConvInfo) : {};

            // we are now supporting client chat after browser restart
            this.sesId = localStorage.getItem('ec_client_socket_ses_id');
            this.socketToken = localStorage.getItem('ec_client_socket_token');

            if (!this.sesId) {
                await window.api
                    .post('/socket-sessions', {
                        api_key: 'test',
                    })
                    .then((res: any) => {
                        console.log(res.data);

                        this.sesId = res.data.data.socket_session.id;
                        this.socketToken = res.data.bearerToken;

                        localStorage.setItem('ec_client_socket_ses_id', this.sesId);
                        localStorage.setItem('ec_client_socket_token', this.socketToken);
                    })
                    .catch((err: any) => {
                        console.log(err);
                    });
            }

            console.log(this.sesId);

            if (!this.socketToken) {
                // handle error
                console.log('socket token not found for this sesId');

                return;
            }
            this.socket = io('http://localhost:3000', {
                query: {
                    token: this.socketToken,
                },
            });
            // localStorage.debug = '*';
            // console.log(this.socket);
        },

        fireSocketListeners() {
            this.socket.on('connect', () => {
                console.log(`Your Connection id is ${this.socket.id}`); // x8WIv7-mJelg7on_ALbx

                this.socketId = this.socket.id;
            });

            this.socket.on('disconnect', () => {
                console.log('You Are Disconnected'); // undefined

                this.socketId = this.socket.id;
            });

            this.socket.on('ec_msg_from_user', async (res: any) => {
                await this.$store.dispatch('chat/storeTemporaryMessage', res);
                console.log('from ec_msg_from_user', res);
            });

            // this.socket.on('ec_is_typing_to_client', (res: any) => {
            //     console.log('from ec_is_typing_to_client', res);
            // });

            // successfully sent to user
            this.socket.on('ec_msg_to_client', async (res: any) => {
                await this.$store.dispatch('chat/storeTemporaryMessage', res);
                console.log('from ec_msg_to_client', res);
            });

            // this.socket.on('ec_is_typing_from_user', (res: any) => {
            //     console.log(res);
            //     // this.typingHandler.typing = true;
            //     console.log('from ec_is_typing_from_user', res);
            // });

            this.socket.on('ec_conv_initiated_to_client', async (res: any) => {
                console.log('from ec_conv_initiated_to_client', res);

                const clientInitiateConvInfo = localStorage.getItem('clientInitiateConvInfo');

                if (res.status === 'success') {
                    if (!clientInitiateConvInfo) {
                        await this.$store.dispatch('chat/storeClientInitiateConvInfo', res);
                    } else {
                        // if (this.conv_id === res.data.conversation_id) {
                        //     //no idea for now what to do if conv_id donst match
                        // }
                    }
                }
            });

            this.socket.on('ec_is_joined_from_conversation', (res: any) => {
                const convInfo = res.data.conv_ses_data;
                convInfo.state_status = 'joined';

                this.$store.dispatch('chat/storeConvState', convInfo);

                console.log('from ec_is_joined_from_conversation', convInfo);
            });

            this.socket.on('ec_is_leaved_from_conversation', (res: any) => {
                const convInfo = res.data.conv_ses_data;
                convInfo.state_status = 'left';

                this.$store.dispatch('chat/storeConvState', convInfo);

                console.log('from ec_is_leaved_from_conversation', convInfo);
            });

            this.socket.on('ec_is_closed_from_conversation', (res: any) => {
                this.$store.dispatch('chat/clearClientChatInitiate');
                this.socket.close();
                // force reload dom
                location.reload();
                console.log('from ec_is_closed_from_conversation', res);
            });

            this.socket.on('ec_error', (res: any) => {
                console.log('from ec_error', res);
            });
        },

        chatInitialize() {
            // console.log(this.convInitFields);

            this.socket.emit('ec_init_conv_from_client', { ...this.convInitFields });
        },

        firePageVisitListner() {
            // Set the name of the hidden property and the change event for visibility
            // let hidden: string, visibilityChange: string;

            // if (typeof document.hidden !== 'undefined') {
            //     // Opera 12.10 and Firefox 18 and later support
            //     hidden = 'hidden';
            //     visibilityChange = 'visibilitychange';
            // }
            // else if (typeof document.msHidden !== 'undefined') {
            //     hidden = 'msHidden';
            //     visibilityChange = 'msvisibilitychange';
            // } else if (typeof document.webkitHidden !== 'undefined') {
            //     hidden = 'webkitHidden';
            //     visibilityChange = 'webkitvisibilitychange';
            // }

            // If the page is hidden, pause sending browsing state;

            // Warn if the browser doesn't support addEventListener or the Page Visibility API
            if (typeof document.addEventListener === 'undefined' || document.hidden === undefined) {
                console.log(
                    'This check requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.'
                );
            } else {
                // Handle page visibility change
                document.addEventListener('visibilitychange', this.handlePageVisibilityChange, false);

                if (!this.pageVisitingHandler) {
                    this.pageVisitingHandler = setInterval(() => {
                        this.sendPageVisitingInfo();
                    }, 2000);
                }
            }
        },

        handlePageVisibilityChange() {
            this.pageInFocus = !document.hidden;
        },

        sendPageVisitingInfo() {
            if (this.pageInFocus && this.socketId) {
                // this.socket.emit('ec_page_visit_info_from_client', {
                //     url: '',
                //     sent_at: 'timestamp',
                // });
            }
        },

        inputFocusHandle() {
            this.typingHandler = setInterval(() => {
                this.sendTypingData();
            }, 1000);
        },

        inputBlurHandle() {
            clearInterval(this.typingHandler);
        },

        sendTypingData() {
            if (this.msg && this.socketId) {
                // console.log('typing');

                this.socket.emit('ec_is_typing_from_client', {
                    msg: this.msg,
                    sent_at: 'timestamp',
                });
            }
        },

        setTypingFalse() {
            setInterval(() => {
                this.typingHandler.typing = false;
            }, 2000);
        },
    },

    unmounted() {
        clearInterval(this.typingHandler);
        clearInterval(this.pageVisitingHandler);

        if (this.socket) {
            this.socket.close();
        }
    },
});
</script>
