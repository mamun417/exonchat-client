<template>
    <div>
        <div class="tw-h-full tw-grid tw-grid-cols-12">
            <chat-panel
                class="tw-col-span-12"
                conversationId="123"
            ></chat-panel>
        </div>
    </div>
</template>

<script lang="ts">
import ChatPanel from 'src/components/subscriber/chat/ChatPanel.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ChatPage',
    components: { ChatPanel },
    setup() {
        return {};
    },
    data(): any {
        return {};
    },
    mounted() {
        console.log('chat page initiated');
    },
    methods: {},
});
</script>
