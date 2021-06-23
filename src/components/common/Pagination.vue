<template>
    <q-pagination
        :model-value="current_page"
        :max="last_page"
        @update:model-value="$emit('handlePagination', $event)"
        :direction-links="true"
        :boundary-links="true"
        icon-first="skip_previous"
        icon-last="skip_next"
        icon-prev="fast_rewind"
        icon-next="fast_forward"
        :max-pages="15"
        :boundary-numbers="true"
    />
</template>

<script>
export default {
    name: 'Pagination',
    props: {
        current_page: {
            type: Number,
        },
        last_page: {
            type: Number,
        },
    },
};
</script>
