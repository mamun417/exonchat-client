<template>
    <div>
        <chat-panel class="tw-h-full" conversationId="123"></chat-panel>
    </div>
    <!-- <div>
        <div class="tw-h-full tw-grid tw-grid-cols-12">
            <chat-panel
                class="tw-col-span-12"
                conversationId="123"
            ></chat-panel>
        </div>
    </div> -->
</template>

<script lang="ts">
import ChatPanel from 'src/components/subscriber/chat/ChatPanel.vue';
import { defineComponent, provide, ref } from 'vue';

export default defineComponent({
    name: 'ChatPage',
    components: { ChatPanel },

    setup() {
        const messageInputAutoFocus = ref(false);

        provide('messageInputAutoFocus', messageInputAutoFocus);

        return {
            messageInputAutoFocus,
        };
    },

    data(): any {
        return {};
    },

    mounted() {
        console.log('chat page initiated');
    },

    beforeRouteEnter(to, from, next) {
        next((vm: any) => {
            vm.messageInputAutoFocus = from.name === 'clients-conversations';
        });
    },

    beforeRouteUpdate(to, from, next) {
        this.messageInputAutoFocus = false;
        next();
    },

    methods: {},
});
</script>
