<template>
    <q-page class="tw-flex tw-flex-col tw-rounded-md" style="min-height: unset">
        <div
            v-show="panelVisibleStatus"
            class="tw-h-full tw-w-full tw-fixed tw-bottom-0 tw-flex tw-flex-col tw-flex-grow tw-bg-blue-50 tw-text-blueGray-900 tw-rounded-md"
        >
            <template v-if="hasApiKey">
                <div
                    class="tw-bg-green-600 text-weight-bold tw-text-gray-50 tw-px-4 tw-py-2 tw-flex tw-items-center tw-rounded-t-md"
                >
                    <div>Chat With Us</div>

                    <q-space></q-space>
                    <q-btn v-if="clientInitiateConvInfo.conv_id" icon="more_vert" flat>
                        <q-menu anchor="bottom right" self="top right">
                            <q-item clickable v-close-popup>
                                <q-item-section class="tw-w-8 tw-min-w-0" avatar>
                                    <q-icon name="confirmation_number" />
                                </q-item-section>
                                <q-item-section @click="openTicket">Open Ticket</q-item-section>
                            </q-item>

                            <q-list style="min-width: 100px" dense>
                                <q-item clickable dense v-close-popup>
                                    <q-item-section class="tw-w-8 tw-min-w-0" avatar>
                                        <q-icon name="close" />
                                    </q-item-section>
                                    <q-item-section @click="clearSession" class="text-orange"
                                        >Close Chat
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>

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
                        <message :ses_id="sesId" :socket="socket" :conv_id="clientInitiateConvInfo.conv_id"></message>
                    </div>

                    <div
                        v-else-if="clientInitiateConvInfo.showRatingForm"
                        class="tw-flex-grow tw-flex tw-items-center tw-justify-center tw-px-5"
                    >
                        <chat-rating @ratedByClient="clearSession" />
                    </div>

                    <div v-else class="tw-flex tw-flex-col justify-center tw-flex-grow">
                        <div class="tw-bg-white tw-shadow tw-m-5 tw-relative">
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
                                >
                                    <template v-slot:prepend>
                                        <q-icon name="person" size="xs" color="green" />
                                    </template>
                                </q-select>

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
                    <div class="text-orange tw-font-medium tw-text-lg">API Key Invalid</div>
                    <div class="text-caption">Please contact support or Notify site owner</div>
                    <q-btn
                        color="green"
                        class="tw-mt-4"
                        label="Hide Panel"
                        @click="toggleChatPanel(false)"
                        no-caps
                        unelevated
                    />
                </div>
                <div class="text-center">powered by <b>Exonhost</b></div>
            </div>
        </div>
        <div v-show="!panelVisibleStatus">
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
import ChatRating from 'components/subscriber/chat/ChatRating.vue';

declare global {
    interface Window {
        maximizeChatPanel: any;
        minimizeChatPanel: any;
        get_widget_id: any;
    }
}

export default defineComponent({
    name: 'WebChat',
    components: { ChatRating, Message },
    setup() {
        return {};
    },
    data(): any {
        return {
            api_key: null,
            hasApiKey: false,

            panelVisibleStatus: !!window.localStorage.getItem('chat_panel_visible'),

            socket: null,
            socketId: null,

            sesId: null,

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
            pageNotInFocusEmitted: false,

            typingHandler: {
                typing: false,
            },
            pageVisitingHandler: null,
            gotoBottomBtnShow: false,
        };
    },

    mounted() {
        console.log('WebChat Mounted');

        // initiate first for listen response from parent
        window.addEventListener(
            'message',
            (event) => {
                if (event.data.res === 'widget_id' && event.data.value) {
                    if (this.api_key === event.data.value) return; // a safe check

                    this.api_key = event.data.value;

                    this.initializeSocket();
                }

                if (event.data.res === 'page_visit_info') {
                    this.sendPageVisitingInfo(event.data.value);
                }

                // handle other res

                // if res is like whmcs_client_id then assign it
                // after that watch for it do what is needed
            },
            false
        );

        // send mounted to parent so that it can send infos
        window.parent.postMessage({ action: 'ec_mounted' }, '*');

        this.handleChatPanelVisibility();

        // await this.initializeSocket();
    },

    computed: {
        ...mapGetters({
            clientInitiateConvInfo: 'chat/clientInitiateConvInfo',
        }),

        // which messages store by getConvMessages()
        conversationInfo(): any {
            return this.$store.getters['chat/conversationInfo'](this.clientInitiateConvInfo.conv_id);
        },

        me() {
            return localStorage.getItem('me');
        },
    },

    methods: {
        handleChatPanelVisibility() {
            if (this.panelVisibleStatus) {
                this.panelMaximize();
            } else {
                this.panelMinimize();
            }
        },
        toggleChatPanel(toggleTo: any) {
            if (toggleTo) {
                window.localStorage.setItem('chat_panel_visible', 'true');
                this.panelVisibleStatus = true;

                this.panelMaximize();
            } else {
                window.localStorage.removeItem('chat_panel_visible');
                this.panelVisibleStatus = false;

                this.panelMinimize();
            }
        },

        panelMaximize() {
            window.parent.postMessage(
                {
                    action: 'ec_maximize_panel',
                    param: 'position: fixed; bottom: 15px; right: 15px; z-index: 9999999; height: 560px; width: 320px',
                },
                '*'
            );
        },
        panelMinimize() {
            window.parent.postMessage(
                {
                    action: 'ec_minimize_panel',
                    param: 'position: fixed; bottom: 15px; right: 15px; z-index: 9999999; width: 50px; height: 50px',
                },
                '*'
            );
        },

        clearSession() {
            // handle actual close by emitting
            this.socket.close();

            localStorage.removeItem('clientInitiateConvInfo');
            localStorage.removeItem('ec_client_socket_token');
            localStorage.removeItem('ec_client_socket_ses_id');
            localStorage.removeItem('showRatingForm');

            this.clientInitiateConvInfo = {};

            location.reload();
        },
        getChatDepartments() {
            window.socketSessionApi
                .get('/departments')
                .then((res: any) => {
                    // console.log('webchat departments', res);
                    this.chatDepartments = res.data;
                })
                .catch((e: any) => {
                    console.log(e);
                });
        },
        // store conversation messages and get the messages by getters (messages)
        getConvMessages(convId: string) {
            this.$store.dispatch('chat/getConvMessages', {
                convId,
                client_page: true,
            });
        },

        async initializeSocket() {
            if (!this.api_key) return;

            // get conversation information
            const clientInitiateConvInfo: any = localStorage.getItem('clientInitiateConvInfo');
            this.clientInitiateConvInfo = clientInitiateConvInfo ? JSON.parse(clientInitiateConvInfo) : {};

            // we are now supporting client chat after browser restart
            this.sesId = localStorage.getItem('ec_client_socket_ses_id');
            this.socketToken = localStorage.getItem('ec_client_socket_token');

            if (!this.sesId || !this.socketToken) {
                await window.api
                    .post('/socket-sessions', {
                        api_key: this.api_key,
                    })
                    .then((res: any) => {
                        console.log(res.data);

                        this.sesId = res.data.data.socket_session.id;
                        this.socketToken = res.data.bearerToken;

                        localStorage.setItem('ec_client_socket_ses_id', this.sesId);
                        localStorage.setItem('ec_client_socket_token', this.socketToken);
                    })
                    .catch((err: any) => {
                        console.log('from web chat error', err.response);

                        if (err.response.status === 204) {
                            this.hasApiKey = false;
                        }
                    });
            }

            console.log(this.sesId);

            if (!this.sesId || !this.socketToken) {
                // handle error
                console.log('socket token or session not found for this sesId');
                return;
            } else {
                this.hasApiKey = true;
            }

            this.socket = io(process.env.API || 'http://localhost:3000', {
                query: {
                    token: this.socketToken,
                },
            });

            this.fireSocketListeners();

            this.firePageVisitListner();

            if (this.clientInitiateConvInfo.conv_id) {
                this.getConvMessages(this.clientInitiateConvInfo.conv_id);
            }

            this.getChatDepartments();
            this.setTypingFalse();
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

            this.socket.on('ec_msg_from_user', (res: any) => {
                res.socket_event = 'ec_msg_from_user';
                res.caller_page = 'web-chat';

                this.$store.dispatch('chat/storeMessage', res);

                console.log('from ec_msg_from_user', res);
            });
            this.socket.on('ec_is_typing_from_user', (res: any) => {
                this.$store.dispatch('chat/updateTypingState', res);

                console.log('from ec_is_typing_from_user', res);
            });

            this.socket.on('ec_reply_from_ai', (res: any) => {
                this.$store.dispatch('chat/storeMessage', res);

                console.log('from ec_reply_from_ai', res);
            });

            // successfully sent to user
            this.socket.on('ec_msg_to_client', (res: any) => {
                this.$store.dispatch('chat/storeMessage', res);

                console.log('from ec_msg_to_client', res);
            });
            // this.socket.on('ec_is_typing_to_client', (res: any) => {
            //     console.log('from ec_is_typing_to_client', res);
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

                this.$store.dispatch('chat/updateConvState', convInfo);

                console.log('from ec_is_joined_from_conversation', convInfo);
            });

            this.socket.on('ec_is_leaved_from_conversation', (res: any) => {
                const convInfo = res.data.conv_ses_data;

                this.$store.dispatch('chat/updateConvState', convInfo);

                console.log('from ec_is_leaved_from_conversation', convInfo);
            });

            this.socket.on('ec_is_closed_from_conversation', (res: any) => {
                // this.$store.dispatch('chat/clearClientChatInitiate');
                this.$store.dispatch('chat/updateConvStateToClosed', res.data.conv_data);

                this.$store.commit('chat/showRatingForm');

                // this.socket.close();
                // // force reload dom
                // location.reload();

                console.log('from ec_is_closed_from_conversation', res);
            });

            this.socket.on('ec_error', (res: any) => {
                if (res.step === 'ec_init_conv_from_client') {
                    this.$q.notify({
                        type: 'warning',
                        position: 'bottom',
                        progress: true,
                        message: res.reason.message ? res.reason.message[0] : res.reason,
                    });
                }
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
            console.log('firePageVisitListner');

            // Warn if the browser doesn't support addEventListener or the Page Visibility API
            if (typeof document.addEventListener === 'undefined' || document.hidden === undefined) {
                console.log(
                    'This check requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.'
                );
            } else {
                // Handle page visibility change
                document.addEventListener('visibilitychange', this.handlePageVisibilityChange, false);

                this.pageInFocus = true;

                // console.log('lalalalala', window.parent.document.URL);

                if (!this.pageVisitingHandler) {
                    this.pageVisitingHandler = setInterval(() => {
                        window.parent.postMessage({ action: 'ec_page_visit_info' }, '*');
                    }, 3000);
                }
            }
        },

        handlePageVisibilityChange() {
            this.pageInFocus = document.visibilityState === 'visible';
        },

        sendPageVisitingInfo(url: any) {
            if (this.socketId) {
                if (this.pageInFocus) {
                    this.socket.emit('ec_page_visit_info_from_client', {
                        url: url,
                        sent_at: Date.now(),
                        visiting: true,
                    });

                    this.pageNotInFocusEmitted = false;
                } else {
                    if (!this.pageNotInFocusEmitted) {
                        this.socket.emit('ec_page_visit_info_from_client', {
                            url: url,
                            sent_at: Date.now(),
                            visiting: false,
                        });

                        this.pageNotInFocusEmitted = true;
                    }
                }
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

        closeChat() {
            this.socket.emit('ec_close_conversation', {
                conv_id: this.clientInitiateConvInfo.conv_id,
            });

            this.$store.commit('chat/showRatingForm');
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
