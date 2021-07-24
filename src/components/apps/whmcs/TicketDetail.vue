<template>
    <q-dialog :model-value="modal_show" @update:modelValue="$emit('modalUpdate', $event)" full-width>
        <q-card>
            <q-card-section class="tw-border-b-2 tw-py-2 tw-font-medium"
                >Ticket #{{ ticketDetail.tid }} {{ ticketDetail.subject }}</q-card-section
            >

            <q-card-section>
                <q-timeline layout="dense" color="secondary">
                    <q-timeline-entry
                        v-for="(reply, key) of ticketDetail?.replies?.reply"
                        :key="reply.replyid"
                        :title="reply.email"
                        :subtitle="reply.date"
                        :side="key % 2 === 0 ? 'left' : 'right'"
                    >
                        <template v-slot:title>
                            <div class="tw-font-medium tw-text-sm">{{ reply.email }}</div>
                        </template>
                        <div class="tw-text-xs tw-whitespace-pre-wrap">
                            {{ reply.message }}
                        </div>
                    </q-timeline-entry>
                </q-timeline>
            </q-card-section>

            <q-inner-loading :showing="loadingDetail" color="green" />
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        ticket: {
            type: Object,
        },
        modal_show: {
            type: Boolean,
            default: false,
        },
    },
    data(): any {
        return {
            ticketDetail: {},
            loadingDetail: false,
        };
    },

    methods: {
        showTicketDetail(ticket: any) {
            this.loadingDetail = true;

            window.api
                .get(`/apps/whmcs/tickets/${ticket.id}`)
                .then((res: any) => {
                    // console.log(res.data);
                    this.ticketDetail = res.data;
                })
                .finally(() => {
                    this.loadingDetail = false;
                });
        },
    },

    watch: {
        ticket: {
            handler: function (newVal, oldVal) {
                if (newVal && newVal.id && newVal.id !== oldVal?.id) {
                    this.ticketDetail = {};
                    this.showTicketDetail(this.ticket);
                }
            },
            immediate: true,
            deep: true,
        },
    },
});
</script>
