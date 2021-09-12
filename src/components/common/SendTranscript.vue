<template>
    <q-btn
        @click="sendTranscript"
        :loading="sendingTranscript"
        label="Send Transcript"
        :color="color || globalColor"
        unelevated
        no-caps
    />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
    name: "SendTranscript",
    data(): any {
        return {
            sendingTranscript: false,
        };
    },

    props: {
        conv_id: {
            type: String,
            default: "",
        },
        color: {
            type: String,
            default: null,
        },
    },

    computed: {
        ...mapGetters({
            globalBgColor: "setting_ui/globalBgColor",
            globalColor: "setting_ui/globalColor",
        }),
    },

    methods: {
        sendTranscript() {
            if (!this.conv_id) {
                this.$helpers.showErrorNotification(this, "Conversation id not found");
                return;
            }

            this.sendingTranscript = true;

            window.socketSessionApi
                .get(`conversations/send-transcript/${this.conv_id}`)
                .then((res: any) => {
                    this.$helpers.showSuccessNotification(this, "Transcript send success");
                })
                .catch((err: any) => {
                    console.log(err);
                })
                .finally(() => {
                    this.sendingTranscript = false;
                });
        },
    },
});
</script>
