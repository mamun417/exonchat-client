<template>
    <q-card class="tw-shadow-lg">
        <q-card-section>
            <div class="tw-flex tw-items-center tw-mb-2">
                <div class="tw-font-medium">Enable/Disable Chat Panle box for testing :</div>
                <q-btn
                    class="tw-ml-2"
                    :color="chatPanelBoxIsTesting ? 'orange' : 'green'"
                    :label="chatPanelBoxIsTesting ? 'Disable' : 'Enable'"
                    size="sm"
                    @click="updateChatPanelBoxTestingShowStaus(!chatPanelBoxIsTesting)"
                    no-caps
                    no-wrap
                />
            </div>
            <div class="tw-text-xs">
                Current staus is :
                <span :class="[chatPanelBoxIsTesting ? 'text-green' : 'text-orange']">{{
                    chatPanelBoxIsTesting ? "enabled" : "disabled"
                }}</span>
            </div>

            <div v-if="!chatPanelBoxIsTesting" class="tw-text-xxs tw-mt-4 text-white bg-green tw-p-2 tw-font-bold">
                <div>
                    It will open the chat panel box here. You will see changes here. If changes are not updating please
                    reload
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapMutations, mapGetters } from "vuex";

export default defineComponent({
    name: "",
    props: {},

    data(): any {
        return {};
    },

    computed: {
        ...mapGetters({}),

        chatPanelBoxIsTesting() {
            // later handle through api
            const ls = window.localStorage.getItem("chat_panel_box_for_test");

            return ls && ls === "true";
        },
    },

    methods: {
        ...mapMutations({}),

        updateChatPanelBoxTestingShowStaus(toogleTo: any) {
            if (toogleTo) {
                window.localStorage.setItem("chat_panel_box_for_test", "true");
            } else {
                window.localStorage.removeItem("chat_panel_box_for_test");
            }

            location.reload();
        },
    },

    watch: {},
});
</script>

<style lang="scss"></style>
