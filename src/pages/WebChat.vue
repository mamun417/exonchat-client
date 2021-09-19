<template>
    <q-page
        v-if="allCheck"
        class="ec-webchat-page tw-flex tw-flex-col tw-h-full tw-justify-end tw-rounded-md"
        style="min-height: unset"
        :class="{ [$helpers.colors().defaultText]: true, 'tw-p-2': panelVisibleStatus }"
    >
        <div v-show="!panelVisibleStatus" id="ec_chat_widget_mini_mode_container">
            <div style="display: none">
                <div ref="ec_chat_helper_container">
                    <div style="height: 100%; display: flex; justify-content: center">
                        <div style="display: flex; align-items: center">
                            <div style="display: flex; align-items: center; margin-right: 20px">
                                <svg
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="comments"
                                    class="svg-inline--fa fa-comments fa-w-18"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                    style="height: 50px; color: #1b5e20"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <div
                                    style="
                                        font-size: 20px;
                                        font-weight: 700;
                                        margin-bottom: 3px;
                                        color: rgb(50, 50, 50);
                                    "
                                >
                                    {{
                                        !onlineChatDepartments || onlineChatDepartments.length
                                            ? "Need Help?"
                                            : "Chat is Offline"
                                    }}
                                </div>
                                <div style="font-size: 16px; line-height: 20px; font-family: inherit">
                                    {{
                                        !onlineChatDepartments || onlineChatDepartments.length
                                            ? "Click here and start chatting with us!"
                                            : "Click here to leave us a message"
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-show="panelReady" class="tw-flex tw-justify-end">
                <q-btn
                    v-show="conversationInfo.id || !onlineChatDepartments || onlineChatDepartments.length"
                    size="20px"
                    :color="globalColor"
                    class="ec_mini_mode_btn tw-shadow-xl round-btn"
                    @click="toggleChatPanel(true)"
                    style="box-shadow: rgba(0 0 0 0.3) 0 1px 5px"
                    round
                    no-caps
                    no-wrap
                    unelevated
                >
                    <div class="tw-relative tw-flex tw-items-center tw-justify-center">
                        <q-icon
                            color="white"
                            class="tw-absolute default-icon widget-mini-mode-static"
                            size="30px"
                            name="far fa-comment-alt"
                        />
                        <q-icon
                            color="white"
                            class="tw-absolute default-icon widget-mini-mode-spinner"
                            size="30px"
                            name="fas fa-comment-alt"
                        />
                        <q-icon
                            color="green-8"
                            class="tw-absolute default-icon widget-mini-mode-spinner tw--top-3"
                            size="20px"
                            name="fas fa-ellipsis-h"
                        />
                    </div>
                </q-btn>

                <q-btn
                    v-show="!conversationInfo.id && onlineChatDepartments && !onlineChatDepartments.length"
                    icon="mail"
                    :color="globalColor"
                    class="tw-shadow-xl tw-mb-4"
                    @click="toggleChatPanel(true)"
                    rounded
                    label="Leave a message"
                    no-caps
                    no-wrap
                    unelevated
                ></q-btn>
            </div>
        </div>

        <div
            v-show="panelVisibleStatus"
            class="tw-h-full tw-w-full tw-flex tw-flex-col tw-flex-grow bg-white"
            :class="{ ec_chat_widget_full_mode_container_hiding: ec_chat_widget_full_mode_container_hiding }"
            id="ec_chat_widget_full_mode_container"
        >
            <div
                v-show="panelReady"
                class="tw-h-full tw-flex tw-flex-col tw-flex-grow"
                id="ec_chat_widget_full_mode_container_section"
            >
                <template v-if="hasApiKey">
                    <div
                        class="tw-text-gray-50 tw-px-2 tw-py-1 tw-flex tw-items-center tw-justify-between"
                        :class="`bg-${globalColor}`"
                        style="border-radius: 8px 8px 0 0"
                    >
                        <q-btn icon="more_horiz" flat dense>
                            <q-menu anchor="bottom right" self="top end" :class="$helpers.colors().defaultText">
                                <q-list separator style="min-width: 200px">
                                    <q-item clickable v-if="conversationInfo.id">
                                        <send-transcript
                                            :conv_id="conversationInfo.id"
                                            @sendingTranscript="sendingTranscript = $event"
                                        >
                                            <template v-slot:custom-content>
                                                <template v-if="sendingTranscript">
                                                    <q-spinner-hourglass class="on-left" size="2em" /> Sending...
                                                </template>

                                                <template v-else>
                                                    <q-item-section avatar class="tw-pr-2 tw-min-w-0">
                                                        <q-icon name="mail_outline" />
                                                    </q-item-section>
                                                    <q-item-section>Send Transcript</q-item-section>
                                                </template>
                                            </template>
                                        </send-transcript>
                                    </q-item>

                                    <q-item
                                        v-if="conversationInfo.id && !conversationInfo.closed_at"
                                        @click="closeChatModal = true"
                                        v-close-popup
                                        clickable
                                    >
                                        <q-item-section avatar class="tw-pr-2 tw-min-w-0">
                                            <q-icon name="clear" />
                                        </q-item-section>
                                        <q-item-section>Close Chat</q-item-section>
                                    </q-item>

                                    <!--<q-item clickable v-ripple :active="active">
                                        <q-item-section avatar class="tw-pr-2 tw-min-w-0">
                                            <q-icon name="volume_off" />
                                        </q-item-section>
                                        <q-item-section>Mute</q-item-section>
                                    </q-item>-->
                                </q-list>
                            </q-menu>
                        </q-btn>

                        <div class="tw-text-base tw-flex tw-items-center">
                            {{
                                conversationInfo.id || !onlineChatDepartments || onlineChatDepartments.length
                                    ? "Online - Chat with us"
                                    : "Offline - Send offline message"
                            }}
                            <q-btn v-if="develop" @click="reload" icon="refresh" flat dense />
                        </div>

                        <q-btn
                            :icon="panelVisibleStatus ? 'expand_more' : 'expand_less'"
                            @click="toggleChatPanel(!panelVisibleStatus)"
                            dense
                            flat
                        ></q-btn>
                    </div>

                    <div class="tw-flex-grow tw-flex tw-flex-col tw-relative">
                        <div v-show="closeChatModal" class="tw-flex-grow tw-flex tw-flex-col tw-relative">
                            <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center tw-px-5">
                                <q-card class="shadow-0">
                                    <q-card-section>
                                        <div class="tw-text-md tw-text-center">
                                            Are you sure you want to end this chat?
                                        </div>
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

                        <div v-show="!closeChatModal" class="tw-flex-grow tw-flex tw-flex-col tw-relative">
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
                                    ref="message"
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
                                            <div class="text-center tw-mb-1 tw-px-2">
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

                                <div
                                    v-if="conversationInfo.closed_at"
                                    class="tw-px-5 full-width tw-flex tw-justify-between tw-items-center tw-gap-4 tw-py-2"
                                >
                                    <send-transcript :conv_id="conversationInfo.id" :color="globalColor" />

                                    <div>OR</div>

                                    <q-btn @click="clearSession" :color="globalColor" no-caps unelevated>
                                        Start New Chat
                                    </q-btn>
                                </div>
                            </div>

                            <div v-else class="tw-flex tw-flex-1 tw-mx-5 tw-my-2 tw-relative">
                                <div v-if="successSubmitOfflineChatReq" class="tw-flex tw-items-center">
                                    <div>
                                        <div>
                                            Ticket has been successfully submitted. Our agents will reply you when they
                                            are online.
                                        </div>
                                        <q-btn
                                            :color="globalColor"
                                            class="full-width tw-mt-6"
                                            @click="clearSession"
                                            no-caps
                                            unelevated
                                        >
                                            Start New Chat
                                        </q-btn>
                                    </div>
                                </div>

                                <div v-else class="tw-flex tw-flex-col">
                                    <template v-if="onlineChatDepartments && onlineChatDepartments.length">
                                        <!--for support department we need to login whmcs-->
                                        <whmcs-login
                                            v-if="showWhmcsLoginForm"
                                            :chat-departments="chatDepartments"
                                            :global-color="globalColor"
                                            @cancelWhmcsLogin="
                                                (convInitFields.department_tag = ''), (convInitFields.department = '')
                                            "
                                            @whmcsLoginSuccess="whmcsLoginSuccess"
                                        />
                                        <template v-else>
                                            <div class="tw-my-7">
                                                <div>
                                                    Welcome to our LiveChat! Please fill in the form below before
                                                    starting the chat.
                                                </div>

                                                <div
                                                    v-if="whmcsInfoAssigned"
                                                    class="tw-my-2 tw-shadow-none tw-font-medium tw-flex tw-items-center tw-justify-between tw--mb-4"
                                                >
                                                    <div class="text-green-8">
                                                        You are currently logged in dashboard.
                                                    </div>
                                                    <q-btn
                                                        @click="resetConvInitForm"
                                                        size="xs"
                                                        color="orange-8"
                                                        class="tw-px-3"
                                                        label="Log Out"
                                                        no-caps
                                                        unelevated
                                                    />
                                                </div>
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
                                                :readonly="whmcsInfoAssigned"
                                            >
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
                                                :readonly="whmcsInfoAssigned"
                                            >
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
                                                option-label="display_name"
                                                label="Chat Department"
                                                class="tw-mb-3"
                                                :color="globalColor"
                                                emit-value
                                                map-options
                                                dense
                                                no-error-icon
                                                outlined
                                            >
                                                <template v-slot:option="{ itemProps, opt }">
                                                    <q-item v-bind="itemProps">
                                                        <q-item-section>
                                                            <q-item-label v-html="opt.display_name"></q-item-label>
                                                            <small
                                                                v-if="!onlineChatDepartments.includes(opt.id)"
                                                                class="tw-text-xxs tw-mt-1 text-grey-8"
                                                            >
                                                                Send offline message
                                                            </small>
                                                        </q-item-section>
                                                        <q-item-section side>
                                                            <q-badge
                                                                :color="
                                                                    onlineChatDepartments.includes(opt.id)
                                                                        ? 'green'
                                                                        : 'grey'
                                                                "
                                                                class="tw-px-2 tw-py-1"
                                                            >
                                                                {{
                                                                    onlineChatDepartments.includes(opt.id)
                                                                        ? "Online"
                                                                        : "Offline"
                                                                }}
                                                            </q-badge>
                                                        </q-item-section>
                                                    </q-item>
                                                </template>
                                            </q-select>

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
                                                type="textarea"
                                                input-style="min-height: 50px"
                                                rows="3"
                                            >
                                            </q-input>

                                            <!--offline form-->
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
                                                :color="globalColor"
                                                class="full-width tw-mt-2"
                                                @click="chatInitialize"
                                                no-caps
                                                unelevated
                                                >Start The Chat
                                            </q-btn>
                                        </template>
                                    </template>

                                    <offline-message
                                        v-else
                                        @submitOfflineMessage="successSubmitOfflineChatReq = true"
                                        :chat-departments="chatDepartments"
                                        :global-color="globalColor"
                                    />
                                </div>
                            </div>
                        </div>

                        <q-inner-loading :showing="socketConnectError" color="orange-1">
                            <div
                                class="tw-flex tw-items-center tw-justify-center tw-py-1 text-center text-weight-medium text-orange-8 tw-text-xs tw-cursor-default tw-select-none"
                            >
                                <q-spinner-ios color="orange-8" class="tw-mr-1" size="15px" />
                                <div>Network Error - Trying to Reconnect</div>
                            </div>
                        </q-inner-loading>
                    </div>
                </template>

                <div v-else class="tw-p-6 tw-flex tw-flex-col tw-flex-grow">
                    <div class="tw-flex tw-flex-col tw-flex-grow tw-justify-center text-center">
                        <div class="text-orange tw-font-medium tw-text-lg">Authorization Keys Invalid</div>
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
                </div>

                <div
                    v-if="panelVisibleStatus"
                    class="text-center tw-flex tw-justify-center tw-items-center tw-py-1 tw-gap-1"
                    style="background: rgb(240, 240, 240); border-radius: 0 0 8px 8px"
                >
                    <div class="tw-text-xxs">Powered by</div>
                    <div>
                        <a href="https://www.exonhost.com" target="_blank"
                            ><q-img src="https://www.exonhost.com/img/logo.png" width="80px"
                        /></a>
                    </div>
                </div>
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
import OfflineMessage from "components/common/OfflineMessage.vue";
import WhmcsLogin from "components/common/WhmcsLogin.vue";
import SendTranscript from "components/common/SendTranscript.vue";
import { Query } from "@vuex-orm/core";
import MessageAttachment from "src/store/models/MessageAttachment";

declare global {
    interface Window {
        maximizeChatPanel: any;
        minimizeChatPanel: any;
        get_widget_id: any;
    }
}

export default defineComponent({
    name: "WebChat",
    components: { SendTranscript, WhmcsLogin, OfflineMessage, ChatRatingForm, Message },
    setup() {
        return {};
    },
    data(): any {
        return {
            develop: process.env.DEV,

            showNeedHelpText: false,
            showNeedHelpTextTimeout: null,

            chatActiveStatus: true,

            closeChatModal: false,
            allCheck: false,

            widget_origin: "", // for current handle
            api_key: null,
            hasApiKey: false,

            panelReady: false, // at toggle fully hide both dom
            panelVisibleStatus: !!window.localStorage.getItem("chat_panel_visible"),
            panelReadyTimeout: null,

            ec_chat_widget_full_mode_container_hiding: false,

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
                department_id: "",
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

            chatWidgetMiniWidth: 250,
            queuePosition: 1,
            queuePositionInterval: "",
            getOnlineDepartmentsInterval: "",

            whmcsInfoError: false,
            whmcsInfoAssigned: false,
            globalColor: "green-10",
            roundBtnHover: false,
            sendChatInitiateMsgInterval: "",

            socketConnectError: false,
            sendingTranscript: false,
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
                    this.widget_origin = event.origin;

                    this.initializeSocket();
                }

                if (event.data.res === "page_visit_info") {
                    this.sendPageVisitingInfo(event.data.value);
                }

                if (event.data.res === "ec_chat_helper_container_clicked") {
                    this.panelMaximize();
                }
                if (event.data.res === "ec_chat_helper_container_closed_btn_clicked") {
                    this.closeHelpText();
                }

                if (event.data.res === "ec_minimized_panel") {
                    this.panelVisibleStatus = false;

                    clearTimeout(this.panelReadyTimeout);
                    this.panelReadyTimeout = setTimeout(() => (this.panelReady = true), 200);

                    this.showNeedHelpTexSection();
                }

                if (event.data.res === "ec_maximized_panel") {
                    this.panelVisibleStatus = true;

                    clearTimeout(this.panelReadyTimeout);
                    this.panelReadyTimeout = setTimeout(() => (this.panelReady = true), 500);
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

        this.$emitter.on("client_socket_token_timeout", () => {
            this.clearSession();
        });
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

        showWhmcsLoginForm(): any {
            const departmentForWhmcsLogin = "support";
            const selectedDepartment = this.convInitFields.department_tag?.toLowerCase();

            if (selectedDepartment !== departmentForWhmcsLogin) {
                return false;
            }

            // get department info
            const departmentInfo = this.chatDepartments.find(
                (department: any) => department.tag?.toLowerCase() == departmentForWhmcsLogin
            );

            // check is this department status online
            const checkDepartmentIsOnline = this.onlineChatDepartments.includes(departmentInfo.id);

            return !this.whmcsInfoAssigned && selectedDepartment === departmentForWhmcsLogin && checkDepartmentIsOnline;
        },
    },

    methods: {
        // getChatWidgetDesign() {
        //     // get design.
        //     // update chatWidgetMiniWidth variable. call onResizeMiniMode or trigger that
        // },

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

                this.showNeedHelpText = false;
                // first apply styles then make visible
                this.panelMaximize();
            } else {
                window.localStorage.removeItem("chat_panel_visible");

                this.panelMinimize();
            }
        },

        showNeedHelpTexSection() {
            clearTimeout(this.showNeedHelpTextTimeout);

            this.showNeedHelpTextTimeout = setTimeout(() => {
                const hideNeedHelpText = localStorage.getItem("hide_need_help_text");

                if (!hideNeedHelpText && this.hasApiKey) {
                    window.parent.postMessage(
                        {
                            action: "ec_show_chat_helper_container",
                            param: {
                                icon: true,
                                style: {
                                    display: "block",
                                    bottom: "85px",
                                    position: "fixed",
                                    right: "15px",
                                    height: "110px",
                                    width: "290px",
                                    background: "#fff",
                                    padding: "20px",
                                    "box-shadow": "rgb(0 0 0 / 30%) 0px 0px 2px",
                                    cursor: "pointer",
                                    "border-radius": "3px",
                                    "z-index": "99999",
                                },
                                dom: this.$refs.ec_chat_helper_container.innerHTML,
                            },
                        },
                        "*"
                    );
                }
            }, 1500);
        },

        hideNeedHelpTextSection() {
            clearTimeout(this.showNeedHelpTextTimeout);

            window.parent.postMessage(
                {
                    action: "ec_hide_chat_helper_container",
                    param: {
                        style: {
                            display: "none",
                        },
                    },
                },
                "*"
            );
        },

        panelMaximize() {
            this.ec_chat_widget_full_mode_container_hiding = false;
            this.hideNeedHelpTextSection();

            window.parent.postMessage(
                {
                    action: "ec_maximize_panel",
                    param: {
                        height: "560px",
                        "max-width": "375px",
                        width: "100%",
                        display: "block",
                        // "box-shadow": "rgb(0 0 0 / 30%) 0px 4px 12px",
                        // "border-radius": "8px",
                    },
                },
                "*"
            );
        },
        panelMinimize() {
            this.ec_chat_widget_full_mode_container_hiding = true;

            setTimeout(() => {
                window.parent.postMessage(
                    {
                        action: "ec_minimize_panel",
                        param: {
                            height: `${!this.onlineChatDepartments || this.onlineChatDepartments.length ? 70 : 60}px`,
                            width: `${!this.onlineChatDepartments || this.onlineChatDepartments.length ? 100 : 200}px`,
                            display: "block",
                            // "box-shadow": "unset",
                        },
                    },
                    "*"
                );
            }, 300);
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
            this.convInitFields.department_id = this.$_.find(this.chatDepartments, ["id", event]).id;
            this.convInitFields.department_tag = this.$_.find(this.chatDepartments, ["id", event]).tag;
            this.convInitFieldsErrors.chat_department_id = "";
            this.convInitFieldsErrors.department = "";
            this.departmentAgentsOffline = !this.onlineChatDepartments.includes(this.convInitFields.department_id);

            // check whmcs logged
            // this.whmcsInfoAssigned = false;
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
                        site_url: this.widget_origin,
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

                        if ([204, 400].includes(err.response.status)) {
                            this.hasApiKey = false;
                        }
                    });
            }

            // console.log(this.sesId);

            if (!this.sesId || !this.socketToken) {
                // handle error
                console.log("socket token or session not found for this sesId");
            } else {
                this.hasApiKey = true;

                this.socket = io(process.env.API || "http://localhost:3000", {
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

                this.getQueueCountNumber();

                this.getOnlineChatDepartments();

                this.fireOtherEvents();
                this.vuexOrmMutationListener();
            }

            this.allCheck = true;

            setTimeout(() => this.handleChatPanelVisibility(), 1000);
        },

        fireSocketListeners() {
            this.socket.on("connect", () => {
                console.log(`Your Connection id is ${this.socket.id}`); // x8WIv7-mJelg7on_ALbx

                this.socketId = this.socket.id;

                this.socketConnectError = false;
            });

            this.socket.on("disconnect", () => {
                console.log("You Are Disconnected"); // undefined

                this.socketId = this.socket.id;
            });

            this.socket.on("ec_msg_from_user", (res: any) => {
                res.socket_event = "ec_msg_from_user";
                res.caller_page = "web-chat";

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

                    // chat initiate message send to agent
                    if (this.convInitFields.message) {
                        this.socket.emit("ec_msg_from_client", {
                            temp_id: this.$helpers.getTempId(),
                            msg: this.convInitFields.message.trim(),
                            init_message_from_client: true,
                        });
                    }
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
                if (!this.panelVisibleStatus) {
                    if (!res.departments.length && this.onlineChatDepartments && this.onlineChatDepartments.length) {
                        this.panelReady = false;
                    }

                    if (this.onlineChatDepartments?.length !== res.departments.length) {
                        this.panelMinimize();
                    }
                }

                // handle dep ids
                this.onlineChatDepartments = res.departments;
                // console.log("from ec_departments_online_status_res", res);
            });

            this.socket.on("ec_error", (res: any) => {
                if (res.step === "ec_init_conv_from_client") {
                    this.errorHandleEcInitConvFromClient(res);
                }
            });

            this.socket.on("connect_error", (err: any) => {
                console.log(`connect_error due to ${err.message}`);
                this.socketConnectError = true;
            });
        },

        chatInitialize() {
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
                .then((/*res: any*/) => {
                    // console.log(res.data);
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
            this.whmcsInfoAssigned = false;
        },

        reload() {
            location.reload();
        },

        getClientWhmcsInfo(whmcsCredential: any) {
            // check already fill up name or email
            const isTypedNameOrEmail = !!this.convInitFields.name || !!this.convInitFields.email;

            // check chat already initiated || isTypedNameOrEmail
            if (this.clientInitiateConvInfo.conv_id || isTypedNameOrEmail) return;

            let whmcsInfo: any = sessionStorage.getItem(`ec_whmcs_info_${this.api_key}`);

            // this.whmcsInfoAssigned will check for first assigned otherwise every 3sec will update form
            // if client type, in the middle of typing will not reset to these info
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
                    // console.log(res.data);
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
            if (res.cause === "required_field" || res.cause === "socket_error_ec_init_conv_from_client") {
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
                    badgeClass: "hidden",
                    message: res.reason.message ? res.reason.message : res.reason,
                });
            }
        },

        closeHelpText() {
            this.showNeedHelpText = false;
            this.hideNeedHelpTextSection();

            localStorage.setItem("hide_need_help_text", "false");
        },

        whmcsLoginSuccess(userInfo: any) {
            this.convInitFields.name = userInfo.fullname;
            this.convInitFields.email = userInfo.email;

            this.convInitFields.user_info = {
                whmcs_info: {
                    ...userInfo,
                    whmcs_info: true,
                },
            };

            this.whmcsInfoAssigned = true;
        },

        vuexOrmMutationListener() {
            Query.on("afterCreate", (model: any) => {
                if (model instanceof MessageAttachment) {
                    if (!model.loaded && !model.src) {
                        MessageAttachment.update({
                            where: model.id,
                            data: { loaded: true },
                        });

                        window.socketSessionApi
                            .get(`attachments/${model.id}`, {
                                responseType: "arraybuffer",
                            })
                            .then((imgRes: any) => {
                                const src = URL.createObjectURL(
                                    new Blob([imgRes.data], { type: imgRes.headers["content-type"] })
                                );

                                MessageAttachment.update({
                                    where: model.id,
                                    data: { src: src },
                                });
                            })
                            .catch();
                    }
                }
            });
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
#ec_chat_widget_full_mode_container {
    box-shadow: rgb(0 0 0 / 30%) 0px 4px 12px;
    border-radius: 8px;

    -webkit-animation: scale-up-br 0.3s ease-in-out;
    animation: scale-up-br 0.3s ease-in-out;

    &.ec_chat_widget_full_mode_container_hiding {
        -webkit-animation: scale-down-br 0.3s ease-in-out both;
        animation: scale-down-br 0.3s ease-in-out both;
    }
}
#ec_chat_widget_mini_mode_container {
    -webkit-animation: opacity-show 0.5s ease-in-out;
    animation: opacity-show 0.5s ease-in-out;
}
#ec_chat_widget_full_mode_container_section {
    -webkit-animation: opacity-show 0.3s ease-in-out;
    animation: opacity-show 0.3s ease-in-out;
}

@-webkit-keyframes scale-up-br {
    0% {
        -webkit-transform: scale(0);
        transform: scale(0);
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
    }
    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
    }
}
@keyframes scale-up-br {
    0% {
        -webkit-transform: scale(0);
        transform: scale(0);
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
    }
    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
    }
}

@-webkit-keyframes scale-down-br {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1);
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
        opacity: 1;
    }
    100% {
        -webkit-transform: scale(0);
        transform: scale(0);
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
        opacity: 0;
    }
}
@keyframes scale-down-br {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1);
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
        opacity: 1;
    }
    100% {
        -webkit-transform: scale(0.01);
        transform: scale(0.01);
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
        opacity: 0;
    }
}

@-webkit-keyframes opacity-show {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
@keyframes opacity-show {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

//.widget-mini-mode-spinner {
//    circle {
//        fill: rgb(15, 133, 36);
//    }
//}

.round-btn {
    &:hover {
        .q-focus-helper {
            background: unset !important;
        }
    }
}

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

.widget-mini-mode-static {
    opacity: 1;
}

.widget-mini-mode-spinner {
    opacity: 0;
    transition: transform 250ms ease-in-out, opacity 250ms ease-out;
}

.ec_mini_mode_btn {
    &:hover {
        .widget-mini-mode-static {
            opacity: 0;
        }
        .widget-mini-mode-spinner {
            opacity: 1;
            transform: scale(1.1);
            //transition: transform 250ms ease-in-out, opacity 250ms ease-out;
        }
    }
}
</style>
