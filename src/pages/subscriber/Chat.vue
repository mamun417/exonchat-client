<template>
    <div>
        <div class="tw-flex tw-flex-col tw-h-full">
            <messages-top-section :conv_id="$route.params['conv_id']" class="tw-mb-3" />

            <message :conv_id="$route.params['conv_id']" :ses_id="profile?.socket_session?.id" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Message from "components/common/Message.vue";
import MessagesTopSection from "components/subscriber/chat/MessagesTopSection.vue";

import { mapGetters, mapMutations } from "vuex";

export default defineComponent({
    name: "ChatPage",
    components: { MessagesTopSection, Message },

    data(): any {
        return {};
    },

    computed: {
        ...mapGetters({
            profile: "auth/profile",
            rightBarState: "setting_ui/rightBarState",
        }),
    },

    beforeRouteEnter(to, from, next) {
        next((vm: any) => {
            // vm.messageInputAutoFocus = from.name === 'clients-conversations';
            if (!vm.rightBarState.mode || vm.rightBarState.mode === "client_info") {
                vm.updateRightDrawerState({ mode: "client_info", visible: true });
            }
        });
    },

    methods: {
        ...mapMutations({ updateRightDrawerState: "setting_ui/updateRightDrawerState" }),
    },
});
</script>
