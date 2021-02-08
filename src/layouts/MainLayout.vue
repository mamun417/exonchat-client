<template>
    <q-layout view="hhh LpR fff" class="tw-bg-white">
        <!-- <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
        /> -->

        <!-- <q-drawer mini show-if-above bordered content-class="tw-bg-gray-900">
            <q-list padding>
                <q-item active clickable v-ripple>
                    <q-item-section avatar>
                        <q-icon name="user" />
                    </q-item-section>

                    <q-item-section>
                        Star
                    </q-item-section>
                </q-item>
            </q-list>
        </q-drawer> -->

        <q-page-container class="tw-min-h-screen"
            ><div
                class="tw-fixed tw-w-18 tw-h-full tw-top-0 tw-left-0 tw-border-r-2 tw-border-blue-50 tw-shadow-lg"
            >
                <q-list class="tw-text-gray-600">
                    <q-item class="tw-my-3 tw-py-4">
                        <q-item-section class="content-center" avatar>
                            <q-icon name="mediation" />
                        </q-item-section>
                    </q-item>
                    <div class="tw-border-b-2 tw-border-blue-50"></div>

                    <q-item clickable v-ripple class="tw-my-3 tw-py-5">
                        <q-item-section class="content-center" avatar>
                            <q-avatar size="xl">
                                <img
                                    :src="
                                        `https://cdn.quasar.dev/img/avatar1.jpg`
                                    "
                                />

                                <q-badge
                                    color="green"
                                    floating
                                    style="background: unset !important"
                                    ><q-icon
                                        name="fiber_manual_record"
                                        color="green"
                                    ></q-icon
                                ></q-badge>
                            </q-avatar>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple class="tw-my-3 tw-py-5">
                        <q-item-section class="content-center" avatar>
                            <q-icon name="forum" />
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple class="tw-my-3 tw-py-5">
                        <q-item-section class="content-center" avatar>
                            <q-icon name="star" />
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple class="tw-my-3 tw-py-5">
                        <q-item-section class="content-center" avatar>
                            <q-icon name="send" />
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple class="tw-my-3 tw-py-5">
                        <q-item-section class="content-center" avatar>
                            <q-icon name="drafts" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>

            <div
                class="tw-fixed tw-w-60 tw-h-full tw-top-0 tw-left-18 tw-border-r-2 tw-border-blue-50 tw-shadow-lg"
            >
                <q-scroll-area
                    class="fit tw-px-1 tw-py-3"
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
                        opacity: 0.5
                    }"
                >
                    <!-- <div
                        class="text-weight-bold tw-text-lg text-center tw-py-2"
                    >
                        Interactions
                    </div> -->

                    <q-list class="tw-text-gray-600">
                        <q-expansion-item
                            default-opened
                            label="Incoming chat request"
                            header-class="text-weight-bold tw-bg-blue-50"
                        >
                            <q-card>
                                <q-card-section>
                                    Currently no chat requests
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-expansion-item
                            default-opened
                            label="Agents"
                            header-class="text-weight-bold tw-bg-blue-50"
                        >
                            <q-card>
                                <q-card-section class="tw-p-0">
                                    <q-list>
                                        <q-item class="">
                                            <q-item-section avatar>
                                                <q-avatar>
                                                    <img
                                                        :src="
                                                            `https://cdn.quasar.dev/img/avatar2.jpg`
                                                        "
                                                    />
                                                </q-avatar>
                                            </q-item-section>

                                            <q-item-section>
                                                <q-item-label
                                                    class="text-weight-bold"
                                                    >Mamun</q-item-label
                                                >
                                            </q-item-section>

                                            <q-item-section side>
                                                <q-icon
                                                    name="fiber_manual_record"
                                                    color="green"
                                                    size="xs"
                                                />
                                            </q-item-section>
                                        </q-item>
                                        <q-item class="">
                                            <q-item-section avatar>
                                                <q-avatar>
                                                    <img
                                                        :src="
                                                            `https://cdn.quasar.dev/img/avatar6.jpg`
                                                        "
                                                    />
                                                </q-avatar>
                                            </q-item-section>

                                            <q-item-section>
                                                <q-item-label
                                                    class="text-weight-bold"
                                                    >Noman</q-item-label
                                                >
                                            </q-item-section>

                                            <q-item-section side>
                                                <q-icon
                                                    name="fiber_manual_record"
                                                    color="grey"
                                                    size="xs"
                                                />
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-expansion-item
                            default-opened
                            label="Chat For Me"
                            header-class="text-weight-bold tw-bg-blue-50"
                        >
                            <q-card>
                                <q-list>
                                    <q-item class="">
                                        <q-item-section avatar>
                                            <q-avatar>
                                                <img
                                                    :src="
                                                        `https://cdn.quasar.dev/img/avatar1.jpg`
                                                    "
                                                />
                                            </q-avatar>
                                        </q-item-section>

                                        <q-item-section>
                                            <q-item-label
                                                class="text-weight-bold"
                                                >Hasan</q-item-label
                                            ><q-item-label caption lines="2"
                                                >How can i buy a bd domain
                                                name</q-item-label
                                            >
                                        </q-item-section>
                                    </q-item>
                                    <q-item class="">
                                        <q-item-section avatar>
                                            <q-avatar>
                                                <img
                                                    :src="
                                                        `https://cdn.quasar.dev/img/avatar3.jpg`
                                                    "
                                                />
                                            </q-avatar>
                                        </q-item-section>

                                        <q-item-section>
                                            <q-item-label
                                                class="text-weight-bold"
                                                >Nasir</q-item-label
                                            ><q-item-label caption lines="2"
                                                >My site is hacked... Please
                                                help me.</q-item-label
                                            >
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-card>
                        </q-expansion-item>
                        <q-expansion-item
                            default-opened
                            label="Chat Departments"
                            header-class="text-weight-bold tw-bg-blue-50"
                        >
                            <q-card>
                                <q-list dense>
                                    <q-item class="tw-text-xs">
                                        <q-item-section>
                                            <q-item-label
                                                class="text-weight-bold"
                                                >All</q-item-label
                                            >
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label
                                                side
                                                class="text-right tw-text-xs"
                                                >10 chats</q-item-label
                                            >
                                        </q-item-section>
                                    </q-item>
                                    <q-item class="tw-text-xs">
                                        <q-item-section>
                                            <q-item-label
                                                class="text-weight-bold"
                                                >Sales</q-item-label
                                            >
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label
                                                side
                                                class="text-right"
                                                >5 chats</q-item-label
                                            >
                                        </q-item-section>
                                    </q-item>
                                    <q-item class="tw-text-xs">
                                        <q-item-section>
                                            <q-item-label
                                                class="text-weight-bold"
                                                >Technical Support</q-item-label
                                            >
                                        </q-item-section>
                                        <q-item-section class="tw-max-w-16">
                                            <q-item-label
                                                side
                                                class="text-right"
                                                >5 chats</q-item-label
                                            >
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-card>
                        </q-expansion-item>
                        <q-expansion-item
                            default-opened
                            label="Busy Agents"
                            header-class="text-weight-bold tw-bg-blue-50"
                        >
                            <q-card>
                                <q-card-section class="tw-p-0">
                                    <q-list v-for="n in 10" :key="n">
                                        <q-item class="">
                                            <q-item-section avatar>
                                                <q-avatar>
                                                    <img
                                                        :src="
                                                            `https://cdn.quasar.dev/img/avatar2.jpg`
                                                        "
                                                    />
                                                </q-avatar>
                                            </q-item-section>

                                            <q-item-section>
                                                <q-item-label
                                                    class="text-weight-bold"
                                                    >Mamun</q-item-label
                                                >
                                            </q-item-section>

                                            <q-item-section side>
                                                <q-icon
                                                    name="fiber_manual_record"
                                                    color="green"
                                                    size="xs"
                                                />
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>
                    </q-list>
                </q-scroll-area>
            </div>

            <div class="tw-ml-78 tw-grid tw-grid-cols-12 tw-min-h-screen">
                <div
                    class="tw-h-full tw-col-span-9 tw-border-r-2 tw-border-blue-50"
                >
                    <div
                        class="tw-h-full tw-grid tw-grid-cols-12 tw-bg-blue-50"
                    >
                        <div
                            class="tw-col-span-12 tw-px-3 tw-my-3 tw-flex tw-flex-col"
                        >
                            <q-card class="tw-shadow-lg"
                                ><q-card-section
                                    class="row no-wrap items-center"
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
                                <q-btn
                                    flat
                                    color="green"
                                    icon="attachment"
                                ></q-btn>
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

                <div
                    class="tw-h-full tw-col-span-3 tw-shadow-lg tw-overflow-hidden"
                >
                    <q-list class="tw-px-1 tw-my-3">
                        <q-item class="">
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
                                    >test@test.test</q-item-label
                                >
                            </q-item-section>
                        </q-item>
                        <q-item class="tw-text-xs tw-w-full" dense>
                            <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                                <q-icon name="language" size="xs"> </q-icon>
                            </q-item-section>
                            <q-item-section no-wrap>
                                <q-item-label class="text-weight-bold"
                                    >Browser</q-item-label
                                ><q-item-label caption
                                    >mozilla firefox</q-item-label
                                >
                            </q-item-section>
                        </q-item>
                        <q-item class="tw-text-xs tw-w-full" dense>
                            <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                                <q-icon name="devices" size="xs"> </q-icon>
                            </q-item-section>
                            <q-item-section no-wrap>
                                <q-item-label class="text-weight-bold"
                                    >Operating System</q-item-label
                                ><q-item-label caption>WIndows 10</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item class="tw-text-xs tw-w-full" dense>
                            <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                                <q-icon name="dns" size="xs"> </q-icon>
                            </q-item-section>
                            <q-item-section no-wrap>
                                <q-item-label class="text-weight-bold"
                                    >User IP</q-item-label
                                ><q-item-label caption>127.0.0.1</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item class="tw-text-xs tw-w-full" dense>
                            <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                                <q-icon name="schedule" size="xs"> </q-icon>
                            </q-item-section>
                            <q-item-section no-wrap>
                                <q-item-label class="text-weight-bold"
                                    >Initiated At</q-item-label
                                ><q-item-label caption
                                    >Sun Aug 11 11 1111 11:11:11</q-item-label
                                >
                            </q-item-section>
                        </q-item>

                        <q-expansion-item
                            icon="web"
                            label="User Visiting"
                            dense
                            default-opened
                            header-class="text-weight-bold tw-bg-blueGray-100"
                            class="tw-py-2"
                        >
                            <q-card
                                ><q-card-section class="tw-p-0">
                                    <q-list class="tw-bg-blueGray-50">
                                        <q-item dense class="tw-text-xs">
                                            <q-item-section
                                                class="tw-max-w-xs tw-pr-0"
                                                avatar
                                            >
                                                <q-icon
                                                    name="wysiwyg"
                                                    size="xs"
                                                >
                                                </q-icon>
                                            </q-item-section>
                                            <q-item-section
                                                ><q-item-label
                                                    >http://my.exonhost.com</q-item-label
                                                ><q-item-label caption
                                                    >30 sec ago</q-item-label
                                                ></q-item-section
                                            ></q-item
                                        >
                                        <q-item dense class="tw-text-xs">
                                            <q-item-section
                                                class="tw-max-w-xs tw-pr-0"
                                                avatar
                                            >
                                                <q-icon
                                                    name="wysiwyg"
                                                    size="xs"
                                                >
                                                </q-icon>
                                            </q-item-section>
                                            <q-item-section
                                                ><q-item-label
                                                    >http://my.exonhost.com</q-item-label
                                                ><q-item-label caption
                                                    >15 sec ago</q-item-label
                                                ></q-item-section
                                            ></q-item
                                        >
                                        <q-item dense class="tw-text-xs">
                                            <q-item-section
                                                class="tw-max-w-xs tw-pr-0"
                                                avatar
                                            >
                                                <q-icon
                                                    name="visibility"
                                                    size="xs"
                                                >
                                                </q-icon>
                                            </q-item-section>
                                            <q-item-section
                                                ><q-item-label
                                                    >http://my.exonhost.com/invoice</q-item-label
                                                ><q-item-label caption
                                                    >5 sec ago</q-item-label
                                                ></q-item-section
                                            ></q-item
                                        ></q-list
                                    ></q-card-section
                                ></q-card
                            >
                        </q-expansion-item>
                    </q-list>
                </div>
            </div>

            <!-- <router-view class="tw-ml-78" /> -->
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
    name: 'MainLayout',
    components: {},
    setup() {
        const miniMode = ref(false);

        return { miniMode };
    }
});
</script>
