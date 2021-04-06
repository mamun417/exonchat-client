<template>
    <div class="tw-flex tw-flex-col">
        <q-card class="tw-shadow-lg">
            <q-card-section class="row no-wrap items-center">
                <q-item class="">
                    <q-item-section avatar>
                        <q-avatar size="xl">
                            <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" alt="" />
                        </q-avatar>
                    </q-item-section>

                    <q-item-section class="tw-w-full">
                        <q-item-label class="text-weight-bold tw-text-lg">Hasan</q-item-label>
                        <q-item-label caption>
                            <q-badge color="green" class="tw-px-2 tw-py-1">Active</q-badge>
                        </q-item-label>
                    </q-item-section>
                </q-item>
                <q-space></q-space>
                <q-btn
                    @click="confirm = !confirm"
                    :label="`${convStateButtonInfo.name} Chat`"
                    color="orange-8"
                    no-caps
                    flat
                ></q-btn>
            </q-card-section>
        </q-card>
        <!-- <div class=""> -->
        <q-scroll-area
            @scroll="handleScroll"
            ref="msgScrollArea"
            class="tw-flex-grow tw-p-3"
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
                v-if="messages.length"
                v-for="(message, index) in messages"
                :key="message.id"
                :name="
                    index === 0 || message?.socket_session_id !== messages[index - 1].socket_session_id
                        ? message.socket_session_id
                        : ''
                "
                avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                :text="[message.msg]"
                :stamp="$fromNowTime(message.created_at)"
                :sent="checkOwnMessage(message)"
                :text-color="checkOwnMessage(message) ? 'black' : 'white'"
                :bg-color="checkOwnMessage(message) ? 'gray-9' : 'blue-9'"
            />

            <!-- <q-chat-message avatar="https://cdn.quasar.dev/img/avatar5.jpg" bg-color="blue-9">
                <q-spinner-dots color="white" size="2rem" />
            </q-chat-message> -->

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
            v-if="convStateInfo.convState === 'joined'"
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
        <!-- </div> -->

        <q-dialog v-model="confirm" persistent>
            <q-card style="min-width: 350px">
                <q-card-section class="row items-center">
                    <span class="q-ml-sm"
                        >Are you want to {{ convStateButtonInfo.name.toLowerCase() }} this conversation ?</span
                    >
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn
                        @click="convStateHandle(convStateButtonInfo.action)"
                        label="Yes"
                        color="primary"
                        v-close-popup
                        flat
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
    name: 'ChatPanel',
    components: {},
    setup() {
        return {};
    },
    props: {
        conversationId: {
            type: String,
            default: '',
        },
    },
    data(): any {
        return {
            sesId: '',
            convId: '',
            confirm: false,
            convState: '',
            msg: '',
            typingInstance: null,
            msgInputFocused: false,
            gotoBottomBtnShow: false,
        };
    },

    mounted() {
        console.log('chat panel initiated');

        setInterval(() => {
            this.$forceUpdate();
        }, 30000);

        this.sesId = sessionStorage.getItem('ec_user_socket_ses_id');
    },

    computed: {
        ...mapGetters({
            convStateInfo: 'chat/convStateInfo',
        }),

        messages(): any {
            const convId = this.getConvId();
            return this.$store.getters['chat/messages'](convId);
        },

        convStateButtonInfo() {
            const convState = this.convStateInfo(this.getConvId())?.status;

            if (convState === 'left') {
                return { name: 'Close', action: 'close' };
            } else if (convState === 'closed') {
                return { name: 'Closed' };
            } else if (convState === 'joined') {
                return { name: 'Leave', action: 'leave' };
            }

            return { name: 'Join', action: 'join' };
        },
    },

    methods: {
        getConvId() {
            return this.$route.params['conv_id'];
        },

        convStateHandle(type: string) {
            if (!type) return;
            this[`${type}Conversation`](this.getConvId());
        },

        joinConversation(conv_id: any) {
            console.log(conv_id);

            this.$socket.emit('ec_join_conversation', {
                conv_id: conv_id,
            });
        },

        leaveConversation(conv_id: any) {
            this.$socket.emit('ec_leave_conversation', {
                conv_id: conv_id,
            });
        },

        closeConversation(conv_id: any) {
            console.log('from close');

            this.$socket.emit('ec_close_conversation', {
                conv_id: conv_id,
            });
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

            // send event when current user is sending msg
            this.$socket.emit('ec_msg_from_user', {
                conv_id: this.getConvId(),
                msg: this.msg,
            }); // sentAt will also mean as tempId

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

                msgScrollArea.setScrollPosition('vertical', scrollTarget.scrollHeight);
                // setTimeout(function () {
                // }, 2000);
            }
        },

        checkOwnMessage(message: any) {
            return message.socket_session_id === this.sesId;
        },

        getConvMessages(convId: string) {
            this.$store.dispatch('chat/getConvMessages', {
                convId,
            });
            // .then((result: any) => {
            //     console.log(result);
            // })
            // .catch((err: any) => {
            //     console.log(err);
            // });
        },
    },

    watch: {
        messages: {
            handler: function () {
                this.scrollToBottom();
            },
            deep: true,
        },

        $route: {
            handler: function () {
                const convId = this.getConvId();

                if (convId) {
                    this.getConvMessages(convId);
                }
            },
            deep: true,
            immediate: true,
        },
    },
});
</script>
