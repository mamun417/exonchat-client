<template>
    <q-page v-if="allCheck" class="tw-flex tw-flex-col tw-rounded-md" style="min-height: unset">
        <div v-show="!panelVisibleStatus">
            <q-btn
                icon="forum"
                size="18px"
                color="blue-grey"
                @click="toggleChatPanel(true)"
                class="tw-fixed tw-right-1 tw-bottom-1"
                round
            />
        </div>

        <div
            v-show="panelVisibleStatus"
            class="tw-h-full tw-w-full tw-fixed tw-bottom-0 tw-flex tw-flex-col tw-flex-grow tw-bg-blue-50 tw-text-blueGray-900 tw-rounded-md"
        >
            <template v-if="hasApiKey">
                <div
                    class="bg-blue-grey text-weight-bold tw-text-gray-50 tw-px-4 tw-py-2 tw-flex tw-items-center tw-rounded-t-md"
                >
                    <div>
                        Chat With Us
                        <q-btn v-if="develop" @click="reload" icon="refresh" class="tw-mr-1" flat dense />
                    </div>
                    <q-space></q-space>

                    <q-btn
                        v-if="conversationInfo.id && !conversationInfo.closed_at"
                        @click="closeChatModal = true"
                        icon="clear"
                        class="tw-mr-1"
                        flat
                        dense
                    />

                    <q-btn
                        :icon="panelVisibleStatus ? 'expand_more' : 'expand_less'"
                        @click="toggleChatPanel(!panelVisibleStatus)"
                        dense
                        flat
                    ></q-btn>
                </div>

                <div v-if="closeChatModal" class="tw-flex-grow tw-flex tw-flex-col tw-p-1">
                    <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center tw-px-5">
                        <q-card>
                            <q-card-section>
                                <div class="tw-text-md tw-text-center">Are you sure you want to close chat?</div>
                            </q-card-section>
                            <q-card-actions align="center">
                                <q-btn @click="closeChat" color="blue-grey" label="Yes" style="width: 70px" />
                                <q-btn
                                    @click="closeChatModal = false"
                                    color="blue-grey"
                                    label="No"
                                    style="width: 70px"
                                />
                            </q-card-actions>
                        </q-card>
                    </div>
                </div>

                <div v-else class="tw-flex-grow tw-flex tw-flex-col tw-p-1">
                    <div
                        v-if="clientInitiateConvInfo.conv_id"
                        id="webchat-container"
                        class="tw-flex-grow tw-flex tw-flex-col"
                    >
                        <message :ses_id="sesId" :socket="socket" :conv_id="clientInitiateConvInfo.conv_id">
                            <template v-slot:scroll-area-top-section>
                                <div
                                    v-if="
                                        conversationInfo.sessions?.length === 1 &&
                                        !conversationInfo.sessions[0].socket_session.user
                                    "
                                    class="tw-p-5"
                                >
                                    <div class="text-center tw-mb-1">
                                        One of our representatives will be with you shortly. Thank you for your
                                        patience.
                                    </div>
                                    <div class="text-center tw-mb-1 tw-mt-2">
                                        You are number {{ queuePosition }} in the queue.
                                    </div>
                                    <!--<div class="text-center tw-mb-1">Your chat is currently in queue</div>-->
                                    <!--<div class="text-center tw-font-bold">Someone will be with you shortly</div>-->
                                </div>
                            </template>

                            <template v-slot:scroll-area-last-section>
                                <div class="text-center" v-if="!conversationInfo.closed_at && !chatActiveStatus">
                                    Chat is idle due to 10 minutes of inactivity
                                </div>
                                <div v-if="clientInitiateConvInfo.showRatingForm" class="tw-p-5">
                                    <chat-rating-form />
                                </div>
                            </template>
                        </message>

                        <q-btn
                            v-if="conversationInfo.closed_at"
                            @click="clearSession"
                            dense
                            color="blue-grey"
                            class="tw-mb-4 tw-mx-5"
                            no-caps
                        >
                            Start New Chat
                        </q-btn>
                    </div>

                    <!--<div
                        v-else-if="clientInitiateConvInfo.showRatingForm"
                        class="tw-flex-grow tw-flex tw-items-center tw-justify-center tw-px-5"
                    >
                        <chat-rating-form @ratedByClient="clearSession" />
                    </div>-->

                    <div v-else class="tw-flex tw-flex-col justify-center tw-flex-grow">
                        <div class="tw-bg-white tw-shadow tw-m-5 tw-relative">
                            <div class="tw-px-4 tw-py-10">
                                <div v-if="successSubmitOfflineChatReq">
                                    Ticket has been successfully submitted. Our agents will reply you when they are
                                    online.
                                    <q-btn
                                        dense
                                        color="blue-grey"
                                        class="full-width tw-mt-6"
                                        @click="clearSession"
                                        no-caps
                                    >
                                        Start New Chat
                                    </q-btn>
                                </div>

                                <div v-else>
                                    <q-input
                                        v-model="convInitFields.name"
                                        :error-message="convInitFieldsErrors.name"
                                        :error="!!convInitFieldsErrors.name"
                                        @update:model-value="convInitFieldsErrors.name = ''"
                                        hide-bottom-space
                                        dense
                                        label="Your Name"
                                        color="blue-grey"
                                        class="tw-mb-3"
                                    >
                                        <template v-slot:prepend>
                                            <q-icon name="person" size="xs" color="blue-grey" />
                                        </template>
                                    </q-input>

                                    <q-input
                                        v-model="convInitFields.email"
                                        :error-message="convInitFieldsErrors.email"
                                        :error="!!convInitFieldsErrors.email"
                                        @update:model-value="convInitFieldsErrors.email = ''"
                                        hide-bottom-space
                                        dense
                                        color="blue-grey"
                                        class="tw-mb-3"
                                        label="Your Email"
                                        type="email"
                                    >
                                        <template v-slot:prepend>
                                            <q-icon name="email" size="xs" color="blue-grey" />
                                        </template>
                                    </q-input>

                                    <q-select
                                        v-model="convInitFields.department"
                                        :options="chatDepartments"
                                        @update:model-value="
                                            convInitFields.department_tag = $_.find(chatDepartments, [
                                                'id',
                                                $event,
                                            ]).tag;
                                            convInitFieldsErrors.chat_department_id = '';
                                            departmentAgentsOffline = false;
                                        "
                                        :error-message="convInitFieldsErrors.chat_department_id"
                                        :error="!!convInitFieldsErrors.chat_department_id"
                                        hide-bottom-space
                                        option-value="id"
                                        option-label="tag"
                                        label="Chat Department"
                                        class="tw-mb-3"
                                        color="blue-grey"
                                        emit-value
                                        map-options
                                        dense
                                    >
                                        <template v-slot:prepend>
                                            <q-icon name="person" size="xs" color="blue-grey" />
                                        </template>
                                    </q-select>

                                    <div v-if="departmentAgentsOffline">
                                        <q-input
                                            v-model="convInitFields.subject"
                                            :error-message="convInitFieldsErrors.subject"
                                            :error="!!convInitFieldsErrors.subject"
                                            @update:model-value="convInitFieldsErrors.subject = ''"
                                            hide-bottom-space
                                            dense
                                            label="Your Subject"
                                            color="blue-grey"
                                            class="tw-mb-3"
                                        >
                                            <template v-slot:prepend>
                                                <q-icon name="subject" size="xs" color="blue-grey" />
                                            </template>
                                        </q-input>

                                        <q-input
                                            v-model="convInitFields.message"
                                            :error-message="convInitFieldsErrors.message"
                                            :error="!!convInitFieldsErrors.message"
                                            @update:model-value="convInitFieldsErrors.message = ''"
                                            hide-bottom-space
                                            dense
                                            label="Your Message"
                                            color="blue-grey"
                                            class="tw-mb-3"
                                            autogrow
                                        >
                                            <template v-slot:prepend>
                                                <q-icon name="textsms" size="xs" color="blue-grey" />
                                            </template>
                                        </q-input>

                                        <q-btn
                                            dense
                                            color="blue-grey"
                                            class="full-width tw-mt-6"
                                            @click="submitOfflineChatReq"
                                            no-caps
                                            >Submit Ticket
                                        </q-btn>
                                        <div class="tw-text-xxs tw-mt-1">
                                            <div>Note: Our agents will resolve your issue when they are online.</div>
                                        </div>
                                    </div>

                                    <q-btn
                                        v-else
                                        dense
                                        color="blue-grey"
                                        class="full-width tw-mt-6"
                                        @click="chatInitialize"
                                        no-caps
                                        >Start Chat as Guest
                                    </q-btn>
                                </div>
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
                        color="blue-grey"
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
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import io from 'socket.io-client';
import { mapGetters } from 'vuex';
import Message from 'components/common/Message.vue';
import ChatRatingForm from 'components/common/ChatRatingForm.vue';
import moment from 'moment';

declare global {
    interface Window {
        maximizeChatPanel: any;
        minimizeChatPanel: any;
        get_widget_id: any;
    }
}

export default defineComponent({
    name: 'WebChat',
    components: { ChatRatingForm, Message },
    setup() {
        return {};
    },
    data(): any {
        return {
            develop: true,
            chatActiveStatus: true,
            activityInterval: {
                threeMinAgent: {
                    interval: '',
                    initTime: 1000 * 60 * 3,
                    time: 1000 * 60 * 3,
                },
                tenMinClient: {
                    interval: '',
                    initTime: 1000 * 60 * 10,
                    time: 1000 * 60 * 10,
                },
                thirteenMinClient: {
                    interval: '',
                    initTime: 1000 * 60 * 30,
                    time: 1000 * 60 * 30,
                },
            },
            closeChatModal: false,
            allCheck: false,
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
                department_tag: '',
                subject: '',
                message: '',
            },
            convInitFieldsErrors: {},
            msg: '',
            pageInFocus: false,
            pageNotInFocusEmitted: false,
            typingHandler: {
                typing: false,
            },
            pageVisitingHandler: null,
            gotoBottomBtnShow: false,
            departmentAgentsOffline: false,
            successSubmitOfflineChatReq: localStorage.getItem('success_submit_offline_chat_req') || false,
            queuePosition: 1,
            queuePositionInterval: '',
        };
    },

    mounted() {
        // console.log('WebChat Mounted');

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
            conversations: 'chat/conversations',
            clientInitiateConvInfo: 'chat/clientInitiateConvInfo',
        }),

        // which messages store by getConvMessages()
        conversationInfo(): any {
            return this.$store.getters['chat/conversationInfo'](this.clientInitiateConvInfo.conv_id);
        },

        conversationMessages(): any {
            return this.$store.getters['chat/conversationMessages'](this.clientInitiateConvInfo.conv_id);
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
                // first apply styles then make visible
                this.panelMaximize();

                // after all code execution set it true
                setTimeout(() => (this.panelVisibleStatus = true), 0);
            } else {
                this.panelVisibleStatus = false;
                window.localStorage.removeItem('chat_panel_visible');

                this.panelMinimize();
            }
        },

        panelMaximize() {
            window.parent.postMessage(
                {
                    action: 'ec_maximize_panel',
                    param: 'position: fixed; bottom: 15px; right: 15px; z-index: 9999999; height: 560px; width: 350px',
                },
                '*'
            );
        },
        panelMinimize() {
            window.parent.postMessage(
                {
                    action: 'ec_minimize_panel',
                    param: 'position: fixed; bottom: 15px; right: 15px; z-index: 9999999; width: 62px; height: 62px',
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
            localStorage.removeItem('ec_intvl_ct');
            localStorage.removeItem('success_submit_offline_chat_req');

            this.resetConvInitForm();

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
                        // console.log(res.data);
                        //
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

            // console.log(this.sesId);

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

            this.allCheck = true;

            this.fireSocketListeners();

            this.firePageVisitListner();

            if (this.clientInitiateConvInfo.conv_id) {
                this.getConvMessages(this.clientInitiateConvInfo.conv_id);
            }

            this.getChatDepartments();
            this.setTypingFalse();
            // localStorage.debug = '*';
            // console.log(this.socket);

            this.getQueueCountNumber();
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

                this.activityInterval.threeMinAgent.time = this.activityInterval.threeMinAgent.initTime;
                this.threeMinAgentInterval();

                this.$store.dispatch('chat/storeMessage', res);

                // console.log('from ec_msg_from_user', res);
            });
            this.socket.on('ec_is_typing_from_user', (res: any) => {
                this.$store.dispatch('chat/updateTypingState', res);

                // console.log('from ec_is_typing_from_user', res);
            });

            this.socket.on('ec_reply_from_ai', (res: any) => {
                this.$store.dispatch('chat/storeMessage', res);

                // console.log('from ec_reply_from_ai', res);
            });

            // successfully sent to user
            this.socket.on('ec_msg_to_client', (res: any) => {
                this.activityInterval.tenMinClient.time = this.activityInterval.tenMinClient.initTime;
                this.activityInterval.thirteenMinClient.time = this.activityInterval.thirteenMinClient.initTime;

                this.tenMinClientInterval();
                this.thirteenMinClientInterval();

                this.chatActiveStatus = true;

                this.$store.dispatch('chat/storeMessage', res);

                // console.log('from ec_msg_to_client', res);
            });
            // this.socket.on('ec_is_typing_to_client', (res: any) => {
            //     console.log('from ec_is_typing_to_client', res);
            // });

            this.socket.on('ec_conv_initiated_to_client', async (res: any) => {
                // console.log('from ec_conv_initiated_to_client', res);

                const clientInitiateConvInfo = localStorage.getItem('clientInitiateConvInfo');

                if (res.status === 'success') {
                    if (!clientInitiateConvInfo) {
                        await this.$store.dispatch('chat/storeClientInitiateConvInfo', res);
                    } else {
                        // if (this.conv_id === res.data.conversation_id) {
                        //     no idea for now what to do if conv_id donst match
                        // }
                    }
                }
            });

            this.socket.on('ec_is_joined_from_conversation', (res: any) => {
                const convInfo = res.data.conv_ses_data;

                this.$store.dispatch('chat/updateConvState', convInfo);

                clearInterval(this.queuePositionInterval);
                // console.log('from ec_is_joined_from_conversation', convInfo);
            });

            this.socket.on('ec_is_leaved_from_conversation', (res: any) => {
                const convInfo = res.data.conv_ses_data;

                this.$store.dispatch('chat/updateConvState', convInfo);

                // console.log('from ec_is_leaved_from_conversation', convInfo);
            });

            this.socket.on('ec_is_closed_from_conversation', (res: any) => {
                // this.$store.dispatch('chat/clearClientChatInitiate');
                this.$store.dispatch('chat/updateConvStateToClosed', res.data.conv_data);

                this.$store.commit('chat/showRatingForm', true);

                // this.socket.close();
                // // force reload dom
                // location.reload();

                clearInterval(this.queuePositionInterval);

                // console.log('from ec_is_closed_from_conversation', res);
            });

            this.socket.on('ec_conv_queue_position_res', (res: any) => {
                this.queuePosition = res.queue_position;
                console.log('from ec_conv_queue_position_res', res);
            });

            this.socket.on('ec_error', (res: any) => {
                if (res.step === 'ec_init_conv_from_client') {
                    this.$q.notify({
                        type: 'warning',
                        position: 'bottom',
                        progress: true,
                        message: res.reason.message ? res.reason.message : res.reason,
                    });

                    this.departmentAgentsOffline = true;
                }
                // console.log('from ec_error', res);
            });
        },

        chatInitialize() {
            // console.log(this.convInitFields);

            this.socket.emit('ec_init_conv_from_client', { ...this.convInitFields });

            this.getQueueCountNumber();
        },

        getQueueCountNumber() {
            this.socket.emit('ec_conv_queue_position', { conv_id: this.clientInitiateConvInfo.conv_id });

            this.queuePositionInterval = setInterval(() => {
                console.log('pppppp............................');

                if (
                    this.conversationInfo.sessions?.length === 1 &&
                    !this.conversationInfo.sessions[0].socket_session.user &&
                    !this.clientInitiateConvInfo.closed_at
                ) {
                    this.socket.emit('ec_conv_queue_position', { conv_id: this.clientInitiateConvInfo.conv_id });
                }

                // check agent joined and session is > 1
                if (
                    this.conversationInfo.conv_id &&
                    (this.clientInitiateConvInfo.closed_at || this.conversationInfo.sessions?.length > 1)
                ) {
                    clearInterval(this.queuePositionInterval);
                }
            }, 3000);
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
            // console.log('firePageVisitListner');

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

        sendPageVisitingInfo(data: any) {
            if (this.socketId) {
                if (this.pageInFocus) {
                    this.socket.emit('ec_page_visit_info_from_client', {
                        page_data: data,
                        sent_at: Date.now(),
                        visiting: true,
                    });

                    this.pageNotInFocusEmitted = false;
                } else {
                    if (!this.pageNotInFocusEmitted) {
                        this.socket.emit('ec_page_visit_info_from_client', {
                            page_data: data,
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

            this.closeChatModal = false;
        },

        submitOfflineChatReq() {
            this.convInitFields.chat_department_id = this.convInitFields.department;

            window.socketSessionApi
                .post('offline-chat-requests', this.convInitFields)
                .then((res: any) => {
                    console.log(res.data);
                    this.successSubmitOfflineChatReq = true;
                    localStorage.setItem('success_submit_offline_chat_req', 'true');
                    this.resetConvInitForm();
                })
                .catch((err: any) => {
                    this.submitOfflineChatReqErrorHandle(err);
                });
        },

        submitOfflineChatReqErrorHandle(err: any) {
            console.log(err.response.data.message);

            if (this.$_.isObject(err.response.data.message)) {
                this.convInitFieldsErrors = err.response.data.message;
            } else {
                this.$helpers.showErrorNotification(this, err.response.data.message);
            }
        },

        resetConvInitForm() {
            this.convInitFields = {};
            this.convInitFieldsErrors = {};
        },

        threeMinAgentInterval() {
            clearInterval(this.activityInterval.threeMinAgent.interval);

            this.activityInterval.threeMinAgent.interval = setInterval(() => {
                console.log('transfer chat to other agent');

                const sesIds = this.conversationInfo.sessions.map((convSes: any) => convSes.socket_session.id);

                const clientSocketSes = this.conversationInfo.sessions.find(
                    (convSes: any) => convSes.socket_session.use_for === 'client'
                ).socket_session;

                this.socket.emit('ec_chat_transfer', {
                    conv_id: this.clientInitiateConvInfo.conv_id,
                    notify_except: sesIds,
                    client_info: clientSocketSes,
                    reason: 'Chat transferred due to agent inactivity',
                });

                // for preventing infinity chat transfer
                localStorage.setItem('ec_intvl_ct', 'true');

                clearInterval(this.activityInterval.threeMinAgent.interval);
            }, this.activityInterval.threeMinAgent.time);
        },

        reload() {
            location.reload();
        },

        tenMinClientInterval() {
            clearInterval(this.activityInterval.tenMinClient.interval);

            console.log('tenMinClientInterval start');

            this.activityInterval.tenMinClient.interval = setInterval(() => {
                console.log('inactive this chat');

                this.socket.emit('ec_updated_socket_room_info', {
                    chat_status: 'inactive',
                    status_for: 'client',
                });

                this.chatActiveStatus = false;

                clearInterval(this.activityInterval.tenMinClient.interval);
            }, this.activityInterval.tenMinClient.time);
        },

        thirteenMinClientInterval() {
            clearInterval(this.activityInterval.thirteenMinClient.interval);

            console.log('thirteenMinClientInterval start');

            this.activityInterval.thirteenMinClient.interval = setInterval(() => {
                console.log('close this chat');

                this.socket.emit('ec_close_conversation', {
                    conv_id: this.clientInitiateConvInfo.conv_id,
                    closed_reason: 'due to inactivity',
                });

                clearInterval(this.activityInterval.threeMinAgent.interval);
                clearInterval(this.activityInterval.tenMinClient.interval);
                clearInterval(this.activityInterval.thirteenMinClient.interval);
            }, this.activityInterval.thirteenMinClient.time);
        },

        // its work when page reload
        calculateIntervalRestOfDuration() {
            const clientConv = this.conversations[this.clientInitiateConvInfo.conv_id];

            if (clientConv?.id && !clientConv.closed_at) {
                const joinedConvSes = clientConv.sessions.filter(
                    (convSession: any) => !convSession.left_at && convSession.socket_session.user_id
                );

                if (joinedConvSes.length) {
                    const intervals: any = {
                        agent: ['threeMinAgent'],
                        client: ['tenMinClient', 'thirteenMinClient'],
                    };

                    Object.keys(intervals).forEach((type: any) => {
                        intervals[type].forEach((interval: any) => {
                            if (!this.activityInterval[interval].interval) {
                                if (
                                    interval !== 'threeMinAgent' ||
                                    (interval === 'threeMinAgent' && localStorage.getItem('ec_intvl_ct') !== 'true')
                                )
                                    this.activityInterval[interval].time = this.getRestOfDurationOfInterval(
                                        type,
                                        clientConv,
                                        this.activityInterval[interval].time,
                                        joinedConvSes
                                    );

                                this[`${interval}Interval`]();
                            }
                        });
                    });
                }
            }
        },

        getRestOfDurationOfInterval(type: any, clientConv: any, activityTime: any, joinedConvSes: any) {
            const mySocketSesId = this.$helpers.getMySocketSessionId('client');

            const messages: any = Object.values(this.conversationMessages).filter((message: any) => {
                if (type === 'agent') {
                    return message.socket_session_id !== mySocketSesId;
                } else {
                    return message.socket_session_id === mySocketSesId;
                }
            });

            let lastActivity: any = '';

            if (!messages.length) {
                lastActivity = this.$_.sortBy(joinedConvSes, [
                    (convSes: any) => moment(convSes.joined_at).format('x'),
                ]).reverse()[0].joined_at;
            } else {
                lastActivity = this.$_.sortBy(messages, [
                    (message: any) => moment(message.created_at).format('x'),
                ]).reverse()[0].created_at;
            }

            const timerLeftDuration = moment().diff(lastActivity, 'milliseconds');

            return activityTime - timerLeftDuration;
        },
    },

    unmounted() {
        clearInterval(this.typingHandler);
        clearInterval(this.pageVisitingHandler);

        if (this.socket) {
            this.socket.close();
        }
    },

    watch: {
        // if you need to load avatars everywhere then watch conversation n use same way in the layout template
        conversations: {
            handler: async function () {
                // console.log('conversations watcher started');

                this.calculateIntervalRestOfDuration();

                if (this.usersAvatarLoading) return;

                this.usersAvatarLoading = true;

                if (this.conversations) {
                    for (const convObj of Object.values(this.conversations)) {
                        const conv: any = convObj;
                        const tempArray: any = { conv_id: conv.id, srcs: [] };

                        for (const convSes of conv.sessions) {
                            if (convSes.socket_session.user) {
                                // I can send attachment from db but for that I have to send from all the query
                                // I have to get the image so y give hard time to api so here check that
                                if (
                                    convSes.socket_session.user?.user_meta?.attachment_id &&
                                    !convSes.socket_session.user?.user_meta?.src
                                ) {
                                    try {
                                        const imgRes = await this.$api.get(
                                            `attachments/${convSes.socket_session.user.user_meta.attachment_id}`,
                                            {
                                                responseType: 'arraybuffer',
                                            }
                                        );

                                        tempArray.srcs.push({
                                            conv_ses_id: convSes.id,
                                            src: URL.createObjectURL(
                                                new Blob([imgRes.data], { type: imgRes.headers['content-type'] })
                                            ),
                                        });
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }
                            }
                        }

                        if (tempArray.srcs.length) {
                            this.$store.commit('chat/updateConversationUserAvatar', tempArray);
                        }
                    }
                }

                this.usersAvatarLoading = false;
            },
            deep: true,
            immediate: true,
        },
    },
});
</script>
