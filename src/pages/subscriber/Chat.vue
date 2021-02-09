<template>
    <div>
        <div class="tw-h-full tw-grid tw-grid-cols-12">
            <div class="tw-col-span-12 tw-flex tw-flex-col">
                <q-card class="tw-shadow-lg"
                    ><q-card-section class="row no-wrap items-center"
                        ><q-item class="">
                            <q-item-section avatar>
                                <q-avatar size="xl">
                                    <img
                                        :src="
                                            `https://cdn.quasar.dev/img/avatar1.jpg`
                                        "
                                    />
                                </q-avatar>
                            </q-item-section>

                            <q-item-section class="tw-w-full">
                                <q-item-label
                                    class="text-weight-bold tw-text-lg"
                                    >Hasan</q-item-label
                                ><q-item-label caption
                                    ><q-badge
                                        color="green"
                                        class="tw-px-2 tw-py-1"
                                        >Active</q-badge
                                    ></q-item-label
                                >
                            </q-item-section>
                        </q-item>
                        <q-space></q-space
                        ><q-btn flat color="orange-8"
                            >Leave</q-btn
                        ></q-card-section
                    ></q-card
                >
                <!-- <div class=""> -->
                <q-scroll-area
                    class="tw-flex-1 tw-p-3"
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
                        text-color="white"
                        bg-color="orange-9"
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
                        autogrow
                        borderless
                        placeholder="Write Message..."
                        color="green-8"
                        class="tw-flex-auto"
                    ></q-input>
                    <q-btn icon="send" flat color="green-8"></q-btn>
                </div>
                <!-- </div> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    name: 'ChatPage',
    components: {},
    setup() {
        return {};
    },
    data(): any {
        return {};
    },
    mounted() {
        console.log('chat page initiated');
    },
    methods: {}
});
</script>
