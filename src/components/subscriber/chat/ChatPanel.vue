<template>
    <div class='tw-flex tw-flex-col'>
        <q-card class='tw-shadow-lg'>
            <q-card-section class='row no-wrap items-center'>
                <q-item class=''>
                    <q-item-section avatar>
                        <q-avatar size='xl'>
                            <img :src='`https://cdn.quasar.dev/img/avatar1.jpg`' />
                        </q-avatar>
                    </q-item-section>

                    <q-item-section class='tw-w-full'>
                        <q-item-label class='text-weight-bold tw-text-lg'>Hasan</q-item-label>
                        <q-item-label caption>
                            <q-badge color='green' class='tw-px-2 tw-py-1'>Active</q-badge>
                        </q-item-label>
                    </q-item-section>
                </q-item>
                <q-space></q-space>
                <q-btn
                    @click='convStateHandle(convStateButtonInfo.action)'
                    :label='`${convStateButtonInfo.name} Chat`'
                    color='orange-8'
                    no-caps
                    flat
                ></q-btn>
            </q-card-section>
        </q-card>
        <!-- <div class=""> -->
        <q-scroll-area
            class='tw-flex-1 tw-p-3'
            style='height: 1px'
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
            :content-style='{}'
        >
            <pre>{{ messages }}</pre>
            <q-chat-message
                v-for='message in messages'
                :key='message'
                name='hasan'
                avatar='https://cdn.quasar.dev/img/avatar3.jpg'
                :text='[message.msg]'
                stamp='7 minutes ago'
                :sent="message.return_type === 'own'"
                :text-color="message.return_type === 'own' ? 'black' : 'white'"
                :bg-color="message.return_type === 'own' ? 'gray-9' : 'blue-9'"
            />

            <q-chat-message avatar='https://cdn.quasar.dev/img/avatar5.jpg' bg-color='blue-9'>
                <q-spinner-dots color='white' size='2rem' />
            </q-chat-message>
        </q-scroll-area>

        <div class='tw-w-full tw-flex tw-mt-3 tw-bg-white tw-shadow-lg tw-self-end tw-rounded'>
            <q-btn flat color='green' icon='attachment'></q-btn>
            <q-btn flat color='green' icon='mood'></q-btn>
            <q-input
                ref='msgScrollArea'
                v-model='msg'
                @keyup.enter.exact='sendMessage'
                @focus='inputFocusHandle'
                @blur='inputBlurHandle'
                debounce='0'
                placeholder='Write Message...'
                color='green-8'
                class='tw-flex-auto'
                autogrow
                borderless
                dense
            ></q-input>
            <q-btn icon='send' flat color='green-8'></q-btn>
        </div>
        <!-- </div> -->
    </div>
</template>

<script lang='ts'>
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
            default: ''
        }
    },
    data(): any {
        return {
            convState: '',
            msg: '',
            typingInstance: null,
            msgInputFocused: false
        };
    },

    mounted() {
        console.log('chat panel initiated');
    },

    computed: {
        ...mapGetters({
            joinConvInfo: 'chat/joinConvInfo',
            messages: 'chat/messages'
        }),

        convStateButtonInfo() {
            const convState = this.joinConvInfo.convState;

            if (convState === 'left') {
                return { name: 'Close', action: 'close' };
            } else if (convState === 'closed') {
                return { name: 'Closed' };
            } else if (convState === 'joined') {
                return { name: 'Leave', action: 'leave' };
            }

            return { name: 'Join', action: 'join' };
        }
    },

    methods: {
        convStateHandle(type: string) {
            if (!type) return;

            this[`${type}Conversation`](123);
        },

        joinConversation(conv_id: any) {
            this.$socket.emit('ec_join_conversation', {
                conv_id: conv_id
            });
        },

        leaveConversation(conv_id: any) {
            this.$socket.emit('ec_leave_conversation', {
                conv_id: conv_id
            });
        },

        closeConversation(conv_id: any) {
            this.$socket.emit('ec_close_conversation', {
                conv_id: conv_id
            });
        },

        inputFocusHandle() {
            this.typingHandler = setInterval(() => {
                this.$socket.emit('ec_is_typing_from_agent', {
                    conv_id: 123,
                    sentAt: 'timestamp'
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
                conv_id: 123,
                msg: this.msg,
                sentAt: 'timestamp'
            }); // sentAt will also mean as tempId

            this.msg = '';
        }
    }
});
</script>
