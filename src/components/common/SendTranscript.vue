<template>
    <div @click="sendTranscript" class="tw-flex tw-items-center">
        <slot v-if="!!this.$slots['custom-content']" name="custom-content"></slot>

        <q-btn
            v-else
            :loading="sendingTranscript"
            :color="color || globalColor"
            :text-color="text_color"
            unelevated
            no-caps
        >
            <q-icon v-if="icon" :name="icon" class="tw-pr-3" />
            <div>Send Transcript</div>
            <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Sending...
            </template>
        </q-btn>
    </div>
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
        icon: {
            type: String,
            default: "",
        },
        color: {
            type: String,
            default: null,
        },
        text_color: {
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
            if (this.sendingTranscript) {
                return;
            }

            if (!this.conv_id) {
                this.$helpers.showErrorNotification(this, "Conversation id not found");
                return;
            }

            this.sendingTranscript = true;
            this.$emit("sendingTranscript", true);

            window.socketSessionApi
                .get(`conversations/send-transcript/${this.conv_id}`)
                .then((res: any) => {
                    this.$helpers.showSuccessNotification(this, "Transcript send success");
                    console.log(res.data);
                })
                .catch((err: any) => {
                    console.log(err);
                })
                .finally(() => {
                    this.sendingTranscript = false;
                    this.$emit("sendingTranscript", false);
                });
        },
    },
});
</script>
