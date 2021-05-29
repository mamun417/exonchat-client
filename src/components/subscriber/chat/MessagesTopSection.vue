<template>
    <q-card class="tw-shadow-lg">
        <q-card-section class="row no-wrap items-center">
            <q-item class="">
                <q-item-section avatar>
                    <q-avatar size="xl">
                        <img :src="`https://cdn.quasar.dev/img/avatar1.jpg`" alt="" />
                    </q-avatar>
                </q-item-section>

                <q-item-section class="tw-w-full">
                    <q-item-label class="text-weight-bold tw-text-lg"> name </q-item-label>
                    <q-item-label caption>
                        <q-badge color="green" class="tw-px-2 tw-py-1">Online</q-badge>
                    </q-item-label>
                </q-item-section>
            </q-item>
            <q-space></q-space>
            <!-- <q-btn
                flat
                no-caps
                color="orange-8"
                @click="confirm = !confirm"
                v-if="!isAgentToAgentConversation"
                :label="`${convStateButtonInfo.name} Chat`"
            ></q-btn> -->
        </q-card-section>
    </q-card>
</template>
