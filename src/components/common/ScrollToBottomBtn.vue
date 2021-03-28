<template>
    <q-btn
        v-if="gotoBottomBtnShow"
        @click="scrollToBottom"
        style="position: fixed; left: 200px; bottom: 60px"
        class="tw-bottom-2 tw-opacity-75 tw-right-2"
        color="black"
        icon="keyboard_arrow_down"
        size="sm"
        round
    />
</template>

<script>
export default {
    name: 'ScrollToBottomBtn',
};
</script>

<style scoped></style>
