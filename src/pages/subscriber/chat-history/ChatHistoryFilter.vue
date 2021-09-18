<template>
    <div class="q-pa-md">
        <div class="tw-flex tw-gap-2 tw-items-center">
            <!--<q-input :model-value="filters.date.from" label="Date" placholder="" style="width: 100px" dense>-->
            <!--    <q-menu>-->
            <!--        <q-date v-model="filters.date.from" basic />-->
            <!--    </q-menu>-->
            <!--</q-input>-->

            <!--<div :class="$helpers.colors().defaultText">To</div>-->

            <!--<q-input :model-value="filters.date.to" label="" placholder="" style="width: 100px" dense>-->
            <!--    <q-menu>-->
            <!--        <q-date v-model="filters.date.to" basic />-->
            <!--    </q-menu>-->
            <!--</q-input>-->

            <q-select
                @update:model-value="handlePipeline({ chat_department_id: $event?.id })"
                :model-value="chatHistoryPipeline.chat_department_id"
                label="Department"
                :options="chatDepartments"
                option-value="id"
                :style="`width: ${filterWidth}`"
                clearable
                dense
            >
                <template v-slot:selected v-if="chatHistoryPipeline.chat_department_id">
                    <q-chip dense square color="white" class="q-my-none q-mr-none tw-ml-0">
                        <div class="tw-flex tw-items-center">
                            <div>{{ getDepartmentData(chatHistoryPipeline.chat_department_id)?.display_name }}</div>
                        </div>
                    </q-chip>
                </template>

                <template v-slot:option="{ itemProps, opt }">
                    <q-item v-bind="itemProps">
                        <q-item-section>
                            <q-item-label v-html="opt.display_name"></q-item-label>
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>

            <q-select
                @update:model-value="handlePipeline({ agent_id: $event?.id })"
                :model-value="chatHistoryPipeline.agent_id"
                label="Agent"
                :options="chatUsers"
                option-value="id"
                option-label="email"
                :style="`width: ${filterWidth}`"
                clearable
                dense
            >
                <template v-slot:selected v-if="chatHistoryPipeline.agent_id">
                    <q-chip dense square color="white" class="q-my-none q-mr-none tw-ml-0">
                        <div class="tw-flex tw-items-center">
                            <div class="tw-mr-1">
                                {{ getAgentData(chatHistoryPipeline.agent_id).user_meta.display_name }}
                            </div>
                        </div>
                    </q-chip>
                </template>

                <template v-slot:option="{ itemProps, opt }">
                    <q-item v-bind="itemProps">
                        <q-item-section>
                            <div class="tw-flex tw-w-full tw-items-center tw-my-1 tw-gap-3">
                                <ec-avatar
                                    :image_src="opt.user_meta.src"
                                    :name="opt.user_meta.display_name"
                                    :email="opt.email"
                                    size="sm"
                                />
                                <div>
                                    <q-item-label>{{ opt.user_meta.display_name }} </q-item-label>
                                </div>
                            </div>
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>

            <q-select
                @update:model-value="handlePipeline({ rating: $event?.value })"
                :model-value="chatHistoryPipeline.rating"
                label="Rating"
                option-value="value"
                :options="ratings"
                :style="`width: ${filterWidth}`"
                clearable
                dense
            >
                <template v-slot:selected v-if="chatHistoryPipeline.rating">
                    <q-chip dense square color="white" class="q-my-none q-mr-none tw-ml-0">
                        <div class="tw-flex tw-items-center">
                            <div>{{ getRatingData(chatHistoryPipeline.rating).label }}</div>
                        </div>
                    </q-chip>
                </template>
            </q-select>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import EcAvatar from "components/common/EcAvatar.vue";

export default defineComponent({
    name: "ChatHistoryFilter",
    components: { EcAvatar },
    data(): any {
        return {
            chatDepartments: [],
            model: "",
            filters: {
                date: {
                    from: "",
                    to: "",
                },
                department: "",
                agent: "",
                rating: "",
            },
            filterWidth: "200px",
            ratings: [
                { label: "Good", value: "5" },
                { label: "Bad", value: "1" },
            ],
        };
    },

    computed: {
        ...mapGetters({
            chatUsers: "chat/chatUsers",
            chatHistoryPipeline: "chat_history/pipeline",
        }),
    },

    mounted() {
        this.getChatDepartments();
    },

    methods: {
        getChatDepartments() {
            window.api
                .get("/departments")
                .then((res: any) => {
                    this.chatDepartments = res.data;
                })
                .catch((e: any) => {
                    console.log(e);
                });
        },

        handlePipeline($event: any) {
            this.$emit("handlePipeline", $event);
        },

        getDepartmentData(departmentId: string) {
            if (this.chatDepartments.length) {
                return this.chatDepartments.find((department: any) => department.id === departmentId);
            }
        },

        getAgentData(agentId: string) {
            if (this.chatUsers.length) {
                return this.chatUsers.find((user: any) => user.id === agentId);
            }
        },

        getRatingData(ratingVal: string) {
            if (this.ratings.length) {
                return this.ratings.find((rating: any) => rating.value === ratingVal);
            }
        },
    },
});
</script>

<style scoped></style>
