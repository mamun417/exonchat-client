<template>
    <div class="tw-flex tw-flex-col">
        <q-card class="tw-shadow-lg"
            ><q-card-section class="row no-wrap items-center"
                ><q-item class="">
                    <q-item-section avatar>
                        <q-avatar size="xl">
                            <img
                                :src="`https://cdn.quasar.dev/img/avatar1.jpg`"
                            />
                        </q-avatar>
                    </q-item-section>

                    <q-item-section class="tw-w-full">
                        <q-item-label class="text-weight-bold tw-text-lg"
                            >Hasan</q-item-label
                        ><q-item-label caption
                            ><q-badge color="green" class="tw-px-2 tw-py-1"
                                >Active</q-badge
                            ></q-item-label
                        >
                    </q-item-section>
                </q-item>
                <q-space></q-space
                ><q-btn
                    flat
                    color="orange-8"
                    @click="convStateHandle(convStateButtionInfo.action)"
                    no-caps
                    :label="`${convStateButtionInfo.name} Chat`"
                ></q-btn></q-card-section
        ></q-card>
        <!-- <div class=""> -->
        <q-scroll-area
            class="tw-flex-1 tw-p-3"
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
                text-color="white"
                bg-color="orange-9"
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
                name="me"
                avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                stamp="5 minutes ago"
                :text="['Hey there!']"
                sent
                text-color="white"
                bg-color="green-9"
            >
            </q-chat-message>

            <q-chat-message
                avatar="https://cdn.quasar.dev/img/avatar5.jpg"
                bg-color="blue-9"
            >
                <q-spinner-dots color="white" size="2rem" />
            </q-chat-message>
        </q-scroll-area>

        <div
            class="tw-w-full tw-flex tw-mt-3 tw-bg-white tw-shadow-lg tw-self-end tw-rounded"
        >
            <q-btn flat color="green" icon="attachment"></q-btn>
            <q-btn flat color="green" icon="mood"></q-btn>
            <q-input
                v-model="msg"
                @keyup.enter="sendMessage"
                @focus="inputFocusHandle"
                @blur="inputBlurHandle"
                debounce="500"
                placeholder="Write Message..."
                color="green-8"
                class="tw-flex-auto"
                autogrow
                borderless
            ></q-input>
            <q-btn icon="send" flat color="green-8"></q-btn>
        </div>
        <!-- </div> -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
            convState: '',
            msg: '',
            typingInstance: null,
            msgInputFocused: false,
        };
    },
    mounted() {
        console.log('chat panel initiated');
    },
    computed: {
        convStateButtionInfo() {
            if (this.convState === 'leaved') {
                return { name: 'Close', action: 'close' };
            } else if (this.convState === 'closed') {
                return { name: 'Closed' };
            } else if (this.convState === 'joined') {
                return { name: 'Join', action: 'join' };
            }

            return { name: 'Join', action: 'join' };
        },
    },
    methods: {
        convStateHandle(type: string) {
            if (!type) return;

            this[`${type}Conversation`](123);
        },
        joinConversation(conv_id: any) {
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
            this.$socket.emit('ec_close_conversation', {
                conv_id: conv_id,
            });
        },
        inputFocusHandle() {
            this.typingHandler = setInterval(() => {
                this.$socket.emit('ec_is_typing_from_agent', {
                    sentAt: 'timestamp',
                });
            }, 1000);
        },
        inputBlurHandle() {
            clearInterval(this.typingHandler);
        },
        sendMessage(): any {
            console.log('sending the msg');

            // send event when current user is sending msg
            this.$socket.emit('ec_msg_from_agent', {
                msg: this.msg,
                sentAt: 'timestamp',
            }); // sentAt will also mean as tempId
        },
    },
});
</script>
