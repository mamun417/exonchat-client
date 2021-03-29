<template>
    <q-page class="tw-flex tw-flex-col">
        <div class="tw-bg-green-600 text-weight-bold tw-text-gray-50 tw-px-4 tw-py-2 tw-flex tw-items-center">
            <div>Online - Chat With Us</div>
            <div style="max-height: 100px; overflow: auto"></div>
            <q-space></q-space>
            <q-btn icon="expand_more" dense flat></q-btn>
        </div>

        <div class="tw-flex-grow tw-flex tw-flex-col tw-p-1">
            <div v-if="convInfo.conv_id" id="webchat-container" class="tw-flex-grow tw-flex tw-flex-col">
                <q-scroll-area
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
                        name="hasan"
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
                </div>
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
                        <pre>{{ convInfo }}</pre>
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

export default defineComponent({
    name: 'WebChat',
    components: {},
    setup() {
        return {};
    },
    data(): any {
        return {
            socket: null,

            socketId: null,
            sesId: null,
            covId: null,
            convInfo: {},

            showChatForm: false,
            userLogged: false,

            msg: '',
            messages: [],

            pageInFocus: false,

            typingHandler: {
                typing: false,
            },
            pageVisitingHandler: null,
            gotoBottomBtnShow: false,
        };
    },

    computed: {
        ...mapGetters({
            // messages: 'chat/messages',
            // convInfo: 'chat/convInfo',
        }),
    },

    async mounted() {
        console.log(this.$store._modules.root.state.chat);
        console.log('WebChat Mounted');

        setInterval(() => {
            this.$forceUpdate();
        }, 30000);

        await this.initializeSocket();
        this.fireSocketListners();

        this.firePageVisitListner();

        // this.setTypingFalse();
    },
    methods: {
        async initializeSocket() {
            // get conversation information
            const convInfo: any = localStorage.getItem('convInfo');
            this.convInfo = convInfo ? JSON.parse(convInfo) : {};

            this.sesId = sessionStorage.getItem('ec_client_socket_ses_id');

            console.log(this.sesId);

            if (!this.sesId) {
                await window.api
                    .post('/socket-sessions', {
                        api_key: 'test',
                    })
                    .then((res: any) => {
                        this.sesId = res.data.id;

                        sessionStorage.setItem('ec_client_socket_ses_id', res.data.id);
                    })
                    .catch((err: any) => {
                        console.log(err);
                    });
            }

            this.socket = io('http://localhost:3000', {
                query: {
                    ses_id: this.sesId,
                    api_key: 'test',
                },
            });
            // localStorage.debug = '*';
            // console.log(this.socket);
        },

        fireSocketListners() {
            this.socket.on('connect', () => {
                console.log(`Your Connection id is ${this.socket.id}`); // x8WIv7-mJelg7on_ALbx

                this.socketId = this.socket.id;
            });

            this.socket.on('disconnect', () => {
                console.log('You Are Disconnected'); // undefined

                this.socketId = this.socket.id;
            });

            this.socket.on('ec_msg_from_user', (res: any) => {
                this.messages.push(res);
                console.log('from ec_msg_from_user', res);
            });

            this.socket.on('ec_is_typing_to_client', (res: any) => {
                console.log('from ec_is_typing_to_client', res);
            });

            // successfully sent to user
            this.socket.on('ec_msg_to_client', (res: any) => {
                this.messages.push(res);
                console.log('from ec_msg_to_client', res);
            });

            this.socket.on('ec_is_typing_from_user', (res: any) => {
                console.log(res);
                // this.typingHandler.typing = true;
                console.log('from ec_is_typing_from_user', res);
            });

            this.socket.on('ec_conv_initiated_to_client', (res: any) => {
                console.log(res);

                console.log('from ec_conv_initiated_to_client', res);

                if (res.status === 'success') {
                    if (!this.conv_id) {
                        localStorage.setItem('convInfo', JSON.stringify(res.data));
                        this.convInfo = res.data;
                    } else {
                        if (this.conv_id === res.data.conversation_id) {
                            //no idea for now what to do if conv_id donst match
                        }
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
            this.socket.emit('ec_init_conv_from_client');
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
                this.socket.emit('ec_page_visit_info_from_client', {
                    url: '',
                    sent_at: 'timestamp',
                });
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

        sendMessage(): any {
            if (!this.msg.length) {
                return false;
            }

            console.log('sending the msg');

            // send event when current user is sending msg
            this.socket.emit('ec_msg_from_client', {
                msg: this.msg,
                temp_id: this.$getTempId,
            });

            this.msg = '';
        },

        scrollToBottom() {
            const msgScrollArea = this.$refs.msgScrollArea;
            const scrollTarget = msgScrollArea.getScrollTarget();

            msgScrollArea.setScrollPosition('vertical', scrollTarget.scrollHeight, 200);
        },

        handleScroll(info: any) {
            let verticalPercentage = info.verticalPercentage;
            this.gotoBottomBtnShow = verticalPercentage < 0.9 && this.messages.length > 0;
        },

        setTypingFalse() {
            setInterval(() => {
                this.typingHandler.typing = false;
            }, 2000);
        },

        checkOwnMessage(message: any) {
            return message.socket_session_id === this.sesId;
        },
    },

    watch: {
        messages: {
            handler: function () {
                this.scrollToBottom();
            },
            deep: true,
        },
    },
});
</script>

<style lang="scss">
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
</style>
