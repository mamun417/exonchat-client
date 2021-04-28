<template>
    <template v-slot:header="props">
        <q-tr :props="props">
            <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-italic text-green tw-font-bold tw-text-lg"
            >
                {{ col.label }}
            </q-th>
        </q-tr>
    </template>

    <!--<template v-slot:body-cell-intent_tag="props">-->
    <!--    <q-td :props="props">-->
    <!--        <q-badge color="green" class="text-italic">-->
    <!--            @{{ props.row.tag }}-->
    <!--            <q-tooltip class="" anchor="center right" :offset="[50, 14]">-->
    <!--                {{ props.row.description }}-->
    <!--            </q-tooltip>-->
    <!--        </q-badge>-->
    <!--    </q-td>-->
    <!--</template>-->

    <!--<template v-slot:body-cell-url_path="props">-->
    <!--    <q-td :props="props">-->
    <!--        <div class="tw-text-xxs text-italic tw-font-medium tw-text-gray-700">-->
    <!--            {{ props.row.url_path }}-->
    <!--        </div>-->
    <!--    </q-td>-->
    <!--</template>-->

    <!--<template v-slot:body-cell-content="props">-->
    <!--    <q-td :props="props">-->
    <!--        <div class="tw-text-xxs tw-text-gray-700">-->
    <!--            {{ props.row.content.content }}-->
    <!--            <q-inner-loading :showing="!!props.row.content.loading">-->
    <!--                <q-spinner-dots size="sm" color="green" />-->
    <!--            </q-inner-loading>-->
    <!--        </div>-->
    <!--    </q-td>-->
    <!--</template>-->

    <!--<template v-slot:body-cell-status="props">-->
    <!--    <q-td :props="props">-->
    <!--        <q-badge :color="props.row.active ? '' : 'red'">-->
    <!--            {{ props.row.active ? 'Active' : 'Inactive' }}-->
    <!--        </q-badge>-->
    <!--    </q-td>-->
    <!--</template>-->

    <!--<template v-slot:body-cell-action="props">-->
    <!--    <q-td :props="props">-->
    <!--        <q-btn icon="create" text-color="green" size="sm" dense flat></q-btn>-->
    <!--        <q-btn icon="settings" text-color="green" size="sm" dense flat></q-btn>-->
    <!--        <q-btn icon="delete" text-color="red" size="sm" dense flat></q-btn>-->
    <!--    </q-td>-->
    <!--</template>-->

    <!--<template v-slot:no-data="{ message }">-->
    <!--    <div class="full-width row flex-center text-red q-gutter-sm">-->
    <!--        <q-icon size="2em" name="sentiment_dissatisfied" />-->
    <!--        <span> Well this is sad... {{ message }} </span>-->
    <!--    </div>-->
    <!--</template>-->
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'IntentList',
    props: {},

    data(): any {
        return {
            intents: [],
        };
    },

    mounted() {
        console.log('get intents');
        this.getIntents();
    },

    methods: {
        getIntents() {
            this.$store
                .dispatch('intent/getIntents')
                .then((res: any) => {
                    res.data.map((e: any) => {
                        e.url_path =
                            e.intent_action.type === 'external'
                                ? e.intent_action.external_path
                                : e.intent_action.type === 'action'
                                ? 'apisiteurl.com/action_resolver?action' + e.intent_action.action_name
                                : 'nil';

                        e.content = {
                            content: e.intent_action.type === 'static' ? e.intent_action.content : '',
                            loading: e.intent_action.type !== 'static',
                            type: e.intent_action.type,
                        };

                        if (e.type !== 'static') {
                            // call e.url_path get res & assign to e.content.content & e.content.loading = false
                        }
                    });

                    this.intents = res.data;
                })
                .catch((err: any) => {
                    console.log(err);
                });
        },
    },
});
</script>

<style scoped></style>
