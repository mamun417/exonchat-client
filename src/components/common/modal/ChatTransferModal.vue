<template>
    <q-dialog :model-value="true">
        <q-card class="tw-shadow-lg" style="min-width: 350px">
            <q-card-section class="tw-border-b-2">
                <span :class="`q-ml-sm tw-text-base tw-font-medium text-${globalColor}`"
                    >You are going to transfer chat</span
                >
            </q-card-section>

            <q-card-section class="tw-p-6">
                <div>Select chat department</div>
                <q-select
                    v-model="transferChatFormData.chat_department"
                    :options="chatDepartments"
                    @update:model-value="transferChatFormData.agent = ''"
                    hide-bottom-space
                    option-value="id"
                    option-label="tag"
                    label="Chat Department"
                    class="tw-mb-3"
                    :color="globalColor"
                    clearable
                    dense
                >
                    <template v-slot:prepend>
                        <q-icon name="person" size="xs" color="blue-grey" />
                    </template>
                </q-select>

                <div class="tw-mt-5">Select agent</div>
                <q-select
                    v-model="transferChatFormData.agent"
                    :options="onlineUsers"
                    label="Agent"
                    option-value="id"
                    option-label="email"
                    class="tw-my-2"
                    :color="globalColor"
                    hide-bottom-space
                    @filter="filterAgent"
                    use-input
                    clearable
                    dense
                >
                    <template v-slot:prepend>
                        <q-icon name="group_add" :color="globalColor" />
                    </template>

                    <template v-slot:selected v-if="transferChatFormData.agent">
                        <q-chip dense square color="white" class="q-my-none q-mr-none tw-ml-0">
                            <div class="tw-flex tw-items-center">
                                <div class="tw-mr-1">
                                    {{ transferChatFormData.agent.email }}
                                </div>
                            </div>
                        </q-chip>
                    </template>

                    <template v-slot:option="{ itemProps, opt }">
                        <q-item v-bind="itemProps">
                            <q-item-section>
                                <q-item-label v-html="opt.email"></q-item-label>
                            </q-item-section>

                            <q-item-section side>
                                <q-badge
                                    :color="
                                        opt.online_status === 'online'
                                            ? 'green'
                                            : opt.online_status === 'offline'
                                            ? 'red'
                                            : 'grey'
                                    "
                                    class="tw-px-2 tw-py-1"
                                >
                                    {{ $_.upperFirst(opt.online_status) }}
                                </q-badge>
                            </q-item-section>
                        </q-item>
                    </template>

                    <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey"> No agent</q-item-section>
                        </q-item>
                    </template>
                </q-select>

                <div class="tw-text-xs tw-py-0">
                    If you don't choose agent, chat will transfer to available agent in that selected department
                </div>
            </q-card-section>

            <q-card-section class="tw-py-3 text-center">
                <q-btn
                    label="Transfer Chat"
                    :color="globalColor"
                    class="full-width"
                    @click="transferChat"
                    unelevated
                    no-caps
                />
            </q-card-section>

            <q-inner-loading :showing="loadingChatDepartments" color="green" />
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
    name: "ChatTransferModal",
    data(): any {
        return {
            loadingChatDepartments: false,
            chatDepartments: [],
            agentFilterKey: "",
            transferChatFormData: {
                chat_department: "",
                agent: "",
            },
        };
    },

    props: {
        conv_id: {
            type: String,
        },
    },

    computed: {
        ...mapGetters({
            globalColor: "setting_ui/globalColor",
            profile: "auth/profile",
        }),

        onlineUsers(): any {
            let chatUsers = this.$_.cloneDeep(this.$store.getters["chat/chatUsers"]);

            if (this.transferChatFormData.chat_department) {
                const departmentUserIds = this.transferChatFormData.chat_department.users.map((user: any) => user.id);

                chatUsers = chatUsers.filter((user: any) => departmentUserIds.includes(user.id));
            }

            // filter agent list by agentFilterKey
            if (this.agentFilterKey) {
                const needle = this.agentFilterKey.toLowerCase();

                chatUsers = chatUsers.filter((agentItem: any) => agentItem.email.toLowerCase().indexOf(needle) > -1);
            }

            // filter only online users
            // return chatUsers.filter((user: any) => user.online_status === "online");

            return chatUsers;
        },

        // chatDepartmentsWithOnlineStatus() {
        //     if (this.chatDepartments) {
        //         let chatUsers = this.$_.cloneDeep(this.$store.getters["chat/chatUsers"]);
        //
        //         this.chatDepartments.map((department: any) => {
        //             const departmentUserIds = department.users.map((user: any) => user.id);
        //
        //             chatUsers = chatUsers.filter((user: any) => departmentUserIds.includes(user.id));
        //
        //             department.online_status = chatUsers.filter((user: any) => user.online_status === "online").length;
        //
        //             return department;
        //         });
        //     }
        //
        //     return [];
        // },
    },

    mounted() {
        this.getChatDepartments();

        this.$emitter.on(`ec_chat_transfer_res${this.conv_id}`, () => {
            this.$emit("transferChat");

            this.$router.push({ name: "chat-interaction" });
        });
    },

    methods: {
        getChatDepartments() {
            this.loadingChatDepartments = true;

            window.api
                .get("/departments")
                .then((res: any) => {
                    this.chatDepartments = res.data;
                })
                .catch((e: any) => {
                    console.log(e);
                })
                .finally(() => {
                    this.loadingChatDepartments = false;
                });
        },

        filterAgent(val: any, update: any) {
            this.agentFilterKey = val;
            update(() => {
                //
            });
        },

        transferChat() {
            if (!(this.transferChatFormData.chat_department || this.transferChatFormData.agent)) {
                this.$helpers.showErrorNotification(this, "Please select chat department or agent");
                return;
            }

            this.$socket.emit("ec_chat_transfer", {
                conv_id: this.conv_id,
                notify_to_dep: this.transferChatFormData.chat_department.tag,
                notify_to: this.transferChatFormData.agent ? this.transferChatFormData.agent.socket_session.id : "",
                agent_info: this.profile,
            });
        },
    },
});
</script>
