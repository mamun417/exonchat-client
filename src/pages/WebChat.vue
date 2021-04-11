<template>
    <q-page class="tw-flex tw-flex-col">
        <div class="tw-bg-green-600 text-weight-bold tw-text-gray-50 tw-px-4 tw-py-2 tw-flex tw-items-center">
            <div>Online - Chat With Us</div>
            <q-btn @click="clearSession">Clear</q-btn>
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
            <div style="max-height: 100px; overflow: auto"></div>
            <q-space></q-space>
            <q-btn icon="expand_more" dense flat></q-btn>
        </div>
        <div class="tw-flex-grow tw-flex tw-flex-col tw-p-1">
            <div v-if="clientInitiateConvInfo.conv_id" id="webchat-container" class="tw-flex-grow tw-flex tw-flex-col">
                <!--<q-scroll-area
                    @scroll="handleScroll"
                    ref="msgScrollArea"
                    class="tw-p-3 tw-flex-grow tw-text-xs"
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
                    <q-chat-message
                        v-for="(message, i) in messages"
                        :key="i"
                        :name="
                            index === 0 || message?.socket_session_id !== messages[index - 1]?.socket_session_id
                                ? message.socket_session_id
                                : ''
                        "
                        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                        :text="[message.msg]"
                        :stamp="$fromNowTime(message.created_at)"
                        :sent="checkOwnMessage(message)"
                        :text-color="checkOwnMessage(message) ? 'black' : 'white'"
                        :bg-color="checkOwnMessage(message) ? 'gray-9' : 'blue-9'"
                    />
                    <q-chat-message
                        v-if="typingHandler.typing"
                        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                        bg-color="gray-9"
                        sent
                        text-color="black"
                        :text="['hasan is typing...']"
                        class="exonchat-is-typing"
                    >
                    </q-chat-message>

                    <q-btn
                        v-if="gotoBottomBtnShow"
                        @click="scrollToBottom"
                        style="position: fixed; left: 50%; bottom: 60px"
                        class="tw-bottom-2 tw-opacity-75 tw-right-2"
                        color="black"
                        icon="keyboard_arrow_down"
                        size="sm"
                        round
                    />
                </q-scroll-area>

                <div class="tw-w-full tw-flex tw-mt-3 tw-bg-white tw-shadow-sm tw-rounded">
                    <q-btn flat color="green" icon="attachment" size="sm"></q-btn>
                    <q-input
                        v-model.trim="msg"
                        @keyup.enter.exact="sendMessage"
                        @focus="inputFocusHandle"
                        @blur="inputBlurHandle"
                        debounce="0"
                        placeholder="Write Message..."
                        color="green-8"
                        class="tw-flex-auto"
                        autogrow
                        borderless
                        dense
                    ></q-input>
                    <q-btn @click="sendMessage" v-model="msg" icon="send" flat color="green-8" size="sm"></q-btn>
                </div>-->
                <message :socket="socket" chat-panel-type="client" :messages="messages"></message>
            </div>

            <div v-else-if="userLogged" class="tw-flex tw-flex-col justify-center tw-flex-grow">
                <div class="tw-bg-white tw-shadow tw-m-5 tw-relative">
                    <div class="tw-absolute tw-m-auto full-width text-center" style="top: -25px">
                        <q-icon name="chat" size="xl" color="green"></q-icon>
                    </div>
                    <div class="tw-px-4 tw-py-16">
                        <q-select dense label="Chat Department" color="green" class="tw-mb-3"></q-select>

                        <q-btn dense color="green" class="full-width tw-mt-6">Start Chat</q-btn>
                    </div>
                </div>
            </div>
            <div v-else class="tw-flex tw-flex-col justify-center tw-flex-grow">
                <div class="tw-bg-white tw-shadow tw-m-5 tw-relative">
                    <div class="tw-absolute tw-m-auto full-width text-center" style="top: -25px">
                        <q-icon name="account_circle" size="xl" color="green"></q-icon>
                    </div>
                    <div class="tw-px-4 tw-py-16">
                        <q-input dense label="Your Name" color="green" class="tw-mb-3">
                            <template v-slot:prepend>
                                <q-icon name="person" size="xs" color="green" />
                            </template>
                        </q-input>
                        <q-input dense class="tw-mb-3" label="Your Email" type="email">
                            <template v-slot:prepend>
                                <q-icon name="email" size="xs" color="green" />
                            </template>
                        </q-input>
                        <q-btn dense color="green" class="full-width tw-mt-6" @click="chatInitialize"
                            >Start Chat as Guest
                        </q-btn>
                        <pre>{{ clientInitiateConvInfo }}</pre>
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import io from 'socket.io-client';
import { mapGetters } from 'vuex';
import Message from 'components/common/Message.vue';

export default defineComponent({
    name: 'WebChat',
    components: { Message },
    setup() {
        return {};
    },
    data(): any {
        return {
            socket: null,

            socketId: null,
            sesId: null,
            soketToken: null,

            showChatForm: false,
            userLogged: false,

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

        await this.initializeSocket();
        this.fireSocketListeners();

        this.firePageVisitListner();

        if (this.clientInitiateConvInfo) {
            this.getConvMessages(this.clientInitiateConvInfo.conv_id);
        }
        // this.setTypingFalse();
    },

    computed: {
        ...mapGetters({
            clientInitiateConvInfo: 'chat/clientInitiateConvInfo',
        }),

        // which messages store by getConvMessages()
        messages(): any {
            return this.$store.getters['chat/messages'](this.clientInitiateConvInfo.conv_id);
        },
    },

    methods: {
        clearSession() {
            localStorage.clear();
            sessionStorage.clear();
            this.clientInitiateConvInfo = {};
            location.reload();
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

            this.sesId = sessionStorage.getItem('ec_client_socket_ses_id');
            this.socketToken = sessionStorage.getItem('ec_client_socket_token');

            if (!this.sesId) {
                await window.api
                    .post('/socket-sessions', {
                        api_key: 'test',
                    })
                    .then((res: any) => {
                        console.log(res.data);

                        this.sesId = res.data.data.id;
                        this.socketToken = res.data.bearerToken;

                        sessionStorage.setItem('ec_client_socket_ses_id', res.data.data.id);
                        sessionStorage.setItem('ec_client_socket_token', res.data.bearerToken);
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
                console.log('from ec_is_joined_from_conversation', res);
            });

            this.socket.on('ec_is_leaved_from_conversation', (res: any) => {
                console.log('from ec_is_leaved_from_conversation', res);
            });

            this.socket.on('ec_is_closed_from_conversation', (res: any) => {
                // remove all info from store which store after chat initialte till end
                console.log('from ec_is_closed_from_conversation', res);
            });

            this.socket.on('ec_error', (res: any) => {
                console.log('from ec_error', res);
            });
        },

        chatInitialize() {
            this.socket.emit('ec_init_conv_from_client', {});
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
});
</script>

<!--<style lang="scss">
#webchat-container {
    .q-message {
        &.exonchat-is-typing {
            .q-message-text {
                min-height: unset;
            }
        }

        .q-message-container {
            .q-message-avatar {
                height: 32px;
                width: 32px;
                min-width: 32px;
            }
        }

        .q-message-text {
            padding: 7px;
        }
    }
}
</style>-->
