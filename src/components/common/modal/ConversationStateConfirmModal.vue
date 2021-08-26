<template>
    <q-dialog :model-value="true" persistent>
        <q-card style="min-width: 350px">
            <q-card-section class="row items-center">
                <slot name="content">
                    <span class="q-ml-sm">
                        Are you sure to {{ convStateButtonInfo.name.toLowerCase() }} this conversation ?
                    </span>
                </slot>
            </q-card-section>

            <q-card-actions align="right">
                <slot name="action">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn
                        @click="$emit('convStateHandle', convStateButtonInfo.action)"
                        label="Yes"
                        color="primary"
                        v-close-popup
                        flat
                    />
                </slot>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "ConversationStateConfirmModal",
    props: {
        convStateButtonInfo: {
            type: Object,
            default: () => ({}),
        },
    },
});
</script>

<style scoped></style>
