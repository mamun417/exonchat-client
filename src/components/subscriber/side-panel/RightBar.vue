<template>
    <div>
        <q-list class="tw-px-1 tw-my-3">
            <q-item class="">
                <q-item-section avatar>
                    <q-avatar size="xl">
                        <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" />
                    </q-avatar>
                </q-item-section>

                <q-item-section class="tw-w-full">
                    <q-item-label class="text-weight-bold tw-text-lg"
                        >Hasan</q-item-label
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
                    <q-item-label class="text-weight-bold">User IP</q-item-label
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
                                    <q-icon name="wysiwyg" size="xs"> </q-icon>
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
                                    <q-icon name="wysiwyg" size="xs"> </q-icon>
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
                                    <q-icon name="visibility" size="xs">
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'RightBar',
    components: {},
    setup() {
        return {};
    },
    data(): any {
        return {};
    },
    mounted() {
        console.log('right bar initiated');
    },
    methods: {},
});
</script>
