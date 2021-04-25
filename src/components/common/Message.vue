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
        <template v-for="(message, index) in conversationInfo.messages" :key="message.id" class="justify-center">
            <q-chat-message
                v-if="message.msg"
                :name="handleNameForMultipleSelfMessage(index, message)"
                avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                :text="[message.msg]"
                :stamp="$helpers.fromNowTime(message.created_at)"
                :sent="checkOwnMessage(message)"
                :text-color="checkOwnMessage(message) ? 'black' : 'white'"
                :bg-color="checkOwnMessage(message) ? 'gray-9' : 'blue-9'"
            />

            <q-chat-message v-else :label="getConvStateStatusMessage(message)" />
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

    <div>{{ attachments }} {{ finalAttachments }}</div>
    <div
        v-if="chatPanelType === 'client' || conversationInfo.state.status === 'joined'"
        class="tw-w-full tw-flex tw-mt-3 tw-bg-white tw-shadow-lg tw-self-end tw-rounded tw-p-1"
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
            <q-btn flat color="green" icon="attachment" @click="$refs.attachment_uploader.pickFiles($event)"></q-btn>
        </div>
        <div class="tw-flex tw-flex-col tw-justify-end"><q-btn flat color="green" icon="mood"></q-btn></div>
        <div class="tw-flex-auto tw-px-3">
            <q-input
                v-model.trim="msg"
                @keyup.enter.exact="sendMessage"
                @focus="inputFocusHandle"
                @blur="inputBlurHandle"
                debounce="0"
                placeholder="Write Message..."
                color="green-8"
                class=""
                autogrow
                borderless
                dense
            ></q-input>
            <div v-if="finalAttachments && finalAttachments.length" class="tw-my-3">
                <q-avatar
                    v-for="(attachmentObj, key) in finalAttachments"
                    :key="key"
                    size="80px"
                    class="each-attachment shadow-3 tw-relative"
                    rounded
                    ><img :src="attachmentObj.src" />
                    <div
                        v-show="attachmentObj.status !== 'done'"
                        class="tw-absolute tw-h-full tw-w-full tw-bg-gray-900 tw-opacity-25"
                    ></div>
                    <div
                        v-show="attachmentObj.status !== 'done'"
                        class="tw-absolute tw-flex tw-justify-items-center text-green tw-font-bold tw-text-xs tw-text-center"
                    >
                        {{ attachmentObj.status }}
                    </div>
                    <q-badge
                        class="attachment-remove-btn hidden"
                        floating
                        color="red"
                        @click="attachmentRemoveHandle(attachmentObj)"
                        ><q-icon name="close" />
                    </q-badge>
                </q-avatar>
            </div>
        </div>
        <div class="tw-flex tw-flex-col tw-justify-end">
            <q-btn icon="send" flat color="green-8" :disable="getSendBtnStatus"></q-btn>
        </div>
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
        };
    },

    mounted() {
        setInterval(() => {
            this.$forceUpdate();
        }, 30000);
    },

    computed: {
        getSendBtnStatus(): any {
            return this.finalAttachments.length && _l.findIndex(this.finalAttachments, (att: any) => !att.id);
        },
    },

    methods: {
        checkOwnMessage(message: any) {
            return message.socket_session_id === this.sesId;
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
                this.$socket.emit('ec_is_typing_from_user', {
                    conv_id: this.getConvId(),
                });
            }, 1000);
        },

        inputBlurHandle() {
            clearInterval(this.typingHandler);
        },

        sendMessage(): any {
            if (!this.msg.length) {
                return false;
            }

            console.log('sending the msg');

            const emitType = this.isUserPanel() ? 'user' : 'client';
            const dynamicBody = this.isUserPanel()
                ? { conv_id: this.getConvId() }
                : { temp_id: this.$helpers.getTempId() };

            const dynamicSocket = this.socket || this.$socket;

            dynamicSocket.emit(`ec_msg_from_${emitType}`, {
                ...dynamicBody,
                msg: this.msg,
            });

            this.msg = '';
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
            console.log(val);
            console.log(this.attachments);

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

                    window.clientApi
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

                            window.clientApi
                                .get(attachment.src)
                                .then((res: any) => {
                                    finalAttachment.id = attachment.attachment_info.id;
                                    finalAttachment.status = 'done';
                                    finalAttachment.src = URL.createObjectURL(res); // its giving a warning so after this line nothing will work
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
            console.log(localCopy);

            if (localCopy.id) {
                window.clientApi.delete(`messages/attachments/${localCopy.id}`);
            }
        },
        handleAttachmentReject(entries: any) {
            // show toast
            console.log('before upload error', entries);

            entries.forEach((attachment: any) => {
                console.log(attachment.file.name, attachment.failedPropValidation, 'error');
            });
        },
    },

    watch: {
        conversationInfo: {
            handler: function () {
                this.scrollToBottom();
            },
            deep: true,
        },
    },
});
</script>

<style lang="scss" scoped>
.each-attachment {
    &:hover {
        .attachment-remove-btn {
            display: inline-flex !important;
        }
    }
}
</style>
