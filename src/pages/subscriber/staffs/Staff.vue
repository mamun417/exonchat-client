<template>
    <div class="tw-flex tw-flex-col">
        <div class="tw-p-4 tw-py-3 tw-flex tw-justify-between tw-mb-3">
            <div class="tw-font-bold tw-text-gray-700 tw-text-lg tw-flex tw-items-center">
                <div>CHATS: {{ chats.length }}</div>
            </div>
        </div>

        <div class="tw-mb-5">
            <div class="tw-shadow tw-bg-white tw-p-4">
                <ec-table :columns="columns" :rows="chats" hide-search>
                    <!--<template v-slot:filter>-->
                    <!--    <q-select-->
                    <!--        v-model="departmentFilters.myRunningChats"-->
                    <!--        label="Choose Department"-->
                    <!--        :options="departments"-->
                    <!--        style="width: 200px"-->
                    <!--        :color="globalColor"-->
                    <!--        dense-->
                    <!--    >-->
                    <!--        <template v-slot:prepend>-->
                    <!--            <q-icon name="groups" :color="globalColor" />-->
                    <!--        </template>-->
                    <!--    </q-select>-->
                    <!--</template>-->

                    <template v-slot:cell-client="slotProps">
                        <div class="">
                            {{ slotProps.row.client_info.socket_session.init_name }}
                        </div>
                    </template>

                    <template v-slot:cell-message="slotProps">
                        <div class="">
                            {{ slotProps.row.messages[0]?.msg }}
                        </div>
                    </template>

                    <!--<template v-slot:cell-currently_on="slotProps">-->
                    <!--    <div class="text-xss">-->
                    <!--        {{-->
                    <!--            $_.last(-->
                    <!--                $_.find(visitors, ["session_id", slotProps.row.client_info.socket_session_id])-->
                    <!--                    ?.visits-->
                    <!--            )?.url-->
                    <!--        }}-->
                    <!--    </div>-->
                    <!--</template>-->

                    <!--<template v-slot:cell-department="slotProps">-->
                    <!--    <div class="text-xss">-->
                    <!--        {{ slotProps.row.chat_department.tag }}-->
                    <!--    </div>-->
                    <!--</template>-->

                    <!--<template v-slot:cell-chat_time="slotProps">-->
                    <!--    <div class="text-xss">-->
                    <!--        {{ $helpers.fromNowTime(slotProps.row.created_at, true) }}-->
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
import * as _l from "lodash";

const columns = [
    {
        name: "client",
        align: "left",
        label: "Client",
        field: "client",
    },
    {
        name: "message",
        align: "center",
        label: "Message",
        field: "message",
    },
    {
        name: "currently_on",
        align: "center",
        label: "Currently On",
        field: "currently_on",
    },
    {
        name: "department",
        align: "left",
        label: "Department",
        field: "department",
    },
    {
        name: "agents",
        align: "left",
        label: "Agents",
        field: "agents",
    },
    {
        name: "elapsed_time",
        align: "left",
        label: "Elapsed Time",
        field: "elapsed_time",
    },
];

export default defineComponent({
    name: "Staffs",
    components: { EcTable },
    setup() {
        return { columns };
    },
    data(): any {
        return {
            chats: [],
        };
    },

    computed: {
        ...mapGetters({
            profile: "auth/profile",
            globalBgColor: "setting_ui/globalBgColor",
            globalColor: "setting_ui/globalColor",
        }),
    },

    mounted() {
        this.getChats();
        //
    },
    unmounted() {
        //
    },

    methods: {
        getChats() {
            this.$api("/conversations").then((res: any) => {
                console.log(res.data.conversations.data);
                const tempChats = res.data.conversations.data;

                this.chats = tempChats.map((conv: any) => {
                    const client_info = _l.find(
                        conv.conversation_sessions,
                        (convSes: any) => !convSes.socket_session.user
                    );

                    conv.messages = conv.messages.filter((msg: any) => msg.message_type === "message");

                    conv.client_info = client_info;

                    return conv;
                });
            });
        },
    },

    watch: {},
});
</script>
