<template>
    <q-page class="tw-flex tw-flex-col">
        <div
            class="tw-bg-green-600 text-weight-bold tw-text-gray-50 tw-px-4 tw-py-2 tw-flex tw-items-center"
        >
            <div>Online - Chat With Us</div>
            <q-space></q-space>
            <q-btn icon="expand_more" dense flat></q-btn>
        </div>

        <div class="tw-flex-grow tw-flex tw-flex-col tw-p-1">
            <div
                v-if="showChatForm"
                id="webchat-container"
                class="tw-flex-grow tw-flex tw-flex-col"
            >
                <q-scroll-area
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
                        name="hasan"
                        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                        :text="['hey, how are you?']"
                        stamp="7 minutes ago"
                        sent
                        text-color="black"
                        bg-color="gray-9"
                    />

                    <q-chat-message
                        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
                        :text="[
                            'doing fine, how r you?',
                            'I just feel like typing a really, really, REALLY long message to annoy you...',
                        ]"
                        stamp="6 minutes ago"
                        text-color="white"
                        bg-color="blue-9"
                    />
                    <q-chat-message
                        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
                        :text="['Did it work?']"
                        stamp="6 minutes ago"
                        text-color="white"
                        bg-color="blue-9"
                    />

                    <q-chat-message
                        name="mamun"
                        avatar="https://cdn.quasar.dev/img/avatar2.jpg"
                        stamp="5 minutes ago"
                        :text="['Hey there!']"
                        sent
                        text-color="black"
                        bg-color="gray-9"
                    >
                    </q-chat-message>

                    <q-chat-message
                        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                        bg-color="gray-9"
                        sent
                        text-color="black"
                        :text="['hasan is typing...']"
                        class="exonchat-is-typing"
                    >
                    </q-chat-message>
                </q-scroll-area>

                <div
                    class="tw-w-full tw-flex tw-mt-3 tw-bg-white tw-shadow-sm tw-rounded"
                >
                    <q-btn
                        flat
                        color="green"
                        icon="attachment"
                        size="sm"
                    ></q-btn>
                    <q-input
                        v-model="msg"
                        @keyup.enter="sendMessage"
                        @focus="inputFocusHandle"
                        @blur="inputBlurHandle"
                        placeholder="Write Message..."
                        color="green-8"
                        class="tw-flex-auto"
                        autogrow
                        borderless
                        dense
                    ></q-input>
                    <q-btn
                        @click="sendMessage"
                        v-model="msg"
                        icon="send"
                        flat
                        color="green-8"
                        size="sm"
                    ></q-btn>
                </div>
            </div>
            <div
                v-else-if="userLogged"
                class="tw-flex tw-flex-col justify-center tw-flex-grow"
            >
                <div class="tw-bg-white tw-shadow tw-m-5 tw-relative">
                    <div
                        class="tw-absolute tw-m-auto full-width text-center"
                        style="top: -25px"
                    >
                        <q-icon name="chat" size="xl" color="green"></q-icon>
                    </div>
                    <div class="tw-px-4 tw-py-16">
                        <q-select
                            dense
                            label="Chat Department"
                            color="green"
                            class="tw-mb-3"
                        ></q-select>

                        <q-btn dense color="green" class="full-width tw-mt-6"
                            >Start Chat</q-btn
                        >
                    </div>
                </div>
            </div>
            <div v-else class="tw-flex tw-flex-col justify-center tw-flex-grow">
                <div class="tw-bg-white tw-shadow tw-m-5 tw-relative">
                    <div
                        class="tw-absolute tw-m-auto full-width text-center"
                        style="top: -25px"
                    >
                        <q-icon
                            name="account_circle"
                            size="xl"
                            color="green"
                        ></q-icon>
                    </div>
                    <div class="tw-px-4 tw-py-16">
                        <q-input
                            dense
                            label="Your Name"
                            color="green"
                            class="tw-mb-3"
                            ><template v-slot:prepend>
                                <q-icon
                                    name="person"
                                    size="xs"
                                    color="green"
                                /> </template
                        ></q-input>
                        <q-input
                            dense
                            class="tw-mb-3"
                            label="Your Email"
                            type="email"
                            ><template v-slot:prepend>
                                <q-icon
                                    name="email"
                                    size="xs"
                                    color="green"
                                /> </template
                        ></q-input>
                        <q-btn
                            dense
                            color="green"
                            class="full-width tw-mt-6"
                            @click="chatInitialize"
                            >Start Chat as Guest</q-btn
                        >
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import io from 'socket.io-client';

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

            showChatForm: true,
            userLogged: false,

            msg: '',
            messages: [],

            pageInFocus: false,

            typingHandler: null,
            pageVisitingHandler: null,
        };
    },
    mounted() {
        console.log('WebChat Mounted');

        this.initializeSocket();
        this.fireSocketListners();

        this.firePageVisitListner();
    },
    methods: {
        initializeSocket() {
            this.sesId = sessionStorage.getItem('exonchat-ses-id');
            console.log(this.sesId);

            if (!this.sesId) {
                this.sesId = new Date().getTime().toString();

                sessionStorage.setItem('exonchat-ses-id', this.sesId);
            }

            this.socket = io('http://localhost:3000', {
                query: {
                    ses_id: this.sesId,
                    api_key: '999',
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

            this.socket.on('ec_msg_from_agent', (data: any) => {
                console.log(`from ec_msg_from_agent ${data}`);
            });

            this.socket.on('ec_is_typing_to_client', (data: any) => {
                console.log(`from ec_is_typing_to_client ${data}`);
            });

            this.socket.on('ec_msg_to_client', (data: any) => {
                console.log(`from ec_msg_to_client ${data}`);
            });

            this.socket.on('ec_is_typing_from_agent', (data: any) => {
                console.log(`from ec_is_typing_from_agent ${data}`);
            });

            this.socket.on('ec_conv_initiated_from_client', (data: any) => {
                console.log(`from ec_conv_initiated_from_client ${data}`);

                if (data.status === 'success') {
                    if (!this.conv_id) {
                        this.conv_id = data.data.conv_id;
                        this.showChatForm = true;
                    } else {
                        if (this.conv_id === data.data.conv_id) {
                            //no idea for now what to do if conv_id donst match
                        }
                    }
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
            if (
                typeof document.addEventListener === 'undefined' ||
                document.hidden === undefined
            ) {
                console.log(
                    'This check requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.'
                );
            } else {
                // Handle page visibility change
                document.addEventListener(
                    'visibilitychange',
                    this.handlePageVisibilityChange,
                    false
                );

                if (!this.pageVisitingHandler) {
                    this.pageVisitingHandler = setInterval(() => {
                        this.sendPageVisitingInfo();
                    }, 2000);
                }
            }
        },
        handlePageVisibilityChange() {
            if (document.hidden) {
                this.pageInFocus = false;
            } else {
                this.pageInFocus = true;
            }
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
            console.log('sending the msg');

            // send event when current user is sending msg
            this.socket.emit('ec_msg_from_client', {
                msg: this.msg,
                sent_at: 'timestamp',
            }); // sentAt will also mean as tempId
            // console.log(socket);

            this.msg = '';
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
