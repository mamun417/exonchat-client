<template>
    <q-scroll-area
        @scroll="scrollInfo = $event"
        ref="msgScrollArea"
        class="tw-px-0 tw-flex-grow tw-text-xs"
        style="height: 1px"
        :bar-style="{
            background: 'grey',
            width: '8px',
            borderRadius: '5px',
            zIndex: 99999,
        }"
        :thumb-style="{
            borderRadius: '5px',
            backgroundColor: '#bec3cd',
            width: '8px',
            opacity: 0.7,
            zIndex: 99999,
        }"
        :content-style="{}"
    >
        <!--        debounce is for load spam-->
        <q-infinite-scroll
            ref="myInfiniteScrollArea"
            :scroll-target="$refs.msgScrollArea"
            @load="handleInfiniteScrollLoad"
            :offset="250"
            :debounce="2000"
            reverse
        >
            <template v-slot:default>
                <slot name="scroll-area-top-section"></slot>

                <div v-if="gettingNewMessages" class="tw-text-center" :class="$helpers.colors().defaultText">
                    Loading History...
                </div>

                <div class="tw-relative tw-z-10">
                    <template v-for="(message, index) in messages" :key="message.id" class="justify-center">
                        <div class="">
                            <div v-if="message.message_type === 'log'" class="tw-flex tw-items-center tw-py-2">
                                <!--dot circle-->
                                <div
                                    v-if="isAgentChatPanel"
                                    class="tw-flex-shrink-0 tw-flex tw-items-center tw-justify-center"
                                    :class="{ 'tw-w-16': mini_mode, 'tw-w-20': !mini_mode }"
                                >
                                    <i
                                        class="fa fa-circle"
                                        :class="`text-${globalColor}-6`"
                                        :style="`font-size: 4px`"
                                        aria-hidden="true"
                                    ></i>
                                </div>

                                <!--state info-->
                                <div
                                    class="tw-flex tw-items-center tw-w-full"
                                    :class="{
                                        'tw-justify-between tw-text-sm': isAgentChatPanel,
                                        'tw-justify-center tw-text-xs': !isAgentChatPanel,
                                        'tw-pr-4': !mini_mode,
                                    }"
                                >
                                    <div class="text-center">
                                        <template v-if="message.msg === 'initiate'">
                                            <span
                                                :class="`tw-mr-1 tw-break-none tw-font-medium tw-capitalize text-${globalColor}`"
                                            >
                                                Chat Initiated
                                            </span>
                                        </template>

                                        <template v-else-if="message.msg === 'chat_inactive'">
                                            <span :class="`tw-mr-1 tw-break-none ${$helpers.colors().defaultText}`">
                                                Chat is idle due to inactivity
                                            </span>
                                        </template>

                                        <template v-else-if="message.msg && message.msg.split('_')[0] === 'transfer'">
                                            <span :class="`tw-mr-1 tw-break-none ${$helpers.colors().defaultText}`">
                                                {{ transferMsgMaker(message) }}
                                            </span>
                                        </template>

                                        <template v-else>
                                            <span
                                                v-if="
                                                    !(
                                                        !isAgentChatPanel &&
                                                        getConvStateStatusMessage(message).state === 'closed'
                                                    )
                                                "
                                                :class="`tw-mr-1 tw-break-none tw-font-medium tw-capitalize text-${globalColor}`"
                                            >
                                                {{ getConvStateStatusMessage(message).name }}
                                            </span>
                                            <span :class="$helpers.colors().defaultText">
                                                {{
                                                    !isAgentChatPanel &&
                                                    getConvStateStatusMessage(message).state === "closed"
                                                        ? `Chat Ended By ${
                                                              getConvStateStatusMessage(message).name
                                                          } at ${getDateTime(message.created_at)}`
                                                        : `${getConvStateStatusMessage(message).state_message} ${
                                                              getConvStateStatusMessage(message).end_message
                                                          }`
                                                }}
                                            </span>
                                        </template>
                                    </div>

                                    <div
                                        v-if="isAgentChatPanel"
                                        :class="{
                                            'tw-text-xxs': mini_mode,
                                            'tw-text-xs': !mini_mode,
                                            [$helpers.colors().dateTimeText]: true,
                                        }"
                                    >
                                        {{ getDateTime(message.created_at) }}
                                    </div>
                                </div>
                            </div>

                            <!--                            speaking with -->
                            <div
                                v-if="
                                    message.message_type === 'log' &&
                                    this.chatPanelType === 'client' &&
                                    message.session?.user &&
                                    message.msg === 'joined' &&
                                    speakingWithUser?.msg?.id === message.id
                                "
                                class="tw-flex tw-items-center tw-justify-center tw--mt-2"
                            >
                                <div class="tw-text-center tw-mt-4">
                                    <ec-avatar
                                        :image_src="speakingWithUser.user.user_meta.src"
                                        :name="speakingWithUser.user.user_meta.display_name"
                                        :email="speakingWithUser.user.email"
                                    >
                                    </ec-avatar>
                                    <div class="tw-mt-2 tw-text-sm tw-mb-4" :class="$helpers.colors().defaultText">
                                        You are currently speaking to
                                        {{ $_.upperFirst(speakingWithUser.user.user_meta.display_name) }}
                                    </div>
                                </div>
                            </div>

                            <!--                            message-->
                            <q-card
                                v-if="message.message_type === 'message'"
                                class="tw-pb-0 tw-my-4"
                                :class="[mini_mode ? 'tw-shadow-none' : 'tw-shadow-sm']"
                                :style="
                                    checkOwnMessage(message)
                                        ? `background-color: ${
                                              isAgentChatPanel ? '#f0f5f8' : 'rgba(46, 104, 44, 0.04)'
                                          }`
                                        : ''
                                "
                            >
                                <q-card-section class="tw-px-0 tw-flex tw-py-3" :class="{ 'tw-py-2': mini_mode }">
                                    <div
                                        class="tw-flex-shrink-0 tw-flex tw-justify-center"
                                        :class="{ 'tw-w-16': mini_mode, 'tw-w-20': !mini_mode }"
                                    >
                                        <ec-avatar
                                            :size="mini_mode ? 'lg' : 'xl'"
                                            :image_src="
                                                msgSenderInfo(message, index).type === 'ai'
                                                    ? 'fas fa-robot'
                                                    : msgSenderInfo(message, index).src
                                            "
                                            :name="msgSenderInfo(message, index).img_alt_name"
                                            :is_icon="msgSenderInfo(message, index).type === 'ai'"
                                            :email="msgSenderInfo(message, index).email"
                                            class=""
                                        >
                                            <!--<q-tooltip class="">{{ msgSenderInfo(message, index).email }}</q-tooltip>-->
                                        </ec-avatar>
                                    </div>
                                    <div class="tw-pr-4 tw-text-base tw-w-full">
                                        <div
                                            class="tw-flex tw-justify-between tw-items-center"
                                            :class="{ 'tw-mb-2': mini_mode, 'tw-mb-3': !mini_mode }"
                                        >
                                            <div class="tw-flex tw-items-center tw-gap-2 tw-mr-4">
                                                <div
                                                    :class="`tw-font-bold tw-capitalize text-${globalColor} tw-text-sm`"
                                                >
                                                    {{ msgSenderInfo(message, index).display_name }}
                                                </div>
                                                <div v-if="!isAgentToAgentConversation && isAgentChatPanel">
                                                    <div
                                                        class="tw-rounded-sm tw-text-xxs tw-px-1 tw-uppercase"
                                                        :class="{ '': msgSenderInfo(message, index).type === 'client' }"
                                                        style="border: 1px solid"
                                                        :style="{
                                                            backgroundColor:
                                                                msgSenderInfo(message, index).type === 'client'
                                                                    ? '#f0f5f8'
                                                                    : '#00568b',
                                                            borderColor:
                                                                msgSenderInfo(message, index).type === 'client'
                                                                    ? '#cddee8'
                                                                    : '#003658',
                                                            color:
                                                                msgSenderInfo(message, index).type === 'client'
                                                                    ? '#333'
                                                                    : '#fff',
                                                        }"
                                                    >
                                                        {{
                                                            msgSenderInfo(message, index).type === "agent"
                                                                ? "staff"
                                                                : msgSenderInfo(message, index).type
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div :class="$helpers.colors().defaultText">
                                            <div
                                                v-for="(msgItem, index) of message.messageArray"
                                                :key="index"
                                                class="tw-flex tw-justify-between tw-gap-2"
                                            >
                                                <div>
                                                    <div class="tw-text-sm tw-my-2">
                                                        <pre
                                                            class="tw-whitespace-normal"
                                                            style="
                                                                font-family: inherit;
                                                                word-break: break-word;
                                                                white-space: break-spaces;
                                                            "
                                                            >{{ msgItem.msg }}</pre
                                                        >
                                                    </div>

                                                    <!--attachment-->
                                                    <div
                                                        v-if="msgItem.attachments && msgItem.attachments.length"
                                                        class="tw-my-3 tw-flex tw-flex-wrap tw-gap-3"
                                                    >
                                                        <div
                                                            v-for="attachment in msgItem.attachments"
                                                            :key="attachment.id"
                                                            style="width: 200px; max-height: 200px"
                                                            class="tw-shadow-lg tw-rounded tw-cursor-pointer tw-overflow-hidden"
                                                        >
                                                            <q-img
                                                                fit="cover"
                                                                spinner-color="green"
                                                                @click="
                                                                    attachmentPreview = attachment;
                                                                    attachmentPreviewModal = true;
                                                                "
                                                                :src="attachment.src"
                                                            >
                                                                <q-tooltip
                                                                    :class="globalBgColor"
                                                                    anchor="bottom middle"
                                                                    :offset="[10, 10]"
                                                                    >{{ attachment.original_name }}
                                                                </q-tooltip>
                                                            </q-img>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    class="tw-whitespace-nowrap"
                                                    :class="{
                                                        'tw-text-xxs': mini_mode,
                                                        'tw-text-xs': !mini_mode,
                                                        [$helpers.colors().dateTimeText]: true,
                                                    }"
                                                >
                                                    {{ getDateTime(msgItem.created_at) }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </q-card-section>
                            </q-card>
                        </div>
                    </template>

                    <!--typing state-->
                    <div>
                        <div
                            v-for="(typing, index) in typingState"
                            :key="index"
                            class="tw-flex tw-items-center tw-py-2"
                        >
                            <div
                                class="tw-flex-shrink-0 tw-flex tw-items-center tw-justify-center"
                                :class="{ 'tw-w-16': mini_mode, 'tw-w-20': !mini_mode }"
                            >
                                <q-spinner-dots color="blue-grey-8" size="1.4em" />
                            </div>

                            <div :class="$helpers.colors().defaultText">
                                <div>
                                    <span
                                        :class="`tw-mr-1 tw-break-none tw-font-medium tw-capitalize text-${globalColor}`"
                                    >
                                        {{ msgSenderInfo(typing).display_name }}
                                    </span>
                                    <span>is typing</span>
                                </div>
                                <div :class="$helpers.colors().defaultText">
                                    <div class="tw-text-sm" style="word-break: break-word">
                                        {{ typing.msg }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--long border up to bottom-->
                    <div
                        v-if="isAgentChatPanel"
                        class="tw-absolute tw-top-0 tw-h-full tw--z-1"
                        :class="{ 'tw-left-10': !mini_mode, 'tw-left-8': mini_mode }"
                    >
                        <div class="tw-flex tw-h-full">
                            <div class="tw-border-l-2 tw-border-gray-300 tw-h-full" style="margin-left: -1px"></div>
                            <!--                                <div class="tw-border-l-2 tw-h-full"></div>-->
                        </div>
                    </div>
                </div>

                <div
                    v-if="conversationInfo.rating && chatPanelType === 'user'"
                    class="text-center tw-py-2"
                    :class="$helpers.colors().defaultText"
                >
                    <div :class="[mini_mode ? 'tw-text-xs' : 'tw-text-sm']">
                        <div>
                            Chat rated by {{ conversationWithUsersInfo[0].socket_session.init_name }}
                            {{ getDateTime(conversationInfo.rating.created_at) }}
                        </div>
                        <div v-if="conversationInfo.rating.comment" style="word-break: break-word">
                            “{{ conversationInfo.rating.comment }}”
                        </div>
                        <div class="tw-mt-2">
                            <div>Chat rating</div>
                            <div>
                                <q-btn
                                    size="sm"
                                    :color="conversationInfo.rating.rating === 5 ? 'green' : 'red'"
                                    :icon="conversationInfo.rating.rating === 5 ? 'thumb_up' : 'thumb_down'"
                                    :label="conversationInfo.rating.rating === 5 ? 'Good' : 'Bad'"
                                    outline
                                    class="tw-mt-1"
                                />
                            </div>
                        </div>
                        <!--<pre>{{ conversationInfo.rating }}</pre>-->
                        <!--<pre>{{ conversationWithUsersInfo[0].socket_session }}</pre>-->
                    </div>
                </div>

                <slot name="scroll-area-last-section"> </slot>
            </template>

            <!--            <template v-slot:loading>-->
            <!--                <div class="row justify-center q-my-md">-->
            <!--                    <q-spinner-dots color="green" size="40px" />-->
            <!--                </div>-->
            <!--            </template>-->
        </q-infinite-scroll>
        <q-scroll-observer :debounce="200" @scroll="scrollObserverHandle" />

        <!--<q-inner-loading :showing="!firstTimeMessageLoaded">
            <q-spinner-dots size="50px" :color="globalColor" />
        </q-inner-loading>-->
    </q-scroll-area>

    <div
        style="border-top: 1px solid rgba(0, 0, 0, 0.08)"
        v-if="showSendMessageInput"
        class="tw-w-full tw-py-2 tw-flex tw-mt-3 tw-bg-white tw-self-end tw-rounded"
        :class="[mini_mode ? 'tw-shadow-smt' : 'tw-shadow-md']"
    >
        <q-file
            v-model="attachments"
            name="attachment-uploader"
            ref="attachment_uploader"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif"
            max-files="5"
            :max-file-size="1024 * 1024 * 1"
            multiple
            append
            @update:model-value="attachmentUploaderHandle"
            @rejected="handleAttachmentReject"
        />

        <div class="tw-flex tw-flex-col tw-justify-end">
            <q-btn
                flat
                :color="chatPanelType === 'user' ? globalColor : clientPanelGlobalColor"
                icon="attachment"
                :class="[mini_mode ? 'tw-px-1' : 'tw-px-2']"
                :dense="mini_mode"
                @click="$refs.attachment_uploader.pickFiles($event)"
            ></q-btn>
        </div>
        <div class="tw-flex tw-flex-col tw-justify-end">
            <ec-emoji
                @clickEmoji="handleClickEmoji"
                :class="[mini_mode ? 'tw-px-1' : 'tw-px-2']"
                :dense="mini_mode"
                :mini_box="mini_mode || chatPanelType === 'client'"
                :color="chatPanelType === 'user' ? globalColor : clientPanelGlobalColor"
            />
        </div>

        <div class="tw-flex-auto tw-px-3">
            <!-- used keydown for instant catch n prevent -->
            <q-input
                ref="messageInput"
                v-model="msg"
                debounce="0"
                placeholder="Write Message..."
                :color="globalColor"
                class="ec-msg-input"
                :class="[`ec-msg-input-${uid}`, mini_mode ? 'ec-mini-mode-msg-input' : '']"
                :autofocus="messageInputAutoFocus"
                @keydown="keyDownHandle"
                @keyup="keyUpHandle"
                @focus="inputFocusHandle"
                @blur="inputBlurHandle"
                hide-bottom-space
                autogrow
                borderless
                dense
            >
                <q-menu
                    v-if="chatPanelType !== 'client'"
                    anchor="top left"
                    self="bottom left"
                    class="chat_template_box"
                    style="max-height: 500px; box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05)"
                    :style="{ maxWidth: `${msgInputWidth}px` }"
                    :offset="[15, 0]"
                    :ref="`ec_template_dom_${uid}`"
                    :class="[`ec_template_dom_${uid}`, 'tw-mr-2']"
                    v-model="chatTemplate"
                    @show="chatTemplateShowHandle"
                    @hide="chatTemplateHideHandle"
                    no-parent-event
                    no-focus
                    fit
                >
                    <div
                        class="chat_template_box_header tw-text-xs tw-tracking-wide tw-px-4 tw-py-4 tw-font-medium"
                        :class="[`text-${globalColor}`]"
                    >
                        Predefined Replies
                    </div>
                    <q-separator style="background-color: rgba(0, 87, 143, 0.1)" />
                    <q-list v-if="mappedChatTemplates.length" separator style="min-width: 300px">
                        <q-item
                            v-for="(template, key) in mappedChatTemplates"
                            :key="key"
                            :active="template.is_focused"
                            active-class="chat_template_selected_item"
                            class=""
                            @click="chatTemplateSelectHandle(key)"
                            @keyup.enter.exact="chatTemplateSelectHandle(key)"
                            clickable
                        >
                            <q-item-section>
                                <q-item-label>
                                    <div class="tw-flex tw-items-center tw-gap-3">
                                        <div class="tw-text-sm tw-font-medium">/{{ template.tag }}</div>
                                        <div
                                            class="tw-text-xs tw-overflow-hidden tw-whitespace-nowrap tw-overflow-ellipsis"
                                            :class="$helpers.colors().defaultText"
                                        >
                                            {{ template.content }}
                                        </div>
                                    </div>
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                    <div v-else class="tw-p-4 text-orange">No Result Found!</div>
                </q-menu>

                <q-resize-observer
                    ref="messageInputResizeObserver"
                    :debounce="200"
                    @resize="messageInputResizeObserver"
                />
            </q-input>

            <div v-if="finalAttachments && finalAttachments.length" class="tw-mt-3 tw-mb-2">
                <q-avatar
                    v-for="(attachmentObj, key) in finalAttachments"
                    :key="key"
                    size="80px"
                    class="each-attachment shadow-3 tw-relative"
                    :class="{ 'tw-mr-2': key !== finalAttachments.length - 1 }"
                    rounded
                    ><img class="cursor-pointer" :src="attachmentObj.src" />
                    <div
                        v-show="attachmentObj.status !== 'done'"
                        class="tw-absolute tw-h-full tw-w-full tw-bg-gray-900 tw-opacity-25"
                    ></div>
                    <div
                        v-show="attachmentObj.status !== 'done'"
                        class="tw-absolute tw-flex tw-justify-items-center text-green tw-font-bold tw-text-xs tw-text-center tw-cursor-default"
                    >
                        {{ attachmentObj.status }}
                    </div>
                    <q-badge
                        class="attachment-remove-btn hidden tw-cursor-pointer"
                        floating
                        color="red"
                        @click="attachmentRemoveHandle(attachmentObj)"
                    >
                        <q-icon name="close" />
                    </q-badge>
                    <q-tooltip class="bg-green" anchor="top middle" self="bottom middle" :offset="[10, 10]"
                        >{{ attachmentObj.original_name }}
                    </q-tooltip>
                </q-avatar>
            </div>
        </div>
        <div class="tw-flex tw-flex-col tw-justify-end">
            <q-btn
                icon="send"
                flat
                :color="chatPanelType === 'user' ? globalColor : clientPanelGlobalColor"
                :dense="mini_mode"
                :disable="getSendBtnStatus"
                @click="sendMessage"
            ></q-btn>
        </div>

        <q-dialog v-model="attachmentPreviewModal" full-width>
            <q-responsive class="no-shadow" :ratio="1">
                <q-img fit="contain" :src="attachmentPreview.src" spinner-color="green" class="attachment-preview">
                    <div class="absolute-bottom text-subtitle1 text-center">
                        {{ attachmentPreview.original_name }}
                    </div>
                    <q-badge class="tw-cursor-pointer" floating v-close-popup>
                        <q-icon name="close" class="text-orange tw-text-lg" />
                    </q-badge>
                </q-img>
            </q-responsive>

            <q-btn class="hidden" />
        </q-dialog>
    </div>

    <div
        v-if="chatPanelType === 'user' && !showSendMessageInput && conversationInfo.id && !mini_mode"
        class="text-center tw-pt-3"
    >
        <div class="tw-flex tw-justify-center tw-gap-2">
            <q-btn
                @click="acceptChat(conversationInfo.id)"
                v-if="
                    !conversationInfo.users_only &&
                    !conversationInfo.closed_at &&
                    (!conversationStatusForMe || conversationStatusForMe !== 'joined')
                "
                :label="conversationConnectedUsers.length ? 'Join Chat' : 'Accept Chat'"
                :color="globalColor"
                unelevated
                no-caps
            />

            <q-btn
                @click="
                    $router.push({
                        name: 'chat-interaction',
                    })
                "
                label="Close Panel"
                :color="globalColor"
                unelevated
                no-caps
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import * as _l from "lodash";
import moment from "moment";
import EcAvatar from "./EcAvatar.vue";
import EcEmoji from "components/common/EcEmoji.vue";

export default defineComponent({
    name: "Message",
    components: { EcEmoji, EcAvatar },
    props: {
        conv_id: {
            type: String,
        },
        ses_id: {
            type: String,
        },

        socket: {
            type: Object,
            default: null,
        },
        mini_mode: {
            type: Boolean,
            default: false,
        },
    },

    setup() {
        //     const messageInputAutoFocus = inject('messageInputAutoFocus');
        const messageInputAutoFocus = true;

        return {
            messageInputAutoFocus,
        };
    },

    data(): any {
        return {
            ecGetClientSesIdStatusInterval: "",
            chatActiveStatus: true,
            uid: new Date().getTime().toString(), // user convid insted. not from url

            firstTimeMessageLoaded: false,
            gettingNewMessages: false, // we could also use conv's loading state but it's will be a disaster here
            newMessagesMayBeLoaded: false,
            canCallMessageApi: true,

            convId: "",
            confirm: false,
            convState: "",

            msg: "",
            typingInstance: null,
            msgInputFocused: false,
            gotoBottomBtnShow: false,
            typingHandler: {
                typing: false,
            },
            notTypingEmitted: {},
            msgInputWidth: 50,

            attachments: [],
            finalAttachments: [],
            conversationInfoLocal: null,

            attachmentPreview: null,
            attachmentPreviewModal: false,

            chatTemplate: false,
            chatTemplateLoading: true,
            chatTemplates: [],
            chatTemplateInputVal: "",
            beforeKeyUpInputVal: "",
            getChatTemplateTimer: "",

            usersAvatarLoading: false,

            scrollInfo: {},
            scrollCheckInterval: null,

            scrollbarCanHandleScrollEvent: false,

            lastTopVerticalPosition: 0,

            timeToShowSpeakingInfo: false,
            clientPanelGlobalColor: "green-10",
        };
    },

    mounted() {
        setInterval(() => {
            this.$forceUpdate();
        }, 30000);

        this.fireSocketListeners();
        this.emitSocketEvents();
    },

    beforeUnmount() {
        clearInterval(this.ecGetClientSesIdStatusInterval);

        if (this.chatPanelType === "user" && !this.conversationInfo.users_only) {
            this.$socket.removeEventListener("ec_get_client_ses_id_status_res");
        }

        this.$emitter.off(`new_message_from_client_${this.conv_id}`);
        this.$emitter.off(`new_message_from_user_${this.conv_id}`);
    },

    computed: {
        ...mapGetters({
            globalBgColor: "setting_ui/globalBgColor",
            globalColor: "setting_ui/globalColor",
            profile: "auth/profile",
        }),

        chatPanelType(): any {
            return this.$route.name === "client-web-chat" ? "client" : "user";
        },

        conversationInfo(): any {
            return this.$store.getters["chat/conversationInfo"](this.conv_id);
        },

        conversationStatusForMe(): any {
            return this.$store.getters["chat/conversationStatusForMe"](this.conv_id, this.ses_id);
        },

        conversationMessages(): any {
            return this.$store.getters["chat/conversationMessages"](this.conv_id);
        },

        messages(): any {
            const stateAsMsg = this.$store.getters["chat/getConvSesStateAsMsg"](this.conv_id);

            const clonedMessages = _l.sortBy(Object.values(_l.cloneDeep(this.conversationMessages)), [
                (msg: any) => moment(msg.created_at).format("x"),
            ]);

            const messages: Array<any> = [];

            for (const msgObj of clonedMessages) {
                const tempMsgObj: any = msgObj;

                if (tempMsgObj.message_type === "log" && tempMsgObj.msg === "initiate" && !this.isAgentChatPanel) {
                    continue;
                }

                if (
                    messages.length &&
                    tempMsgObj.message_type === "message" &&
                    _l.last(messages).message_type === "message" &&
                    _l.last(messages).socket_session_id === tempMsgObj.socket_session_id
                ) {
                    const lastTempMessage = _l.last(messages);

                    lastTempMessage.messageArray.push(tempMsgObj);
                } else {
                    tempMsgObj.messageArray = [tempMsgObj];

                    messages.push(tempMsgObj);
                }
            }

            messages.map((tempMsg: any) => {
                if (tempMsg.message_type === "log" && tempMsg.socket_session_id) {
                    const conversation__session = this.conversationInfo.sessions.find(
                        (convSes: any) => convSes.socket_session_id === tempMsg.socket_session_id
                    );

                    if (conversation__session) {
                        tempMsg.session = conversation__session.socket_session;
                    } else {
                        // check y cz it's impossible
                    }
                }
            });

            return messages;
        },

        typingState(): any {
            const states = this.$store.getters["chat/typingState"](this.conv_id);

            return states.filter((state: any) => {
                return state.status === "typing";
            });
        },

        getSendBtnStatus(): any {
            return !!this.finalAttachments.length && _l.findIndex(this.finalAttachments, (att: any) => !att.id);
        },

        isAgentToAgentConversation(): any {
            return this.conversationInfo.users_only;
        },

        showSendMessageInput(): any {
            // console.log(this.conversationStatusForMe);

            return this.conversationStatusForMe === "joined" || this.isAgentToAgentConversation;
        },

        mappedChatTemplates(): any {
            const mappedChatTemplates = this.chatTemplates.map((chatTemplate: any, index: any) => {
                // set content
                if (chatTemplate.intent) {
                    chatTemplate.content =
                        chatTemplate.intent.intent_action.type === "static"
                            ? chatTemplate.intent.intent_action.content
                            : "";

                    chatTemplate.loading = chatTemplate.intent.intent_action.type !== "static";
                }

                chatTemplate.is_focused = index === 0;

                return chatTemplate;
            });

            if (!mappedChatTemplates.length) {
                return [
                    // {
                    //     tag: "No Result! Append in message box",
                    //     content: `/${this.chatTemplateInputVal}`,
                    //     is_focused: true,
                    // },
                ];
            }

            return mappedChatTemplates;
        },

        conversationWithUsersInfo(): any {
            return this.$store.getters["chat/conversationWithUsersInfo"](
                this.conv_id,
                this.profile?.socket_session?.id
            );
        },

        conversationConnectedUsers(): any {
            return this.$store.getters["chat/conversationConnectedUsers"](this.conv_id);
        },

        // return user who first join the conversation
        speakingWithUser(): any {
            if (this.conversationInfo.id) {
                const sessions = this.conversationInfo.sessions;

                if (sessions.length) {
                    const firstJoin = _l.find(
                        this.messages || [],
                        (msg: any) => msg.message_type === "log" && msg.msg === "joined" && msg.session.user
                    );

                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    const sessionInfo = this.$_.sortBy(
                        sessions.filter((ses: any) => ses.socket_session.user),
                        [(convSes: any) => moment(convSes.created_at).format("x")]
                    )[0];

                    if (sessionInfo && firstJoin && sessionInfo.socket_session.id === firstJoin.socket_session_id) {
                        return { user: sessionInfo.socket_session.user, msg: firstJoin };
                    }
                }
            }

            return {};
        },

        ecGetClientSesIdStatusWatch(): any {
            return [this.conv_id, this.conversationWithUsersInfo];
        },

        canGoToBottom(): any {
            return (
                !this.conversationInfo.hasOwnProperty("scroll_info") ||
                (this.conversationInfo.scroll_info?.last_position === 1 &&
                    this.conversationInfo.scroll_info?.auto_scroll_to_bottom)
            );
        },

        isAgentChatPanel(): any {
            return this.chatPanelType === "user";
        },
    },

    methods: {
        scrollObserverHandle(info: any) {
            // go up, assume that scroll happened manually so update
            if (info.direction === "up") {
                this.$store.dispatch("chat/updateConvMessagesAutoScrollToBottom", {
                    conv_id: this.conv_id,
                    auto_scroll_to_bottom: false,
                    last_position: this.scrollInfo.verticalPercentage,
                });
            }
        },
        messageInputResizeObserver(size: any) {
            this.msgInputWidth = size.width;
        },

        emitSocketEvents() {
            //
        },

        fireSocketListeners() {
            if (this.chatPanelType === "user" && !this.conversationInfo.users_only) {
                this.$socket.on("ec_get_client_ses_id_status_res", (res: any) => {
                    // custom event fire for messageTopSection
                    this.$emitter.emit("ec_get_client_ses_id_status_res", res);

                    // console.log('from ec_get_client_ses_id_status_res', res);
                });
            }

            this.$emitter.on(`new_message_from_client_${this.conv_id}`, () => {
                if (this.chatPanelType === "user" && !this.conversationInfo.users_only) {
                    this.emitEcGetClientSesIdStatus();
                }

                if (this.canGoToBottom) {
                    this.scrollToPosition();

                    // move these check to the function
                    if (this.chatPanelType === "user") {
                        // check if user on page then update. for now do it
                        setTimeout(() => this.updateLastMsgSeenTime(), 1200);
                    }
                }
            });

            this.$emitter.on(`new_message_from_user_${this.conv_id}`, () => {
                if (this.canGoToBottom) {
                    this.scrollToPosition();

                    if (this.chatPanelType === "user") {
                        // check if user on page then update. for now do it
                        setTimeout(() => this.updateLastMsgSeenTime(), 1200);
                    }
                }
            });
        },

        ecGetClientSesIdStatusEvent() {
            if (this.chatPanelType === "user" && !this.conversationInfo.users_only) {
                this.emitEcGetClientSesIdStatus();

                this.ecGetClientSesIdStatusInterval = setInterval(() => {
                    this.emitEcGetClientSesIdStatus();
                }, 10000);
            }
        },

        emitEcGetClientSesIdStatus() {
            this.$socket.emit("ec_get_client_ses_id_status", {
                client_ses_id: this.conversationWithUsersInfo[0].socket_session.id,
            });
        },

        handleInfiniteScrollLoad(index: any, done: any) {
            console.log("handleInfiniteScrollLoad");
            // it's calling only first time by load event
            // immediately we call done so that spam turns off.
            // keep in mind after done(true) scroll won't trigger without resume call
            // we have to do like these cz it's default behaviour is not working
            done(true);
            this.getNewMessages();
        },

        handleClickEmoji($event: any) {
            this.msg += $event;
            this.$refs.messageInput.focus();
        },

        // this func will get initial messages if not
        // keep in mind there will be a scenario when we know the conv_id but nothing in conversationInfo
        // at that time this function is very imp
        getNewMessages() {
            if (!this.gettingNewMessages) {
                this.gettingNewMessages = true;

                this.$store
                    .dispatch("chat/getConvMessages", {
                        convId: this.conv_id,
                        client_page: !this.isAgentChatPanel,
                    })
                    .then((res: any) => {
                        // console.log({ res });
                        if (!res.data.conversation.data.messages?.length) {
                            // if no data turn off new msg load
                            this.canCallMessageApi = false;
                        }

                        // we can check page === 1 without checking firstTimeMessageLoaded
                        if (!this.firstTimeMessageLoaded && this.canGoToBottom) {
                            this.scrollToPosition(1); // y here? cz if msg comes & scrollbar appear then auto go bottom

                            if (this.chatPanelType === "user") this.updateLastMsgSeenTime();
                        }
                    })
                    .catch(() => {
                        this.$router.push({ name: "chat-interaction" });
                    })
                    .finally(() => {
                        // delay api call for prevent spamming
                        setTimeout(() => {
                            this.firstTimeMessageLoaded = true;
                            this.gettingNewMessages = false;
                        }, 1000);
                    });
            }
        },

        checkOwnMessage(message: any) {
            return message.socket_session_id === this.ses_id;
        },
        msgForRightSide(message: any) {
            if (this.checkOwnMessage(message)) {
                return true;
            } else {
                if (this.$route.name !== "client-web-chat") {
                    if (!message.socket_session_id) {
                        return true;
                    }

                    const findSes = _l.find(this.conversationInfo.sessions, [
                        "socket_session_id",
                        message.socket_session_id,
                    ]);

                    return !!findSes.socket_session.user;
                }
            }

            return false;
        },
        msgSenderInfo(msg: any, index: any) {
            // const prevMsg = this.messages[index - 1];

            if (!msg.socket_session_id) {
                return {
                    display_name: "AI",
                    img_alt_name: "AI",
                    type: "ai",
                };
            }

            const findSes = _l.find(this.conversationInfo.sessions, ["socket_session_id", msg.socket_session_id]);

            const isMyMsg =
                (this.chatPanelType !== "user" && !findSes.socket_session.user) ||
                (this.chatPanelType === "user" &&
                    findSes.socket_session.user &&
                    findSes.socket_session.user.id === this.profile.id);

            if (findSes.socket_session.user) {
                return {
                    display_name: isMyMsg ? "You" : findSes.socket_session.user.user_meta.display_name,
                    img_alt_name: findSes.socket_session.user.user_meta.display_name,
                    email: findSes.socket_session.user.email,
                    src: findSes.socket_session.user.user_meta.src || null,
                    type: "agent",
                };
            }

            return {
                display_name: isMyMsg ? "You" : findSes.socket_session.init_name,
                img_alt_name: findSes.socket_session.init_name,
                email: findSes.socket_session.init_email,
                type: "client",
            };
        },

        getConvStateStatusMessage(message: any) {
            let name = message.session.user ? message.session.user.user_meta?.display_name : message.session.init_name;

            let isOwn = false;

            if (this.chatPanelType === "user" && message.session.user && message.session.user.id === this.profile.id) {
                name = "You";
                isOwn = true;
            }

            if (this.chatPanelType === "client" && !message.session.user) {
                name = "You";
                isOwn = true;
            }
            //
            // if (this.chatPanelType === 'user' && !message.session.user) {
            //     name = 'Client';
            // }

            const convSes = this.conversationInfo.sessions.find(
                (convSes: any) => convSes.socket_session_id === message.session.id
            );

            const endMaker =
                message.msg === "closed"
                    ? `| ${message.session.user ? "Agent" : "Client"} Ended chat ${convSes.closed_reason || ""}`
                    : "";

            // const time = `at ${this.getDateTime(message.created_at)}`;

            // if (this.chatPanelType === "user") {
            return {
                name: name,
                state: message.msg,
                state_message: `${message.msg} the chat`,
                end_message: !isOwn ? endMaker : "",
                user_type: message.session.user ? "agent" : "client",
            };
            // }

            //chat ended by mohammed younus. client widget
            // chat ended by you. client widget. by client

            // return `${name} ${message.state} the chat ${message.state !== "joined" ? time : ""} ${endMaker}`;
        },

        transferMsgMaker(msg: any) {
            const transferredTo = this.conversationConnectedUsers.find(
                (convSes: any) => convSes.socket_session_id === msg.msg.split("_")[1]
            );

            return `${msg.session?.user?.user_meta?.display_name} transferred the chat to ${transferredTo?.socket_session?.user?.user_meta?.display_name}`;
        },

        inputFocusHandle() {
            this.typingHandler = setInterval(() => {
                const tempMsg = this.msg;
                const dynamicSocket = this.socket || this.$socket;

                if (tempMsg.trim()) {
                    this.notTypingEmitted = false;

                    dynamicSocket.emit(`ec_is_typing_from_${this.chatPanelType}`, {
                        conv_id: this.conv_id,
                        msg: this.chatPanelType === "user" ? "" : this.msg.trim(),
                        status: "typing",
                    });
                } else {
                    if (!this.notTypingEmitted) {
                        this.notTypingEmitted = true;

                        dynamicSocket.emit(`ec_is_typing_from_${this.chatPanelType}`, {
                            conv_id: this.conv_id,
                            msg: "",
                            status: "not_typing",
                        });
                    }
                }
            }, 1000);
        },
        inputBlurHandle() {
            const dynamicSocket = this.socket || this.$socket;
            dynamicSocket.emit(`ec_is_typing_from_${this.chatPanelType}`, {
                conv_id: this.conv_id,
                msg: "",
                status: "not_typing",
            });
            clearInterval(this.typingHandler);
        },

        keyDownHandle(e: any) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                if (!this.chatTemplate) {
                    this.sendMessage();
                }
            }
        },
        keyUpHandle(e: any) {
            // prevent only enter so that before send new line does not show
            if (this.chatPanelType !== "client" && e.key === "/" && !this.beforeKeyUpInputVal) {
                this.chatTemplate = true;
            }

            /// when backspace press this.msg is empty
            if (!this.msg && e.key === "Backspace") {
                this.chatTemplate = false;
            }

            if (this.chatTemplate) {
                if (!["ArrowUp", "ArrowDown", "Enter", "Escape"].includes(e.key)) {
                    this.chatTemplateSearchHandle(e.target.value.slice(1));
                }
            }

            // e.target.value is the previous state
            this.beforeKeyUpInputVal = e.target.value;
        },

        getChatTemplates(keyword = "") {
            this.chatTemplateLoading = true;
            let payload: any = {};

            if (keyword) {
                payload.keyword = keyword;
            }

            this.$store.dispatch("chat_template/getChatTemplates", payload).then((res: any) => {
                this.chatTemplates = res.data;

                this.chatTemplateLoading = false;

                // when get completes
                this.$refs[`ec_template_dom_${this.uid}`].$forceUpdate(); // it will try to match dynamic height
            });
        },
        chatTemplateShowHandle() {
            this.getChatTemplates();
            document.body.addEventListener("keyup", this.chatTemplateArrowKeyUpDownHandle);

            this.chatTemplateDomPositionUpdate();
        },
        chatTemplateHideHandle() {
            document.body.removeEventListener("keyup", this.chatTemplateArrowKeyUpDownHandle);
        },
        chatTemplateArrowKeyUpDownHandle(e: any) {
            if (this.mappedChatTemplates.length) {
                const currentFocusedTemplate = _l.findIndex(this.mappedChatTemplates, ["is_focused", true]);
                if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                    const upOrDown = e.key === "ArrowDown" ? 1 : -1;

                    if (
                        currentFocusedTemplate === this.mappedChatTemplates.length - 1 ||
                        currentFocusedTemplate === -1
                    ) {
                        this.mappedChatTemplates[0].is_focused = true;
                    } else if (currentFocusedTemplate === 0 && e.key === "ArrowUp") {
                        this.mappedChatTemplates[this.mappedChatTemplates.length - 1].is_focused = true;
                    } else {
                        this.mappedChatTemplates[currentFocusedTemplate + upOrDown].is_focused = true;
                    }

                    if (this.mappedChatTemplates.length > 1 && currentFocusedTemplate !== -1) {
                        this.mappedChatTemplates[currentFocusedTemplate].is_focused = false;
                    }
                }

                if (e.key === "Enter") {
                    this.chatTemplateSelectHandle(currentFocusedTemplate);
                }
            }
        },
        chatTemplateSelectHandle(key: any) {
            if (key !== -1) {
                //if has intent handle loader wait then add content
                this.msg = this.mappedChatTemplates[key].content;
            }

            this.chatTemplate = false;
        },
        chatTemplateSearchHandle(value: any) {
            // clear before backspace check so that one api call save's
            clearTimeout(this.getChatTemplateTimer);

            this.getChatTemplateTimer = setTimeout(() => {
                this.getChatTemplates(value);
            }, 200);
        },
        chatTemplateDomPositionUpdate() {
            // this method will fix the menu position when content changes its height
            // for now quasar is not updating position when its open from top
            const msgInputElm: any = document.getElementsByClassName(`ec-msg-input-${this.uid}`)[0];
            const bodyHeight = document.body.getBoundingClientRect().height;
            const msgInputBottomPos = msgInputElm.getBoundingClientRect().bottom;

            const templateDom: any = document.getElementsByClassName(`ec_template_dom_${this.uid}`)[0];

            templateDom.style.top = "unset";
            templateDom.style.bottom = `${bodyHeight - msgInputBottomPos + 50}px`;
        },

        sendMessage(): any {
            this.msg = this.msg.trim();

            if (!this.finalAttachments.length && !this.msg.length) {
                return false;
            }

            // console.log('sending the msg');

            const dynamicBody =
                this.chatPanelType === "user"
                    ? { conv_id: this.conv_id, temp_id: this.$helpers.getTempId() }
                    : { temp_id: this.$helpers.getTempId() };

            const dynamicSocket = this.socket || this.$socket;

            // send not typing from here also before send emit so that typing flicker goes
            dynamicSocket.emit(`ec_is_typing_from_${this.chatPanelType}`, {
                conv_id: this.conv_id,
                msg: "",
                status: "not_typing",
            });

            dynamicSocket.emit(`ec_msg_from_${this.chatPanelType}`, {
                ...dynamicBody,
                msg: this.msg,
                attachments: _l.map(this.finalAttachments, "id"),
            });

            this.msg = "";
            this.attachments = [];
            this.finalAttachments = [];
        },

        handleScroll() {
            // if a cov has no msg then it will fire
            // that time we are loading until scrollbar appears or no more msg
            // verticalPercentage is 0 if small amount of msg
            if (
                this.scrollInfo.verticalSize === this.scrollInfo.verticalContainerSize &&
                this.scrollInfo.verticalPercentage === 0
            ) {
                // get new messages until scrollbar appear or no msg
                if (this.canCallMessageApi && !this.gettingNewMessages && this.$refs.myInfiniteScrollArea) {
                    this.$refs.myInfiniteScrollArea.resume();
                    this.$refs.myInfiniteScrollArea.trigger();

                    // canGoToBottom check safe side
                    if (this.canGoToBottom) {
                        this.scrollToPosition(1); // y here? cz if msg comes & scrollbar appear then auto go bottom

                        if (this.chatPanelType === "user") this.updateLastMsgSeenTime();
                    }
                }

                return;
            }

            const verticalPercentage = this.scrollInfo.verticalPercentage;
            // if it has scroll info we know it's not first time
            if (this.conversationInfo.hasOwnProperty("scroll_info")) {
                this.gotoBottomBtnShow = verticalPercentage < 0.9 && this.messages?.length > 0;

                const topScrolling = this.lastTopVerticalPosition > this.scrollInfo.verticalPosition;
                this.lastTopVerticalPosition = this.scrollInfo.verticalPosition;

                if (topScrolling && verticalPercentage < 0.25) {
                    if (this.canCallMessageApi && !this.gettingNewMessages) {
                        // if we can then resume and trigger which will fire the load event
                        this.$refs.myInfiniteScrollArea.resume();
                        this.$refs.myInfiniteScrollArea.trigger();
                    }
                }
            }

            if (this.newMessagesMayBeLoaded && this.canGoToBottom) {
                this.scrollToPosition();

                // it's needed for come back
                if (this.chatPanelType === "user") this.updateLastMsgSeenTime();
            }

            // if we scrolled to bottom but in store set to not can go then update
            if (this.scrollInfo.verticalPercentage === 1 && !this.canGoToBottom) {
                this.scrollToPosition();

                if (this.chatPanelType === "user") this.updateLastMsgSeenTime();
            }
        },

        scrollToPosition(position = 1) {
            const msgScrollArea = this.$refs.msgScrollArea;

            if (msgScrollArea) {
                // waiting for dom render
                setTimeout(() => {
                    console.log("scroll to ", position);
                    msgScrollArea.setScrollPercentage("vertical", position, 200);
                }, 100);
            }

            this.$store.dispatch("chat/updateConvMessagesAutoScrollToBottom", {
                conv_id: this.conv_id,
                auto_scroll_to_bottom: position === 1,
                last_position: 1,
            });

            if (this.newMessagesMayBeLoaded && position === 1) {
                this.newMessagesMayBeLoaded = false;
            }
        },

        attachmentUploaderHandle(val: any) {
            val.forEach((img: any) => {
                if (_l.findIndex(this.finalAttachments, { original_name: img.name, size: img.size }) === -1) {
                    this.finalAttachments.push({
                        temp_id: new Date().getTime(),
                        original_name: img.name,
                        size: img.size,
                        status: "pending",
                        src: URL.createObjectURL(img),
                    });

                    let formData = new FormData();
                    formData.append("attachments", img, img.name);

                    this.$socketSessionApi
                        .post("attachments", formData)
                        .then((res: any) => {
                            // console.log(res.data);
                            const attachment = res.data.data[0];

                            const afterPushedFinalAttachmentIndex = _l.findIndex(this.finalAttachments, {
                                original_name: img.name,
                                size: img.size,
                            });

                            const finalAttachment = this.finalAttachments[afterPushedFinalAttachmentIndex];

                            finalAttachment.status = "uploading";

                            this.$socketSessionApi
                                .get(attachment.src, {
                                    responseType: "arraybuffer",
                                })
                                .then((res: any) => {
                                    // console.log(res);
                                    // console.log(typeof res.data);

                                    finalAttachment.id = attachment.attachment_info.id;
                                    finalAttachment.status = "done";
                                    finalAttachment.src = URL.createObjectURL(
                                        new Blob([res.data], { type: res.headers["content-type"] })
                                    ); // its giving a warning so after this line nothing will work
                                })
                                .catch((e: any) => {
                                    console.log(e);
                                });
                        })
                        .catch((e: any) => {
                            console.log(e);
                        });
                }
            });
        },
        attachmentRemoveHandle(attachmentObj: any) {
            const localCopy = _l.cloneDeep(attachmentObj);

            _l.remove(
                this.finalAttachments,
                (a: any) => a.original_name === attachmentObj.original_name && a.size === attachmentObj.size
            );

            _l.remove(
                this.attachments,
                (a: any) => a.name === attachmentObj.original_name && a.size === attachmentObj.size
            );

            if (localCopy.id) {
                this.$socketSessionApi.delete(`attachments/${localCopy.id}`);
            }
        },
        handleAttachmentReject(entries: any) {
            // show toast
            console.log("before upload error", entries);

            entries.forEach((attachment: any) => {
                console.log(attachment.file.name, attachment.failedPropValidation, "error");
                this.$helpers.showErrorNotification(this, attachment.failedPropValidation);
            });
        },

        async handleAttachmentLoading() {
            // console.log('called handle attch loader');

            if (!Object.keys(this.conversationMessages).length) return;

            // if it does not reflect change to store then handle attachment mutation here
            for (const message of Object.values(this.conversationMessages)) {
                const msg: any = message; // its only for now. otherwise type error msg

                if (msg.attachments && msg.attachments.length) {
                    for (const attch of msg.attachments) {
                        if (!attch.loaded && !attch.src) {
                            try {
                                const imgRes = await this.$socketSessionApi.get(`attachments/${attch.id}`, {
                                    responseType: "arraybuffer",
                                });

                                attch.src = URL.createObjectURL(
                                    new Blob([imgRes.data], { type: imgRes.headers["content-type"] })
                                );

                                attch.loaded = true;
                            } catch (e) {
                                attch.loaded = false;
                                console.log(e);
                            }
                        }
                    }
                }
            }
        },

        async updateLastMsgSeenTime() {
            // urgent check needed
            // must check if seen need to update or not
            console.log("update seen");
            const lastMsgSeenTime = moment().format();
            const mySocketSesId = this.$helpers.getMySocketSessionId();

            // check for undefined issue
            if (this.conversationConnectedUsers.length) {
                this.$store.commit("chat/updateConversation", {
                    conv_id: this.conv_id,
                    last_msg_seen_time: lastMsgSeenTime,
                    socket_session_id: mySocketSesId,
                });

                const selfSession = this.conversationConnectedUsers.find(
                    (convConnectedUser: any) => convConnectedUser.socket_session_id === mySocketSesId
                );

                if (selfSession) {
                    await window.api.post(
                        `conversations/update-last-message-seen-time/conversation-session/${selfSession.id}`,
                        {
                            last_msg_seen_time: lastMsgSeenTime,
                        }
                    );
                }
            }
        },

        getDateTime(date: any) {
            return this.$helpers.myDate(date, `${this.isAgentChatPanel ? "MMM DD, Y" : ""} h:mm a`);
        },

        acceptChat(convId: any) {
            this.$socket.emit("ec_join_conversation", {
                conv_id: convId,
            });

            // check chat conversation id

            this.$router.push({ name: "chats", params: { conv_id: convId } });
        },
    },

    watch: {
        conversationInfo: {
            handler: function () {
                // console.log('conversationInfo watcher started');
                if (this.conversationInfo.id && this.conversationInfo.closed_at) {
                    clearInterval(this.ecGetClientSesIdStatusInterval);
                }
            },
            deep: true,
            immediate: true,
        },

        conv_id: {
            handler: function (newVal, oldVal) {
                if (this.conv_id && this.mini_mode && newVal !== oldVal && this.$refs.myInfiniteScrollArea) {
                    this.$refs.myInfiniteScrollArea.poll();

                    this.scrollToPosition();

                    if (this.chatPanelType === "user") this.updateLastMsgSeenTime();
                }
            },
            immediate: true,
        },

        conversationMessages: {
            handler: function () {
                // in the future, we can fine tune this by checking old & new val
                this.newMessagesMayBeLoaded = true;

                if (!this.scrollCheckInterval) {
                    this.scrollCheckInterval = setInterval(() => this.handleScroll(), 300);
                }

                this.handleAttachmentLoading();
            },
            deep: true,
            immediate: true,
        },

        typingState: {
            handler: function (newVal, oldVal) {
                // console.log(oldVal, newVal);

                if (this.conversationInfo.scroll_info?.auto_scroll_to_bottom) {
                    // I think this if not need anymore
                    if (newVal.length > oldVal.length) {
                        // this.scrollToPosition();
                        this.newMessagesMayBeLoaded = true;
                    }
                }
            },
            deep: true,
        },

        ecGetClientSesIdStatusWatch: {
            handler: function () {
                if (
                    this.conversationInfo?.id &&
                    !this.conversationInfo.closed_at &&
                    this.conversationWithUsersInfo.length &&
                    !this.ecGetClientSesIdStatusInterval
                ) {
                    this.ecGetClientSesIdStatusEvent();
                }
            },
            deep: true,
            immediate: true,
        },
    },

    unmounted() {
        this.$store.dispatch("chat/updateConvMessagesAutoScrollToBottom", {
            conv_id: this.conv_id,
            auto_scroll_to_bottom: true,
            last_position: 1,
        });

        clearInterval(this.scrollCheckInterval);
    },
});
</script>

<style lang="scss">
.each-attachment {
    &:hover {
        .attachment-remove-btn {
            display: inline-flex !important;
        }
    }
}

.attachment-preview {
    img {
        width: min-content;
        margin: auto;
    }
}

.ec-msg-input.q-textarea {
    .q-field__control-container {
        padding: 0;
    }
}

.mini-mode-message-text-container {
    .q-message-text {
        padding: 5px;

        &:last-child {
            min-height: 40px;
        }
    }
}

.chat_template_box {
    .q-list--separator {
        .q-item-type:not(:first-child) {
            border-top: 1px solid rgba(0, 87, 143, 0.1);
        }
    }

    .chat_template_selected_item,
        //.chat_template_box_header
    {
        background-color: rgba(0, 87, 143, 0.06);
    }

    .q-item-type:hover .q-focus-helper {
        background: rgba(0, 87, 143, 0.06) !important;
        opacity: unset !important;

        &:before {
            opacity: unset;
            background: unset;
        }
    }
}
</style>
