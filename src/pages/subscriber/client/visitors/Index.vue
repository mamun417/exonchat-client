<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Visitors List</div>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <!-- {{ visitors }} -->
                <ec-table :rows="visitors" :columns="columns">
                    <template v-slot:cell-client_ip="slotProps">
                        <div class="text-italic">
                            <!-- <pre>{{ slotProps.row }}</pre> -->
                            {{ slotProps.row.client_ip }}
                        </div>
                    </template>

                    <template v-slot:cell-status="slotProps">
                        <q-badge :color="$_.last(slotProps.row.visits).visiting ? 'green' : 'orange'">
                            {{ $_.last(slotProps.row.visits).visiting ? 'Visiting' : 'Not Visiting' }}
                        </q-badge>
                    </template>

                    <template v-slot:cell-url="slotProps">
                        <div class="text-italic">
                            <!-- <pre>{{ slotProps.row }}</pre> -->
                            {{ $_.last(slotProps.row.visits).url }}
                        </div>
                    </template>

                    <template v-slot:cell-stay_time="slotProps">
                        <div class="text-italic">
                            <!-- <pre>{{ slotProps.row }}</pre> -->
                            {{ $helpers.diffAsMinute($_.last(slotProps.row.visits).first_visit_time) }}
                        </div>
                    </template>

                    <template v-slot:cell-last_seen_at="slotProps">
                        <div class="text-italic">
                            <!-- <pre>{{ slotProps.row }}</pre> -->
                            {{ $helpers.fromNowTime($_.last(slotProps.row.visits).last_stay_time) }}
                        </div>
                    </template>
                </ec-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import EcTable from 'components/common/table/EcTable.vue';

const columns = [
    {
        name: 'ip',
        align: 'left',
        label: 'IP',
    },
    {
        name: 'name',
        align: 'left',
        label: 'Name',
    },
    {
        name: 'email',
        align: 'left',
        label: 'Email',
    },
    {
        name: 'url',
        align: 'center',
        label: 'url',
    },
    {
        name: 'status',
        align: 'center',
        label: 'On Page Status',
    },
    {
        name: 'stay_time',
        label: 'Visit Duration',
    },
    {
        name: 'last_seen_at', // only view, close if needed, join if um not joined, leave if um joined
        label: 'Last Seen',
    },
];

export default defineComponent({
    components: {
        EcTable,
    },
    data(): any {
        return {};
    },

    setup() {
        return {
            columns,
        };
    },

    computed: {
        ...mapGetters({
            visitors: 'visitor/visitors',
        }),
    },

    mounted() {
        setInterval(() => {
            this.$forceUpdate();
        }, 10000);
    },

    methods: {},
});
</script>
