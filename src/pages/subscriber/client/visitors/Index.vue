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
                        <div class="tw-uppercase">
                            {{
                                sessionInfo(slotProps.row.session_id)?.init_name ||
                                `Visitor#${slotProps.row.session_id.slice(-8)}`
                            }}
                        </div>
                    </template>

                    <template v-slot:cell-location="slotProps">
                        {{
                            sessionInfo(slotProps.row.session_id)?.init_location?.country?.names?.en || "Unknown"
                        }}</template
                    >

                    <template v-slot:cell-referrer="slotProps"> {{ slotProps.row.referrer }}</template>

                    <template v-slot:cell-chats> 0</template>

                    <template v-slot:cell-url="slotProps">
                        <div>
                            <a :href="$_.last(slotProps.row.visits).url" class="text-blue-5 tw-font-medium">{{
                                $_.last(slotProps.row.visits).title
                            }}</a>
                        </div>
                    </template>

                    <template v-slot:cell-activity="slotProps">
                        <div class="tw-flex tw-items-center tw-justify-end tw-gap-2">
                            <!--{{ $_.last(slotProps.row.visits).visiting }}-->
                            <q-icon
                                name="fa fa-circle"
                                size="8px"
                                :color="$_.last(slotProps.row.visits).visiting ? 'green-8' : 'grey-6'"
                            />
                            <div
                                class="tw-font-medium"
                                :class="{
                                    'text-green-8': $_.last(slotProps.row.visits).visiting,
                                    'text-grey-8': !$_.last(slotProps.row.visits).visiting,
                                }"
                            >
                                {{ $_.last(slotProps.row.visits).visiting ? "Visiting" : "Not Visiting" }}
                            </div>
                        </div>
                    </template>

                    <!--<template v-slot:cell-stay_time="slotProps">-->
                    <!--    <div class="">-->
                    <!--        &lt;!&ndash; <pre>{{ slotProps.row }}</pre> &ndash;&gt;-->
                    <!--        {{ $helpers.diffAsMinute($_.last(slotProps.row.visits).first_visit_time) }}-->
                    <!--    </div>-->
                    <!--</template>-->
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
        align: "left",
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
        name: "activity",
        label: "Activity",
    },
    // {
    //     name: "stay_time",
    //     label: "Time On Site",
    // },
];

export default defineComponent({
    components: {
        EcTable,
    },
    data(): any {
        return {
            visitorInterval: "",
        };
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
        this.visitorInterval = setInterval(() => {
            this.$forceUpdate();
        }, 10000);
    },

    beforeUnmount() {
        clearInterval(this.visitorInterval);
    },
});
</script>
