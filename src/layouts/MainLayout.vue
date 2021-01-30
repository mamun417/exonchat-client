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
                class="tw-fixed tw-w-18 tw-h-full tw-top-0 tw-left-0 tw-border-r-2 tw-border-blue-100"
            >
                <q-list class="tw-text-gray-600 ">
                    <q-item class="tw-my-3 tw-py-4">
                        <q-item-section class="content-center" avatar>
                            <q-icon name="mediation" />
                        </q-item-section>
                    </q-item>
                    <div class="tw-border-b-2 tw-border-blue-100"></div>

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
                class="tw-fixed tw-w-60 tw-h-full tw-top-0 tw-left-18  tw-border-r-2 tw-border-blue-100"
            >
                <q-scroll-area
                    class="fit"
                    :bar-style="{
                        background: '#60A5FA',
                        width: '5px',
                        opacity: 0.7
                    }"
                    :thumb-style="{
                        display: 'none'
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
                            header-class="text-weight-bold tw-bg-blueGray-100"
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
                            header-class="text-weight-bold tw-bg-blueGray-100"
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
                            expand-separator
                            default-opened
                            label="Chat For Me"
                            header-class="text-weight-bold tw-bg-blueGray-100"
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
                            header-class="text-weight-bold tw-bg-blueGray-100"
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
                            header-class="text-weight-bold tw-bg-blueGray-100"
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
                    class="tw-h-full tw-col-span-8 tw-border-r-2 tw-border-blue-100"
                ></div>

                <div class="tw-h-full tw-col-span-4">
                    <q-list>
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
