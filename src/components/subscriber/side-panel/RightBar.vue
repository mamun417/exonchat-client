<template>
    <div class="tw-h-full tw-flex tw-flex-col">
        <message :ses-id="sesId" chat-panel-type="user" :conversationInfo="conversationInfo"></message>

        <!--        <q-btn
            icon="chevron_right"
            color="green"
            size="sm"
            class="tw-absolute tw-top-7"
            style="z-index: 999; right: 235px"
            round
            unelevated
        />-->
        <!--        <q-scroll-area
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
            &lt;!&ndash;            <q-list class="tw-px-1 tw-my-3">
                <q-item class="">
                    <q-item-section avatar>
                        <q-avatar size="xl">
                            <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" alt="" />
                        </q-avatar>
                    </q-item-section>

                    <q-item-section class="tw-w-full">
                        <q-item-label class="text-weight-bold tw-text-lg">Hasan</q-item-label
                        ><q-item-label caption>test@test.test</q-item-label>
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
            </q-list>&ndash;&gt;
        </q-scroll-area>-->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Message from 'components/common/Message.vue';

export default defineComponent({
    name: 'RightBar',
    components: { Message },
    setup() {
        return {};
    },
    data(): any {
        return {
            sesId: '',
        };
    },

    computed: {
        conversationInfo(): any {
            return this.$store.getters['chat/conversationInfo']('ckovg9uxa3498ckg7g6h15fz0');
        },
    },

    mounted() {
        console.log('right bar initiated');
        this.sesId = sessionStorage.getItem('ec_user_socket_ses_id');

        this.getConvMessages('ckovg9uxa3498ckg7g6h15fz0');
    },

    methods: {
        async getConvMessages(convId: string) {
            await this.$store.dispatch('chat/getAgentConvMessages', {
                convId,
            });
        },
    },
});
</script>
