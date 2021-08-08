<template>
    <q-expansion-item
        class="tw-border-1 tw-shadow-md tw-my-1"
        v-for="(state, i) in Object.keys($store._modules.root.state)"
        :key="i"
        :label="state"
        :header-class="`tw-font-bold ${globalBgColor}-2`"
        dense
    >
        <q-expansion-item
            v-for="(stateKey, k) in Object.keys($store._modules.root.state[state])"
            :key="k"
            :header-inset-level="0.3"
            :label="`${state}/${stateKey}`"
            :header-class="`tw-font-bold ${globalBgColor}-2`"
            dense
        >
            <div class="tw-p-4 tw-text-xs">
                <pre>{{ $store._modules.root.state[state][stateKey] }}</pre>
            </div>
        </q-expansion-item>
    </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
    name: "StoreDebug",
    props: {},

    data(): any {
        return {};
    },

    computed: {
        ...mapGetters({
            globalBgColor: "setting_ui/globalBgColor",
        }),
    },
});
</script>

<style lang="scss"></style>
