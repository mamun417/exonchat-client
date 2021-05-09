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
        <template v-for="(message, index) in conversationInfoLocal.messages" :key="message.id" class="justify-center">
            <q-chat-message
                v-if="message.msg"
                :name="handleNameForMultipleSelfMessage(index, message)"
                avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                :stamp="$helpers.fromNowTime(message.created_at)"
                :sent="checkOwnMessage(message)"
                :text-color="checkOwnMessage(message) ? 'black' : 'white'"
                :bg-color="checkOwnMessage(message) ? 'gray-9' : 'blue-9'"
            >
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
                        <!-- <q-avatar
                            v-for="(attachment, key) in message.attachments"
                            :key="attachment.id"
                            size="100px"
                            class="shadow-3"
                            :class="{
                                'tw-mr-2': !msgForRightSide(message) && key !== message.attachments.length - 1,
                                'tw-ml-2': msgForRightSide(message) && key !== message.attachments.length - 1,
                            }"
                            rounded
                        >
                            <q-inner-loading
                                v-if="!attachment.hasOwnProperty('loading') || attachment.loading"
                                :showing="true"
                            >
                                <q-spinner-dots size="30px" color="green" />
                            </q-inner-loading>
                            <img v-else class="tw-cursor-pointer" :src="attachment.src" />
                        </q-avatar> -->
                    </div>
                </div></q-chat-message
            >

            <q-chat-message
                v-else-if="!message.msg && !isAgentToAgentConversation"
                :label="getConvStateStatusMessage(message)"
            />
        </template>

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

    <div
        v-if="
            chatPanelType === 'client' || conversationInfo.stateInfo.status === 'joined' || isAgentToAgentConversation
        "
        class="tw-w-full tw-flex tw-mt-3 tw-bg-white tw-shadow-lg tw-self-end tw-rounded"
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
                color="green"
                icon="attachment"
                class="tw-px-2"
                @click="$refs.attachment_uploader.pickFiles($event)"
            ></q-btn>
        </div>
        <div class="tw-flex tw-flex-col tw-justify-end">
            <q-btn flat color="green" icon="mood" class="tw-px-2"></q-btn>
        </div>
        <div class="tw-flex-auto tw-px-3">
            <!-- used keydown for instant catch n prevent -->
            <q-input
                v-model="msg"
                debounce="0"
                placeholder="Write Message..."
                color="green-8"
                class="ec-msg-input"
                :class="[`ec-msg-input-${uid}`]"
                @keyup.enter.exact="sendMessage"
                @keydown="keyUpHandle"
                @focus="inputFocusHandle"
                @blur="inputBlurHandle"
                hide-bottom-space
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
                    <div class="tw-font-bold tw-text-xs text-green tw-px-4 tw-py-2">Suggetions</div>
                    <q-separator />
                    <q-list separator style="min-width: 300px"
                        ><q-item
                            v-for="(template, key) in chatTemplates"
                            :key="key"
                            :active="template.is_focused"
                            active-class="bg-green-3"
                            class="tw-font-medium"
                            @click="chatTemplateSelectHandle(key)"
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
            <q-btn icon="send" flat color="green-8" :disable="getSendBtnStatus"></q-btn>
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

import * as _l from 'lodash';

export default defineComponent({
    name: 'Message',
    components: {},
    props: {
        sesId: {
            type: String,
        },

        socket: {
            type: Object,
            default: null,
        },

        chatPanelType: {
            type: String,
            default: 'user',
        },

        conversationInfo: {
            type: Object,
        },
    },

    data(): any {
        return {
            uid: new Date().getTime().toString(), // user convid insted. not from url
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
        };
    },

    mounted() {
        setInterval(() => {
            this.$forceUpdate(); // now i have no idea why its needed
        }, 30000);
    },

    computed: {
        getSendBtnStatus(): any {
            return this.finalAttachments.length && _l.findIndex(this.finalAttachments, (att: any) => !att.id);
        },

        isAgentToAgentConversation(): any {
            return this.conversationInfo.stateInfo.users_only;
        },
    },

    methods: {
        checkOwnMessage(message: any) {
            return message.socket_session_id === this.sesId;
        },

        msgForRightSide(message: any) {
            if (this.checkOwnMessage(message)) {
                return true;
            } else {
                if (!this.isUserPanel) {
                    return !!message.socket_session.user_id;
                }
            }

            return false;
        },

        getConvId() {
            return this.$route.params['conv_id'];
        },

        handleNameForMultipleSelfMessage(index: any, message: any) {
            const previousMessage = this.conversationInfo.messages[index - 1];

            return index === 0 ||
                previousMessage.hasOwnProperty('conv_state_status') ||
                message?.socket_session_id !== previousMessage.socket_session_id
                ? message.hasOwnProperty('socket_session')
                    ? message.socket_session.user?.email ?? 'init email address'
                    : ''
                : '';
        },

        getConvStateStatusMessage(message: any) {
            // const onOrAt = message.conv_state_status === 'join' ? 'on' : 'at';

            const infoKey = message.conv_state_status === 'closed' ? 'closed_by' : 'socket_session';

            return `${message[infoKey].user.email} ${message.conv_state_status} ${this.$helpers.fromNowTime(
                message.created_at
            )}`;
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
            if (e.key === '/') {
                this.chatTemplate = true;
                e.preventDefault();
            }
        },

        getChatTemplates() {
            this.chatTemplates = [
                { tag: '/hi', content: 'hello user', is_focused: false },
                { tag: '/by', content: 'bye user', is_focused: true },
            ];

            this.chatTemplateLoading = false;

            // when get completes
            this.$refs[`ec_template_dom_${this.uid}`].$forceUpdate(); // it will try to match dynamic height
        },
        chatTemplateShowHandle() {
            this.getChatTemplates();
            document.body.addEventListener('keyup', this.chatTemplateArrowKeyUpDownHandle);

            this.chatTemplateDomPositionUpdate();
        },
        chatTemplateHideHandle() {
            document.body.removeEventListener('keyup', this.chatTemplateArrowKeyUpDownHandle);
        },
        chatTemplateArrowKeyUpDownHandle(e: any) {
            if (this.chatTemplates.length) {
                const currentFocusedTemplate = _l.findIndex(this.chatTemplates, ['is_focused', true]);
                if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
                    const upOrDown = e.key === 'ArrowDown' ? 1 : -1;

                    if (currentFocusedTemplate === this.chatTemplates.length - 1 || currentFocusedTemplate === -1) {
                        this.chatTemplates[0].is_focused = true;
                    } else if (currentFocusedTemplate === 0 && e.key === 'ArrowUp') {
                        this.chatTemplates[this.chatTemplates.length - 1].is_focused = true;
                    } else {
                        this.chatTemplates[currentFocusedTemplate + upOrDown].is_focused = true;
                    }

                    if (this.chatTemplates.length > 1 && currentFocusedTemplate !== -1) {
                        this.chatTemplates[currentFocusedTemplate].is_focused = false;
                    }
                }

                if (e.key === 'Enter') {
                    this.chatTemplateSelectHandle(currentFocusedTemplate);
                }
            }
        },
        chatTemplateSelectHandle(key: any) {
            //if has intent handle loader wait then add content
            this.msg += this.chatTemplates[key].content;
            this.chatTemplate = false;
        },
        chatTemplateSearchHandle(e: any) {
            if (['ArrowUp', 'ArrowDown'].includes(e.key)) return;

            // assume api returned none after search
            this.chatTemplates = [
                { tag: 'No Result! Append in message box', content: `/${this.chatTemplateInputVal}`, is_focused: true },
            ];
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
            if (!this.msg.length) {
                return false;
            }

            console.log('sending the msg');

            const emitType = this.isUserPanel() ? 'user' : 'client';
            const dynamicBody = this.isUserPanel()
                ? { conv_id: this.getConvId(), temp_id: this.$helpers.getTempId() }
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

        isUserPanel() {
            return this.chatPanelType === 'user';
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
            });
        },

        async handleAttachmentLoading() {
            console.log('called handle attch loader');

            this.conversationInfoLocal = _l.cloneDeep(this.conversationInfo);

            if (
                !this.conversationInfoLocal ||
                !this.conversationInfoLocal.messages ||
                !this.conversationInfoLocal.messages.length
            )
                return;

            for (const msg of this.conversationInfoLocal.messages) {
                // console.log(msg);

                if (msg.attachments && msg.attachments.length) {
                    for (const attch of msg.attachments) {
                        if (!attch.hasOwnProperty('loading')) {
                            try {
                                attch.loading = false;
                                const imgRes = await this.$socketSessionApi.get(`messages/attachments/${attch.id}`, {
                                    responseType: 'arraybuffer',
                                });

                                attch.src = URL.createObjectURL(
                                    new Blob([imgRes.data], { type: imgRes.headers['content-type'] })
                                );
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                }
            }
        },
    },

    watch: {
        conversationInfo: {
            handler: function () {
                this.handleAttachmentLoading();
                this.scrollToBottom();
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
</style>
