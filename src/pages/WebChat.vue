<template>
    <q-page class="tw-flex tw-flex-col">
        <div
            class="tw-bg-green-600 text-weight-bold tw-text-gray-50 tw-px-4 tw-py-2 tw-flex tw-items-center"
        >
            <div>Online - Chat With Us</div>
            <q-space></q-space>
            <q-btn icon="expand_more" dense flat></q-btn>
        </div>

        <div class="tw-flex-grow tw-flex tw-flex-col tw-p-1">
            <div v-if="true" class="tw-flex-grow tw-flex tw-flex-col">
                <q-scroll-area
                    class="tw-p-3 tw-flex-grow tw-text-xs"
                    style="height:1px"
                    :bar-style="{
                        background: '#60A5FA',
                        width: '4px',
                        opacity: 0.2,
                        borderRadius: '10px'
                    }"
                    :thumb-style="{
                        borderRadius: '9px',
                        backgroundColor: '#60A5FA',
                        width: '4px',
                        opacity: 0.7
                    }"
                    :content-style="{}"
                >
                    <q-chat-message
                        name="hasan"
                        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                        :text="['hey, how are you?']"
                        stamp="7 minutes ago"
                        sent
                        text-color="black"
                        bg-color="gray-9"
                    />

                    <q-chat-message
                        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
                        :text="[
                            'doing fine, how r you?',
                            'I just feel like typing a really, really, REALLY long message to annoy you...'
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
                        name="mamun"
                        avatar="https://cdn.quasar.dev/img/avatar2.jpg"
                        stamp="5 minutes ago"
                        :text="['Hey there!']"
                        sent
                        text-color="black"
                        bg-color="gray-9"
                    >
                    </q-chat-message>

                    <q-chat-message
                        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                        bg-color="gray-9"
                        sent
                        text-color="black"
                        :text="['hasan is typing...']"
                        class="exonchat-is-typing"
                    >
                    </q-chat-message>
                </q-scroll-area>

                <div
                    class="tw-w-full tw-flex tw-mt-3 tw-bg-white tw-shadow-sm tw-rounded"
                >
                    <q-btn
                        flat
                        color="green"
                        icon="attachment"
                        size="sm"
                    ></q-btn>
                    <q-input
                        autogrow
                        borderless
                        placeholder="Write Message..."
                        color="green-8"
                        class="tw-flex-auto"
                        dense
                    ></q-input>
                    <q-btn icon="send" flat color="green-8" size="sm"></q-btn>
                </div>
            </div>
            <div
                v-else-if="'after_login_found' === 'after_login_found'"
                class="tw-flex tw-flex-col justify-center tw-flex-grow"
            >
                <div class="tw-bg-white tw-shadow tw-m-5 tw-relative">
                    <div
                        class="tw-absolute tw-m-auto full-width text-center"
                        style="top:-25px"
                    >
                        <q-icon name="chat" size="xl" color="green"></q-icon>
                    </div>
                    <div class="tw-px-4 tw-py-16">
                        <q-select
                            dense
                            label="Chat Department"
                            color="green"
                            class="tw-mb-3"
                        ></q-select>

                        <q-btn dense color="green" class="full-width tw-mt-6"
                            >Start Chat</q-btn
                        >
                    </div>
                </div>
            </div>
            <div v-else class="tw-flex tw-flex-col justify-center tw-flex-grow">
                <div class="tw-bg-white tw-shadow tw-m-5 tw-relative">
                    <div
                        class="tw-absolute tw-m-auto full-width text-center"
                        style="top:-25px"
                    >
                        <q-icon
                            name="account_circle"
                            size="xl"
                            color="green"
                        ></q-icon>
                    </div>
                    <div class="tw-px-4 tw-py-16">
                        <q-input
                            dense
                            label="Your Name"
                            color="green"
                            class="tw-mb-3"
                            ><template v-slot:prepend>
                                <q-icon name="person" size="xs" /> </template
                        ></q-input>
                        <q-input
                            dense
                            class="tw-mb-3"
                            label="Your Email"
                            type="email"
                            ><template v-slot:prepend>
                                <q-icon name="email" size="xs" /> </template
                        ></q-input>
                        <q-btn dense color="green" class="full-width tw-mt-6"
                            >Start Chat as Guest</q-btn
                        >
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    name: 'WebChat',
    components: {},
    setup() {
        return {};
    }
});
</script>

<style>
.q-message.exonchat-is-typing .q-message-text {
    min-height: unset;
}
</style>
