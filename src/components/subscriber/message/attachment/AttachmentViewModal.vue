<template>
    <q-dialog :model-value="true" full-width>
        <q-responsive class="no-shadow" :ratio="1">
            <q-img fit="contain" :src="attachmentPreview.src" spinner-color="green" class="attachment-preview">
                <div class="absolute-bottom text-subtitle1 text-center">
                    {{ attachmentPreview.original_name }}
                </div>
                <q-badge class="tw-cursor-pointer" floating v-close-popup>
                    <q-icon name="close" class="text-orange tw-text-lg" />
                </q-badge>
            </q-img>
        </q-responsive>

        <q-btn class="hidden" />
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "AttachmentViewModal",
    props: {
        attachmentPreview: {
            type: Object,
            default: () => ({}),
        },
    },
});
</script>
