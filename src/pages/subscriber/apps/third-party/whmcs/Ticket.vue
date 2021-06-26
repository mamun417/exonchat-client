<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow-lg tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">WHMCS Tickets</div>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow-lg tw-bg-white tw-p-4">
                <ec-table :rows="tickets" :columns="columns" :loading="loadingData" hideSearch>
                    <template v-slot:filter><q-btn label="Reload" icon="refresh" size="sm" no-caps /></template>

                    <template v-slot:cell-email="slotProps">
                        <div class="text-italic">
                            <!-- <pre>{{ slotProps.row }}</pre> -->
                            {{ slotProps.row.email }}
                        </div>
                    </template>

                    <template v-slot:cell-status="slotProps">
                        <q-badge :color="slotProps.row.status === 'Answered' ? 'green' : 'orange'">
                            {{ slotProps.row.status }}
                        </q-badge>
                    </template>

                    <template v-slot:cell-created_at="slotProps">
                        <div class="tw-text-xxs">{{ slotProps.row.date }}</div>
                    </template>

                    <template v-slot:cell-action="slotProps">
                        <q-btn
                            @click="
                                ticketSelected = slotProps.row;
                                detailModal = true;
                            "
                            icon="visibility"
                            color="green"
                            flat
                        />
                    </template>
                </ec-table>
            </div>
        </div>

        <ticket-detail :ticket="ticketSelected" :modal_show="detailModal" @modalUpdate="detailModal = $event" />

        <!--        <q-dialog v-model="detailModal" @update:modelValue="(value) => (detailModal = value)" full-width>-->
        <!--            <q-card>-->
        <!--                <q-card-section class="tw-border-b-2 tw-py-2 text-italic tw-font-medium"-->
        <!--                    >Ticket #{{ ticketDetail.tid }} {{ ticketDetail.subject }}</q-card-section-->
        <!--                >-->

        <!--                <q-card-section>-->
        <!--                    <q-timeline layout="dense" color="secondary">-->
        <!--                        <q-timeline-entry-->
        <!--                            v-for="(reply, key) of ticketDetail?.replies?.reply"-->
        <!--                            :key="reply.replyid"-->
        <!--                            :title="reply.email"-->
        <!--                            :subtitle="reply.date"-->
        <!--                            :side="key % 2 === 0 ? 'left' : 'right'"-->
        <!--                        >-->
        <!--                            <template v-slot:title>-->
        <!--                                <div class="text-italic tw-font-medium tw-text-sm">{{ reply.email }}</div>-->
        <!--                            </template>-->
        <!--                            <div class="tw-text-xs tw-whitespace-pre-wrap">-->
        <!--                                {{ reply.message }}-->
        <!--                            </div>-->
        <!--                        </q-timeline-entry>-->
        <!--                    </q-timeline>-->
        <!--                </q-card-section>-->

        <!--                <q-inner-loading :showing="loadingDetail" color="green" />-->
        <!--            </q-card>-->
        <!--        </q-dialog>-->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EcTable from 'components/common/table/EcTable.vue';
import TicketDetail from 'components/apps/whmcs/TicketDetail.vue';

export default defineComponent({
    components: { TicketDetail, EcTable },
    data(): any {
        return {
            columns: [
                { name: 'tid', align: 'center', label: 'Ticket ID', field: 'tid' },
                { name: 'email', align: 'center', label: 'Email', field: 'email' },
                { name: 'subject', align: 'center', label: 'Subject', field: 'subject' },
                { name: 'status', align: 'center', label: 'Status', field: 'status' },
                { name: 'priority', align: 'center', label: 'Priority', field: 'priority' },
                { name: 'created_at', align: 'center', label: 'Created At', field: 'date' },
                { name: 'action', label: 'Actions', field: 'action', align: 'center' },
            ],
            tickets: [],

            ticketSelected: null,

            loadingData: false,

            detailModal: false,
        };
    },

    mounted() {
        this.getTickets();
    },

    computed: {
        mappedTickets(): any {
            return [];
        },
    },

    methods: {
        getTickets() {
            this.loadingData = true;

            window.api
                .get('/apps/whmcs/tickets')
                .then((res: any) => {
                    this.tickets = res.data.tickets.ticket;
                })
                .finally(() => {
                    console.log('finally executed');

                    this.loadingData = false;
                });
        },
    },
});
</script>
