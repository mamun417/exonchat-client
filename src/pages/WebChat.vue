<template>
    <q-page
        v-if="allCheck"
        class="ec-webchat-page tw-flex tw-flex-col tw-h-full tw-justify-end tw-rounded-md"
        style="min-height: unset"
        :class="$helpers.colors().defaultText"
    >
        <div v-show="panelReady && !panelVisibleStatus">
            <div class="tw-mb-3" v-show="showNeedHelpText">
                <div @click="showNeedHelpText = false" class="tw-flex tw-justify-end tw-mb-1">
                    <q-btn icon="close" size="xs" class="tw-shadow" round flat />
                </div>
                <!--                <div>-->
                <div class="ec-help-text tw-p-2 bg-white tw-shadow-lg">
                    <!--                    check letter count then use nowrap iff needed otherwise content height flickers-->
                    <div class="" v-show="conversationInfo.id || onlineChatDepartments.length">
                        <div class="tw-font-medium">Need Help?</div>
                        <div>Start chatting with us!</div>
                    </div>
                    <div class="" v-show="!conversationInfo.id && !onlineChatDepartments.length">
                        <div class="tw-font-medium">Need Help?</div>
                        <div>Click here to leave us a message</div>
                    </div>
                </div>
                <!--                </div>-->
            </div>

            <div class="tw-flex tw-justify-end">
                <q-btn
                    v-show="conversationInfo.id || onlineChatDepartments.length"
                    icon="forum"
                    size="18px"
                    :color="globalColor"
                    class="tw-shadow-xl"
                    @click="toggleChatPanel(true)"
                    round
                    no-caps
                    no-wrap
                    unelevated
                ></q-btn>

                <q-btn
                    v-show="!conversationInfo.id && !onlineChatDepartments.length"
                    icon="mail"
                    :color="globalColor"
                    class="tw-shadow-xl"
                    @click="toggleChatPanel(true)"
                    rounded
                    label="Leave a message"
                    no-caps
                    no-wrap
                    unelevated
                ></q-btn>
            </div>

            <q-resize-observer ref="resizeObserver" :debounce="200" @resize="onResizeMiniMode" />
        </div>

        <div
            v-show="panelReady && panelVisibleStatus"
            class="tw-h-full tw-w-full tw-fixed tw-bottom-0 tw-flex tw-flex-col tw-flex-grow"
        >
            <template v-if="hasApiKey">
                <div
                    class="tw-text-gray-50 tw-px-4 tw-py-1 tw-flex tw-items-center"
                    :class="`bg-${globalColor}`"
                    style="border-radius: 8px 8px 0 0"
                >
                    <div class="tw-text-base">
                        {{
                            conversationInfo.id || onlineChatDepartments.length
                                ? "Online - Chat with us"
                                : "Offline - Send offline message"
                        }}
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

                <div v-show="closeChatModal" class="tw-flex-grow tw-flex tw-flex-col tw-p-1">
                    <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center tw-px-5">
                        <q-card class="shadow-0">
                            <q-card-section>
                                <div class="tw-text-md tw-text-center">Are you sure you want to end this chat?</div>
                            </q-card-section>
                            <q-card-actions align="center">
                                <q-btn
                                    @click="closeChat"
                                    :color="globalColor"
                                    label="Yes"
                                    style="width: 70px"
                                    no-caps
                                    unelevated
                                />
                                <q-btn
                                    @click="closeChatModal = false"
                                    :color="globalColor"
                                    label="No"
                                    style="width: 70px"
                                    no-caps
                                    unelevated
                                />
                            </q-card-actions>
                        </q-card>
                    </div>
                </div>

                <div v-show="!closeChatModal" class="tw-flex-grow tw-flex tw-flex-col tw-p-1">
                    <div
                        v-if="clientInitiateConvInfo.conv_id"
                        id="webchat-container"
                        class="tw-flex-grow tw-flex tw-flex-col"
                    >
                        <message
                            :ses_id="sesId"
                            :socket="socket"
                            :conv_id="clientInitiateConvInfo.conv_id"
                            :mini_mode="true"
                        >
                            <template v-slot:scroll-area-top-section>
                                <div
                                    v-if="
                                        !conversationInfo.closed_at &&
                                        conversationInfo.sessions?.length === 1 &&
                                        !conversationInfo.sessions[0].socket_session.user
                                    "
                                    class="tw-py-4 tw-text-sm"
                                    :class="$helpers.colors().defaultText"
                                >
                                    <div class="text-center tw-mb-1">
                                        One of our representatives will be with you shortly. Thank you for your
                                        patience.
                                    </div>

                                    <q-separator class="tw-my-2" />

                                    <div class="text-center tw-mb-1 tw-mt-2">
                                        You are number <b>{{ queuePosition }}</b> in the queue.
                                    </div>
                                    <!--<div class="text-center tw-mb-1">Your chat is currently in queue</div>-->
                                    <!--<div class="text-center tw-font-bold">Someone will be with you shortly</div>-->
                                </div>
                            </template>

                            <template v-slot:scroll-area-last-section>
                                <div
                                    class="text-center"
                                    :class="$helpers.colors().defaultText"
                                    v-if="!conversationInfo.closed_at && !chatActiveStatus"
                                >
                                    Chat is idle due to 10 minutes of inactivity
                                </div>

                                <div v-if="clientInitiateConvInfo.showRatingForm" class="tw-mb-4">
                                    <chat-rating-form />
                                </div>
                            </template>
                        </message>

                        <div class="tw-px-5 full-width">
                            <q-btn
                                v-if="conversationInfo.closed_at"
                                @click="clearSession"
                                :color="globalColor"
                                class="full-width tw-mb-2"
                                no-caps
                                unelevated
                            >
                                Start New Chat
                            </q-btn>
                        </div>
                    </div>

                    <!--<div
                        v-else-if="clientInitiateConvInfo.showRatingForm"
                        class="tw-flex-grow tw-flex tw-items-center tw-justify-center tw-px-5"
                    >
                        <chat-rating-form @ratedByClient="clearSession" />
                    </div>-->

                    <div v-else class="">
                        <div class="tw-m-5 tw-mt-2 tw-relative">
                            <div class="">
                                <template v-if="successSubmitOfflineChatReq">
                                    Ticket has been successfully submitted. Our agents will reply you when they are
                                    online.
                                    <q-btn
                                        dense
                                        :color="globalColor"
                                        class="full-width tw-mt-6"
                                        @click="clearSession"
                                        no-caps
                                    >
                                        Start New Chat
                                    </q-btn>
                                </template>

                                <template v-else>
                                    <template v-if="onlineChatDepartments.length">
                                        <div class="tw-mb-4">
                                            Welcome to Live Chat. Please enter the information below to chat with a
                                            representative. Please remember "Technical Support" department is not for
                                            sales query. For Sales query, please select sales department. If sales
                                            department is offline please email to sales@exonhost.com with your query.
                                        </div>

                                        <q-input
                                            v-model="convInitFields.name"
                                            :error="!!convInitFieldsErrors.name"
                                            @update:model-value="convInitFieldsErrors.name = ''"
                                            hide-bottom-space
                                            dense
                                            no-error-icon
                                            label="Your Name"
                                            :color="globalColor"
                                            class="tw-mb-3"
                                            outlined
                                        >
                                            <!--<template v-slot:prepend>
                                                <q-icon name="person" size="xs"                                             :color="globalColor" />
                                            </template>-->
                                        </q-input>

                                        <q-input
                                            v-model="convInitFields.email"
                                            :error="!!convInitFieldsErrors.email"
                                            @update:model-value="convInitFieldsErrors.email = ''"
                                            hide-bottom-space
                                            dense
                                            no-error-icon
                                            :color="globalColor"
                                            class="tw-mb-3"
                                            label="Your Email"
                                            type="email"
                                            outlined
                                        >
                                            <!--<template v-slot:prepend>
                                                <q-icon name="email" size="xs"                                             :color="globalColor" />
                                            </template>-->
                                        </q-input>

                                        <q-select
                                            v-model="convInitFields.department"
                                            :options="chatDepartments"
                                            @update:model-value="changeDepartment($event)"
                                            :error="
                                                !!convInitFieldsErrors.chat_department_id ||
                                                !!convInitFieldsErrors.department
                                            "
                                            hide-bottom-space
                                            option-value="id"
                                            option-label="tag"
                                            label="Chat Department"
                                            class="tw-mb-3"
                                            :color="globalColor"
                                            emit-value
                                            map-options
                                            dense
                                            no-error-icon
                                            outlined
                                        >
                                            <!--<template v-slot:prepend>
                                                <q-icon name="person" size="xs"                                             :color="globalColor" />
                                            </template>-->

                                            <template v-slot:option="{ itemProps, opt }">
                                                <q-item v-bind="itemProps">
                                                    <q-item-section>
                                                        <q-item-label v-html="opt.tag"></q-item-label>
                                                        <small
                                                            v-if="!onlineChatDepartments.includes(opt.tag)"
                                                            class="tw-text-xxs tw-mt-1 text-grey-8"
                                                        >
                                                            Send offline message
                                                        </small>
                                                    </q-item-section>
                                                    <q-item-section side>
                                                        <q-badge
                                                            :color="
                                                                onlineChatDepartments.includes(opt.tag)
                                                                    ? 'green'
                                                                    : 'grey'
                                                            "
                                                            class="tw-px-2 tw-py-1"
                                                        >
                                                            {{
                                                                onlineChatDepartments.includes(opt.tag)
                                                                    ? "Online"
                                                                    : "Offline"
                                                            }}
                                                        </q-badge>
                                                    </q-item-section>
                                                </q-item>
                                            </template>
                                        </q-select>

                                        <div v-if="departmentAgentsOffline">
                                            <q-input
                                                v-model="convInitFields.subject"
                                                :error="!!convInitFieldsErrors.subject"
                                                @update:model-value="convInitFieldsErrors.subject = ''"
                                                hide-bottom-space
                                                dense
                                                no-error-icon
                                                label="Your Subject"
                                                :color="globalColor"
                                                class="tw-mb-3"
                                                outlined
                                            >
                                                <!--<template v-slot:prepend>
                                                    <q-icon name="subject" size="xs" :color="globalColor" />
                                                </template>-->
                                            </q-input>

                                            <q-input
                                                v-model="convInitFields.message"
                                                :error="!!convInitFieldsErrors.message"
                                                @update:model-value="convInitFieldsErrors.message = ''"
                                                hide-bottom-space
                                                dense
                                                no-error-icon
                                                label="Your Message"
                                                :color="globalColor"
                                                class="tw-mb-3"
                                                autogrow
                                                outlined
                                            >
                                                <!--<template v-slot:prepend>
                                                    <q-icon name="textsms" size="xs" :color="globalColor" />
                                                </template>-->
                                            </q-input>

                                            <q-btn
                                                dense
                                                :color="globalColor"
                                                class="full-width tw-mt-2"
                                                @click="submitOfflineChatReq"
                                                no-caps
                                                >Submit Ticket
                                            </q-btn>
                                            <div class="tw-text-xxs tw-mt-1">
                                                <div>Our agents will resolve your issue when they are online.</div>
                                            </div>
                                        </div>

                                        <q-btn
                                            v-else
                                            dense
                                            :color="globalColor"
                                            class="full-width tw-mt-2"
                                            @click="chatInitialize"
                                            no-caps
                                            unelevated
                                            >Start the chat
                                        </q-btn>
                                    </template>

                                    <offline-message
                                        v-else
                                        @submitOfflineMessage="successSubmitOfflineChatReq = true"
                                        :chat-departments="chatDepartments"
                                        :global-color="globalColor"
                                    />
                                </template>
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
                        :color="globalColor"
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
import { defineComponent } from "vue";
import io from "socket.io-client";
import { mapGetters } from "vuex";
import Message from "components/common/Message.vue";
import ChatRatingForm from "components/common/ChatRatingForm.vue";
import moment from "moment";
import OfflineMessage from "components/common/OfflineMessage.vue";

declare global {
    interface Window {
        maximizeChatPanel: any;
        minimizeChatPanel: any;
        get_widget_id: any;
    }
}

export default defineComponent({
    name: "WebChat",
    components: { OfflineMessage, ChatRatingForm, Message },
    setup() {
        return {};
    },
    data(): any {
        return {
            develop: process.env.DEV,
            showNeedHelpText: true,
            chatActiveStatus: true,
            activityInterval: {
                threeMinAgent: {
                    interval: "",
                    initTime: 1000 * 60 * 3,
                    time: 1000 * 60 * 3,
                },
                tenMinClient: {
                    interval: "",
                    initTime: 1000 * 60 * 10,
                    time: 1000 * 60 * 10,
                },
                thirteenMinClient: {
                    interval: "",
                    initTime: 1000 * 60 * 30,
                    time: 1000 * 60 * 30,
                },
            },
            closeChatModal: false,
            allCheck: false,
            api_key: null,
            hasApiKey: false,

            panelReady: false, // at toggle fully hide both dom
            panelVisibleStatus: !!window.localStorage.getItem("chat_panel_visible"),

            socket: null,
            socketId: null,
            sesId: null,
            showChatForm: false,
            userLogged: false,
            chatDepartments: [],
            onlineChatDepartments: [],
            convInitFields: {
                name: "",
                email: "",
                department: "",
                department_tag: "",
                subject: "",
                message: "",
                user_info: {},
            },
            convInitFieldsErrors: {},
            msg: "",
            pageInFocus: false,
            pageNotInFocusEmitted: false,
            typingHandler: {
                typing: false,
            },
            pageVisitingHandler: null,
            gotoBottomBtnShow: false,
            departmentAgentsOffline: false,
            successSubmitOfflineChatReq: localStorage.getItem("success_submit_offline_chat_req") || false,

            chatWidgetMiniWidth: 200,
            queuePosition: 1,
            queuePositionInterval: "",
            getOnlineDepartmentsInterval: "",

            whmcsInfoError: false,
            whmcsInfoAssigned: false,
            globalColor: "green-10",
        };
    },

    mounted() {
        // console.log('WebChat Mounted');

        // initiate first for listen response from parent
        window.addEventListener(
            "message",
            (event) => {
                if (event.data.res === "widget_id" && event.data.value) {
                    if (this.api_key === event.data.value) return; // a safe check

                    this.api_key = event.data.value;

                    this.initializeSocket();
                }

                if (event.data.res === "page_visit_info") {
                    this.sendPageVisitingInfo(event.data.value);
                }

                if (event.data.res === "ec_minimized_panel") {
                    this.panelVisibleStatus = false;

                    this.panelReady = true;
                }

                if (event.data.res === "ec_maximized_panel") {
                    this.panelVisibleStatus = true;

                    this.panelReady = true;
                }

                if (event.data.res === "exonchat_obj" && event.data.value) {
                    if (
                        event.data.value.hasOwnProperty("whmcs_info") &&
                        event.data.value.whmcs_info.clientId &&
                        event.data.value.whmcs_info.clientEmail
                    ) {
                        this.getClientWhmcsInfo(event.data.value.whmcs_info);
                    }
                }

                // handle other res
            },
            false
        );

        // send mounted to parent so that it can send infos
        window.parent.postMessage({ action: "ec_mounted" }, "*");

        this.handleChatPanelVisibility();

        // await this.initializeSocket();
    },

    computed: {
        ...mapGetters({
            conversations: "chat/conversations",
            clientInitiateConvInfo: "chat/clientInitiateConvInfo",
        }),

        // which messages store by getConvMessages()
        conversationInfo(): any {
            return this.$store.getters["chat/conversationInfo"](this.clientInitiateConvInfo.conv_id);
        },

        conversationMessages(): any {
            return this.$store.getters["chat/conversationMessages"](this.clientInitiateConvInfo.conv_id);
        },
    },

    methods: {
        onResizeMiniMode(size: any) {
            // call this function one time for get height & width
            if (this.panelVisibleStatus) return;

            // size.width is unstable

            // if (size.width < 160) {
            //     size.width = 160;
            // }

            let width = 190;
            let height = size.height;

            if (this.onlineChatDepartments.length && !this.showNeedHelpText) {
                width = 100;
                height = 70;
            }

            window.parent.postMessage(
                {
                    action: "ec_minimize_panel",
                    param: {
                        height: `${height}px`,
                        width: `${width}px`,
                        display: "block",
                        "box-shadow": "unset",
                    },
                },
                "*"
            );
        },

        getChatWidgetDesign() {
            // get design.
            // update chatWidgetMiniWidth variable. call onResizeMiniMode or trigger that
        },

        handleChatPanelVisibility() {
            if (this.panelVisibleStatus) {
                this.panelMaximize();
            } else {
                this.panelMinimize();
            }
        },
        toggleChatPanel(toggleTo: any) {
            this.panelReady = false;

            if (toggleTo) {
                window.localStorage.setItem("chat_panel_visible", "true");
                // first apply styles then make visible
                this.panelMaximize();
            } else {
                window.localStorage.removeItem("chat_panel_visible");

                this.panelMinimize();
            }
        },

        panelMaximize() {
            window.parent.postMessage(
                {
                    action: "ec_maximize_panel",
                    param: {
                        height: "560px",
                        width: "350px",
                        display: "block",
                        "box-shadow": "rgb(0 0 0 / 30%) 0px 4px 12px",
                        "border-radius": "8px",
                    },
                },
                "*"
            );
        },
        panelMinimize() {
            window.parent.postMessage(
                {
                    action: "ec_minimize_panel",
                    param: {
                        height: "300px",
                        width: `${this.chatWidgetMiniWidth}px`,
                        display: "block",
                        "box-shadow": "unset",
                    },
                },
                "*"
            );
        },

        clearSession() {
            // handle actual close by emitting
            this.socket.close();

            localStorage.removeItem("clientInitiateConvInfo");
            localStorage.removeItem("ec_client_socket_token");
            localStorage.removeItem("ec_client_socket_ses_id");
            localStorage.removeItem("showRatingForm");
            localStorage.removeItem("ec_intvl_ct");
            localStorage.removeItem("success_submit_offline_chat_req");

            this.resetConvInitForm();

            location.reload();
        },

        changeDepartment(event: any) {
            this.convInitFields.department_tag = this.$_.find(this.chatDepartments, ["id", event]).tag;
            this.convInitFieldsErrors.chat_department_id = "";
            this.departmentAgentsOffline = !this.onlineChatDepartments.includes(this.convInitFields.department_tag);
        },

        getChatDepartments() {
            window.socketSessionApi
                .get("/departments")
                .then((res: any) => {
                    // console.log('webchat departments', res);
                    this.chatDepartments = res.data;
                })
                .catch((e: any) => {
                    console.log(e);
                });
        },

        getOnlineChatDepartments() {
            if (!this.clientInitiateConvInfo.conv_id) {
                this.socket.emit("ec_departments_online_status", {});

                this.getOnlineDepartmentsInterval = setInterval(() => {
                    if (!this.clientInitiateConvInfo.conv_id) {
                        this.socket.emit("ec_departments_online_status", {});
                    } else {
                        clearInterval(this.getOnlineDepartmentsInterval);
                    }
                }, 3000);
            }
        },

        // store conversation messages and get the messages by getters (messages)
        getConvMessages(convId: string) {
            this.$store.dispatch("chat/getConvMessages", {
                convId,
                client_page: true,
            });
        },

        async initializeSocket() {
            if (!this.api_key) return;

            // get conversation information
            const clientInitiateConvInfo: any = localStorage.getItem("clientInitiateConvInfo");
            this.clientInitiateConvInfo = clientInitiateConvInfo ? JSON.parse(clientInitiateConvInfo) : {};

            // we are now supporting client chat after browser restart
            this.sesId = localStorage.getItem("ec_client_socket_ses_id");
            this.socketToken = localStorage.getItem("ec_client_socket_token");

            if (!this.sesId || !this.socketToken) {
                await window.api
                    .post("/socket-sessions", {
                        api_key: this.api_key,
                    })
                    .then((res: any) => {
                        // console.log(res.data);
                        //
                        this.sesId = res.data.data.socket_session.id;
                        this.socketToken = res.data.bearerToken;

                        localStorage.setItem("ec_client_socket_ses_id", this.sesId);
                        localStorage.setItem("ec_client_socket_token", this.socketToken);
                    })
                    .catch((err: any) => {
                        console.log("from web chat error", err.response);

                        if (err.response.status === 204) {
                            this.hasApiKey = false;
                        }
                    });
            }

            // console.log(this.sesId);

            if (!this.sesId || !this.socketToken) {
                // handle error
                console.log("socket token or session not found for this sesId");
                return;
            } else {
                this.hasApiKey = true;
            }

            this.socket = io(process.env.API || "http://localhost:3000", {
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

            this.getOnlineChatDepartments();

            this.fireOtherEvents();
        },

        fireSocketListeners() {
            this.socket.on("connect", () => {
                console.log(`Your Connection id is ${this.socket.id}`); // x8WIv7-mJelg7on_ALbx

                this.socketId = this.socket.id;
            });

            this.socket.on("disconnect", () => {
                console.log("You Are Disconnected"); // undefined

                this.socketId = this.socket.id;
            });

            this.socket.on("ec_msg_from_user", (res: any) => {
                res.socket_event = "ec_msg_from_user";
                res.caller_page = "web-chat";

                this.activityInterval.threeMinAgent.time = this.activityInterval.threeMinAgent.initTime;
                this.threeMinAgentInterval();

                this.$store.dispatch("chat/storeMessage", res);

                // console.log('from ec_msg_from_user', res);
            });
            this.socket.on("ec_is_typing_from_user", (res: any) => {
                this.$store.dispatch("chat/updateTypingState", res);

                // console.log('from ec_is_typing_from_user', res);
            });

            this.socket.on("ec_reply_from_ai", (res: any) => {
                this.$store.dispatch("chat/storeMessage", res);

                // console.log('from ec_reply_from_ai', res);
            });

            // successfully sent to user
            this.socket.on("ec_msg_to_client", (res: any) => {
                this.activityInterval.tenMinClient.time = this.activityInterval.tenMinClient.initTime;
                this.activityInterval.thirteenMinClient.time = this.activityInterval.thirteenMinClient.initTime;

                this.tenMinClientInterval();
                this.thirteenMinClientInterval();

                this.chatActiveStatus = true;

                this.$store.dispatch("chat/storeMessage", res);

                // console.log('from ec_msg_to_client', res);
            });
            // this.socket.on('ec_is_typing_to_client', (res: any) => {
            //     console.log('from ec_is_typing_to_client', res);
            // });

            this.socket.on("ec_conv_initiated_to_client", async (res: any) => {
                if (res.status === "success") {
                    // we don't care now if it's re updating storage
                    await this.$store.dispatch("chat/storeClientInitiateConvInfo", res);
                }
            });

            this.socket.on("ec_is_joined_from_conversation", (res: any) => {
                const convInfo = res.data.conv_ses_data;

                this.$store.dispatch("chat/updateConvState", convInfo);

                clearInterval(this.queuePositionInterval);
                // console.log('from ec_is_joined_from_conversation', convInfo);
            });

            this.socket.on("ec_is_leaved_from_conversation", (res: any) => {
                const convInfo = res.data.conv_ses_data;

                this.$store.dispatch("chat/updateConvState", convInfo);

                // console.log('from ec_is_leaved_from_conversation', convInfo);
            });

            this.socket.on("ec_is_closed_from_conversation", (res: any) => {
                // this.$store.dispatch('chat/clearClientChatInitiate');
                this.$store.dispatch("chat/updateConvStateToClosed", res.data.conv_data);

                this.$store.commit("chat/showRatingForm", true);

                // this.socket.close();
                // // force reload dom
                // location.reload();

                clearInterval(this.queuePositionInterval);

                // console.log('from ec_is_closed_from_conversation', res);
            });

            this.socket.on("ec_conv_queue_position_res", (res: any) => {
                this.queuePosition = res.queue_position;

                // console.log('from ec_conv_queue_position_res', res);
            });

            this.socket.on("ec_departments_online_status_res", (res: any) => {
                this.onlineChatDepartments = res.departments;
                console.log("from ec_departments_online_status_res", res);
            });

            this.socket.on("ec_error", (res: any) => {
                if (res.step === "ec_init_conv_from_client") {
                    this.errorHandleEcInitConvFromClient(res);
                }
            });
        },

        chatInitialize() {
            console.log(this.convInitFields);

            this.socket.emit("ec_init_conv_from_client", { ...this.convInitFields });

            this.getQueueCountNumber();
        },

        getQueueCountNumber() {
            this.socket.emit("ec_conv_queue_position", { conv_id: this.clientInitiateConvInfo.conv_id });

            this.queuePositionInterval = setInterval(() => {
                if (
                    this.conversationInfo.sessions?.length === 1 &&
                    !this.conversationInfo.sessions[0].socket_session.user &&
                    !this.clientInitiateConvInfo.closed_at
                ) {
                    this.socket.emit("ec_conv_queue_position", { conv_id: this.clientInitiateConvInfo.conv_id });
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
            if (typeof document.addEventListener === "undefined" || document.hidden === undefined) {
                console.log(
                    "This check requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API."
                );
            } else {
                // Handle page visibility change
                document.addEventListener("visibilitychange", this.handlePageVisibilityChange, false);

                this.pageInFocus = true;

                // console.log('lalalalala', window.parent.document.URL);

                if (!this.pageVisitingHandler) {
                    this.pageVisitingHandler = setInterval(() => {
                        window.parent.postMessage({ action: "ec_page_visit_info" }, "*");
                    }, 3000);
                }
            }
        },

        fireOtherEvents() {
            setInterval(() => {
                window.parent.postMessage({ action: "getExonchatObj" }, "*");
            }, 3000);

            window.addEventListener("storage", (event) => {
                if (event.oldValue !== event.newValue) {
                    if (event.key === `ec_update_storage_ec_whmcs_info_${this.api_key}` && event.newValue) {
                        // later handle whmcs logout
                        localStorage.removeItem(`ec_update_storage_ec_whmcs_info_${this.api_key}`);

                        sessionStorage.setItem(`ec_whmcs_info_${this.api_key}`, event.newValue);
                    }
                }
            });
        },

        handlePageVisibilityChange() {
            this.pageInFocus = document.visibilityState === "visible";
        },

        sendPageVisitingInfo(data: any) {
            if (this.socketId) {
                if (this.pageInFocus) {
                    this.socket.emit("ec_page_visit_info_from_client", {
                        page_data: data,
                        sent_at: Date.now(),
                        visiting: true,
                    });

                    this.pageNotInFocusEmitted = false;
                } else {
                    if (!this.pageNotInFocusEmitted) {
                        this.socket.emit("ec_page_visit_info_from_client", {
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

                this.socket.emit("ec_is_typing_from_client", {
                    msg: this.msg,
                    sent_at: "timestamp",
                });
            }
        },

        setTypingFalse() {
            setInterval(() => {
                this.typingHandler.typing = false;
            }, 2000);
        },

        closeChat() {
            this.socket.emit("ec_close_conversation", {
                conv_id: this.clientInitiateConvInfo.conv_id,
            });

            this.$store.commit("chat/showRatingForm");

            this.closeChatModal = false;
        },

        submitOfflineChatReq() {
            this.convInitFields.chat_department_id = this.convInitFields.department;

            window.socketSessionApi
                .post("offline-chat-requests", this.convInitFields)
                .then((res: any) => {
                    console.log(res.data);
                    this.successSubmitOfflineChatReq = true;
                    localStorage.setItem("success_submit_offline_chat_req", "true");
                    this.resetConvInitForm();
                })
                .catch((err: any) => {
                    this.submitOfflineChatReqErrorHandle(err);
                });
        },

        submitOfflineChatReqErrorHandle(err: any) {
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
                console.log("transfer chat to other agent");

                const sesIds = this.conversationInfo.sessions.map((convSes: any) => convSes.socket_session.id);

                const clientSocketSes = this.conversationInfo.sessions.find(
                    (convSes: any) => convSes.socket_session.use_for === "client"
                ).socket_session;

                this.socket.emit("ec_chat_transfer", {
                    conv_id: this.clientInitiateConvInfo.conv_id,
                    notify_except: sesIds,
                    client_info: clientSocketSes,
                    reason: "Chat transferred due to agent inactivity",
                });

                // for preventing infinity chat transfer
                localStorage.setItem("ec_intvl_ct", "true");

                clearInterval(this.activityInterval.threeMinAgent.interval);
            }, this.activityInterval.threeMinAgent.time);
        },

        reload() {
            location.reload();
        },

        tenMinClientInterval() {
            clearInterval(this.activityInterval.tenMinClient.interval);

            console.log("tenMinClientInterval start");

            this.activityInterval.tenMinClient.interval = setInterval(() => {
                console.log("inactive this chat");

                this.socket.emit("ec_updated_socket_room_info", {
                    chat_status: "inactive",
                    status_for: "client",
                });

                this.chatActiveStatus = false;

                clearInterval(this.activityInterval.tenMinClient.interval);
            }, this.activityInterval.tenMinClient.time);
        },

        thirteenMinClientInterval() {
            clearInterval(this.activityInterval.thirteenMinClient.interval);

            console.log("thirteenMinClientInterval start");

            this.activityInterval.thirteenMinClient.interval = setInterval(() => {
                console.log("close this chat");

                this.socket.emit("ec_close_conversation", {
                    conv_id: this.clientInitiateConvInfo.conv_id,
                    closed_reason: "due to inactivity",
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
                        agent: ["threeMinAgent"],
                        client: ["tenMinClient", "thirteenMinClient"],
                    };

                    Object.keys(intervals).forEach((type: any) => {
                        intervals[type].forEach((interval: any) => {
                            if (!this.activityInterval[interval].interval) {
                                if (
                                    interval !== "threeMinAgent" ||
                                    (interval === "threeMinAgent" && localStorage.getItem("ec_intvl_ct") !== "true")
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
            const mySocketSesId = this.$helpers.getMySocketSessionId("client");

            const messages: any = Object.values(this.conversationMessages).filter((message: any) => {
                if (type === "agent") {
                    return message.socket_session_id !== mySocketSesId;
                } else {
                    return message.socket_session_id === mySocketSesId;
                }
            });

            let lastActivity: any = "";

            if (!messages.length) {
                lastActivity = this.$_.sortBy(joinedConvSes, [
                    (convSes: any) => moment(convSes.joined_at).format("x"),
                ]).reverse()[0].joined_at;
            } else {
                lastActivity = this.$_.sortBy(messages, [
                    (message: any) => moment(message.created_at).format("x"),
                ]).reverse()[0].created_at;
            }

            const timerLeftDuration = moment().diff(lastActivity, "milliseconds");

            return activityTime - timerLeftDuration;
        },

        getClientWhmcsInfo(whmcsCredential: any) {
            // check chat already initiated
            if (this.clientInitiateConvInfo.conv_id) return;

            let whmcsInfo: any = sessionStorage.getItem(`ec_whmcs_info_${this.api_key}`);

            // this.whmcsInfoAssigned will check for first assigned otherwise every 3sec will update form
            // if client type, in the middle of typing will reset to these info
            if (whmcsInfo && !this.whmcsInfoAssigned) {
                whmcsInfo = JSON.parse(whmcsInfo);

                this.convInitFields.name = whmcsInfo?.fullname;
                this.convInitFields.email = whmcsInfo?.email;

                this.whmcsInfoAssigned = true;

                return;
            }

            // without these don't call api
            if (
                !whmcsCredential?.clientId ||
                !whmcsCredential?.clientEmail ||
                this.whmcsInfoError ||
                this.whmcsInfoAssigned
            )
                return;

            window.api
                .post("apps/whmcs/client-details", {
                    clientid: whmcsCredential?.clientId, // change key to client_id
                    email: whmcsCredential?.clientEmail,
                })
                .then((res: any) => {
                    console.log(res.data);
                    this.convInitFields.name = res.data.fullname;
                    this.convInitFields.email = res.data.email;

                    this.convInitFields.user_info = {
                        whmcs_info: {
                            ...res.data,
                            whmcs_info: true,
                        },
                    };

                    sessionStorage.setItem(`ec_whmcs_info_${this.api_key}`, JSON.stringify(res.data));

                    localStorage.setItem(`ec_update_storage_ec_whmcs_info_${this.api_key}`, JSON.stringify(res.data));

                    this.whmcsInfoAssigned = true;
                })
                .catch((err: any) => {
                    console.log(err.response);
                    this.whmcsInfoError = true;
                });
        },

        errorHandleEcInitConvFromClient(res: any) {
            if (res.cause === "required_field") {
                this.submitOfflineChatReqErrorHandle({
                    response: {
                        data: {
                            message: res.reason.messages,
                        },
                    },
                });
            }

            if (res.cause === "offline_agent") {
                this.departmentAgentsOffline = true;

                this.$q.notify({
                    type: "warning",
                    position: "bottom",
                    progress: true,
                    message: res.reason.message ? res.reason.message : res.reason,
                });
            }
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
                                                responseType: "arraybuffer",
                                            }
                                        );

                                        tempArray.srcs.push({
                                            conv_ses_id: convSes.id,
                                            src: URL.createObjectURL(
                                                new Blob([imgRes.data], { type: imgRes.headers["content-type"] })
                                            ),
                                        });
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }
                            }
                        }

                        if (tempArray.srcs.length) {
                            this.$store.commit("chat/updateConversationUserAvatar", tempArray);
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

<style lang="scss">
.ec-webchat-page {
    .q-field__control {
        &.text-negative {
            &:after {
                border-color: rgb(232, 206, 204);
            }
        }
    }
}

.q-field--outlined:hover .q-field__control:before {
    border: 1px solid rgba(0, 0, 0, 0.24);
}
</style>
