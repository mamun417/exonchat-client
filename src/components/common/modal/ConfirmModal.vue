<template>
    <q-dialog :model-value="true" persistent>
        <q-card style="min-width: 350px">
            <q-card-section class="row items-center">
                <span v-if="$slots.content" class="q-ml-sm">
                    <slot name="content"> </slot>
                </span>
                <span v-else class="q-ml-sm">Are you want to delete ?</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn @click="$emit('confirmed')" label="Yes" color="primary" v-close-popup flat />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ConfirmModal',
});
</script>
