<template>
    <div class="tw-h-full tw-flex tw-flex-col">
        <template v-if="rightBarState.mode === 'conversation'">
            <messages-top-section :conv_id="rightBarState.conv_id" :mini_mode="true" />
            <message :ses_id="profile.socket_session.id" :conv_id="rightBarState.conv_id" :mini_mode="true"></message>
        </template>

        <q-scroll-area
            v-else-if="rightBarState.mode === 'client_info'"
            class="fit"
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
                opacity: 0.5,
            }"
        >
            <q-list class="tw-px-1 tw-my-3">
                <q-item class="">
                    <q-item-section avatar>
                        <q-avatar size="xl">
                            <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" alt="" />
                        </q-avatar>
                    </q-item-section>

                    <q-item-section class="tw-w-full">
                        <q-item-label class="text-weight-bold tw-text-lg">
                            {{ $_.upperFirst(profile.user_meta?.full_name) }}
                        </q-item-label>
                        <q-item-label caption>{{ profile.email }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item class="tw-text-xs tw-w-full" dense>
                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                        <q-icon name="language" size="xs"> </q-icon>
                    </q-item-section>
                    <q-item-section no-wrap>
                        <q-item-label class="text-weight-bold">Browser</q-item-label
                        ><q-item-label caption>mozilla firefox</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item class="tw-text-xs tw-w-full" dense>
                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                        <q-icon name="devices" size="xs"> </q-icon>
                    </q-item-section>
                    <q-item-section no-wrap>
                        <q-item-label class="text-weight-bold">Operating System</q-item-label
                        ><q-item-label caption>WIndows 10</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item class="tw-text-xs tw-w-full" dense>
                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                        <q-icon name="dns" size="xs"> </q-icon>
                    </q-item-section>
                    <q-item-section no-wrap>
                        <q-item-label class="text-weight-bold">User IP</q-item-label
                        ><q-item-label caption>127.0.0.1</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item class="tw-text-xs tw-w-full" dense>
                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                        <q-icon name="schedule" size="xs"> </q-icon>
                    </q-item-section>
                    <q-item-section no-wrap>
                        <q-item-label class="text-weight-bold">Initiated At</q-item-label
                        ><q-item-label caption>Sun Aug 11 11 1111 11:11:11</q-item-label>
                    </q-item-section>
                </q-item>

                <q-expansion-item
                    icon="web"
                    label="User Visiting"
                    dense
                    default-opened
                    header-class="text-weight-bold bg-green-1"
                    class="tw-py-2"
                >
                    <q-card
                        ><q-card-section class="tw-p-0">
                            <q-list class="">
                                <q-item dense class="tw-text-xs">
                                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                                        <q-icon name="wysiwyg" size="xs"> </q-icon>
                                    </q-item-section>
                                    <q-item-section
                                        ><q-item-label>http://my.exonhost.com</q-item-label
                                        ><q-item-label caption>30 sec ago</q-item-label></q-item-section
                                    ></q-item
                                >
                                <q-item dense class="tw-text-xs">
                                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                                        <q-icon name="wysiwyg" size="xs"> </q-icon>
                                    </q-item-section>
                                    <q-item-section
                                        ><q-item-label>http://my.exonhost.com</q-item-label
                                        ><q-item-label caption>15 sec ago</q-item-label></q-item-section
                                    ></q-item
                                >
                                <q-item dense class="tw-text-xs">
                                    <q-item-section class="tw-max-w-xs tw-pr-0" avatar>
                                        <q-icon name="visibility" size="xs"> </q-icon>
                                    </q-item-section>
                                    <q-item-section
                                        ><q-item-label>http://my.exonhost.com/invoice</q-item-label
                                        ><q-item-label caption>5 sec ago</q-item-label></q-item-section
                                    ></q-item
                                ></q-list
                            ></q-card-section
                        ></q-card
                    >
                </q-expansion-item>
            </q-list>
        </q-scroll-area>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import Message from 'components/common/Message.vue';
import MessagesTopSection from 'components/subscriber/chat/MessagesTopSection.vue';

export default defineComponent({
    name: 'RightBar',
    components: { MessagesTopSection, Message },
    setup() {
        return {};
    },
    data(): any {
        return {
            sesId: '',
            confirm: false,
        };
    },

    computed: {
        ...mapGetters({
            rightBarState: 'ui/rightBarState',
            profile: 'auth/profile',
        }),
    },

    mounted() {
        console.log('right bar initiated');
    },

    methods: {},
});
</script>
