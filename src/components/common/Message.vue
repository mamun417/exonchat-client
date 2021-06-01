<template>
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
        <!-- <pre>
        {{ conversationInfo }}
        {{ messages }}
        </pre> -->
        <template v-for="(message, index) in messages" :key="message.id" class="justify-center">
            <q-chat-message
                v-if="message.msg || (message.attachments && message.attachments.length)"
                :name="msgSenderName(message, index)"
                avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                :sent="checkOwnMessage(message)"
                :text-color="checkOwnMessage(message) ? 'black' : 'white'"
                :bg-color="checkOwnMessage(message) ? 'gray-9' : 'blue-9'"
                :class="{ 'mini-mode-message-text-container': mini_mode }"
            >
                <template v-slot:stamp>
                    <div :class="[mini_mode ? 'tw-text-xxs' : 'tw-text-xs']">
                        {{ $helpers.fromNowTime(message.created_at) }}
                    </div>
                </template>

                <template v-slot:avatar>
                    <q-avatar size="lg" class="tw-mr-2">
                        <img src="https://cdn.quasar.dev/img/avatar1.jpg" alt="image" />
                        <q-tooltip class=""> email </q-tooltip>
                    </q-avatar>
                </template>

                <div>
                    <div :class="{ 'text-right': msgForRightSide(message) }">{{ message.msg }}</div>
                    <div v-if="message.attachments && message.attachments.length" class="tw-my-3 tw-flex">
                        <div
                            v-for="(attachment, key) in message.attachments"
                            :key="attachment.id"
                            style="width: 100px; max-height: 100px"
                            class="shadow-3 tw-rounded tw-cursor-pointer tw-overflow-hidden"
                            :class="{
                                'tw-mr-2': !msgForRightSide(message) && key !== message.attachments.length - 1,
                                'tw-ml-2': msgForRightSide(message) && key !== message.attachments.length - 1,
                            }"
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
                                <q-tooltip class="bg-green" anchor="bottom middle" :offset="[10, 10]">{{
                                    attachment.original_name
                                }}</q-tooltip>
                            </q-img>
                        </div>
                    </div>
                </div></q-chat-message
            >

            <q-chat-message
                v-else-if="!message.msg && !message.attachments && !isAgentToAgentConversation"
                class="tw-mb-0"
            >
                <template v-slot:label>
                    <div :class="[mini_mode ? 'tw-text-xxs' : 'tw-text-xs']">
                        {{ getConvStateStatusMessage(message) }}
                    </div></template
                ></q-chat-message
            >
        </template>

        <!-- <q-chat-message
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
        /> -->
    </q-scroll-area>

    <div v-if="showSendMessageInput" class="tw-w-full tw-flex tw-mt-3 tw-bg-white tw-shadow-lg tw-self-end tw-rounded">
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
                color="green"
                icon="attachment"
                :class="[mini_mode ? 'tw-px-1' : 'tw-px-2']"
                :dense="mini_mode"
                @click="$refs.attachment_uploader.pickFiles($event)"
            ></q-btn>
        </div>
        <div class="tw-flex tw-flex-col tw-justify-end">
            <q-btn
                flat
                color="green"
                icon="mood"
                :class="[mini_mode ? 'tw-px-1' : 'tw-px-2']"
                :dense="mini_mode"
            ></q-btn>
        </div>
        <div class="tw-flex-auto tw-px-3">
            <!-- used keydown for instant catch n prevent -->
            <q-input
                v-model="msg"
                debounce="0"
                placeholder="Write Message..."
                color="green-8"
                class="ec-msg-input"
                :class="[`ec-msg-input-${uid}`, mini_mode ? 'tw-text-xxs ec-mini-mode-msg-input' : '']"
                @keyup.enter.exact="sendMessage"
                @keydown="keyUpHandle"
                @focus="inputFocusHandle"
                @blur="inputBlurHandle"
                hide-bottom-space
                :autofocus="messageInputAutoFocus"
                autogrow
                borderless
                dense
                ><q-menu
                    v-if="chatPanelType !== 'client'"
                    anchor="bottom left"
                    self="bottom left"
                    style="max-height: 500px"
                    :ref="`ec_template_dom_${uid}`"
                    :class="[`ec_template_dom_${uid}`]"
                    v-model="chatTemplate"
                    @show="chatTemplateShowHandle"
                    @hide="chatTemplateHideHandle"
                    no-parent-event
                >
                    <div class="tw-font-bold tw-text-xs text-green tw-px-4 tw-py-2">Suggestions</div>
                    <q-separator />
                    <q-list separator style="min-width: 300px"
                        ><q-item
                            v-for="(template, key) in mappedChatTemplates"
                            :key="key"
                            :active="template.is_focused"
                            active-class="bg-green-3"
                            class="tw-font-medium"
                            @click="chatTemplateSelectHandle(key)"
                            @keyup.enter.exact="chatTemplateSelectHandle(key)"
                            clickable
                        >
                            <q-item-section
                                ><q-item-label class="tw-text-xs">{{ template.tag }}</q-item-label
                                ><q-item-label caption>{{ template.content }}</q-item-label></q-item-section
                            >
                        </q-item></q-list
                    >
                    <q-separator />
                    <div class="tw-px-4">
                        <!-- n here keyup is for finally done press so that i dont call this func continiously -->
                        <q-input
                            v-model="chatTemplateInputVal"
                            placeholder="search"
                            color="green-8"
                            @keyup="chatTemplateSearchHandle"
                            autofocus
                            borderless
                            dense
                        /></div></q-menu
            ></q-input>
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
                        ><q-icon name="close" />
                    </q-badge>
                    <q-tooltip class="bg-green" anchor="top middle" self="bottom middle" :offset="[10, 10]">{{
                        attachmentObj.original_name
                    }}</q-tooltip>
                </q-avatar>
            </div>
        </div>
        <div class="tw-flex tw-flex-col tw-justify-end">
            <q-btn
                icon="send"
                flat
                color="green-8"
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
                    <q-badge class="tw-cursor-pointer" floating v-close-popup
                        ><q-icon name="close" class="text-orange tw-text-lg"
                    /></q-badge>
                </q-img>
            </q-responsive>

            <q-btn class="hidden" />
        </q-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import * as _l from 'lodash';
import moment from 'moment';

export default defineComponent({
    name: 'Message',
    components: {},
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
            uid: new Date().getTime().toString(), // user convid insted. not from url

            gettingNewMessages: false, // we could also use conv's loading state but it's will be a disaster here

            convId: '',
            confirm: false,
            convState: '',
            msg: '',
            typingInstance: null,
            msgInputFocused: false,
            gotoBottomBtnShow: false,
            typingHandler: {
                typing: false,
            },
            attachments: [],
            finalAttachments: [],
            conversationInfoLocal: null,

            attachmentPreview: null,
            attachmentPreviewModal: false,

            chatTemplate: false,
            chatTemplateLoading: true,
            chatTemplates: [],
            chatTemplateInputVal: '',
            getChatTemplateTimer: '',
        };
    },

    mounted() {
        // setInterval(() => {
        //     this.$forceUpdate(); // now i have no idea why its needed
        // }, 30000);
    },

    computed: {
        ...mapGetters({
            globalBgColor: 'ui/globalBgColor',
            globalColor: 'ui/globalColor',
        }),

        chatPanelType(): any {
            return this.$router.name === 'client-web-chat' ? 'client' : 'user';
        },

        conversationInfo(): any {
            return this.$store.getters['chat/conversationInfo'](this.conv_id);
        },

        conversationStatusForMe(): any {
            return this.$store.getters['chat/conversationStatusForMe'](this.conv_id, this.ses_id);
        },

        conversationMessages(): any {
            return this.$store.getters['chat/conversationMessages'](this.conv_id);
        },

        messages(): any {
            const stateAsMsg = this.$store.getters['chat/getConvSesStateAsMsg'](this.conv_id);

            const tempMessages = _l.cloneDeep(this.conversationMessages);

            stateAsMsg.forEach((stateMsg: any) => {
                if (!tempMessages.hasOwnProperty(stateMsg.id)) {
                    tempMessages[stateMsg.id] = stateMsg;
                }
            });

            return _l.sortBy(Object.values(tempMessages), [(msg: any) => moment(msg.created_at).format('x')]);
        },

        getSendBtnStatus(): any {
            return this.finalAttachments.length && _l.findIndex(this.finalAttachments, (att: any) => !att.id);
        },

        isAgentToAgentConversation(): any {
            return this.conversationInfo.users_only;
        },

        showSendMessageInput(): any {
            console.log(this.conversationStatusForMe);

            return this.conversationStatusForMe === 'joined' || this.isAgentToAgentConversation;
        },

        mappedChatTemplates(): any {
            const mappedChatTemplates = this.chatTemplates.map((chatTemplate: any) => {
                // set content
                if (chatTemplate.intent) {
                    chatTemplate.content =
                        chatTemplate.intent.intent_action.type === 'static'
                            ? chatTemplate.intent.intent_action.content
                            : '';

                    chatTemplate.loading = chatTemplate.intent.intent_action.type !== 'static';
                }

                chatTemplate.is_focused = false;

                return chatTemplate;
            });

            if (!mappedChatTemplates.length) {
                return [
                    {
                        tag: 'No Result! Append in message box',
                        content: `/${this.chatTemplateInputVal}`,
                        is_focused: true,
                    },
                ];
            }

            return mappedChatTemplates;
        },
    },

    methods: {
        getNewMessages() {
            if (
                !this.gettingNewMessages && // and also check loading state of this conv
                this.conversationInfo
            ) {
                this.gettingNewMessages = true;

                this.$store
                    .dispatch('chat/getConvMessages', {
                        convId: this.conv_id,
                        page: !this.conversationInfo.hasOwnProperty('current_page')
                            ? 1
                            : parseInt(this.conversationInfo.current_page) + 1,
                    })
                    .finally(() => {
                        this.gettingNewMessages = false;
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
                if (this.$route.name === 'client-web-chat') {
                    return !!message.socket_session.user_id;
                }
            }

            return false;
        },

        getConvId() {
            return this.isConversationTracking ? this.conversationId : this.$route.params['conv_id'];
        },

        msgSenderName(msg: any, index: any) {
            const prevMsg = this.messages[index - 1];

            // if (
            //     index === 0 ||
            //     (prevMsg.hasOwnProperty('msg') && msg?.socket_session_id !== prevMsg.socket_session_id)
            // ) {
            //     if (msg.socket_session.user) {
            //         return msg.socket_session.user.user_meta.display_name;
            //     }

            //     return msg.socket_session.init_name;
            // }

            return '';
        },

        getConvStateStatusMessage(message: any) {
            return `${message.session.user ? message.session.user.user_meta.display_name : message.session.init_name} ${
                message.state
            } ${this.$helpers.fromNowTime(message.created_at)}`;
        },

        inputFocusHandle() {
            this.typingHandler = setInterval(() => {
                //     this.$socket.emit('ec_is_typing_from_user', {
                //         conv_id: this.getConvId(),
                //     });
            }, 1000);
        },
        inputBlurHandle() {
            clearInterval(this.typingHandler);
        },
        keyUpHandle(e: any) {
            if (this.chatPanelType !== 'client' && e.key === '/') {
                this.chatTemplate = true;
                e.preventDefault();
            }
        },

        getChatTemplates(keyword = '') {
            this.chatTemplateLoading = true;
            let payload: any = {};

            if (keyword) {
                payload.keyword = keyword;
            }

            this.$store.dispatch('chat_template/getChatTemplates', payload).then((res: any) => {
                this.chatTemplates = res.data;

                this.chatTemplateLoading = false;

                // when get completes
                this.$refs[`ec_template_dom_${this.uid}`].$forceUpdate(); // it will try to match dynamic height
            });
        },

        chatTemplateShowHandle() {
            this.getChatTemplates();
            document.body.addEventListener('keyup', this.chatTemplateArrowKeyUpDownHandle);

            this.chatTemplateDomPositionUpdate();
        },
        chatTemplateHideHandle() {
            this.chatTemplateInputVal = '';
            document.body.removeEventListener('keyup', this.chatTemplateArrowKeyUpDownHandle);
        },
        chatTemplateArrowKeyUpDownHandle(e: any) {
            if (this.mappedChatTemplates.length) {
                const currentFocusedTemplate = _l.findIndex(this.mappedChatTemplates, ['is_focused', true]);
                if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
                    const upOrDown = e.key === 'ArrowDown' ? 1 : -1;

                    if (
                        currentFocusedTemplate === this.mappedChatTemplates.length - 1 ||
                        currentFocusedTemplate === -1
                    ) {
                        this.mappedChatTemplates[0].is_focused = true;
                    } else if (currentFocusedTemplate === 0 && e.key === 'ArrowUp') {
                        this.mappedChatTemplates[this.mappedChatTemplates.length - 1].is_focused = true;
                    } else {
                        this.mappedChatTemplates[currentFocusedTemplate + upOrDown].is_focused = true;
                    }

                    if (this.mappedChatTemplates.length > 1 && currentFocusedTemplate !== -1) {
                        this.mappedChatTemplates[currentFocusedTemplate].is_focused = false;
                    }
                }

                if (e.key === 'Enter') {
                    this.chatTemplateSelectHandle(currentFocusedTemplate);
                }
            }
        },
        chatTemplateSelectHandle(key: any) {
            if (key !== -1) {
                //if has intent handle loader wait then add content
                this.msg += this.mappedChatTemplates[key].content;
                this.chatTemplate = false;
            }
        },
        chatTemplateSearchHandle(e: any) {
            if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) return;

            console.log(e.target.value);

            clearTimeout(this.getChatTemplateTimer);
            this.getChatTemplateTimer = setTimeout(() => {
                this.getChatTemplates(e.target.value);
            }, 200);
        },
        chatTemplateDomPositionUpdate() {
            // this method will fix the menu position when content changes its height
            // for now quasar is not updating position when its open from top
            const msgInputElm: any = document.getElementsByClassName(`ec-msg-input-${this.uid}`)[0];
            const bodyHeight = document.body.getBoundingClientRect().height;
            const msgInputBottomPos = msgInputElm.getBoundingClientRect().bottom;

            const templateDom: any = document.getElementsByClassName(`ec_template_dom_${this.uid}`)[0];

            templateDom.style.top = 'unset';
            templateDom.style.bottom = `${bodyHeight - msgInputBottomPos + 11}px`;
        },

        sendMessage(): any {
            this.msg = this.msg.trim();

            if (!this.finalAttachments.length && !this.msg.length) {
                return false;
            }

            console.log('sending the msg');

            const emitType = this.chatPanelType ? 'user' : 'client';
            const dynamicBody =
                this.chatPanelType === 'user'
                    ? { conv_id: this.conv_id, temp_id: this.$helpers.getTempId() }
                    : { temp_id: this.$helpers.getTempId() };

            const dynamicSocket = this.socket || this.$socket;

            dynamicSocket.emit(`ec_msg_from_${emitType}`, {
                ...dynamicBody,
                msg: this.msg,
                attachments: _l.map(this.finalAttachments, 'id'),
            });

            this.msg = '';
            this.attachments = [];
            this.finalAttachments = [];
        },

        handleScroll(info: any) {
            let verticalPercentage = info.verticalPercentage;
            this.gotoBottomBtnShow = verticalPercentage < 0.9 && this.messages?.length > 0;
        },
        scrollToBottom() {
            const msgScrollArea = this.$refs.msgScrollArea;

            if (msgScrollArea) {
                const scrollTarget = msgScrollArea.getScrollTarget();

                msgScrollArea.setScrollPosition('vertical', scrollTarget.scrollHeight, 500);
            }
        },

        attachmentUploaderHandle(val: any) {
            val.forEach((img: any) => {
                if (_l.findIndex(this.finalAttachments, { original_name: img.name, size: img.size }) === -1) {
                    this.finalAttachments.push({
                        temp_id: new Date().getTime(),
                        original_name: img.name,
                        size: img.size,
                        status: 'pending',
                        src: URL.createObjectURL(img),
                    });

                    let formData = new FormData();
                    formData.append('attachments', img, img.name);

                    this.$socketSessionApi
                        .post('messages/attachments', formData)
                        .then((res: any) => {
                            console.log(res.data);
                            const attachment = res.data.data[0];

                            const afterPushedFinalAttachmentIndex = _l.findIndex(this.finalAttachments, {
                                original_name: img.name,
                                size: img.size,
                            });

                            const finalAttachment = this.finalAttachments[afterPushedFinalAttachmentIndex];

                            finalAttachment.status = 'uploading';

                            this.$socketSessionApi
                                .get(attachment.src, {
                                    responseType: 'arraybuffer',
                                })
                                .then((res: any) => {
                                    // console.log(res);
                                    // console.log(typeof res.data);

                                    finalAttachment.id = attachment.attachment_info.id;
                                    finalAttachment.status = 'done';
                                    finalAttachment.src = URL.createObjectURL(
                                        new Blob([res.data], { type: res.headers['content-type'] })
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
                this.$socketSessionApi.delete(`messages/attachments/${localCopy.id}`);
            }
        },
        handleAttachmentReject(entries: any) {
            // show toast
            console.log('before upload error', entries);

            entries.forEach((attachment: any) => {
                console.log(attachment.file.name, attachment.failedPropValidation, 'error');
                this.$helpers.showErrorNotification(this, attachment.failedPropValidation);
            });
        },

        async handleAttachmentLoading() {
            console.log('called handle attch loader');

            if (!Object.keys(this.conversationMessages).length) return;

            // if it does not reflect change to store then handle attachment mutation here
            for (const message of Object.values(this.conversationMessages)) {
                const msg: any = message; // its only for now. otherwise type error msg

                if (msg.attachments && msg.attachments.length) {
                    for (const attch of msg.attachments) {
                        if (!attch.loaded && !attch.src) {
                            try {
                                const imgRes = await this.$socketSessionApi.get(`messages/attachments/${attch.id}`, {
                                    responseType: 'arraybuffer',
                                });

                                attch.src = URL.createObjectURL(
                                    new Blob([imgRes.data], { type: imgRes.headers['content-type'] })
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
    },

    watch: {
        // its calling many times. y need examination
        // conversationInfo: {
        //     handler: function () {
        //         if (
        //             !this.gettingNewMessages && // and also check loading state of this conv
        //             this.conversationInfo &&
        //             (!this.conversationInfo.hasOwnProperty('current_page') || this.conversationInfo.current_page === 0)
        //         ) {
        //             console.log('getting new messages. watch this if it calls many times without needed');

        //             this.gettingNewMessages = true;

        //             this.$store.dispatch('chat/getConvMessages', { convId: this.conv_id }).finally(() => {
        //                 this.gettingNewMessages = false;
        //             });
        //         }
        //     },
        //     deep: true,
        //     immediate: true,
        // },

        conv_id: {
            handler: function () {
                if (!this.conversationInfo.hasOwnProperty('current_page')) {
                    this.getNewMessages();
                }
            },
            immediate: true,
        },

        conversationMessages: {
            handler: function () {
                this.handleAttachmentLoading();

                if ('auto_scroll_to_bottom') {
                    this.scrollToBottom();
                }
            },
            deep: true,
            immediate: true,
        },
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
</style>
