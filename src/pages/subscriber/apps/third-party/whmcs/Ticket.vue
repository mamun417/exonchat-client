<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">WHMCS Tickets</div>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <ec-table :rows="mappedTickets" :columns="columns"> </ec-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EcTable from 'components/common/table/EcTable.vue';

export default defineComponent({
    components: { EcTable },
    data(): any {
        return {
            columns: [{ name: 'id', align: 'center', label: 'Ticket ID', field: 'ticket_id' }],
            chatTemplates: [],
        };
    },

    computed: {
        mappedTickets(): any {
            return [];
        },
    },

    methods: {},
});
</script>
