<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-shadow tw-bg-white tw-p-4 tw-flex tw-justify-between tw-mb-7">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-py-1">Visitors List</div>
        </div>

        <div class="tw-flex-grow">
            <div class="tw-shadow tw-bg-white tw-p-4">
                <!--                {{ visitors }}-->
                <ec-table :rows="visitors" :columns="columns">
                    <template v-slot:cell-client="slotProps">
                        <div class="">
                            <!-- <pre>{{ slotProps.row }}</pre> -->
                            {{
                                sessionInfo(slotProps.row.session_id)?.init_name ||
                                `Visitor#${slotProps.row.session_id.slice(-8)}`
                            }}
                        </div>
                    </template>

                    <template v-slot:cell-location="slotProps">
                        {{ slotProps.row.session_info?.init_location?.country?.names?.en || "Unknown" }}</template
                    >

                    <template v-slot:cell-referrer="slotProps"> {{ slotProps.row.referrer }}</template>

                    <template v-slot:cell-chats> 0</template>

                    <template v-slot:cell-url="slotProps">
                        <div class="">
                            <!-- <pre>{{ slotProps.row }}</pre> -->
                            {{ $_.last(slotProps.row.visits).url }}
                        </div>
                    </template>

                    <template v-slot:cell-stay_time="slotProps">
                        <div class="">
                            <!-- <pre>{{ slotProps.row }}</pre> -->
                            {{ $helpers.diffAsMinute($_.last(slotProps.row.visits).first_visit_time) }}
                        </div>
                    </template>
                </ec-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import EcTable from "components/common/table/EcTable.vue";

const columns = [
    {
        name: "client",
        align: "left",
        label: "Client",
    },
    {
        name: "location",
        align: "left",
        label: "Location",
    },

    {
        name: "url",
        align: "center",
        label: "Currently On",
    },
    {
        name: "referrer",
        align: "center",
        label: "Referrer",
    },
    {
        name: "chats",
        align: "center",
        label: "Chats",
    },
    {
        name: "stay_time",
        label: "Time On Site",
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
            visitors: "visitor/visitors",
            clientsConversation: "chat/clientsConversation",
        }),
    },

    methods: {
        sessionInfo(sesId: any) {
            let ses = null;
            this.clientsConversation.find((conv: any) =>
                conv.sessions.find((convSes: any) => {
                    if (convSes.socket_session_id === sesId) {
                        ses = convSes.socket_session;
                    }
                })
            );

            return ses;
        },
    },

    mounted() {
        setInterval(() => {
            this.$forceUpdate();
        }, 10000);
    },
});
</script>
