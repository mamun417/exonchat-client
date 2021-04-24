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
        <q-btn flat color="green" icon="attachment"></q-btn>
        <q-btn flat color="green" icon="mood"></q-btn>
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
        <q-btn icon="send" flat color="green-8"></q-btn>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
        };
    },

    mounted() {
        setInterval(() => {
            this.$forceUpdate();
        }, 30000);
    },

    computed: {
        isAgentToAgentConversation(): any {
            return this.conversationInfo.stateInfo.users_only;
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
            // this.typingHandler = setInterval(() => {
            //     this.$socket.emit('ec_is_typing_from_user', {
            //         conv_id: this.getConvId(),
            //     });
            // }, 1000);
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
